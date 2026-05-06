'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { X, Sparkles, Zap } from 'lucide-react';

interface FreemiumGateProps {
  type: 'anonymous' | 'registered';
  remaining: number;
  onClose?: () => void;
}

export default function FreemiumGate({ type, remaining, onClose }: FreemiumGateProps) {
  const { user } = useAuth();

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000,
      padding: '1rem'
    }}>
      <div className="glass-v2-heavy animate-slide-up" style={{
        maxWidth: '540px',
        width: '100%',
        padding: '3rem 2rem',
        textAlign: 'center',
        border: '2px solid var(--accent-primary)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Close button */}
        {onClose && (
          <button onClick={onClose} style={{ 
            position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'white',
            background: 'rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '50%',
            border: 'none', cursor: 'pointer', display: 'flex'
          }}>
            <X size={20} />
          </button>
        )}

        {/* Decorative pulse */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '200px',
          height: '200px',
          background: 'var(--accent-primary)',
          filter: 'blur(100px)',
          opacity: 0.2,
          zIndex: -1
        }} />

        <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>🔐</div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, maxWidth: '500px' }}>
          {type === 'anonymous' 
            ? '¡Desbloquea el Acceso Beta!' 
            : '¡Te has tomado en serio tu futuro!'}
        </h2>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', lineHeight: 1.6 }}>
          {type === 'anonymous' 
            ? 'Estás a un paso de ver toda la información. Únete a nuestra lista de espera exclusiva y obtén acceso total al buscador.'
            : 'Has alcanzado el límite de visualizaciones. Desbloquea acceso ILIMITADO uniéndote a nuestra lista de fundadores.'}
        </p>

        {type === 'anonymous' ? (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/" className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
              <Sparkles size={18} /> Unirme a la Lista de Espera
            </Link>
            <Link href="/auth/login" className="btn btn-secondary" style={{ padding: '1rem 2rem' }}>
              Ya tengo acceso
            </Link>
          </div>
        ) : (
          <button className="btn-glow" style={{ 
            padding: '1.25rem 2.5rem', 
            fontSize: '1.15rem',
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            border: 'none', cursor: 'pointer'
          }}>
            <Zap size={20} fill="currentColor" /> Unirse a Becafy Premium
          </button>
        )}

        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          {type === 'anonymous' 
            ? 'Únete a 1,200+ estudiantes en espera hoy.'
            : 'Acceso a becas exclusivas y mentorías personalizadas.'}
        </div>
      </div>
    </div>
  );
}
