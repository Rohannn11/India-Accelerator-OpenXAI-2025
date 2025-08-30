import type { User } from '../types/medical';

// Mock user data for development
const mockUsers: User[] = [
  {
    id: '1',
    email: 'demo@healthai.com',
    full_name: 'Demo User',
    date_of_birth: '1990-01-01',
    gender: 'prefer_not_to_say',
    medical_history: ['None'],
    allergies: ['None'],
    medications: ['None'],
    emergency_contact: {
      name: 'Emergency Contact',
      phone: '+1-555-0123',
      relationship: 'Family'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export class MockAuthService {
  private currentUser: User | null = null;

  async signUp(email: string, password: string, userData: Partial<User>) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      email,
      full_name: userData.full_name || 'New User',
      date_of_birth: userData.date_of_birth || '1990-01-01',
      gender: userData.gender || 'prefer_not_to_say',
      medical_history: userData.medical_history || [],
      allergies: userData.allergies || [],
      medications: userData.medications || [],
      emergency_contact: {
        name: 'Emergency Contact',
        phone: '+1-555-0123',
        relationship: 'Family'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    mockUsers.push(newUser);
    this.currentUser = newUser;
    
    return { user: newUser, session: null };
  }

  async signIn(email: string, password: string) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, accept any email/password combination
    // In production, this would validate against the database
    const user = mockUsers.find(u => u.email === email) || mockUsers[0];
    this.currentUser = user;
    
    return { user, session: null };
  }

  async signOut() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    this.currentUser = null;
  }

  async getCurrentUser() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.currentUser;
  }

  async updateProfile(userId: string, updates: Partial<User>) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates, updated_at: new Date().toISOString() };
      this.currentUser = mockUsers[userIndex];
      return mockUsers[userIndex];
    }
    
    throw new Error('User not found');
  }
}

export const mockAuthService = new MockAuthService();
