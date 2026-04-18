'use client';

import React from 'react';
import { Search, Sparkles, TrendingUp } from 'lucide-react';

interface HeroProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  totalScholarships: number;
}

export default function Hero({ searchTerm, onSearchChange, totalScholarships }: HeroProps) {
  return (
    <section style={{ 
      padding: '8rem 1.5rem 5rem', textAlign: 'center', position: 'relative',
      overflow: 'hidden' 
    }}>
      {/* Background Flares */}
      <div style={{
        position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '300px', background: 'var(--accent-primary)',
        filter: 'blur(150px)', opacity: 0.15, zIndex: -1, borderRadius: '50%'
      }} />

      <div className="container-v2 animate-fade-in">
        <div style={{ 
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(255,255,255,0.05)', padding: '8px 16px',
          borderRadius: '100px', border: '1px solid rgba(255,255,255,0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{ width: '8px', height: '8px', background: 'var(--diff-easy)', borderRadius: '50%' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
            MÁS DE {totalScholarships} BECAS DISPONIBLES HOY
          </span>
        </div>

        <h1 style={{ 
          fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: 800, 
          lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.05em'
        }}>
          Tu Futuro no es un Sueño, <br />
          <span className="text-sparkle">Es tu Próximo Match</span>
        </h1>

        <p style={{ 
          fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '700px', 
          margin: '0 auto 3rem', lineHeight: 1.6 
        }}>
          La primera plataforma inteligente que conecta tus estudios con las becas más prestigiosas del mundo. 
          Rápido, fácil y 100% móvil.
        </p>

        {/* Search Bar - Ultra Premium */}
        <div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative' }}>
          <div style={{ 
            position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--accent-primary)'
          }}>
            <Search size={22} />
          </div>
          <input 
            type="text" 
            placeholder="¿Qué quieres estudiar? (Ingeniería, Contaduría...)"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: '100%', padding: '1.5rem 1.5rem 1.5rem 4rem',
              background: 'var(--bg-glass-heavy)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '100px',
              color: 'white', fontSize: '1.1rem', outline: 'none',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              transition: 'all 0.3s ease'
            }}
            className="search-input-focus"
          />
          <button style={{
            position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)',
            background: 'var(--grad-accent)', color: 'white', border: 'none',
            padding: '0.9rem 2rem', borderRadius: '100px', fontWeight: 700,
            cursor: 'pointer', boxShadow: '0 5px 15px rgba(99, 102, 241, 0.4)'
          }}>
            Buscar
          </button>
        </div>

        {/* Trending Tags */}
        <div style={{ 
          marginTop: '2.5rem', display: 'flex', justifyContent: 'center', 
          gap: '1.5rem', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.9rem'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendingUp size={16} /> Tendencias:
          </span>
          <button className="tag-link" onClick={() => onSearchChange('Canadá')}>Beca Canadá</button>
          <button className="tag-link" onClick={() => onSearchChange('Tecnología')}>Tech Elite</button>
          <button className="tag-link" onClick={() => onSearchChange('Europa')}>Erasmus+</button>
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 1s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .search-input-focus:focus {
          border-color: var(--accent-primary);
          box-shadow: 0 0 30px rgba(99, 102, 241, 0.4);
          transform: scale(1.02);
        }
        .tag-link {
          background: none; border: none; color: var(--text-secondary);
          cursor: pointer; transition: color 0.3s ease; font-size: 0.9rem;
        }
        .tag-link:hover { color: var(--accent-primary); }
      `}</style>
    </section>
  );
}
