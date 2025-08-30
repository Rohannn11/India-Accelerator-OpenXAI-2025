import React from 'react';
import { AlertCircle, Phone } from 'lucide-react';

interface EmergencyAlertProps {
  message: string;
  actionRequired: string;
  onCall911?: () => void;
}

export function EmergencyAlert({ message, actionRequired, onCall911 }: EmergencyAlertProps) {
  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6 animate-pulse">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-red-800 mb-2">
            🚨 Emergency Alert
          </h2>
          <p className="text-red-700 font-medium mb-3">
            {message}
          </p>
          <p className="text-red-600 mb-4">
            {actionRequired}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onCall911}
              className="flex items-center justify-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span>Call 911 Now</span>
            </button>
            
            <a
              href="tel:911"
              className="flex items-center justify-center space-x-2 bg-red-100 text-red-700 px-6 py-3 rounded-lg font-semibold hover:bg-red-200 transition-colors border border-red-300"
            >
              <Phone className="w-5 h-5" />
              <span>Emergency Services</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}