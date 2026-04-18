export interface User {
  id: string;
  email: string;
  is_premium: boolean;
  role: 'user' | 'admin';
  subscription_type: 'free' | 'monthly' | 'yearly' | 'lifetime';
  subscription_end_date?: string;
  created_at: string;
  // Extended Profile
  firstName?: string;
  lastName?: string;
  age?: number;
  career?: string;
  phone?: string;
  address?: string;
  trackedScholarships?: TrackedScholarship[];
}

export interface Payment {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  payment_date: string;
  plan_type: 'monthly' | 'yearly' | 'lifetime';
  status: 'completed' | 'pending' | 'failed';
}

export interface TrackedScholarship {
  scholarshipId: string;
  completedRequirements: string[];
}

export interface Scholarship {
  id: string;
  title: string;
  institution: string;
  country: string;
  description: string;
  coverage: string;
  requirements: string[];
  language_level: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'pregrado' | 'maestria' | 'intercambio' | 'cursos';
  deadline: string;
  official_link: string;
  created_at: string;
  // V3 Optimized Fields
  careerField: string; // The primary field for better filtering
  fields: string[]; 
  location: string;
  coordinates: [number, number];
}

export interface FilterState {
  careerField: string;
  location: string;
  deadline: string;
}
