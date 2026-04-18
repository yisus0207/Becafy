import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Scholarship } from '@/types';
import L from 'leaflet';

// Fix Leaflet default icon issues in Next.js
if (typeof window !== 'undefined') {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

interface InteractiveMapProps {
  scholarships: Scholarship[];
  userCareer?: string;
  onSelectScholarship: (scholarship: Scholarship) => void;
  isSelectionActive: boolean;
}

export default function InteractiveMap({ scholarships = [], userCareer, onSelectScholarship, isSelectionActive }: InteractiveMapProps) {
  const getIcon = (category: string, isMatch: boolean) => {
    let color = 'white';
    switch (category) {
      case 'maestria': color = '#a855f7'; break; // Purple
      case 'pregrado': color = '#3b82f6'; break; // Blue
      case 'intercambio': color = '#ec4899'; break; // Pink
      case 'cursos': color = '#10b981'; break; // Green
    }

    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div class="custom-marker" style="background: ${color}; box-shadow: ${isMatch ? '0 0 15px ' + color : 'none'}; width: ${isMatch ? '20px' : '14px'}; height: ${isMatch ? '20px' : '14px'}"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    // Force map to recalculate size 1 second after mount
    // This fixed the "grey map" issue in Next.js + dynamic imports
    const timer = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle auto zoom-out when selection is cleared
  const prevSelectionRef = useRef(isSelectionActive);
  useEffect(() => {
    if (prevSelectionRef.current && !isSelectionActive) {
      // Transitioned from active to inactive (modal closed)
      if (mapRef.current) {
        mapRef.current.flyTo([5, -20], 3, {
          duration: 1.5
        });
      }
    }
    prevSelectionRef.current = isSelectionActive;
  }, [isSelectionActive]);

  return (
    <div style={{ height: '500px', width: '100%', position: 'relative', zIndex: 1 }} className="glass-v2">
      <MapContainer 
        center={[5, -75] as any} // Centered on LatAm
        zoom={3} 
        minZoom={2}
        maxZoom={12}
        scrollWheelZoom={true}
        zoomControl={false}
        attributionControl={false}
        worldCopyJump={true}
        ref={mapRef}
        style={{ height: '100%', width: '100%', borderRadius: 'var(--radius-lg)' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {scholarships && scholarships.length > 0 && scholarships.map(s => {
          const isMatch = userCareer && s.fields.includes(userCareer);
          return (
            <Marker 
              key={s.id} 
              position={s.coordinates} 
              icon={getIcon(s.category, !!isMatch)}
              eventHandlers={{
                click: () => {
                  if (mapRef.current) {
                    mapRef.current.flyTo(s.coordinates, 12, {
                      duration: 1.5
                    });
                  }
                  
                  setTimeout(() => {
                    onSelectScholarship(s);
                  }, 1500);
                },
              }}
            >
              <Popup>
                <div style={{ color: 'black', padding: '4px' }}>
                  <strong style={{ display: 'block', fontSize: '0.9rem', marginBottom: '2px' }}>{s.title}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'gray' }}>{s.country}</span>
                  {isMatch && <div style={{ color: '#6366f1', fontSize: '0.7rem', fontWeight: 'bold', marginTop: '4px' }}>✨ ¡Match Perfecto!</div>}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
