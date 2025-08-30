import axios from 'axios';
import type { TriageResult, MedicalAlert } from '../types/medical';

const OLLAMA_BASE_URL = 'http://localhost:11434';

export class OllamaService {
  private async callOllama(model: string, prompt: string): Promise<string> {
    try {
      const response = await axios.post(`${OLLAMA_BASE_URL}/api/generate`, {
        model,
        prompt,
        stream: false,
        options: {
          temperature: 0.3, // Lower temperature for more consistent medical responses
          top_p: 0.9,
          max_tokens: 1000
        }
      });
      
      return response.data.response;
    } catch (error) {
      console.error('Ollama API error:', error);
      throw new Error('AI service temporarily unavailable. Please consult a healthcare provider.');
    }
  }

  async analyzeSymptoms(
    symptoms: string,
    userAge: number,
    userGender: string,
    medicalHistory: string[]
  ): Promise<TriageResult> {
    const prompt = `
      You are a medical triage assistant. Analyze the following symptoms and provide a structured assessment.
      
      Patient Information:
      - Age: ${userAge}
      - Gender: ${userGender}
      - Medical History: ${medicalHistory.join(', ') || 'None reported'}
      
      Symptoms: ${symptoms}
      
      Please provide:
      1. Priority level (emergency/urgent/non_urgent)
      2. Risk score (0-100)
      3. Key red flags identified
      4. Recommended next steps
      5. Confidence level (0-100)
      6. Clear explanation for your assessment
      
      CRITICAL: Always err on the side of caution. If uncertain, recommend seeking immediate medical attention.
      
      Format your response as JSON with these exact keys:
      {
        "priority": "emergency|urgent|non_urgent",
        "risk_score": number,
        "red_flags": ["flag1", "flag2"],
        "recommendations": ["rec1", "rec2"],
        "confidence": number,
        "explanation": "detailed explanation",
        "next_steps": ["step1", "step2"]
      }
    `;

    try {
      const response = await this.callOllama('llama2', prompt);
      
      // Parse JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid AI response format');
      }
      
      const result = JSON.parse(jsonMatch[0]);
      
      // Apply safety defaults
      if (result.confidence < 70) {
        result.priority = 'urgent';
        result.recommendations.unshift('Consult a healthcare provider due to AI uncertainty');
      }
      
      return result;
    } catch (error) {
      console.error('Symptom analysis error:', error);
      // Fail-safe response
      return {
        priority: 'urgent',
        risk_score: 75,
        recommendations: ['Please consult a healthcare provider immediately'],
        red_flags: ['Unable to complete AI analysis'],
        confidence: 0,
        explanation: 'AI analysis failed. Seeking medical attention is recommended.',
        next_steps: ['Contact your doctor or visit an urgent care center']
      };
    }
  }

  async detectRedFlags(symptoms: string): Promise<MedicalAlert[]> {
    const redFlagKeywords = [
      'chest pain', 'severe headache', 'difficulty breathing', 'shortness of breath',
      'sudden weakness', 'slurred speech', 'severe abdominal pain', 'high fever',
      'loss of consciousness', 'severe bleeding', 'severe burn', 'poisoning',
      'suicide', 'self-harm', 'stroke symptoms', 'heart attack'
    ];

    const alerts: MedicalAlert[] = [];
    const lowerSymptoms = symptoms.toLowerCase();

    for (const keyword of redFlagKeywords) {
      if (lowerSymptoms.includes(keyword)) {
        alerts.push({
          type: 'emergency',
          message: `Critical symptom detected: ${keyword}`,
          action_required: 'Seek immediate emergency medical attention',
          confidence: 95
        });
      }
    }

    return alerts;
  }

  async generateFollowUpQuestions(symptoms: string, context: string[]): Promise<string[]> {
    const prompt = `
      Based on the symptoms "${symptoms}" and previous conversation context, generate 3-5 relevant follow-up questions to better understand the patient's condition.
      
      Context: ${context.join('\n')}
      
      Questions should be:
      - Medically relevant
      - Easy to understand
      - Help narrow down the diagnosis
      - Include timing, severity, and associated symptoms
      
      Return only the questions, one per line.
    `;

    try {
      const response = await this.callOllama('llama2', prompt);
      return response.split('\n').filter(q => q.trim().length > 0).slice(0, 5);
    } catch (error) {
      console.error('Question generation error:', error);
      return [
        'How long have you been experiencing these symptoms?',
        'On a scale of 1-10, how severe is your discomfort?',
        'Have you noticed any other symptoms alongside this?'
      ];
    }
  }
}

export const ollamaService = new OllamaService();