import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { initialUsers } from '../data/initialData';
import { store } from '../services/store';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  firebaseSignOut,
  onAuthStateChanged,
  isLiveFirebase,
} from '../lib/firebase';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  loginAs: (role: UserRole) => void;
  register: (fullName: string, email: string, phone: string, password?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('ticketora_active_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error loading active user', e);
    }
    // Default to customer Anik Sen for instant preview
    return initialUsers.find((u) => u.role === 'customer') || null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('ticketora_active_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ticketora_active_user');
    }
  }, [user]);

  // Listen for Firebase auth state changes if live Firebase is configured
  useEffect(() => {
    if (!isLiveFirebase) return;

    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const existing = store.getUsers().find((u) => u.email.toLowerCase() === fbUser.email?.toLowerCase());
        const userProf: UserProfile = existing || {
          id: fbUser.uid,
          email: fbUser.email || '',
          full_name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Passenger',
          phone: fbUser.phoneNumber || '+8801700000000',
          avatar_url: fbUser.photoURL || undefined,
          role: 'customer',
          created_at: new Date().toISOString(),
        };
        setUser(userProf);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password?: string): Promise<boolean> => {
    if (isLiveFirebase && password) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const fbUser = userCredential.user;
        const existing = store.getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
        const userProf: UserProfile = existing || {
          id: fbUser.uid,
          email: fbUser.email || email,
          full_name: fbUser.displayName || email.split('@')[0],
          phone: '+8801700000000',
          role: 'customer',
          created_at: new Date().toISOString(),
        };
        setUser(userProf);
        return true;
      } catch (err: any) {
        throw new Error(err.message || 'Firebase login failed.');
      }
    }

    // Local / Store Fallback
    const found = store.getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setUser(found);
      return true;
    }
    const newCust: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      full_name: email.split('@')[0],
      phone: '+8801700000000',
      role: 'customer',
      created_at: new Date().toISOString(),
    };
    setUser(newCust);
    return true;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    if (isLiveFirebase) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const fbUser = result.user;
        const existing = store.getUsers().find((u) => u.email.toLowerCase() === fbUser.email?.toLowerCase());
        const googleUser: UserProfile = existing || {
          id: fbUser.uid,
          email: fbUser.email || '',
          full_name: fbUser.displayName || 'Google Passenger',
          phone: fbUser.phoneNumber || '+8801799123456',
          avatar_url: fbUser.photoURL || undefined,
          role: 'customer',
          created_at: new Date().toISOString(),
        };
        setUser(googleUser);
        return true;
      } catch (err: any) {
        throw new Error(err.message || 'Google sign-in failed.');
      }
    }

    // Demo / Local Google Sign-In Fallback
    const googleUser: UserProfile = {
      id: 'usr-google-verified',
      email: 'anik.sen@gmail.com',
      full_name: 'Anik Sen (Google)',
      phone: '+8801799123456',
      role: 'customer',
      avatar_url: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
      created_at: new Date().toISOString(),
    };
    setUser(googleUser);
    return true;
  };

  const loginAs = (targetRole: UserRole) => {
    const demoUser = initialUsers.find((u) => u.role === targetRole);
    if (demoUser) {
      setUser(demoUser);
    }
  };

  const register = async (fullName: string, email: string, phone: string, password?: string): Promise<boolean> => {
    if (isLiveFirebase && password) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const fbUser = userCredential.user;
        const newCust: UserProfile = {
          id: fbUser.uid,
          email,
          full_name: fullName,
          phone,
          role: 'customer',
          created_at: new Date().toISOString(),
        };
        setUser(newCust);
        return true;
      } catch (err: any) {
        throw new Error(err.message || 'Firebase registration failed.');
      }
    }

    const newCust: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      full_name: fullName,
      phone,
      role: 'customer',
      created_at: new Date().toISOString(),
    };
    setUser(newCust);
    return true;
  };

  const logout = async () => {
    if (isLiveFirebase) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        console.warn('Firebase signout error', e);
      }
    }
    setUser(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
        loginAs,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
