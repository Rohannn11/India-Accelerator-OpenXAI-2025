import React from 'react';
import { Bot, User, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '../../types/medical';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  const getMessageIcon = () => {
    if (isUser) return <User className="w-4 h-4" />;
    if (isSystem) return <AlertCircle className="w-4 h-4" />;
    return <Bot className="w-4 h-4" />;
  };

  const getMessageTypeIcon = () => {
    switch (message.message_type) {
      case 'alert':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'assessment':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'recommendation':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const messageClasses = isUser
    ? "bg-blue-600 text-white ml-12"
    : isSystem
    ? "bg-amber-100 text-amber-800 mr-12 border border-amber-200"
    : "bg-gray-100 text-gray-800 mr-12";

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs sm:max-w-md lg:max-w-lg rounded-lg px-4 py-3 ${messageClasses}`}>
        <div className="flex items-start space-x-2">
          {!isUser && (
            <div className={`flex-shrink-0 ${isSystem ? 'text-amber-600' : 'text-gray-600'}`}>
              {getMessageIcon()}
            </div>
          )}
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              {getMessageTypeIcon()}
              {message.confidence_score && (
                <span className="text-xs opacity-75">
                  Confidence: {message.confidence_score}%
                </span>
              )}
            </div>
            
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
            
            <div className="flex items-center space-x-1 mt-2 opacity-60">
              <Clock className="w-3 h-3" />
              <span className="text-xs">
                {new Date(message.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
          </div>
          
          {isUser && (
            <div className="flex-shrink-0 text-blue-100">
              {getMessageIcon()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}