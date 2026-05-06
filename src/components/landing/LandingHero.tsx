'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2, Users, Globe, Zap } from 'lucide-react';
import Link from 'next/link';

export default function LandingHero() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      // Here you would typically save to Supabase waitlist table
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', display: 'flex', flexDirection: 'column', 
      alignItems: 'center', justifyContent: 'center', padding: '6rem 1.5rem',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Dynamic Background Elements */}
      <div style={{
        position: 'absolute', top: '20%', left: '10%', width: '300px', height: '300px',
        background: 'var(--accent-primary)', filter: 'blur(120px)', opacity: 0.1, zIndex: -1
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '10%', width: '400px', height: '400px',
        background: 'var(--accent-secondary)', filter: 'blur(150px)', opacity: 0.1, zIndex: -1
      }} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container-v2"
        style={{ textAlign: 'center', maxWidth: '900px' }}
      >
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,255,255,0.03)', padding: '8px 20px',
            borderRadius: '100px', border: '1px solid rgba(255,255,255,0.08)',
            marginBottom: '2.5rem', color: 'var(--accent-primary)',
            fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em'
          }}
        >
          <Sparkles size={14} /> FASE BETA · ACCESO EXCLUSIVO
        </motion.div>

        <h1 style={{ 
          fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: 800, 
          lineHeight: 1, marginBottom: '2rem', letterSpacing: '-0.04em'
        }}>
          Tu Futuro no es un Sueño, <br />
          <span className="text-sparkle">Es tu Próximo Match</span>
        </h1>

        <p style={{ 
          fontSize: '1.25rem', color: 'var(--text-secondary)', 
          maxWidth: '700px', margin: '0 auto 3.5rem', lineHeight: 1.6
        }}>
          Hackeamos el sistema de becas para que dejes de buscar y empieces a aplicar. 
          La IA que conecta tu perfil con las mejores universidades del mundo.
        </p>

        {/* Waitlist Form */}
        {!isSubmitted ? (
          <motion.form 
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ 
              maxWidth: '550px', margin: '0 auto', display: 'flex', 
              flexDirection: 'column', gap: '1rem', position: 'relative'
            }}
          >
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                placeholder="Tu mejor correo electrónico..."
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%', padding: '1.4rem 2rem', background: 'var(--bg-glass-heavy)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px',
                  color: 'white', fontSize: '1.1rem', outline: 'none',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4)', transition: 'all 0.3s ease'
                }}
                className="waitlist-input"
              />
              <button 
                type="submit"
                style={{
                  position: 'absolute', right: '0.6rem', top: '0.6rem', bottom: '0.6rem',
                  background: 'var(--grad-accent)', color: 'white', border: 'none',
                  padding: '0 2rem', borderRadius: '14px', fontWeight: 700,
                  cursor: 'pointer', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                  display: 'flex', alignItems: 'center', gap: '8px'
                }}
                className="hover-scale"
              >
                Asegurar mi lugar <ArrowRight size={18} />
              </button>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              🚀 Únete a los +1,240 estudiantes que ya están en la lista VIP.
            </p>
          </motion.form>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ 
              background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)',
              padding: '2rem', borderRadius: '24px', maxWidth: '500px', margin: '0 auto'
            }}
          >
            <CheckCircle2 size={40} color="#10b981" style={{ marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>¡Estás dentro, {email.split('@')[0]}!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Te avisaremos en cuanto abramos las puertas de la Beta. 
              Mientras tanto, ¡mira lo que estamos construyendo!
            </p>
            <Link href="/explorar" style={{ 
              display: 'inline-flex', marginTop: '1.5rem', color: 'var(--accent-primary)',
              fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem', gap: '6px',
              alignItems: 'center'
            }}>
              Ver el buscador en vivo <ArrowRight size={16} />
            </Link>
          </motion.div>
        )}

        {/* Sneak Peek Button */}
        {!isSubmitted && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{ marginTop: '4rem' }}
          >
            <Link href="/explorar" style={{ 
              color: 'var(--text-muted)', textDecoration: 'none', 
              fontSize: '0.9rem', fontWeight: 600, display: 'flex', 
              alignItems: 'center', justifyContent: 'center', gap: '8px',
              opacity: 0.7, transition: 'opacity 0.3s'
            }} className="hover-opacity">
              ¿Quieres ver cómo funciona? <span style={{ color: 'var(--accent-primary)' }}>Ver el buscador</span>
            </Link>
          </motion.div>
        )}
      </motion.div>

      {/* Features Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        style={{ 
          marginTop: '8rem', display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem', width: '100%', maxWidth: '1200px'
        }}
      >
        {[
          { icon: Globe, title: 'Alcance Global', desc: 'Acceso a becas en los 5 continentes.' },
          { icon: Zap, title: 'Match al Instante', desc: 'IA que filtra becas según tu carrera y promedio.' },
          { icon: Users, title: 'Comunidad Elite', desc: 'Consejos de quienes ya ganaron sus becas.' }
        ].map((f, i) => (
          <div key={i} className="glass-v2" style={{ padding: '2rem', textAlign: 'left' }}>
            <div style={{ 
              width: '45px', height: '45px', borderRadius: '12px', 
              background: 'rgba(255,255,255,0.05)', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem',
              color: 'var(--accent-primary)'
            }}>
              <f.icon size={24} />
            </div>
            <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>{f.title}</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>{f.desc}</p>
          </div>
        ))}
      </motion.div>

      <style jsx>{`
        .waitlist-input:focus {
          border-color: var(--accent-primary) !important;
          box-shadow: 0 0 30px rgba(99, 102, 241, 0.3) !important;
        }
        .hover-scale:hover {
          transform: scale(1.05);
        }
        .hover-opacity:hover {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}
