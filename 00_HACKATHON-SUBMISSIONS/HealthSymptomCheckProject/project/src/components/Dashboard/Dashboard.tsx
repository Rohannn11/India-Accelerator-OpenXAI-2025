import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { symptomService } from '../../services/symptomService';
import { Plus, History, TrendingUp, Calendar, Download } from 'lucide-react';
import type { SymptomSession } from '../../types/medical';

export function Dashboard() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SymptomSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, [user]);

  const loadSessions = async () => {
    if (!user) return;
    
    try {
      const userSessions = await symptomService.getUserSessions(user.id);
      setSessions(userSessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'text-red-600 bg-red-50 border-red-200';
      case 'urgent': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.full_name || 'User'}
        </h1>
        <p className="text-gray-600">
          Your health guidance dashboard. Start a new symptom assessment or review your history.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition-colors text-left">
          <div className="flex items-center space-x-3 mb-3">
            <Plus className="w-6 h-6" />
            <h3 className="text-lg font-semibold">New Assessment</h3>
          </div>
          <p className="text-blue-100 text-sm">
            Start a new AI-powered symptom evaluation
          </p>
        </button>

        <button className="bg-white border border-gray-200 p-6 rounded-lg hover:bg-gray-50 transition-colors text-left">
          <div className="flex items-center space-x-3 mb-3">
            <History className="w-6 h-6 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">History</h3>
          </div>
          <p className="text-gray-600 text-sm">
            View your previous assessments and recommendations
          </p>
        </button>

        <button className="bg-white border border-gray-200 p-6 rounded-lg hover:bg-gray-50 transition-colors text-left">
          <div className="flex items-center space-x-3 mb-3">
            <TrendingUp className="w-6 h-6 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Health Trends</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Track your health patterns over time
          </p>
        </button>
      </div>

      {/* Recent Sessions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Assessments</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {sessions.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No previous assessments found.</p>
              <p className="text-sm mt-1">Start your first symptom check above.</p>
            </div>
          ) : (
            sessions.slice(0, 5).map((session) => (
              <div key={session.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium text-gray-900">
                        {session.chief_complaint}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(session.priority_level)}`}>
                        {session.priority_level.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      Risk Score: {session.risk_score}/100
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(session.created_at).toLocaleDateString()}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full ${
                        session.status === 'completed' ? 'bg-green-100 text-green-700' :
                        session.status === 'active' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                  </div>
                  
                  <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}