import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { mockScholarships } from '../src/data/mockScholarships';

try {
  dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
} catch (e) {
  // Ignore error if .env.local doesn't exist (e.g. in Vercel)
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  console.log("Seeding database via Supabase...");
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

    console.log(`Inserted ${s.title}`);
  }
  console.log("Seeding COMPLETE.");
}

seed().catch(console.error);
