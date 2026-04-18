'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, TrackedScholarship } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password?: string, name?: string) => Promise<any>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  setPremium: (status: boolean) => Promise<void>;
  toggleTrackScholarship: (scholarshipId: string) => Promise<void>;
  toggleRequirement: (scholarshipId: string, requirement: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to fetch user data and full tracking status
  const fetchUserProfile = async (userId: string, email: string) => {
    try {
      // 1. Get profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (profileError) {
        // If profile doesn't exist (PGRST116), we can create a temporary one or ignore the error
        if (profileError.code === 'PGRST116') {
          console.warn("Profile not found for user, using defaults");
          // Optionally create it here if we have a session
          const { error: createError } = await supabase
            .from('user_profiles')
            .upsert({ id: userId, email: email, first_name: email.split('@')[0] });
            
          if (createError) throw createError;
          
          // Retry once
          return fetchUserProfile(userId, email);
        }
        throw profileError;
      }

      // 2. Get tracking mappings
      const { data: tracking, error: trackError } = await supabase
        .from('user_tracking')
        .select('id, opportunity_id');
        
      if (trackError) throw trackError;

      const trackedScholarships: TrackedScholarship[] = [];

      for (const track of (tracking || [])) {
        // Need to find completed progress inside tracking
        const { data: progress } = await supabase
          .from('tracking_progress')
          .select('requirements(description)')
          .eq('user_tracking_id', track.id);
          
        const completedRequirements = progress?.map((p: any) => p.requirements.description) || [];
        trackedScholarships.push({
          scholarshipId: track.opportunity_id,
          completedRequirements
        });
      }

      if (!profile) throw new Error("Profile object is null after fetch");

      setUser({
        id: profile.id,
        email: profile.email || email,
        firstName: profile.first_name,
        lastName: profile.last_name,
        career: profile.career_field,
        phone: profile.phone,
        is_premium: profile.is_premium,
        role: profile.role || 'user',
        subscription_type: profile.subscription_type || 'free',
        subscription_end_date: profile.subscription_end_date,
        created_at: profile.created_at,
        trackedScholarships
      });
    } catch (e: any) {
      console.error("Error fetching user profile:", e?.message || e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchUserProfile(session.user.id, session.user.email!);
      } else {
        setLoading(false);
      }

      supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          await fetchUserProfile(session.user.id, session.user.email!);
        } else {
          setUser(null);
          setLoading(false);
        }
      });
    };
    initAuth();
  }, []);

  const login = async (email: string, password?: string) => {
    if (!password) throw new Error("Password REQUIRED for connection.");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const register = async (email: string, password?: string, name?: string) => {
    if (!password) throw new Error("Password REQUIRED for connection.");
    const { data: authData, error: authError } = await supabase.auth.signUp({ 
      email, 
      password 
    });
    
    if (authError) throw authError;

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          email: email,
          first_name: name || ''
        });
      if (profileError) throw profileError;
    }

    return authData;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    
    // Optimistic UI
    setUser(prev => prev ? { ...prev, ...data } : null);
    
    // DB
    const updates: any = {};
    if (data.firstName !== undefined) updates.first_name = data.firstName;
    if (data.lastName !== undefined) updates.last_name = data.lastName;
    if (data.career !== undefined) updates.career_field = data.career;
    if (data.phone !== undefined) updates.phone = data.phone;
    if (data.is_premium !== undefined) updates.is_premium = data.is_premium;
    if (data.role !== undefined) updates.role = data.role;
    if (data.subscription_type !== undefined) updates.subscription_type = data.subscription_type;
    if (data.subscription_end_date !== undefined) updates.subscription_end_date = data.subscription_end_date;

    if (Object.keys(updates).length > 0) {
      const { error } = await supabase.from('user_profiles').update(updates).eq('id', user.id);
      if (error) throw error;
    }
  };

  const setPremium = async (status: boolean) => {
    await updateProfile({ is_premium: status });
  };

  const toggleTrackScholarship = async (scholarshipId: string) => {
    if (!user) return;
    
    let currentTracked = user.trackedScholarships || [];
    const isTracking = currentTracked.some(t => t.scholarshipId === scholarshipId);
    
    if (isTracking) {
      // Opt UI
      setUser({ ...user, trackedScholarships: currentTracked.filter(t => t.scholarshipId !== scholarshipId) });
      // DB
      await supabase.from('user_tracking').delete().match({ user_id: user.id, opportunity_id: scholarshipId });
    } else {
      // Opt UI
      setUser({ ...user, trackedScholarships: [...currentTracked, { scholarshipId, completedRequirements: [] }] });
      // DB
      await supabase.from('user_tracking').insert({ user_id: user.id, opportunity_id: scholarshipId });
    }
  };

  const toggleRequirement = async (scholarshipId: string, requirementDesc: string) => {
    if (!user) return;
    
    const currentTracked = user.trackedScholarships || [];
    let updatedTracked = [...currentTracked];
    
    const trackIndex = updatedTracked.findIndex(t => t.scholarshipId === scholarshipId);
    if (trackIndex === -1) return; // Cant check requirement of untracked
    
    // Fetch tracking_id from DB securely to update progress
    const { data: trackRow } = await supabase.from('user_tracking')
      .select('id').match({ user_id: user.id, opportunity_id: scholarshipId }).single();
      
    if (!trackRow) return;

    // Fetch req_id corresponding to that description
    const { data: reqRow } = await supabase.from('requirements')
      .select('id').match({ opportunity_id: scholarshipId, description: requirementDesc }).single();
      
    if (!reqRow) return;

    let reqs = updatedTracked[trackIndex].completedRequirements || [];
    const isChecked = reqs.includes(requirementDesc);
    
    if (isChecked) {
      // Remove
      updatedTracked[trackIndex] = { ...updatedTracked[trackIndex], completedRequirements: reqs.filter(r => r !== requirementDesc) };
      await supabase.from('tracking_progress').delete().match({ user_tracking_id: trackRow.id, requirement_id: reqRow.id });
    } else {
      updatedTracked[trackIndex] = { ...updatedTracked[trackIndex], completedRequirements: [...reqs, requirementDesc] };
      await supabase.from('tracking_progress').insert({ user_tracking_id: trackRow.id, requirement_id: reqRow.id });
    }
    
    setUser({ ...user, trackedScholarships: updatedTracked });
  };

  return (
    <AuthContext.Provider value={{ 
      user, loading, login, logout, register, 
      updateProfile, setPremium, toggleTrackScholarship, toggleRequirement 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
