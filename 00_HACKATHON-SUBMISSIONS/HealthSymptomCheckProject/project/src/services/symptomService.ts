import type { SymptomSession, TriageResult, ChatMessage } from '../types/medical';
import { APIService, createOpenAIService, createAnthropicService, createGoogleService, createCustomService } from './apiService';
import { getBestAvailableService } from '../config/api';

// Mock data for development
const mockSessions: SymptomSession[] = [
  {
    id: '1',
    user_id: '1',
    start_time: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    end_time: new Date(Date.now() - 86400000 + 1800000).toISOString(), // 30 minutes later
    status: 'completed',
    risk_score: 25,
    priority_level: 'non_urgent',
    chief_complaint: 'Mild headache and fatigue',
    ai_analysis: 'Symptoms suggest mild dehydration and stress. No immediate medical attention required.',
    recommendations: [
      'Increase water intake',
      'Get adequate rest',
      'Practice stress management techniques'
    ],
    red_flags: [],
    follow_up_required: false,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000 + 1800000).toISOString()
  },
  {
    id: '2',
    user_id: '1',
    start_time: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    end_time: new Date(Date.now() - 172800000 + 2400000).toISOString(), // 40 minutes later
    status: 'completed',
    risk_score: 45,
    priority_level: 'urgent',
    chief_complaint: 'Chest pain and shortness of breath',
    ai_analysis: 'Symptoms require immediate medical evaluation. Could indicate serious cardiac or respiratory issues.',
    recommendations: [
      'Seek immediate medical attention',
      'Call emergency services if symptoms worsen',
      'Do not delay treatment'
    ],
    red_flags: ['Chest pain', 'Shortness of breath'],
    follow_up_required: true,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000 + 2400000).toISOString()
  }
];

export class SymptomService {
  private aiService: APIService | null = null;
  private aiServiceAvailable: boolean = false;

  constructor() {
    this.initializeAIService();
  }

  private async initializeAIService() {
    try {
      const apiConfig = getBestAvailableService();
      
      if (apiConfig) {
        switch (apiConfig.provider) {
          case 'openai':
            this.aiService = createOpenAIService(apiConfig.apiKey, apiConfig.model);
            break;
          case 'anthropic':
            this.aiService = createAnthropicService(apiConfig.apiKey, apiConfig.model);
            break;
          case 'google':
            this.aiService = createGoogleService(apiConfig.apiKey, apiConfig.model);
            break;
          case 'custom':
            if (apiConfig.baseUrl) {
              this.aiService = createCustomService(apiConfig.apiKey, apiConfig.baseUrl, apiConfig.model);
            }
            break;
        }
        
        if (this.aiService) {
          this.aiServiceAvailable = await this.aiService.checkServiceHealth();
          console.log(`AI service available: ${apiConfig.provider} (${apiConfig.model})`);
        }
      } else {
        console.warn('No AI API service configured. Using fallback analysis only.');
        this.aiServiceAvailable = false;
      }
    } catch (error) {
      console.warn('AI service initialization failed:', error);
      this.aiServiceAvailable = false;
    }
  }

  async getUserSessions(userId: string): Promise<SymptomSession[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Filter sessions by user ID
    return mockSessions.filter(session => session.user_id === userId);
  }

  async createSession(userId: string, chiefComplaint: string): Promise<SymptomSession> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newSession: SymptomSession = {
      id: Date.now().toString(),
      user_id: userId,
      start_time: new Date().toISOString(),
      status: 'active',
      risk_score: 0,
      priority_level: 'non_urgent',
      chief_complaint: chiefComplaint,
      ai_analysis: '',
      recommendations: [],
      red_flags: [],
      follow_up_required: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    mockSessions.unshift(newSession);
    return newSession;
  }

  async updateSession(sessionId: string, updates: Partial<SymptomSession>): Promise<SymptomSession> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const sessionIndex = mockSessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) {
      throw new Error('Session not found');
    }

    mockSessions[sessionIndex] = {
      ...mockSessions[sessionIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };

    return mockSessions[sessionIndex];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async analyzeSymptoms(symptoms: string[], medicalHistory: string[]): Promise<TriageResult> {
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock AI analysis logic
    const hasEmergencySymptoms = symptoms.some(s => 
      s.toLowerCase().includes('chest pain') || 
      s.toLowerCase().includes('difficulty breathing') ||
      s.toLowerCase().includes('severe bleeding')
    );

    const hasUrgentSymptoms = symptoms.some(s =>
      s.toLowerCase().includes('fever') ||
      s.toLowerCase().includes('severe pain') ||
      s.toLowerCase().includes('dizziness')
    );

    let priority: 'emergency' | 'urgent' | 'non_urgent';
    let riskScore: number;
    let recommendations: string[];
    let redFlags: string[];

    if (hasEmergencySymptoms) {
      priority = 'emergency';
      riskScore = 85;
      recommendations = [
        'Seek immediate emergency medical care',
        'Call 911 or go to nearest emergency room',
        'Do not delay treatment'
      ];
      redFlags = symptoms.filter(s => 
        s.toLowerCase().includes('chest pain') || 
        s.toLowerCase().includes('difficulty breathing')
      );
    } else if (hasUrgentSymptoms) {
      priority = 'urgent';
      riskScore = 65;
      recommendations = [
        'Seek medical attention within 24 hours',
        'Monitor symptoms closely',
        'Contact healthcare provider'
      ];
      redFlags = symptoms.filter(s =>
        s.toLowerCase().includes('fever') ||
        s.toLowerCase().includes('severe pain')
      );
    } else {
      priority = 'non_urgent';
      riskScore = 25;
      recommendations = [
        'Monitor symptoms',
        'Rest and hydrate',
        'Contact healthcare provider if symptoms persist'
      ];
      redFlags = [];
    }

    return {
      priority,
      risk_score: riskScore,
      recommendations,
      red_flags: redFlags,
      confidence: 0.85,
      explanation: `Analysis based on reported symptoms: ${symptoms.join(', ')}. ${priority === 'emergency' ? 'Emergency symptoms detected requiring immediate care.' : priority === 'urgent' ? 'Urgent symptoms requiring prompt medical attention.' : 'Non-urgent symptoms that can be monitored.'}`,
      next_steps: recommendations
    };
  }

  async addMessage(sessionId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<ChatMessage> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      ...message,
      timestamp: new Date().toISOString()
    };

    return newMessage;
  }

  async processSymptoms(
    sessionId: string,
    symptoms: string,
    userAge: number,
    userGender: string,
    medicalHistory: string[]
  ): Promise<TriageResult> {
    try {
      if (this.aiServiceAvailable && this.aiService) {
        // Use AI API service for analysis
        const request = {
          symptoms,
          userAge,
          userGender,
          medicalHistory,
          conversationHistory: [] // Could be enhanced to include chat history
        };

        const aiResult = await this.aiService.analyzeSymptoms(request);
        
        // Convert AI response to TriageResult format
        const triageResult: TriageResult = {
          priority: aiResult.priority,
          risk_score: aiResult.risk_score,
          recommendations: aiResult.recommendations,
          red_flags: aiResult.red_flags,
          confidence: aiResult.confidence,
          explanation: aiResult.explanation,
          next_steps: aiResult.next_steps
        };

        // Update session with AI results
        await this.updateSession(sessionId, {
          risk_score: aiResult.risk_score,
          priority_level: aiResult.priority,
          ai_analysis: aiResult.explanation,
          recommendations: aiResult.recommendations,
          red_flags: aiResult.red_flags,
          status: 'completed',
          end_time: new Date().toISOString()
        });

        return triageResult;
      } else {
        // Fallback to enhanced analysis
        console.warn('AI service unavailable, using enhanced fallback analysis');
        return await this.fallbackAnalysis(symptoms, userAge, userGender, medicalHistory);
      }
    } catch (error) {
      console.error('Symptom analysis failed:', error);
      
      // Emergency fallback for critical symptoms
      const criticalSymptoms = ['chest pain', 'difficulty breathing', 'severe bleeding', 'unconscious'];
      const hasCriticalSymptoms = criticalSymptoms.some(symptom => 
        symptoms.toLowerCase().includes(symptom)
      );

      if (hasCriticalSymptoms) {
        return {
          priority: 'emergency',
          risk_score: 90,
          recommendations: [
            'Seek immediate emergency medical care',
            'Call 911 or go to nearest emergency room',
            'Do not delay treatment'
          ],
          red_flags: ['Critical symptoms detected'],
          confidence: 0.9,
          explanation: 'Critical symptoms detected requiring immediate emergency care.',
          next_steps: ['Call emergency services immediately']
        };
      }

      // General fallback
      return await this.fallbackAnalysis(symptoms, userAge, userGender, medicalHistory);
    }
  }

  private async fallbackAnalysis(symptoms: string, userAge: number, userGender: string, medicalHistory: string[]): Promise<TriageResult> {
    console.warn('Using enhanced fallback analysis due to AI service unavailability.');
    const symptomsList = symptoms.toLowerCase().split(/\s+/);
    const hasEmergencySymptoms = symptomsList.some(s => 
      s.includes('chest pain') || 
      s.includes('difficulty breathing') ||
      s.includes('severe bleeding')
    );

    const hasUrgentSymptoms = symptomsList.some(s =>
      s.includes('fever') ||
      s.includes('severe pain') ||
      s.includes('dizziness')
    );

    let priority: 'emergency' | 'urgent' | 'non_urgent';
    let riskScore: number;
    let recommendations: string[];
    let redFlags: string[];

    if (hasEmergencySymptoms) {
      priority = 'emergency';
      riskScore = 85;
      recommendations = [
        'Seek immediate emergency medical care',
        'Call 911 or go to nearest emergency room',
        'Do not delay treatment'
      ];
      redFlags = symptomsList.filter(s => 
        s.includes('chest pain') || 
        s.includes('difficulty breathing')
      );
    } else if (hasUrgentSymptoms) {
      priority = 'urgent';
      riskScore = 65;
      recommendations = [
        'Seek medical attention within 24 hours',
        'Monitor symptoms closely',
        'Contact healthcare provider'
      ];
      redFlags = symptomsList.filter(s =>
        s.includes('fever') ||
        s.includes('dizziness')
      );
    } else {
      priority = 'non_urgent';
      riskScore = 25;
      recommendations = [
        'Monitor symptoms',
        'Rest and hydrate',
        'Contact healthcare provider if symptoms persist'
      ];
      redFlags = [];
    }

    return {
      priority,
      risk_score: riskScore,
      recommendations,
      red_flags: redFlags,
      confidence: 0.85,
      explanation: `Enhanced fallback analysis based on reported symptoms: ${symptoms}. ${priority === 'emergency' ? 'Emergency symptoms detected requiring immediate care.' : priority === 'urgent' ? 'Urgent symptoms requiring prompt medical attention.' : 'Non-urgent symptoms that can be monitored.'}`,
      next_steps: recommendations
    };
  }

  async generateFollowUpQuestions(sessionId: string): Promise<string[]> {
    try {
      if (this.aiServiceAvailable && this.aiService) {
        // Get session details for context
        const session = mockSessions.find(s => s.id === sessionId);
        if (session) {
          return await this.aiService.generateFollowUpQuestions(
            session.chief_complaint,
            [] // Could be enhanced to include user's medical history
          );
        }
      }
      
      // Fallback questions
      return [
        'How long have you been experiencing these symptoms?',
        'Have you had similar symptoms before?',
        'Are you currently taking any medications?',
        'Have you noticed any triggers that make symptoms worse?',
        'Are there any other symptoms you\'re experiencing?'
      ];
    } catch (error) {
      console.error('Failed to generate follow-up questions:', error);
      return [
        'How long have you been experiencing these symptoms?',
        'Have you had similar symptoms before?',
        'Are you currently taking any medications?'
      ];
    }
  }
}

export const symptomService = new SymptomService();