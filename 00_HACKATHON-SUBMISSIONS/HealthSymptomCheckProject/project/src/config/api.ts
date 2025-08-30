export interface APIServiceConfig {
  provider: 'openai' | 'anthropic' | 'google' | 'custom';
  apiKey: string;
  baseUrl?: string;
  model: string;
  timeout: number;
  enabled: boolean;
}

export const API_CONFIG = {
  // OpenAI Configuration
  openai: {
    provider: 'openai' as const,
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
    model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo',
    timeout: 30000,
    enabled: false
  },

  // Anthropic Configuration
  anthropic: {
    provider: 'anthropic' as const,
    apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
    model: import.meta.env.VITE_ANTHROPIC_MODEL || 'claude-3-haiku-20240307',
    timeout: 30000,
    enabled: false
  },

  // Google Configuration
  google: {
    provider: 'google' as const,
    apiKey: import.meta.env.VITE_GOOGLE_API_KEY || '',
    model: import.meta.env.VITE_GOOGLE_MODEL || 'gemini-pro',
    timeout: 30000,
    enabled: false
  },

  // Custom API Configuration
  custom: {
    provider: 'custom' as const,
    apiKey: import.meta.env.VITE_CUSTOM_API_KEY || '',
    baseUrl: import.meta.env.VITE_CUSTOM_API_BASE_URL || '',
    model: import.meta.env.VITE_CUSTOM_API_MODEL || 'default',
    timeout: 30000,
    enabled: false
  }
};

// Available models for each provider
export const AVAILABLE_MODELS = {
  openai: [
    'gpt-3.5-turbo',
    'gpt-3.5-turbo-16k',
    'gpt-4',
    'gpt-4-turbo-preview',
    'gpt-4o',
    'gpt-4o-mini'
  ],
  anthropic: [
    'claude-3-haiku-20240307',
    'claude-3-sonnet-20240229',
    'claude-3-opus-20240229',
    'claude-3-5-sonnet-20241022'
  ],
  google: [
    'gemini-pro',
    'gemini-pro-vision',
    'gemini-1.5-pro',
    'gemini-1.5-flash'
  ]
};

// Get the first available API service
export const getAvailableAPIService = (): APIServiceConfig | null => {
  for (const [key, config] of Object.entries(API_CONFIG)) {
    if (config.enabled && config.apiKey) {
      return config;
    }
  }
  return null;
};

// Check if any API service is available
export const hasAvailableAPIService = (): boolean => {
  return getAvailableAPIService() !== null;
};

// Get all available services
export const getAvailableServices = (): string[] => {
  return Object.entries(API_CONFIG)
    .filter(([_, config]) => config.enabled && config.apiKey)
    .map(([key, _]) => key);
};

// Environment-specific overrides
export const getAPIConfig = () => {
  const config = { ...API_CONFIG };
  
  // Development overrides
  if (import.meta.env.DEV) {
    // Enable services that have API keys
    Object.keys(config).forEach(key => {
      const serviceKey = key as keyof typeof config;
      if (config[serviceKey].apiKey) {
        config[serviceKey].enabled = true;
      }
    });
  }
  
  // Production overrides
  if (import.meta.env.PROD) {
    // Only enable services with valid API keys
    Object.keys(config).forEach(key => {
      const serviceKey = key as keyof typeof config;
      config[serviceKey].enabled = !!config[serviceKey].apiKey;
    });
  }
  
  return config;
};

// Service priority (order of preference)
export const SERVICE_PRIORITY = ['openai', 'anthropic', 'google', 'custom'];

// Get the best available service based on priority
export const getBestAvailableService = (): APIServiceConfig | null => {
  const availableConfig = getAPIConfig();
  
  for (const serviceName of SERVICE_PRIORITY) {
    const service = availableConfig[serviceName as keyof typeof availableConfig];
    if (service.enabled && service.apiKey) {
      return service;
    }
  }
  
  return null;
};
