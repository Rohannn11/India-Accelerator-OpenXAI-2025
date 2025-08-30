import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Heart, Pill, AlertTriangle, Download, Trash2 } from 'lucide-react';
import type { User as UserType } from '../../types/medical';

export function ProfileSettings() {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserType>>(user || {});

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleExportData = () => {
    // Implementation would export user data as JSON
    const dataToExport = {
      profile: user,
      exported_at: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `healthai-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            <div className="flex space-x-2">
              <button
                onClick={handleExportData}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Data</span>
              </button>
              <button
                onClick={() => setEditing(!editing)}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>{editing ? 'Cancel' : 'Edit Profile'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Basic Information</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.full_name || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">{user.full_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">{user.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                {editing ? (
                  <input
                    type="date"
                    value={formData.date_of_birth || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                    {user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : 'Not provided'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                {editing ? (
                  <select
                    value={formData.gender || 'prefer_not_to_say'}
                    onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="prefer_not_to_say">Prefer not to say</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <p className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900 capitalize">
                    {user.gender?.replace('_', ' ') || 'Not specified'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Medical History */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Heart className="w-5 h-5" />
              <span>Medical History</span>
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical Conditions (one per line)
                </label>
                {editing ? (
                  <textarea
                    value={formData.medical_history?.join('\n') || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      medical_history: e.target.value.split('\n').filter(item => item.trim()) 
                    }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter medical conditions, one per line..."
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900 min-h-[100px]">
                    {user.medical_history?.length ? (
                      <ul className="space-y-1">
                        {user.medical_history.map((condition, index) => (
                          <li key={index} className="text-sm">• {condition}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-500 text-sm">No medical history recorded</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Allergies */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Allergies</span>
            </h2>
            
            {editing ? (
              <textarea
                value={formData.allergies?.join('\n') || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  allergies: e.target.value.split('\n').filter(item => item.trim()) 
                }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter allergies, one per line..."
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900 min-h-[80px]">
                {user.allergies?.length ? (
                  <ul className="space-y-1">
                    {user.allergies.map((allergy, index) => (
                      <li key={index} className="text-sm">• {allergy}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-gray-500 text-sm">No allergies recorded</span>
                )}
              </div>
            )}
          </div>

          {/* Current Medications */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Pill className="w-5 h-5" />
              <span>Current Medications</span>
            </h2>
            
            {editing ? (
              <textarea
                value={formData.medications?.join('\n') || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  medications: e.target.value.split('\n').filter(item => item.trim()) 
                }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter medications, one per line..."
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900 min-h-[80px]">
                {user.medications?.length ? (
                  <ul className="space-y-1">
                    {user.medications.map((medication, index) => (
                      <li key={index} className="text-sm">• {medication}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-gray-500 text-sm">No medications recorded</span>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {editing && (
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setFormData(user);
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Data Management */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Data Management</h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleExportData}
              className="flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export My Data</span>
            </button>
            
            <button className="flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors">
              <Trash2 className="w-4 h-4" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}