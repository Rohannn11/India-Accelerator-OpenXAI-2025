import React from 'react';
import { AlertTriangle, Shield } from 'lucide-react';

interface MedicalDisclaimerProps {
  variant?: 'banner' | 'modal' | 'inline';
  showDetails?: boolean;
}

export function MedicalDisclaimer({ variant = 'banner', showDetails = false }: MedicalDisclaimerProps) {
  const baseClasses = "bg-amber-50 border border-amber-200 rounded-lg p-4";
  const variantClasses = {
    banner: "mb-6",
    modal: "mb-4",
    inline: "mb-3"
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]}`}>
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-amber-800 mb-2">
            Important Medical Disclaimer
          </h3>
          <p className="text-sm text-amber-700 leading-relaxed">
            This AI-powered tool provides general health information only and is not a substitute for professional medical advice, diagnosis, or treatment. 
            <strong className="font-semibold"> Always consult qualified healthcare providers for medical concerns.</strong>
          </p>
          
          {showDetails && (
            <div className="mt-3 space-y-2 text-xs text-amber-600">
              <div className="flex items-center space-x-2">
                <Shield className="w-3 h-3" />
                <span>Emergency situations require immediate medical attention</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-3 h-3" />
                <span>AI assessments have limitations and may not capture all medical factors</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-3 h-3" />
                <span>Your data is encrypted and HIPAA-compliant</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}