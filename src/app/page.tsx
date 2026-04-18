'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useScholarships } from '@/hooks/useScholarships';
import { useFreemium } from '@/hooks/useFreemium';

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ScholarshipCard from '@/components/ScholarshipCard';
import ScholarshipDetail from '@/components/ScholarshipDetail';
import FilterPanel from '@/components/FilterPanel';
import FreemiumGate from '@/components/FreemiumGate';
import { Scholarship } from '@/types';
import { LayoutGrid, Map as MapIcon, SlidersHorizontal, Sparkles, Info } from 'lucide-react';
import dynamic from 'next/dynamic';

const InteractiveMap = dynamic(() => import('@/components/InteractiveMap'), { 
  ssr: false,
  loading: () => <div className="glass-v2" style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando Mapa Élite...</div>
});

export default function Home() {
  const { user } = useAuth();
  const { 
    scholarships: filteredScholarships, 
    searchTerm, setSearchTerm, 
    filters, setFilters, 
    resetFilters 
  } = useScholarships();

  const { trackView, canViewContent, showGate, setShowGate, remainingViews } = useFreemium();
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [showFilters, setShowFilters] = useState(false);



  const handleOpenScholarship = (scholarship: Scholarship) => {
    if (canViewContent(scholarship.id)) {
      trackView(scholarship.id);
      setSelectedScholarship(scholarship);
    } else {
      setShowGate(true);
    }
  };

  return (
    <main style={{ paddingBottom: '8rem' }}>
      <Header />
      <Hero 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
        totalScholarships={filteredScholarships.length}
      />

      <div className="container-v2">
        
        {/* View Controls & Matches Hint */}
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' 
        }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Oportunidades de Crecimiento</h2>
            {user?.career && (
              <p style={{ color: 'var(--accent-secondary)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={14} /> Recomendaciones para {user.career}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '100px' }}>
            <button 
              onClick={() => setViewMode('grid')}
              style={{ 
                padding: '0.6rem 1.2rem', borderRadius: '100px', border: 'none',
                background: viewMode === 'grid' ? 'var(--accent-primary)' : 'transparent',
                color: 'white', display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'all 0.3s ease', cursor: 'pointer', fontWeight: 600
              }}
            >
              <LayoutGrid size={18} /> <span className="hide-mobile">Grilla</span>
            </button>
            <button 
              onClick={() => setViewMode('map')}
              style={{ 
                padding: '0.6rem 1.2rem', borderRadius: '100px', border: 'none',
                background: viewMode === 'map' ? 'var(--accent-primary)' : 'transparent',
                color: 'white', display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'all 0.3s ease', cursor: 'pointer', fontWeight: 600
              }}
            >
              <MapIcon size={18} /> <span className="hide-mobile">Mapa</span>
            </button>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              style={{ 
                padding: '0.6rem 1.2rem', borderRadius: '100px', border: 'none',
                background: showFilters ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: 'white', display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'all 0.3s ease', cursor: 'pointer', fontWeight: 600
              }}
            >
              <SlidersHorizontal size={18} /> <span className="hide-mobile">Filtros</span>
            </button>
          </div>
        </div>

        {/* Filters Drawer (Mobile Friendly) */}
        {showFilters && (
          <div className="animate-slide-up" style={{ marginBottom: '2rem' }}>
            <FilterPanel 
              filters={filters} 
              onFilterChange={setFilters} 
              onReset={() => { resetFilters(); setShowFilters(false); }} 
            />
          </div>
        )}

        {/* Content Area */}
        <div className="main-content-v3">
          {viewMode === 'grid' ? (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
              gap: '1.5rem' 
            }}>
              {filteredScholarships.map(s => (
                <ScholarshipCard 
                  key={s.id} 
                  scholarship={s} 
                  onClick={handleOpenScholarship} 
                />
              ))}
            </div>
          ) : (
            <div className="animate-slide-up" style={{ height: '600px', borderRadius: '40px', overflow: 'hidden' }}>
              <InteractiveMap 
                scholarships={filteredScholarships} 
                onSelectScholarship={handleOpenScholarship}
                userCareer={user?.career}
                isSelectionActive={!!selectedScholarship || showGate}
              />
            </div>
          )}
        </div>

        {filteredScholarships.length === 0 && (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <Info size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
            <h3>No encontramos becas con esos filtros.</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Prueba ajustando tu búsqueda o filtros.</p>
          </div>
        )}
      </div>

      {selectedScholarship && (
        <ScholarshipDetail 
          scholarship={selectedScholarship} 
          onClose={() => setSelectedScholarship(null)} 
        />
      )}

      {showGate && (
        <FreemiumGate 
          type={user ? 'registered' : 'anonymous'} 
          remaining={remainingViews}
          onClose={() => setShowGate(false)} 
        />
      )}

      <style jsx>{`
        .hide-mobile {
          display: none;
        }
        @media (min-width: 640px) {
          .hide-mobile { display: inline; }
        }
        .animate-slide-up {
          animation: slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
