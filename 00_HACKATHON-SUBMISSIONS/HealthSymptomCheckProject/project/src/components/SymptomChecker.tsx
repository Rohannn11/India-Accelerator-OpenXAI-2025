// components/SymptomChecker.tsx
import React, { useState } from 'react';
import geminiService from '../services/geminiService';

interface SymptomCheckerProps {}

interface UserInfo {
  age?: number;
  gender?: string;
  medicalHistory?: string[];
}

const SymptomChecker: React.FC<SymptomCheckerProps> = () => {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [currentSymptom, setCurrentSymptom] = useState('');

  const addSymptom = () => {
    if (currentSymptom.trim() && !symptoms.includes(currentSymptom.trim())) {
      setSymptoms([...symptoms, currentSymptom.trim()]);
      setCurrentSymptom('');
    }
  };

  const removeSymptom = (symptomToRemove: string) => {
    setSymptoms(symptoms.filter(symptom => symptom !== symptomToRemove));
  };

  const analyzeSymptoms = async () => {
    if (symptoms.length === 0) {
      alert('Please add at least one symptom');
      return;
    }

    setLoading(true);
    try {
      const result = await geminiService.analyzeSymptoms(symptoms, userInfo);
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Failed to analyze symptoms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Health Symptom Checker</h1>
      
      {/* User Information Section */}
      <div className="mb-6 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Personal Information (Optional)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Age"
            value={userInfo.age || ''}
            onChange={(e) => setUserInfo({...userInfo, age: parseInt(e.target.value)})}
            className="p-2 border rounded"
          />
          <select
            value={userInfo.gender || ''}
            onChange={(e) => setUserInfo({...userInfo, gender: e.target.value})}
            className="p-2 border rounded"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Symptom Input Section */}
      <div className="mb-6 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Add Your Symptoms</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={currentSymptom}
            onChange={(e) => setCurrentSymptom(e.target.value)}
            placeholder="Enter a symptom (e.g., headache, fever, cough)"
            className="flex-1 p-2 border rounded"
            onKeyPress={(e) => e.key === 'Enter' && addSymptom()}
          />
          <button
            onClick={addSymptom}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
        
        {/* Display Added Symptoms */}
        <div className="flex flex-wrap gap-2 mb-4">
          {symptoms.map((symptom, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-200 rounded-full text-sm flex items-center gap-2"
            >
              {symptom}
              <button
                onClick={() => removeSymptom(symptom)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Analyze Button */}
      <div className="text-center mb-6">
        <button
          onClick={analyzeSymptoms}
          disabled={loading || symptoms.length === 0}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400"
        >
          {loading ? 'Analyzing...' : 'Analyze Symptoms'}
        </button>
      </div>

      {/* Results Section */}
      {analysis && (
        <div className="p-4 border rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
          <div className="whitespace-pre-wrap">{analysis}</div>
          <div className="mt-4 p-3 bg-yellow-100 border-l-4 border-yellow-500">
            <p className="text-sm">
              <strong>Disclaimer:</strong> This analysis is for informational purposes only and should not replace professional medical advice. Please consult with a healthcare provider for proper diagnosis and treatment.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
