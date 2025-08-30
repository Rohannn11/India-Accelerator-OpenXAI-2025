export interface User {
  id: string;
  email: string;
  full_name: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  medical_history: string[];
  allergies: string[];
  medications: string[];
  emergency_contact: {
    name: string;
    phone: string;
    relationship: string;
  };
  created_at: string;
  updated_at: string;
}

export interface SymptomSession {
  id: string;
  user_id: string;
  start_time: string;
  end_time?: string;
  status: 'active' | 'completed' | 'abandoned';
  risk_score: number;
  priority_level: 'emergency' | 'urgent' | 'non_urgent';
  chief_complaint: string;
  ai_analysis: string;
  recommendations: string[];
  red_flags: string[];
  follow_up_required: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  message_type: 'question' | 'answer' | 'assessment' | 'recommendation' | 'alert';
  confidence_score?: number;
  timestamp: string;
}

export interface TriageResult {
  priority: 'emergency' | 'urgent' | 'non_urgent';
  risk_score: number;
  recommendations: string[];
  red_flags: string[];
  confidence: number;
  explanation: string;
  next_steps: string[];
}

export interface MedicalAlert {
  type: 'emergency' | 'urgent' | 'warning';
  message: string;
  action_required: string;
  confidence: number;
}