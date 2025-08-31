import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key not found');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async analyzeSymptoms(symptoms: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `You are a medical AI assistant. Analyze these symptoms and provide guidance.

IMPORTANT: Always include medical disclaimers and recommend consulting healthcare professionals.

Symptoms: ${symptoms}

Provide:
1. Possible conditions (mention these are possibilities, not diagnoses)
2. Risk assessment (Low/Medium/High/Emergency)
3. Specific recommendations
4. When to seek medical care

Format as clear, empathetic medical guidance with appropriate disclaimers.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('Unable to analyze symptoms. Please try again.');
    }
  }
}

export const geminiService = new GeminiService();
