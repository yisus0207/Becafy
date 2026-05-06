import React from 'react';
import LandingHero from '@/components/landing/LandingHero';
import Header from '@/components/Header';

export default function Home() {
  return (
    <main style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <Header />
      <LandingHero />
      
      {/* Visual background noise/particles could go here */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px', pointerEvents: 'none', zIndex: -1
      }} />
    </main>
  );
}
