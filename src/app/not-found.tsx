'use client';

import Link from 'next/link';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main style={{ 
      minHeight: '100vh', display: 'flex', flexDirection: 'column', 
      alignItems: 'center', justifyContent: 'center', 
      background: 'var(--grad-main)', textAlign: 'center', padding: '2rem' 
    }}>
      <div style={{ 
        width: '120px', height: '120px', borderRadius: '50%', 
        background: 'rgba(99, 102, 241, 0.1)', display: 'flex', 
        alignItems: 'center', justifyContent: 'center', marginBottom: '2rem',
        color: 'var(--accent-primary)', animation: 'pulse 2s infinite'
      }}>
        <Sparkles size={60} />
      </div>
      
      <h1 style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '1rem' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Página no encontrada</h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', marginBottom: '3rem', lineHeight: 1.6 }}>
        Parece que esta beca se ha esfumado o el enlace ha expirado. 
        Pero no te preocupes, hay miles más esperándote.
      </p>

      <Link href="/" style={{ 
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        background: 'var(--accent-primary)', color: 'white', 
        padding: '1rem 2rem', borderRadius: '100px', fontWeight: 700,
        textDecoration: 'none', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)',
        transition: 'all 0.3s ease'
      }} className="hover-scale">
        <ArrowLeft size={20} /> Volver a Explorar
      </Link>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
        }
        .hover-scale:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 15px 30px rgba(99, 102, 241, 0.5);
        }
      `}</style>
    </main>
  );
}
