'use client';

import { useState, useEffect, useCallback } from 'react';
import { FilterState } from '../types';
import { supabase } from '../lib/supabase';

// Helper type para machear con la vista
export interface ScholarshipData {
  id: string;
  title: string;
  institution: string;
  country: string;
  location: string; // fallback country for now
  description: string;
  coverage: string;
  requirements: string[]; // From relations
  language_level: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'pregrado' | 'maestria' | 'intercambio' | 'cursos';
  deadline: string;
  official_link: string;
  created_at: string;
  careerField: string;
  fields: string[];
  coordinates: [number, number];
}

export const useScholarships = () => {
  const [scholarships, setScholarships] = useState<ScholarshipData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    careerField: '',
    location: '',
    deadline: '',
  });

  const [searchTerm, setSearchTerm] = useState('');

  const fetchOpportunities = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('opportunities').select(`
      *,
      opportunity_fields(field_name),
      requirements(description)
    `);

    // Basic filters at query level if possible, else we filter client side
    // For fuzzy search:
    if (searchTerm) {
      query = query.ilike('title', `%${searchTerm}%`);
    }

    // Country 
    if (filters.location) {
      query = query.eq('country', filters.location);
    }

    // Deadline
    if (filters.deadline) {
      query = query.gte('deadline', filters.deadline);
    }

    const { data, error } = await query;
    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    let parsed: ScholarshipData[] = (data || []).map(row => ({
      id: row.id,
      title: row.title,
      institution: row.institution,
      country: row.country,
      location: row.country, // using country as location
      description: row.description,
      coverage: row.coverage,
      requirements: row.requirements ? row.requirements.map((r: any) => r.description) : [],
      language_level: row.language_level,
      difficulty: row.difficulty,
      category: row.category,
      deadline: row.deadline,
      official_link: row.official_link,
      created_at: row.created_at,
      careerField: row.opportunity_fields?.[0]?.field_name || 'General',
      fields: row.opportunity_fields ? row.opportunity_fields.map((f: any) => f.field_name) : [],
      coordinates: (() => {
        try {
          const raw = row.coordinates;
          if (Array.isArray(raw) && raw.length === 2) return raw as [number, number];
          if (typeof raw === 'string') {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length === 2) return parsed as [number, number];
            return [5, -75] as [number, number];
          }
          if (raw && typeof raw === 'object' && 'lat' in raw && 'lng' in raw) {
            return [raw.lat, raw.lng] as [number, number];
          }
          return [5, -75] as [number, number]; // Default center
        } catch (e) {
          console.error("Error parsing coordinates for", row.title, e);
          return [5, -75] as [number, number];
        }
      })()
    }));

    // Client side filter for specific fields if careerField selected
    if (filters.careerField) {
      parsed = parsed.filter(p => p.fields.includes(filters.careerField));
    }

    setScholarships(parsed);
    setLoading(false);
  }, [searchTerm, filters]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  const resetFilters = useCallback(() => {
    setFilters({
      careerField: '',
      location: '',
      deadline: '',
    });
    setSearchTerm('');
  }, []);

  return {
    scholarships,
    loading,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    resetFilters
  };
};
