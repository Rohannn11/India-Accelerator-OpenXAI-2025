import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, Key, Settings } from 'lucide-react';
import { getAPIConfig, getBestAvailableService, hasAvailableAPIService } from '../../config/api';

interface ServiceStatusProps {
  className?: string;
}

export function ServiceStatus({ className = '' }: ServiceStatusProps) {
  const [status, setStatus] = useState<'checking' | 'available' | 'unavailable' | 'error'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [config] = useState(getAPIConfig());
  const [availableServices, setAvailableServices] = useState<string[]>([]);

  useEffect(() => {
    checkServiceStatus();
    const interval = setInterval(checkServiceStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkServiceStatus = async () => {
    try {
      setStatus('checking');
      const hasService = hasAvailableAPIService();
      const bestService = getBestAvailableService();
      
      if (hasService && bestService) {
        setStatus('available');
        setAvailableServices([bestService.provider]);
      } else {
        setStatus('unavailable');
        setAvailableServices([]);
      }
      
      setLastChecked(new Date());
    } catch (error) {
      setStatus('error');
      setLastChecked(new Date());
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'unavailable':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'available':
        return 'AI Service Available';
      case 'unavailable':
        return 'AI Service Unavailable';
      case 'error':
        return 'Service Check Failed';
      default:
        return 'Checking Service...';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'available':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'unavailable':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'error':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      default:
        return 'text-blue-700 bg-blue-50 border-blue-200';
    }
  };

  const getSetupInstructions = () => {
    const instructions = [];
    
    if (!config.openai.apiKey) {
      instructions.push({
        provider: 'OpenAI',
        steps: [
          'Get API key from [platform.openai.com](https://platform.openai.com)',
          'Add to .env: VITE_OPENAI_API_KEY=your_key_here'
        ]
      });
    }
    
    if (!config.anthropic.apiKey) {
      instructions.push({
        provider: 'Anthropic',
        steps: [
          'Get API key from [console.anthropic.com](https://console.anthropic.com)',
          'Add to .env: VITE_ANTHROPIC_API_KEY=your_key_here'
        ]
      });
    }
    
    if (!config.google.apiKey) {
      instructions.push({
        provider: 'Google',
        steps: [
          'Get API key from [makersuite.google.com](https://makersuite.google.com)',
          'Add to .env: VITE_GOOGLE_API_KEY=your_key_here'
        ]
      });
    }
    
    return instructions;
  };

  return (
    <div className={`bg-white rounded-lg border p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className={`font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
        <button
          onClick={checkServiceStatus}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {lastChecked && (
        <p className="text-xs text-gray-500 mb-3">
          Last checked: {lastChecked.toLocaleTimeString()}
        </p>
      )}

      {status === 'unavailable' && (
        <div className="space-y-3">
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
            <div className="flex items-start space-x-2">
              <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-2">AI API Setup Required</p>
                <p className="mb-3">
                  To enable AI-powered symptom analysis, you need to configure an AI API service.
                  Choose from OpenAI, Anthropic, Google, or a custom API.
                </p>
                
                <div className="space-y-3">
                  {getSetupInstructions().map((instruction, index) => (
                    <div key={index} className="bg-amber-100 rounded-md p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Key className="w-4 h-4 text-amber-700" />
                        <span className="font-medium text-amber-800">{instruction.provider}</span>
                      </div>
                      <div className="space-y-1">
                        {instruction.steps.map((step, stepIndex) => (
                          <div key={stepIndex} className="flex items-start space-x-2">
                            <span className="text-amber-700 text-xs mt-1">•</span>
                            <span className="text-amber-700 text-sm">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Quick Setup:</strong>
            </p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>1. Copy env.example to .env</p>
              <p>2. Add your API key(s)</p>
              <p>3. Restart the application</p>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            <p>Note: The app will use enhanced fallback analysis when AI APIs are unavailable.</p>
          </div>
        </div>
      )}

      {status === 'available' && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-800">
              <p className="font-medium mb-1">AI Service Ready</p>
              <p>Your symptom analysis will now use AI-powered assessment for more accurate results.</p>
              {availableServices.length > 0 && (
                <p className="text-xs mt-2 text-green-700">
                  Using: {availableServices.join(', ')}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Service Check Failed</p>
              <p>Unable to verify AI service status. Please check your API configuration.</p>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Status */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex items-center space-x-2 mb-2">
          <Settings className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Configuration Status</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className={`px-2 py-1 rounded ${config.openai.apiKey ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            OpenAI: {config.openai.apiKey ? '✓' : '✗'}
          </div>
          <div className={`px-2 py-1 rounded ${config.anthropic.apiKey ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            Anthropic: {config.anthropic.apiKey ? '✓' : '✗'}
          </div>
          <div className={`px-2 py-1 rounded ${config.google.apiKey ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            Google: {config.google.apiKey ? '✓' : '✗'}
          </div>
          <div className={`px-2 py-1 rounded ${config.custom.apiKey ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            Custom: {config.custom.apiKey ? '✓' : '✗'}
          </div>
        </div>
      </div>
    </div>
  );
}
