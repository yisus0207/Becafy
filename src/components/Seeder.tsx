'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { mockScholarships } from '../data/mockScholarships';

export default function Seeder() {
  const [status, setStatus] = useState('Idle');

  useEffect(() => {
    async function seed() {
      setStatus('Comenzando...');
      for (const s of mockScholarships) {
        // Insert Opportunity
        const { data: opp, error: oppErr } = await supabase
          .from('opportunities')
          .insert({
            title: s.title,
            institution: s.institution,
            country: s.country,
            description: s.description,
            coverage: s.coverage,
            language_level: s.language_level,
            difficulty: s.difficulty,
            category: s.category,
            deadline: s.deadline ? new Date(s.deadline).toISOString() : null,
            official_link: s.official_link,
            is_verified: true,
            coordinates: s.coordinates ? JSON.stringify(s.coordinates) : null,
            created_at: new Date().toISOString()
          })
          .select('id').single();
    
        if (oppErr || !opp) {
          console.error(`Error inserting ${s.title}`, oppErr);
          continue;
        }
    
        const oppId = opp.id;
    
        // Insert Fields
        if (s.fields) {
          const fieldInserts = s.fields.map(f => ({ opportunity_id: oppId, field_name: f }));
          if (s.careerField && !s.fields.includes(s.careerField)) {
            fieldInserts.push({ opportunity_id: oppId, field_name: s.careerField });
          }
          await supabase.from('opportunity_fields').insert(fieldInserts);
        }
    
        // Insert Requirements
        if (s.requirements) {
          const reqInserts = s.requirements.map(r => ({ opportunity_id: oppId, description: r }));
          await supabase.from('requirements').insert(reqInserts);
        }
      }
      setStatus('Terminado con éxito');
    }
    
    seed();
  }, []);

  return <div style={{ position:'fixed', top:0, left:0, zIndex: 9999, background:'black', color:'lime', padding:'10px' }}>SEEDER STATUS: {status}</div>;
}
