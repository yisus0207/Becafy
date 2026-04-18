'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { User as UserIcon, LogOut, Sparkles, Map as MapIcon, Globe, Zap, User } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`nav-float glass-v2-heavy ${scrolled ? 'scrolled' : ''} desktop-only`}
      style={{
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(5, 5, 16, 0.9)' : 'rgba(20, 20, 40, 0.4)',
        boxShadow: scrolled ? '0 10px 30px rgba(0,0,0,0.5)' : 'none',
      }}
    >
      <style jsx>{`
        @media (max-width: 1023px) {
          .desktop-only { display: none !important; }
        }
      `}</style>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
        <div style={{
          background: 'var(--grad-accent)', padding: '0.6rem',
          borderRadius: '12px', color: 'white', display: 'flex'
        }}>
          <Zap size={20} fill="currentColor" />
        </div>
        <span style={{
          fontSize: '1.6rem', fontWeight: 800,
          letterSpacing: '-0.05em', color: 'white'
        }}>Becafy</span>
      </Link>

      <nav style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
        <Link href="/" className="nav-link">Inicio</Link>
        <Link href="/" className="nav-link">Becas</Link>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link href="/profile" className="nav-link" style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              color: 'var(--accent-primary)', fontWeight: 700
            }}>
              <UserIcon size={18} /> Mi Perfil
            </Link>
            <button
              onClick={logout}
              style={{
                background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444',
                padding: '0.6rem 1.2rem', borderRadius: '100px',
                fontSize: '0.9rem', fontWeight: 600, border: '1px solid rgba(239, 68, 68, 0.2)',
                cursor: 'pointer'
              }}
            >
              Salir
            </button>
          </div>
        ) : (
          <Link href="/auth/login" className="btn-glow" style={{ padding: '0.7rem 1.5rem', fontSize: '0.9rem', textDecoration: 'none' }}>
            Ingresar
          </Link>
        )}
      </nav>

      <style jsx>{`
        .nav-link {
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          position: relative;
        }

        .nav-link:hover {
          color: white;
        }

        .nav-link::after {
          content: "";
          position: absolute;
          bottom: -4px; left: 0; width: 0; height: 2px;
          background: var(--grad-accent);
          transition: width 0.3s ease;
        }

        .nav-link:hover::after {
          width: 100%;
        }
      `}</style>
    </header>
  );
}
