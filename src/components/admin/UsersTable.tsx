'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User as UserType } from '@/types';
import { 
  Search, 
  MoreVertical, 
  Shield, 
  User as UserIcon, 
  Star, 
  CreditCard,
  Trash2,
  Mail
} from 'lucide-react';

export default function UsersTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleAdmin(id: string, currentRole: string) {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const { error } = await supabase
      .from('user_profiles')
      .update({ role: newRole })
      .eq('id', id);

    if (!error) {
      setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
    }
  }

  async function togglePremium(id: string, currentStatus: boolean) {
    const newStatus = !currentStatus;
    const { error } = await supabase
      .from('user_profiles')
      .update({ is_premium: newStatus, subscription_type: newStatus ? 'monthly' : 'free' })
      .eq('id', id);

    if (!error) {
      setUsers(users.map(u => u.id === id ? { ...u, is_premium: newStatus, subscription_type: newStatus ? 'monthly' : 'free' } : u));
    }
  }

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o correo..." 
            className="input pl-12 bg-glass"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <button className="btn btn-secondary !py-2">Exportar CSV</button>
        </div>
      </div>

      <div className="glass-v2 overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="p-4 font-bold text-xs uppercase tracking-widest text-text-muted">Usuario</th>
                <th className="p-4 font-bold text-xs uppercase tracking-widest text-text-muted">Rol</th>
                <th className="p-4 font-bold text-xs uppercase tracking-widest text-text-muted">Suscripción</th>
                <th className="p-4 font-bold text-xs uppercase tracking-widest text-text-muted">Registrado</th>
                <th className="p-4 font-bold text-xs uppercase tracking-widest text-text-muted text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary mx-auto"></div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-text-muted italic">No se encontraron usuarios</td>
                </tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary border border-accent-primary/30">
                        {user.first_name ? user.first_name[0].toUpperCase() : <UserIcon size={18} />}
                      </div>
                      <div>
                        <p className="font-bold text-white">{user.first_name} {user.last_name}</p>
                        <p className="text-xs text-text-muted flex items-center gap-1">
                          <Mail size={10} />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => toggleAdmin(user.id, user.role)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all
                        ${user.role === 'admin' 
                          ? 'bg-accent-secondary/20 text-accent-secondary border border-accent-secondary/30' 
                          : 'bg-white/5 text-text-muted border border-white/10 hover:border-white/20'
                        }
                      `}
                    >
                      {user.role === 'admin' ? <Shield size={12} /> : <UserIcon size={12} />}
                      {user.role === 'admin' ? 'Admin' : 'Usuario'}
                    </button>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => togglePremium(user.id, user.is_premium)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all
                        ${user.is_premium 
                          ? 'bg-diff-easy/20 text-diff-easy border border-diff-easy/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                          : 'bg-white/5 text-text-muted border border-white/10 hover:border-white/20'
                        }
                      `}
                    >
                      <Star size={12} className={user.is_premium ? 'fill-current' : ''} />
                      {user.is_premium ? 'Premium' : 'Free'}
                    </button>
                  </td>
                  <td className="p-4 text-sm text-text-secondary">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-white/10 rounded-lg text-text-muted hover:text-white transition-colors">
                        <MoreVertical size={18} />
                      </button>
                      <button className="p-2 hover:bg-diff-hard/10 rounded-lg text-text-muted hover:text-diff-hard transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
