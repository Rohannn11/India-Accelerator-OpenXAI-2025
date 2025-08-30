export const OLLAMA_CONFIG = {
  // Ollama server configuration
  baseUrl: import.meta.env.VITE_OLLAMA_BASE_URL || 'http://localhost:11434',
  
  // Default model to use for symptom analysis
  defaultModel: import.meta.env.VITE_OLLAMA_MODEL || 'llama3.2:3b',
  
  // Alternative models that can be used
  availableModels: [
    'llama3.2:3b',
    'llama3.2:8b',
    'llama3.2:70b',
    'mistral:7b',
    'codellama:7b',
    'phi3:3.8b'
  ],
  
  // Request timeout in milliseconds
  timeout: 30000,
  
  // AI response settings
  aiSettings: {
    temperature: 0.1,        // Lower for more consistent medical responses
    top_p: 0.9,             // Nucleus sampling
    max_tokens: 2000,        // Maximum response length
    repeat_penalty: 1.1      // Prevent repetitive responses
  },
  
  // Medical safety settings
  safetySettings: {
    emergencyThreshold: 0.8,     // Confidence threshold for emergency classification
    urgentThreshold: 0.6,        // Confidence threshold for urgent classification
    maxRiskScore: 100,           // Maximum risk score
    requireMedicalDisclaimer: true, // Always include medical disclaimers
    conservativeMode: true        // Err on the side of caution
  },
  
  // Fallback settings when AI is unavailable
  fallbackSettings: {
    enableBasicAnalysis: true,   // Use basic keyword-based analysis
    emergencyKeywords: [
      'chest pain', 'pressure', 'tightness', 'squeezing',
      'difficulty breathing', 'shortness of breath', 'can\'t breathe',
      'severe bleeding', 'unconscious', 'passed out', 'fainted',
      'paralysis', 'weakness', 'numbness', 'slurred speech'
    ],
    urgentKeywords: [
      'fever', 'high temperature', 'severe pain', 'intense pain',
      'dizziness', 'lightheaded', 'vomiting', 'diarrhea',
      'infection', 'swelling', 'redness', 'warm to touch'
    ]
  }
};

// Environment-specific overrides
export const getOllamaConfig = () => {
  const config = { ...OLLAMA_CONFIG };
  
  // Development overrides
  if (import.meta.env.DEV) {
    config.timeout = 45000; // Longer timeout for development
    config.aiSettings.temperature = 0.2; // Slightly higher for development
  }
  
  // Production overrides
  if (import.meta.env.PROD) {
    config.timeout = 25000; // Shorter timeout for production
    config.aiSettings.temperature = 0.05; // Very low for production consistency
  }
  
  return config;
};
