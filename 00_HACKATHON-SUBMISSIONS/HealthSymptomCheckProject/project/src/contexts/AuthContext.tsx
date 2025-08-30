import React, { createContext, useContext, useEffect, useState } from 'react';
import { mockAuthService } from '../services/mockAuthService';
import type { User } from '../types/medical';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    const checkUser = async () => {
      try {
        const currentUser = await mockAuthService.getCurrentUser();
        if (currentUser) {
          // Fetch full user profile from database
          // This would be implemented when database is set up
          setUser(currentUser as User);
        }
      } catch (error) {
        // Silently handle auth errors during initial load
        // This is expected when user is not logged in or Supabase is not configured
        console.log('No active session found');
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await mockAuthService.signIn(email, password);
    if (result.user) {
      setUser(result.user as User);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    const result = await mockAuthService.signUp(email, password, userData);
    if (result.user) {
      setUser(result.user as User);
    }
  };

  const signOut = async () => {
    await mockAuthService.signOut();
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error('No user logged in');
    const updatedUser = await mockAuthService.updateProfile(user.id, updates);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}