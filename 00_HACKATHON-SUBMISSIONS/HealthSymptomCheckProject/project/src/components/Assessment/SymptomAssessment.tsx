import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { symptomService } from '../../services/symptomService';
import { ChatInterface } from '../Chat/ChatInterface';
import { MedicalDisclaimer } from '../Common/MedicalDisclaimer';
import { ArrowLeft } from 'lucide-react';
import type { SymptomSession, ChatMessage, TriageResult } from '../../types/medical';

interface SymptomAssessmentProps {
  onBack: () => void;
}

export function SymptomAssessment({ onBack }: SymptomAssessmentProps) {
  const { user } = useAuth();
  const [session, setSession] = useState<SymptomSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    if (!user || initialized) return;

    try {
      // Create initial system message
      const systemMessage: Omit<ChatMessage, 'id' | 'timestamp'> = {
        session_id: '', // Will be set after session creation
        role: 'system',
        content: 'Welcome to HealthAI. I\'m here to help assess your symptoms and provide guidance. Please describe your main concern or symptoms in detail.',
        message_type: 'question'
      };

      setMessages([systemMessage as ChatMessage]);
      setInitialized(true);
    } catch (error) {
      console.error('Failed to initialize session:', error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!user) return;

    setLoading(true);
    
    try {
      // Create session if it doesn't exist
      let currentSession = session;
      if (!currentSession) {
        currentSession = await symptomService.createSession(user.id, content);
        setSession(currentSession);
      }

      // Add user message
      const userMessage = await symptomService.addMessage(currentSession.id, {
        session_id: currentSession.id,
        role: 'user',
        content,
        message_type: 'answer'
      });

      setMessages(prev => [...prev, userMessage]);

      // Get AI response and triage
      const userAge = user.date_of_birth ? 
        new Date().getFullYear() - new Date(user.date_of_birth).getFullYear() : 25;

      const result = await symptomService.processSymptoms(
        currentSession.id,
        content,
        userAge,
        user.gender,
        user.medical_history || []
      );

      setTriageResult(result);

      // Add AI response
      const aiMessage = await symptomService.addMessage(currentSession.id, {
        session_id: currentSession.id,
        role: 'assistant',
        content: result.explanation,
        message_type: 'assessment',
        confidence_score: result.confidence
      });

      setMessages(prev => [...prev, aiMessage]);

      // Generate follow-up questions if needed
      if (result.confidence < 80 && result.priority !== 'emergency') {
        const followUpQuestions = await symptomService.generateFollowUpQuestions(currentSession.id);
        
        if (followUpQuestions.length > 0) {
          const questionMessage = await symptomService.addMessage(currentSession.id, {
            session_id: currentSession.id,
            role: 'assistant',
            content: `To better understand your condition, could you please answer:\n\n${followUpQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`,
            message_type: 'question',
            confidence_score: result.confidence
          });

          setMessages(prev => [...prev, questionMessage]);
        }
      }

    } catch (error) {
      console.error('Failed to process message:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        session_id: session?.id || '',
        role: 'system',
        content: 'I apologize, but I\'m experiencing technical difficulties. Please consult a healthcare provider for your symptoms.',
        message_type: 'alert',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Symptom Assessment</h1>
            <p className="text-sm text-gray-600">AI-powered health guidance</p>
          </div>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="px-4 py-3 bg-white border-b border-gray-200">
        <MedicalDisclaimer variant="inline" />
      </div>

      {/* Chat Interface */}
      <div className="flex-1">
        <ChatInterface
          sessionId={session?.id || ''}
          messages={messages}
          onSendMessage={handleSendMessage}
          triageResult={triageResult}
          loading={loading}
        />
      </div>
    </div>
  );
}