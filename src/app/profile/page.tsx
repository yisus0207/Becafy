'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useScholarships } from '@/hooks/useScholarships';
import { 
  User, BookOpen, MapPin, Phone, Award, Save, 
  CheckCircle, Briefcase, Heart, Settings, ChevronRight, 
  LogOut, ClipboardList, Sparkles, FileText, ArrowLeft
} from 'lucide-react';
import ScholarshipCard from '@/components/ScholarshipCard';
import { CAREER_FIELDS } from '@/data/constants';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Suspense } from 'react';

type TabType = 'perfil' | 'matches' | 'seguimiento';

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--grad-main)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Cargando perfil...</p>
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}

function ProfileContent() {
  const { user, updateProfile, logout, toggleRequirement } = useAuth();
  const { showToast } = useToast();
  const { scholarships } = useScholarships();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('perfil');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'matches' || tab === 'seguimiento') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    age: user?.age || '',
    career: user?.career || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ ...formData, age: Number(formData.age) });
    showToast('¡Información actualizada con éxito!', 'success');
    // We stay in the profile, but maybe switch view? 
    // The user said "not stay exactly the same", let's show a success state or something
  };

  const handleToggleRequirement = async (scholarshipId: string, req: string, totalCount: number, currentCompleted: number) => {
    await toggleRequirement(scholarshipId, req);
    
    // If we were at totalCount - 1 and we just checked one, it's 100%
    // Note: toggleRequirement is async and we just called it, but we can predict the state
    const isChecking = !user?.trackedScholarships?.find(t => t.scholarshipId === scholarshipId)?.completedRequirements.includes(req);
    
    if (isChecking && currentCompleted + 1 === totalCount) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#10b981', '#fbbf24', '#f472b6']
      });
      showToast('¡Increíble! Has completado todos los requisitos.', 'success');
    }
  };

  const matches = scholarships.filter(s => s.careerField === user?.career);

  if (!user) return null;

  return (
    <main style={{ minHeight: '100vh', background: 'var(--grad-main)', paddingBottom: '6rem' }}>
      
      {/* Header Profile - Mobile App Style */}
      <section style={{ 
        padding: '2rem 1.5rem 2rem', background: 'rgba(255,255,255,0.02)',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Back Button */}
          <button 
            onClick={() => router.push('/')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'none', border: 'none', color: 'var(--text-secondary)',
              fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
              marginBottom: '1.5rem', padding: 0
            }}
          >
            <ArrowLeft size={18} /> Volver a Explorar
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'var(--grad-accent)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: 800, color: 'white',
            boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)'
          }}>
            {user.firstName?.[0] || 'U'}
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Hola, {user.firstName || 'Estudiante'}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{user.email}</p>
            <div style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '4px 12px', background: 'rgba(16, 185, 129, 0.1)',
              color: 'var(--diff-easy)', borderRadius: '100px', 
              fontSize: '0.75rem', fontWeight: 700, marginTop: '8px'
            }}>
              <CheckCircle size={12} /> Perfil Verificado
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Tabs Navigation - Premium Pill Style */}
      <div style={{ 
        maxWidth: '800px', margin: '1.5rem auto', padding: '0 1rem',
        display: 'flex', gap: '0.5rem', overflowX: 'auto', scrollbarWidth: 'none'
      }}>
        {(['perfil', 'matches', 'seguimiento'] as TabType[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.8rem 1.5rem', borderRadius: '100px',
              background: activeTab === tab ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
              color: activeTab === tab ? 'white' : 'var(--text-secondary)',
              border: 'none', fontWeight: 700, fontSize: '0.9rem',
              transition: 'all 0.3s ease', whiteSpace: 'nowrap',
              boxShadow: activeTab === tab ? '0 8px 20px rgba(99, 102, 241, 0.3)' : 'none'
            }}
          >
            {tab === 'perfil' && 'Mis Datos'}
            {tab === 'matches' && 'Mis Matches ✨'}
            {tab === 'seguimiento' && 'Seguimiento'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <section style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem' }}>
        
        {activeTab === 'perfil' && (
          <form onSubmit={handleSave} className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-v2-heavy" style={{ padding: '2rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Nombre</label>
                  <input className="input" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Área de Estudio</label>
                  <select className="input" value={formData.career} onChange={(e) => setFormData({...formData, career: e.target.value})} style={{ appearance: 'none' }}>
                    <option value="">Seleccionar Carrera</option>
                    {CAREER_FIELDS.map(field => (
                      <option key={field} value={field}>{field}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Teléfono</label>
                  <input className="input" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
            </div>
            <button type="submit" className="btn-glow" style={{ borderRadius: '100px', padding: '1.2rem' }}>
              Guardar Cambios
            </button>
            <button 
              type="button" 
              onClick={() => {
                logout();
                router.push('/');
              }}
              style={{ padding: '1rem', color: '#ef4444', background: 'none', border: 'none', fontWeight: 600 }}
            >
              Cerrar Sesión
            </button>
          </form>
        )}

        {activeTab === 'matches' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <div style={{ padding: '1rem', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '16px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>
                💡 Encontramos {matches.length} becas perfectas para tu perfil de {user.career}.
              </p>
            </div>
            {matches.map(s => (
              <ScholarshipCard key={s.id} scholarship={s} onClick={() => {}} />
            ))}
            {matches.length === 0 && (
              <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <Sparkles size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                <p style={{ color: 'var(--text-secondary)' }}>¡Completa tu perfil para ver tus primeras recomendaciones!</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'seguimiento' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            {(!user.trackedScholarships || user.trackedScholarships.length === 0) && (
              <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <ClipboardList size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                <p style={{ color: 'var(--text-secondary)' }}>Aún no estás siguiendo ninguna beca.</p>
              </div>
            )}
            
            {user.trackedScholarships?.map(tracking => {
              const scholarship = scholarships.find(s => s.id === tracking.scholarshipId);
              if (!scholarship) return null;
              
              const totalReqs = scholarship.requirements.length;
              const completedCount = tracking.completedRequirements.length;
              const progressPct = totalReqs > 0 ? Math.round((completedCount / totalReqs) * 100) : 0;
              const isReady = progressPct === 100;

              return (
                <motion.div 
                  layout
                  key={tracking.scholarshipId} 
                  className="glass-v2-heavy" 
                  style={{ 
                    padding: '2rem', 
                    borderRadius: 'var(--radius-lg)',
                    border: isReady ? '2px solid var(--diff-easy)' : '1px solid rgba(255,255,255,0.1)',
                    boxShadow: isReady ? '0 0 30px rgba(16, 185, 129, 0.2)' : 'none',
                    transition: 'all 0.5s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div>
                      <span style={{ 
                        background: isReady ? 'var(--diff-easy)' : 'rgba(255,255,255,0.1)', 
                        color: isReady ? 'black' : 'white',
                        padding: '0.4rem 0.8rem', 
                        borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800,
                        transition: 'all 0.3s ease'
                      }}>
                        {scholarship.institution}
                      </span>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '0.8rem' }}>{scholarship.title}</h3>
                    </div>
                    <div style={{ 
                      background: isReady ? 'rgba(16, 185, 129, 0.2)' : 'var(--bg-glass)',
                      color: isReady ? 'var(--diff-easy)' : 'white',
                      padding: '0.5rem 1rem', borderRadius: '100px', fontWeight: 800, fontSize: '0.9rem',
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      border: isReady ? '1px solid var(--diff-easy)' : '1px solid rgba(255,255,255,0.1)'
                    }}>
                      {isReady ? <><CheckCircle size={16} /> ¡LISTO!</> : `${progressPct}%`}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px' }}>
                    <h4 style={{ fontSize: '0.8rem', color: isReady ? 'var(--diff-easy)' : 'var(--text-muted)', marginBottom: '1rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                      {isReady ? '¡REQUISITOS COMPLETADOS!' : 'REQUISITOS PENDIENTES'}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      {scholarship.requirements.map(req => {
                        const isChecked = tracking.completedRequirements.includes(req);
                        return (
                          <label key={req} style={{ 
                            display: 'flex', gap: '1rem', cursor: 'pointer', 
                            padding: '0.8rem', borderRadius: '8px',
                            background: isChecked ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.02)',
                            border: isChecked ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
                            transition: 'all 0.2s ease',
                            opacity: isChecked ? 0.8 : 1
                          }}>
                            <input 
                              type="checkbox" 
                              checked={isChecked}
                              onChange={() => handleToggleRequirement(scholarship.id, req, totalReqs, completedCount)}
                              style={{ width: '22px', height: '22px', accentColor: 'var(--diff-easy)', flexShrink: 0, cursor: 'pointer' }}
                            />
                            <span style={{ 
                              color: isChecked ? 'var(--text-secondary)' : 'var(--text-primary)',
                              textDecoration: isChecked ? 'line-through' : 'none',
                              fontSize: '0.9rem', lineHeight: 1.4,
                              fontWeight: isChecked ? 500 : 600
                            }}>
                              {req}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {isReady && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                          <p style={{ color: 'var(--diff-easy)', fontWeight: 700, marginBottom: '1rem', fontSize: '0.9rem' }}>
                            ✨ ¡Felicidades! Tienes todo lo necesario para ganar esta beca.
                          </p>
                           <a 
                             href={scholarship.official_link || '#'} 
                             target="_blank" 
                             rel="noopener noreferrer" 
                             className="btn-glow" 
                             style={{ 
                               width: '100%', 
                               textAlign: 'center', 
                               display: 'block',
                               padding: '1.2rem',
                               borderRadius: '12px',
                               background: 'linear-gradient(135deg, #10b981, #059669)',
                               boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)'
                             }}
                           >
                             Enviar Postulación Oficial
                           </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        )}

      </section>

      {/* Tab Transitions CSS */}
      <style jsx>{`
        .animate-slide-up {
          animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
