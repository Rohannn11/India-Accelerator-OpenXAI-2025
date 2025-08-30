import React from 'react';
import { TrendingUp } from 'lucide-react';

interface ConfidenceMeterProps {
  confidence: number;
  label?: string;
}

export function ConfidenceMeter({ confidence, label = "AI Confidence" }: ConfidenceMeterProps) {
  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getConfidenceText = (score: number) => {
    if (score >= 80) return 'High';
    if (score >= 60) return 'Medium';
    return 'Low';
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        <span className="text-sm font-semibold text-gray-800">
          {getConfidenceText(confidence)} ({confidence}%)
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getConfidenceColor(confidence)}`}
          style={{ width: `${confidence}%` }}
        />
      </div>
      
      {confidence < 70 && (
        <p className="text-xs text-amber-600 mt-2">
          Low confidence detected. Professional medical consultation strongly recommended.
        </p>
      )}
    </div>
  );
}