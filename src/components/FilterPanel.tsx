'use client';

import React from 'react';
import { X, RefreshCcw, GraduationCap, MapPin, Calendar, Check } from 'lucide-react';
import { CAREER_FIELDS, LOCATIONS } from '@/data/constants';

interface FilterPanelProps {
  filters: {
    careerField: string;
    location: string;
    deadline: string;
  };
  onFilterChange: (newFilters: any) => void;
  onReset: () => void;
}

export default function FilterPanel({ filters, onFilterChange, onReset }: FilterPanelProps) {
  const careers = CAREER_FIELDS;
  const locations = LOCATIONS;

  return (
    <div className="glass-v2-heavy animate-slide-up" style={{ 
      padding: '2rem', borderRadius: '32px', border: '1px solid var(--border-glow)',
      boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Filtros Avanzados</h3>
        <button 
          onClick={onReset}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '6px', 
            background: 'none', border: 'none', color: 'var(--accent-primary)',
            fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer'
          }}
        >
          <RefreshCcw size={14} /> Reiniciar
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
        
        {/* Career Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GraduationCap size={16} /> Área de Estudio
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {careers.map(c => (
              <button
                key={c}
                onClick={() => onFilterChange({ ...filters, careerField: filters.careerField === c ? '' : c })}
                style={{
                  padding: '0.6rem 1rem', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.1)',
                  background: filters.careerField === c ? 'var(--accent-primary)' : 'rgba(255,255,255,0.03)',
                  color: 'white', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.3s ease'
                }}
              >
                {filters.careerField === c && <Check size={12} style={{ marginRight: '4px', display: 'inline' }} />}
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Location Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={16} /> Ubicación
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {locations.map(l => (
              <button
                key={l}
                onClick={() => onFilterChange({ ...filters, location: filters.location === l ? '' : l })}
                style={{
                  padding: '0.6rem 1rem', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.1)',
                  background: filters.location === l ? 'var(--accent-secondary)' : 'rgba(255,255,255,0.03)',
                  color: 'white', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.3s ease'
                }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Date Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={16} /> Próximo Cierre
          </label>
          <input 
            type="date" 
            className="input" 
            value={filters.deadline}
            onChange={(e) => onFilterChange({ ...filters, deadline: e.target.value })}
            style={{ padding: '0.8rem', fontSize: '0.9rem' }}
          />
        </div>

      </div>
    </div>
  );
}
