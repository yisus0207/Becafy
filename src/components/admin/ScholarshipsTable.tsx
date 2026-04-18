'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Search, 
  Plus, 
  MapPin, 
  Calendar, 
  ExternalLink, 
  Trash2, 
  Edit3,
  Globe,
  Tag
} from 'lucide-react';

export default function ScholarshipsTable() {
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchScholarships();
  }, []);

  async function fetchScholarships() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setScholarships(data || []);
    } catch (err) {
      console.error("Error fetching scholarships:", err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteScholarship(id: string) {
    if (!confirm('¿Estás seguro de eliminar esta beca? Esta acción no se puede deshacer.')) return;
    
    const { error } = await supabase
      .from('opportunities')
      .delete()
      .eq('id', id);

    if (!error) {
      setScholarships(scholarships.filter(s => s.id !== id));
    }
  }

  const filteredScholarships = scholarships.filter(s => 
    s.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.institution?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.country?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por título, país o institución..." 
            className="input pl-12 bg-glass"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button className="btn btn-primary">
          <Plus size={20} />
          Nueva Beca
        </button>
      </div>

      <div className="glass-v2 overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="p-4 font-bold text-xs uppercase tracking-widest text-text-muted">Beca</th>
                <th className="p-4 font-bold text-xs uppercase tracking-widest text-text-muted">Categoría</th>
                <th className="p-4 font-bold text-xs uppercase tracking-widest text-text-muted">Ubicación</th>
                <th className="p-4 font-bold text-xs uppercase tracking-widest text-text-muted">Cierre</th>
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
              ) : filteredScholarships.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-text-muted italic">No hay becas registradas</td>
                </tr>
              ) : filteredScholarships.map((s) => (
                <tr key={s.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-white mb-0.5">{s.title}</span>
                      <span className="text-xs text-text-muted">{s.institution}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                      <Tag size={10} />
                      {s.category}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-text-secondary">
                    <div className="flex items-center gap-2">
                      <Globe size={14} className="text-accent-primary" />
                      {s.country}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-text-secondary">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-accent-secondary" />
                      {new Date(s.deadline).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a 
                        href={s.official_link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-2 hover:bg-white/10 rounded-lg text-text-muted hover:text-white transition-colors"
                      >
                        <ExternalLink size={18} />
                      </a>
                      <button className="p-2 hover:bg-white/10 rounded-lg text-text-muted hover:text-white transition-colors">
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => deleteScholarship(s.id)}
                        className="p-2 hover:bg-diff-hard/10 rounded-lg text-text-muted hover:text-diff-hard transition-colors"
                      >
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
