'use client';

import React from 'react';
import { Scholarship } from '../types';
import { X, ExternalLink, CheckCircle2, Globe2, Clock, ShieldCheck, Sparkles, Bookmark, BookmarkCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { formatDate } from '@/lib/utils';

interface ScholarshipDetailProps {
  scholarship: Scholarship;
  onClose: () => void;
}

export default function ScholarshipDetail({ scholarship, onClose }: ScholarshipDetailProps) {
  const { user, toggleTrackScholarship } = useAuth();
  const isMatch = user?.career && scholarship.fields.includes(user.career);
  const isTracking = user?.trackedScholarships?.some(t => t.scholarshipId === scholarship.id);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000,
      padding: '1rem'
    }}>
      <div className="glass-v2-heavy animate-slide-up" style={{
        maxWidth: '900px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
        borderRadius: 'var(--radius-lg)', position: 'relative'
      }}>
        {/* Banner with Match Glow */}
        <div style={{ 
          background: isMatch ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' : 'var(--bg-glass-heavy)',
          padding: '4rem 3rem 2rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <button onClick={onClose} style={{ 
            position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'white',
            background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '50%'
          }}>
            <X size={24} />
          </button>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ 
              background: 'rgba(255,255,255,0.2)', padding: '0.4rem 1rem', 
              borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700 
            }}>
              {scholarship.category.toUpperCase()}
            </span>
            {isMatch && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 800 }}>
                <Sparkles size={16} /> MATCH ESPECIAL PARA TI
              </div>
            )}
          </div>
          
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white' }}>{scholarship.title}</h2>
          <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', color: 'rgba(255,255,255,0.8)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Globe2 size={18} /> {scholarship.country}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} /> Cierre: {formatDate(scholarship.deadline)}
            </div>
          </div>
        </div>

        <div className="detail-content" style={{ padding: '3rem', display: 'grid', gap: '3rem' }}>
          <div>
            <section style={{ marginBottom: '2.5rem' }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--accent-primary)' }}>Descripción</h4>
              <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>{scholarship.description}</p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--accent-primary)' }}>Lo que cubre (Beneficios)</h4>
              <div className="glass-v2" style={{ padding: '1.5rem', borderLeft: '4px solid var(--diff-easy)' }}>
                <p style={{ fontWeight: 500 }}>{scholarship.coverage}</p>
              </div>
            </section>

            <section>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--accent-primary)' }}>Requisitos Clave</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {scholarship.requirements.map((req, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                    <CheckCircle2 size={20} color="var(--diff-easy)" style={{ flexShrink: 0 }} />
                    {req}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside>
            <div className="glass-v2" style={{ padding: '2rem', borderRadius: 'var(--radius-md)', position: 'sticky', top: '2rem' }}>
              <div style={{ marginBottom: '2rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>DIFICULTAD</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', marginTop: '0.25rem' }}>
                  {scholarship.difficulty}
                </div>
              </div>
              
              <div style={{ marginBottom: '2rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>IDIOMA REQUERIDO</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '0.25rem' }}>
                  {scholarship.language_level}
                </div>
              </div>

              <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--diff-easy)' }}>
                <ShieldCheck size={18} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Oportunidad Verificada</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <a 
                  href={scholarship.official_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-glow"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
                >
                  Postular Ahora <ExternalLink size={18} />
                </a>

                {user && (
                  <button 
                    onClick={() => toggleTrackScholarship(scholarship.id)}
                    style={{ 
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                      padding: '1rem 2rem', borderRadius: 'var(--radius-full)', fontWeight: 700,
                      background: isTracking ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                      color: isTracking ? 'var(--diff-easy)' : 'white',
                      border: isTracking ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
                      cursor: 'pointer', transition: 'all 0.3s ease'
                    }}
                  >
                    {isTracking ? (
                      <><BookmarkCheck size={18} /> Beca en Seguimiento</>
                    ) : (
                      <><Bookmark size={18} /> Seguir / Guardar Beca</>
                    )}
                  </button>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style jsx>{`
        .detail-content {
          grid-template-columns: 2fr 1fr;
        }
        @media (max-width: 768px) {
          .detail-content {
            grid-template-columns: 1fr;
            padding: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
