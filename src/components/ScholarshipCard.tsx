'use client';

import React from 'react';
import { Scholarship } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { MapPin, Calendar, ArrowRight, Sparkles, GraduationCap } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ScholarshipCardProps {
  scholarship: Scholarship;
  onClick: (s: Scholarship) => void;
}

export default function ScholarshipCard({ scholarship, onClick }: ScholarshipCardProps) {
  const { user } = useAuth();
  const isMatch = user?.career === scholarship.careerField;

  return (
    <div 
      onClick={() => onClick(scholarship)}
      className="glass-v2"
      style={{
        padding: '1.2rem',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        border: isMatch ? '2px solid rgba(99, 102, 241, 0.3)' : '1px solid rgba(255,255,255,0.05)',
        background: isMatch ? 'rgba(99, 102, 241, 0.05)' : 'var(--bg-glass)'
      }}
    >
      {isMatch && (
        <div style={{
          position: 'absolute', top: '1rem', right: '1rem',
          background: 'var(--grad-accent)', padding: '4px 12px',
          borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '4px',
          fontSize: '0.7rem', fontWeight: 800, color: 'white',
          boxShadow: '0 5px 15px rgba(99, 102, 241, 0.4)',
          zIndex: 2
        }}>
          <Sparkles size={12} fill="white" /> MATCH ELITE
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ 
          width: '56px', height: '56px', borderRadius: '16px',
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', color: 'var(--accent-primary)'
        }}>
          {scholarship.title[0]}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, lineHeight: 1.2 }}>{scholarship.title}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--accent-secondary)', fontWeight: 600, marginTop: '2px' }}>
            {scholarship.institution}
          </p>
        </div>
      </div>

      <div style={{ 
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem',
        padding: '0.8rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
          <MapPin size={14} /> <span>{scholarship.location}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
          <Calendar size={14} /> <span>Vence: {formatDate(scholarship.deadline)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
          <GraduationCap size={14} /> <span>{scholarship.careerField}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 700 }}>
          <ArrowRight size={14} /> <span>Ver Detalles</span>
        </div>
      </div>

      {/* Mini Progress Bar for Match */}
      {isMatch && (
        <div style={{ height: '3px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: '95%', background: 'var(--grad-accent)' }} />
        </div>
      )}
    </div>
  );
}
