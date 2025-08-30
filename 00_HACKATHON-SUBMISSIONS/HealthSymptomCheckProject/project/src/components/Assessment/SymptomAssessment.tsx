import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { symptomService } from '../../services/symptomService';
import { ChatInterface } from '../Chat/ChatInterface';
import { ArrowLeft, AlertTriangle, Heart, Activity } from 'lucide-react';
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
      const systemMessage: Omit<ChatMessage, 'id' | 'timestamp'> = {
        session_id: '',
        role: 'system',
        content: 'Hello! I\'m here to help assess your symptoms and provide guidance. Please describe what you\'re experiencing in detail.',
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
      let currentSession = session;
      if (!currentSession) {
        currentSession = await symptomService.createSession(user.id, content);
        setSession(currentSession);
      }

      const userMessage = await symptomService.addMessage(currentSession.id, {
        session_id: currentSession.id,
        role: 'user',
        content,
        message_type: 'answer'
      });

      setMessages(prev => [...prev, userMessage]);

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

      const aiMessage = await symptomService.addMessage(currentSession.id, {
        session_id: currentSession.id,
        role: 'assistant',
        content: result.explanation,
        message_type: 'assessment',
        confidence_score: result.confidence
      });

      setMessages(prev => [...prev, aiMessage]);

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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'emergency':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'urgent':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Heart className="w-5 h-5 text-green-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'urgent':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-green-50 border-green-200 text-green-800';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Symptom Assessment</h1>
                <p className="text-sm text-gray-600">AI-powered health evaluation</p>
              </div>
            </div>
            {triageResult && (
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-full border ${getPriorityColor(triageResult.priority)}`}>
                {getPriorityIcon(triageResult.priority)}
                <span className="text-sm font-medium">
                  {triageResult.priority.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Medical Disclaimer - Single, Clean */}
      <div className="bg-blue-50 border-b border-blue-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Medical Disclaimer</p>
              <p>This assessment provides general health information and is not a substitute for professional medical advice. Always consult qualified healthcare providers for medical concerns.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Results - Only show when available */}
      {triageResult && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{triageResult.risk_score}</div>
                <div className="text-sm text-gray-600">Risk Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{Math.round(triageResult.confidence * 100)}%</div>
                <div className="text-sm text-gray-600">Confidence</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{triageResult.recommendations.length}</div>
                <div className="text-sm text-gray-600">Recommendations</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Interface */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface
          sessionId={session?.id || ''}
          messages={messages}
          onSendMessage={handleSendMessage}
          triageResult={triageResult}
          loading={loading}
        />
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 py-3">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span>HealthAI</span>
              <span>•</span>
              <span>AI-Powered Assessment</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>HIPAA Compliant</span>
              <span>•</span>
              <span>Secure & Private</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}