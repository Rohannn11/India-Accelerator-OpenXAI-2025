import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
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

  const showEmergencyAlert = triageResult?.priority === 'emergency';

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Emergency Alert - Only show for emergency cases */}
      {showEmergencyAlert && (
        <div className="bg-red-50 border-b border-red-200 p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-800 mb-1">Emergency Alert</h3>
              <p className="text-sm text-red-700 mb-3">
                Critical symptoms detected that may require immediate medical attention.
              </p>
              <button
                onClick={handleCall911}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Call Emergency Services
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {loading && (
          <div className="flex items-center space-x-3 bg-white rounded-lg p-4 shadow-sm">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <div className="text-sm font-medium text-gray-900">AI Analysis</div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
              <div className="text-sm text-gray-600">Analyzing your symptoms...</div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Assessment Results - Clean, organized display */}
      {triageResult && !showEmergencyAlert && (
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="space-y-4">
            {/* Priority and Confidence */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  triageResult.priority === 'emergency' ? 'bg-red-100 text-red-800' :
                  triageResult.priority === 'urgent' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {triageResult.priority.replace('_', ' ').toUpperCase()}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>{Math.round(triageResult.confidence * 100)}% Confidence</span>
                </div>
              </div>
            </div>

            {/* Assessment Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Assessment Summary</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {triageResult.explanation}
              </p>
            </div>

            {/* Recommendations */}
            {triageResult.recommendations.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Recommendations</h4>
                <div className="space-y-2">
                  {triageResult.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Red Flags - Only show if present */}
            {triageResult.red_flags.length > 0 && (
              <div>
                <h4 className="font-semibold text-red-800 mb-2 flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Red Flags</span>
                </h4>
                <div className="space-y-1">
                  {triageResult.red_flags.map((flag, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-red-700">{flag}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
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
      </div>
    </div>
  );
}