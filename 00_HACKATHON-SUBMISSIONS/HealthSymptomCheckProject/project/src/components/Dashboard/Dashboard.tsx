import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { symptomService } from '../../services/symptomService';
import { 
  Plus, 
  History, 
  TrendingUp, 
  Calendar, 
  Download, 
  Activity,
  Heart,
  AlertTriangle,
  Phone,
  Pill,
  User,
  Clock,
  CheckCircle
} from 'lucide-react';
import type { SymptomSession } from '../../types/medical';

export function Dashboard() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SymptomSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'analytics'>('overview');

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
      case 'emergency': return 'bg-red-100 text-red-800 border-red-200';
      case 'urgent': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: 'High', color: 'text-red-600' };
    if (score >= 50) return { level: 'Medium', color: 'text-yellow-600' };
    return { level: 'Low', color: 'text-green-600' };
  };

  const getHealthScore = () => {
    if (sessions.length === 0) return 85;
    const avgRisk = sessions.reduce((sum, session) => sum + session.risk_score, 0) / sessions.length;
    return Math.max(0, 100 - avgRisk);
  };

  const getRecentTrends = () => {
    const recentSessions = sessions.slice(0, 5);
    if (recentSessions.length === 0) return 'No recent assessments';
    
    const avgRisk = recentSessions.reduce((sum, session) => sum + session.risk_score, 0) / recentSessions.length;
    if (avgRisk < 30) return 'Improving';
    if (avgRisk < 60) return 'Stable';
    return 'Needs attention';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your health dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.full_name?.split(' ')[0] || 'User'}
              </h1>
              <p className="text-gray-600 mt-1">
                Your health insights and recommendations
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-full">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">AI Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'history', label: 'History', icon: History },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Health Score Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Health Score</h2>
                <Heart className="w-6 h-6 text-red-500" />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="text-3xl font-bold text-blue-600">{getHealthScore()}%</div>
                  <div className="text-sm text-gray-600 mt-1">Overall health status</div>
                </div>
                <div className="w-24 h-24 relative">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${(getHealthScore() / 100) * 251.2} 251.2`}
                      className="text-blue-600 transition-all duration-1000"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105">
                <div className="flex items-center space-x-3 mb-3">
                  <Plus className="w-6 h-6" />
                  <h3 className="text-lg font-semibold">New Assessment</h3>
                </div>
                <p className="text-blue-100 text-sm">
                  Start a comprehensive symptom evaluation
                </p>
              </button>

              <button className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center space-x-3 mb-3">
                  <Phone className="w-6 h-6 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Emergency</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Quick access to emergency services
                </p>
              </button>

              <button className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center space-x-3 mb-3">
                  <Pill className="w-6 h-6 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Medications</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Track your medications and interactions
                </p>
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              </div>
              
              <div className="p-6">
                {sessions.length === 0 ? (
                  <div className="text-center py-8">
                    <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500 mb-2">No assessments yet</p>
                    <p className="text-sm text-gray-400">Start your first health evaluation</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sessions.slice(0, 3).map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Activity className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{session.chief_complaint}</h3>
                            <p className="text-sm text-gray-600">
                              {new Date(session.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(session.priority_level)}`}>
                            {session.priority_level.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className={`text-sm font-medium ${getRiskLevel(session.risk_score).color}`}>
                            {session.risk_score}/100
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Assessment History</h2>
            </div>
            
            <div className="p-6">
              {sessions.length === 0 ? (
                <div className="text-center py-8">
                  <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500">No previous assessments found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-medium text-gray-900">{session.chief_complaint}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(session.priority_level)}`}>
                              {session.priority_level.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(session.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{new Date(session.created_at).toLocaleTimeString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className={`font-medium ${getRiskLevel(session.risk_score).color}`}>
                                Risk: {session.risk_score}/100
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 line-clamp-2">{session.ai_analysis}</p>
                        </div>
                        
                        <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium">
                          <Download className="w-4 h-4" />
                          <span>Export</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Health Trends */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Health Trends</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{sessions.length}</div>
                  <div className="text-sm text-gray-600">Total Assessments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{getHealthScore()}%</div>
                  <div className="text-sm text-gray-600">Health Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{getRecentTrends()}</div>
                  <div className="text-sm text-gray-600">Recent Trend</div>
                </div>
              </div>
            </div>

            {/* Risk Distribution */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Risk Distribution</h2>
              <div className="space-y-3">
                {[
                  { level: 'Low Risk', count: sessions.filter(s => s.risk_score < 30).length, color: 'bg-green-500' },
                  { level: 'Medium Risk', count: sessions.filter(s => s.risk_score >= 30 && s.risk_score < 70).length, color: 'bg-yellow-500' },
                  { level: 'High Risk', count: sessions.filter(s => s.risk_score >= 70).length, color: 'bg-red-500' }
                ].map((item) => (
                  <div key={item.level} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{item.level}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${item.color}`}
                          style={{ width: `${(item.count / Math.max(sessions.length, 1)) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}