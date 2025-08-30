import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertCircle } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ConfidenceMeter } from '../Common/ConfidenceMeter';
import { EmergencyAlert } from '../Common/EmergencyAlert';
import type { ChatMessage as ChatMessageType, TriageResult } from '../../types/medical';

interface ChatInterfaceProps {
  sessionId: string;
  messages: ChatMessageType[];
  onSendMessage: (content: string) => Promise<void>;
  triageResult?: TriageResult;
  loading?: boolean;
}

export function ChatInterface({ 
  sessionId, 
  messages, 
  onSendMessage, 
  triageResult,
  loading = false 
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const message = inputValue.trim();
    setInputValue('');
    await onSendMessage(message);
  };

  const handleCall911 = () => {
    window.open('tel:911', '_self');
  };

  const showEmergencyAlert = triageResult?.priority === 'emergency' || 
    triageResult?.red_flags.some(flag => flag.toLowerCase().includes('emergency'));

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Emergency Alert */}
      {showEmergencyAlert && (
        <div className="p-4 border-b border-gray-200">
          <EmergencyAlert
            message="Critical symptoms detected that may require immediate medical attention."
            actionRequired="Please contact emergency services or go to the nearest emergency room immediately."
            onCall911={handleCall911}
          />
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {loading && (
          <div className="flex items-center space-x-2 text-gray-500">
            <Bot className="w-5 h-5 animate-pulse" />
            <span className="text-sm">AI is analyzing your symptoms...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Triage Results */}
      {triageResult && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="space-y-3">
            <ConfidenceMeter confidence={triageResult.confidence} />
            
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">Assessment Summary</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  triageResult.priority === 'emergency' ? 'bg-red-100 text-red-800' :
                  triageResult.priority === 'urgent' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {triageResult.priority.toUpperCase()}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">
                {triageResult.explanation}
              </p>
              
              {triageResult.recommendations.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-800 mb-1">Recommendations:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {triageResult.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-600">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <div className="flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Describe your symptoms in detail..."
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            disabled={!inputValue.trim() || loading}
            className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        
        <p className="text-xs text-gray-500 mt-2 text-center">
          This is not medical advice. Always consult healthcare professionals for medical concerns.
        </p>
      </div>
    </div>
  );
}