'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Heart, Briefcase, User, LayoutGrid, ClipboardList } from 'lucide-react';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: 'Explorar', icon: Search, path: '/explorar' },
    { label: 'Match', icon: Heart, path: '/profile?tab=matches' },
    { label: 'Seguimiento', icon: ClipboardList, path: '/profile?tab=seguimiento' },
    { label: 'Perfil', icon: User, path: '/profile' },
  ];

  return (
    <nav className="glass-v2-heavy" style={{
      position: 'fixed', bottom: '1.5rem', left: '1rem', right: '1rem',
      height: 'var(--nav-height)', borderRadius: '100px',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      zIndex: 1000, padding: '0 1rem',
      boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
      border: '1px solid rgba(255,255,255,0.1)'
    }}>
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <button
            key={item.label}
            onClick={() => router.push(item.path)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
              background: 'none', border: 'none', cursor: 'pointer', outline: 'none',
              transition: 'all 0.3s ease',
              transform: isActive ? 'scale(1.1) translateY(-4px)' : 'scale(1)',
              padding: '0.5rem'
            }}
          >
            <div style={{
              position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <item.icon size={isActive ? 24 : 22} strokeWidth={isActive ? 2.5 : 2} />
              {isActive && (
                <div style={{
                  position: 'absolute', bottom: '-10px', width: '4px', height: '4px',
                  background: 'var(--accent-primary)', borderRadius: '50%',
                  boxShadow: '0 0 10px var(--accent-primary)'
                }} />
              )}
            </div>
            <span style={{ 
              fontSize: '0.65rem', fontWeight: isActive ? 700 : 500,
              textTransform: 'uppercase', letterSpacing: '0.05em'
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
      
      {/* Visual Indicator of the glass bar on Mobile Only CSS */}
      <style jsx>{`
        @media (min-width: 1024px) {
          nav { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
