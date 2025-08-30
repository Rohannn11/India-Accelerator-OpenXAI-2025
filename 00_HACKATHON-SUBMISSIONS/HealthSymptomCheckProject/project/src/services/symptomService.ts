import type { SymptomSession, TriageResult, ChatMessage } from '../types/medical';

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
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock AI analysis logic
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

    // Update session with results
    await this.updateSession(sessionId, {
      risk_score: riskScore,
      priority_level: priority,
      ai_analysis: `Analysis based on reported symptoms: ${symptoms}. ${priority === 'emergency' ? 'Emergency symptoms detected requiring immediate care.' : priority === 'urgent' ? 'Urgent symptoms requiring prompt medical attention.' : 'Non-urgent symptoms that can be monitored.'}`,
      recommendations,
      red_flags: redFlags,
      status: 'completed',
      end_time: new Date().toISOString()
    });

    return {
      priority,
      risk_score: riskScore,
      recommendations,
      red_flags: redFlags,
      confidence: 0.85,
      explanation: `Analysis based on reported symptoms: ${symptoms}. ${priority === 'emergency' ? 'Emergency symptoms detected requiring immediate care.' : priority === 'urgent' ? 'Urgent symptoms requiring prompt medical attention.' : 'Non-urgent symptoms that can be monitored.'}`,
      next_steps: recommendations
    };
  }

  async generateFollowUpQuestions(sessionId: string): Promise<string[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock follow-up questions
    return [
      'How long have you been experiencing these symptoms?',
      'Have you had similar symptoms before?',
      'Are you currently taking any medications?',
      'Have you noticed any triggers that make symptoms worse?'
    ];
  }
}

export const symptomService = new SymptomService();