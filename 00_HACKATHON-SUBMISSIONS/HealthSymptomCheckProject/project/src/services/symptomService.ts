import { supabase } from '../config/supabase';
import { ollamaService } from './ollamaService';
import type { SymptomSession, ChatMessage, TriageResult } from '../types/medical';

export class SymptomService {
  async createSession(userId: string, chiefComplaint: string): Promise<SymptomSession> {
    const { data, error } = await supabase
      .from('symptom_sessions')
      .insert({
        user_id: userId,
        chief_complaint: chiefComplaint,
        status: 'active',
        risk_score: 0,
        priority_level: 'non_urgent'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async addMessage(sessionId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<ChatMessage> {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        ...message,
        session_id: sessionId
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async processSymptoms(
    sessionId: string,
    symptoms: string,
    userAge: number,
    userGender: string,
    medicalHistory: string[]
  ): Promise<TriageResult> {
    try {
      // Get AI analysis
      const aiResult = await ollamaService.analyzeSymptoms(symptoms, userAge, userGender, medicalHistory);
      
      // Check for red flags
      const redFlags = await ollamaService.detectRedFlags(symptoms);
      
      // Update session with results
      await supabase
        .from('symptom_sessions')
        .update({
          risk_score: aiResult.risk_score,
          priority_level: aiResult.priority,
          ai_analysis: aiResult.explanation,
          recommendations: aiResult.recommendations,
          red_flags: aiResult.red_flags,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      return {
        ...aiResult,
        red_flags: [...aiResult.red_flags, ...redFlags.map(alert => alert.message)]
      };
    } catch (error) {
      console.error('Symptom processing error:', error);
      // Fail-safe response
      return {
        priority: 'urgent',
        risk_score: 75,
        recommendations: ['Please consult a healthcare provider'],
        red_flags: ['AI analysis unavailable'],
        confidence: 0,
        explanation: 'Unable to complete assessment. Medical consultation recommended.',
        next_steps: ['Contact your healthcare provider or visit an urgent care center']
      };
    }
  }

  async getUserSessions(userId: string): Promise<SymptomSession[]> {
    const { data, error } = await supabase
      .from('symptom_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async generateFollowUpQuestions(sessionId: string): Promise<string[]> {
    const messages = await this.getSessionMessages(sessionId);
    const symptoms = messages
      .filter(m => m.role === 'user')
      .map(m => m.content)
      .join(' ');
    
    const context = messages
      .filter(m => m.role === 'assistant')
      .map(m => m.content);

    return ollamaService.generateFollowUpQuestions(symptoms, context);
  }
}

export const symptomService = new SymptomService();