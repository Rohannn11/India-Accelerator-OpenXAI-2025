import axios from 'axios';

export interface APIConfig {
  provider: 'openai' | 'anthropic' | 'google' | 'custom';
  apiKey: string;
  baseUrl?: string;
  model: string;
  timeout: number;
}

export interface SymptomAnalysisRequest {
  symptoms: string;
  userAge: number;
  userGender: string;
  medicalHistory: string[];
  conversationHistory: string[];
}

export interface SymptomAnalysisResponse {
  priority: 'emergency' | 'urgent' | 'non_urgent';
  risk_score: number;
  recommendations: string[];
  red_flags: string[];
  confidence: number;
  explanation: string;
  next_steps: string[];
  follow_up_questions: string[];
  medical_disclaimer: string;
}

export class APIService {
  private config: APIConfig;

  constructor(config: APIConfig) {
    this.config = config;
  }

  async analyzeSymptoms(request: SymptomAnalysisRequest): Promise<SymptomAnalysisResponse> {
    const prompt = this.buildMedicalPrompt(request);
    
    try {
      let response: string;
      
      switch (this.config.provider) {
        case 'openai':
          response = await this.callOpenAI(prompt);
          break;
        case 'anthropic':
          response = await this.callAnthropic(prompt);
          break;
        case 'google':
          response = await this.callGoogle(prompt);
          break;
        case 'custom':
          response = await this.callCustomAPI(prompt);
          break;
        default:
          throw new Error('Unsupported API provider');
      }

      return this.parseAIResponse(response);
    } catch (error) {
      console.error('API call failed:', error);
      return this.fallbackAnalysis(request);
    }
  }

  private async callOpenAI(prompt: string): Promise<string> {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: 'You are a medical AI assistant. Always prioritize patient safety and provide conservative medical guidance.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: this.config.timeout
      }
    );

    return response.data.choices[0].message.content;
  }

  private async callAnthropic(prompt: string): Promise<string> {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: this.config.model,
        max_tokens: 2000,
        temperature: 0.1,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      {
        headers: {
          'x-api-key': this.config.apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        },
        timeout: this.config.timeout
      }
    );

    return response.data.content[0].text;
  }

  private async callGoogle(prompt: string): Promise<string> {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.config.model}:generateContent`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 2000
        }
      },
      {
        params: {
          key: this.config.apiKey
        },
        timeout: this.config.timeout
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  }

  private async callCustomAPI(prompt: string): Promise<string> {
    if (!this.config.baseUrl) {
      throw new Error('Custom API base URL is required');
    }

    const response = await axios.post(
      this.config.baseUrl,
      {
        prompt,
        model: this.config.model,
        temperature: 0.1,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: this.config.timeout
      }
    );

    return response.data.response || response.data.text || response.data.content;
  }

  private buildMedicalPrompt(request: SymptomAnalysisRequest): string {
    const { symptoms, userAge, userGender, medicalHistory, conversationHistory } = request;
    
    return `You are a medical AI assistant designed to analyze symptoms and provide preliminary health guidance. 

IMPORTANT SAFETY RULES:
1. ALWAYS prioritize patient safety
2. If ANY emergency symptoms are mentioned, immediately classify as EMERGENCY
3. Be conservative in risk assessment
4. Always recommend professional medical consultation
5. Never provide definitive diagnoses
6. Always include medical disclaimers

PATIENT INFORMATION:
- Age: ${userAge} years
- Gender: ${userGender}
- Medical History: ${medicalHistory.join(', ') || 'None reported'}
- Current Symptoms: ${symptoms}
- Conversation History: ${conversationHistory.join(' | ') || 'None'}

EMERGENCY SYMPTOMS (immediate classification):
- Chest pain, pressure, or tightness
- Severe difficulty breathing
- Severe bleeding
- Loss of consciousness
- Severe head injury
- Paralysis or weakness
- Severe allergic reactions

URGENT SYMPTOMS (within 24 hours):
- High fever (>103°F/39.4°C)
- Severe pain
- Persistent vomiting/diarrhea
- Signs of infection
- Sudden vision changes

Please analyze the symptoms and provide a structured response in the following JSON format:

{
  "priority": "emergency|urgent|non_urgent",
  "risk_score": 0-100,
  "recommendations": ["array of specific recommendations"],
  "red_flags": ["array of concerning symptoms"],
  "confidence": 0.0-1.0,
  "explanation": "detailed explanation of analysis",
  "next_steps": ["immediate actions to take"],
  "follow_up_questions": ["questions to better understand symptoms"],
  "medical_disclaimer": "standard medical disclaimer"
}

Focus on safety and always err on the side of caution.`;
  }

  private parseAIResponse(response: string): SymptomAnalysisResponse {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return this.validateAndSanitizeResponse(parsed);
      }
      
      // If no JSON found, try to parse the response manually
      return this.parseUnstructuredResponse(response);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      throw new Error('Invalid response format from AI service');
    }
  }

  private validateAndSanitizeResponse(parsed: any): SymptomAnalysisResponse {
    // Ensure all required fields are present and valid
    const priority = ['emergency', 'urgent', 'non_urgent'].includes(parsed.priority) 
      ? parsed.priority : 'non_urgent';
    
    const riskScore = Math.max(0, Math.min(100, parsed.risk_score || 50));
    const confidence = Math.max(0, Math.min(1, parsed.confidence || 0.7));

    return {
      priority,
      risk_score: riskScore,
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : ['Consult a healthcare provider'],
      red_flags: Array.isArray(parsed.red_flags) ? parsed.red_flags : [],
      confidence,
      explanation: parsed.explanation || 'Analysis completed based on reported symptoms',
      next_steps: Array.isArray(parsed.next_steps) ? parsed.next_steps : ['Monitor symptoms and consult healthcare provider'],
      follow_up_questions: Array.isArray(parsed.follow_up_questions) ? parsed.follow_up_questions : [],
      medical_disclaimer: parsed.medical_disclaimer || 'This analysis is for informational purposes only and should not replace professional medical advice.'
    };
  }

  private parseUnstructuredResponse(response: string): SymptomAnalysisResponse {
    // Fallback parsing for unstructured responses
    const lowerResponse = response.toLowerCase();
    
    let priority: 'emergency' | 'urgent' | 'non_urgent' = 'non_urgent';
    let riskScore = 25;
    let redFlags: string[] = [];

    // Check for emergency indicators
    if (lowerResponse.includes('emergency') || lowerResponse.includes('immediate') || 
        lowerResponse.includes('911') || lowerResponse.includes('call emergency')) {
      priority = 'emergency';
      riskScore = 85;
    } else if (lowerResponse.includes('urgent') || lowerResponse.includes('soon') || 
               lowerResponse.includes('24 hours')) {
      priority = 'urgent';
      riskScore = 65;
    }

    // Extract red flags
    const emergencyKeywords = ['chest pain', 'difficulty breathing', 'severe bleeding', 'unconscious'];
    emergencyKeywords.forEach(keyword => {
      if (lowerResponse.includes(keyword)) {
        redFlags.push(keyword);
      }
    });

    return {
      priority,
      risk_score: riskScore,
      recommendations: ['Consult a healthcare provider for proper evaluation'],
      red_flags: redFlags,
      confidence: 0.6,
      explanation: 'Analysis completed based on reported symptoms',
      next_steps: ['Monitor symptoms and seek medical attention if needed'],
      follow_up_questions: [],
      medical_disclaimer: 'This analysis is for informational purposes only and should not replace professional medical advice.'
    };
  }

  private fallbackAnalysis(request: SymptomAnalysisRequest): SymptomAnalysisResponse {
    // Basic fallback analysis when API fails
    const { symptoms } = request;
    const lowerSymptoms = symptoms.toLowerCase();
    
    let priority: 'emergency' | 'urgent' | 'non_urgent' = 'non_urgent';
    let riskScore = 25;
    let redFlags: string[] = [];

    // Basic symptom checking
    if (lowerSymptoms.includes('chest pain') || lowerSymptoms.includes('difficulty breathing') ||
        lowerSymptoms.includes('severe bleeding')) {
      priority = 'emergency';
      riskScore = 85;
      redFlags = ['Emergency symptoms detected'];
    } else if (lowerSymptoms.includes('fever') || lowerSymptoms.includes('severe pain')) {
      priority = 'urgent';
      riskScore = 65;
    }

    return {
      priority,
      risk_score: riskScore,
      recommendations: ['Consult a healthcare provider for proper evaluation'],
      red_flags: redFlags,
      confidence: 0.5,
      explanation: 'Basic symptom analysis completed. API service unavailable.',
      next_steps: ['Seek professional medical advice'],
      follow_up_questions: [],
      medical_disclaimer: 'This is a basic analysis and should not replace professional medical evaluation.'
    };
  }

  async generateFollowUpQuestions(symptoms: string, medicalHistory: string[]): Promise<string[]> {
    const prompt = `Based on these symptoms: "${symptoms}" and medical history: ${medicalHistory.join(', ') || 'None'}, 
    generate 3-5 follow-up questions to better understand the patient's condition. 
    Focus on timing, severity, triggers, and associated symptoms.
    
    Return only the questions, one per line, without numbering.`;

    try {
      let response: string;
      
      switch (this.config.provider) {
        case 'openai':
          response = await this.callOpenAI(prompt);
          break;
        case 'anthropic':
          response = await this.callAnthropic(prompt);
          break;
        case 'google':
          response = await this.callGoogle(prompt);
          break;
        case 'custom':
          response = await this.callCustomAPI(prompt);
          break;
        default:
          throw new Error('Unsupported API provider');
      }

      const questions = response.split('\n').filter(q => q.trim().length > 0);
      return questions.slice(0, 5); // Limit to 5 questions
    } catch (error) {
      // Fallback questions
      return [
        'How long have you been experiencing these symptoms?',
        'Have you had similar symptoms before?',
        'Are you currently taking any medications?',
        'Have you noticed any triggers that make symptoms worse?',
        'Are there any other symptoms you\'re experiencing?'
      ];
    }
  }

  async checkServiceHealth(): Promise<boolean> {
    try {
      // Test with a simple prompt
      const testPrompt = 'Hello, this is a health check. Please respond with "OK".';
      await this.analyzeSymptoms({
        symptoms: 'test',
        userAge: 25,
        userGender: 'other',
        medicalHistory: [],
        conversationHistory: []
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Pre-configured API services
export const createOpenAIService = (apiKey: string, model: string = 'gpt-3.5-turbo') => 
  new APIService({
    provider: 'openai',
    apiKey,
    model,
    timeout: 30000
  });

export const createAnthropicService = (apiKey: string, model: string = 'claude-3-haiku-20240307') => 
  new APIService({
    provider: 'anthropic',
    apiKey,
    model,
    timeout: 30000
  });

export const createGoogleService = (apiKey: string, model: string = 'gemini-pro') => 
  new APIService({
    provider: 'google',
    apiKey,
    model,
    timeout: 30000
  });

export const createCustomService = (apiKey: string, baseUrl: string, model: string) => 
  new APIService({
    provider: 'custom',
    apiKey,
    baseUrl,
    model,
    timeout: 30000
  });
