import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserTier } from '../types';
import { AuthService, supabase } from '../services/authService';
import { MOCK_USERS } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  login: (user: User) => void;
  logout: () => Promise<void>;
  switchUser: (tierOrRole: UserTier | 'admin' | string) => void;
  refreshUser: () => void;
  updateCurrentUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  // Initialize and seed users list in local DB if empty
  const initAuth = useCallback(() => {
    let storedUsers = AuthService.getStoredUsers();
    if (!storedUsers || storedUsers.length === 0) {
      storedUsers = Object.values(MOCK_USERS);
      AuthService.saveStoredUsers(storedUsers);
    }

    const session = AuthService.getCurrentSession();
    if (session) {
      const refreshed = storedUsers.find((u) => u.id === session.id) || session;
      setCurrentUser(refreshed);
    } else {
      // Default to Local Verified (Anita Devi) or Citizen for seamless immediate demo review
      const defaultUser = MOCK_USERS.local_verified || storedUsers[0];
      setCurrentUser(defaultUser);
      AuthService.setCurrentSession(defaultUser);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    initAuth();

    // Listen to Supabase auth state change if Supabase is connected
    if (supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const storedUsers = AuthService.getStoredUsers();
          const found = storedUsers.find((u) => u.id === session.user.id);
          if (found) {
            setCurrentUser(found);
            AuthService.setCurrentSession(found);
          }
        } else if (event === 'SIGNED_OUT') {
          // Keep state consistent
        }
      });

      return () => {
        authListener?.subscription.unsubscribe();
      };
    }
  }, [initAuth]);

  const login = (user: User) => {
    setCurrentUser(user);
    AuthService.setCurrentSession(user);
    // Ensure user is in list
    const users = AuthService.getStoredUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    AuthService.saveStoredUsers(users);
  };

  const logout = async () => {
    setIsLoading(true);
    await AuthService.signOut();
    setCurrentUser(null);
    setIsLoading(false);
  };

  const switchUser = (tierOrRole: UserTier | 'admin' | string) => {
    const allUsers = AuthService.getStoredUsers();
    let target: User | undefined;

    if (tierOrRole === 'admin') {
      target = allUsers.find((u) => u.isAdmin) || MOCK_USERS.admin;
    } else {
      target = allUsers.find((u) => u.tier === tierOrRole && !u.isAdmin) || (MOCK_USERS as any)[tierOrRole];
    }

    if (target) {
      setCurrentUser(target);
      AuthService.setCurrentSession(target);
    }
  };

  const refreshUser = () => {
    if (!currentUser) return;
    const users = AuthService.getStoredUsers();
    const found = users.find((u) => u.id === currentUser.id);
    if (found) {
      setCurrentUser(found);
      AuthService.setCurrentSession(found);
    }
  };

  const updateCurrentUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    AuthService.setCurrentSession(updatedUser);
    const users = AuthService.getStoredUsers();
    const idx = users.findIndex((u) => u.id === updatedUser.id);
    if (idx >= 0) {
      users[idx] = updatedUser;
    } else {
      users.push(updatedUser);
    }
    AuthService.saveStoredUsers(users);
  };

  const isAuthenticated = Boolean(currentUser && currentUser.id);
  const isAdmin = Boolean(currentUser?.isAdmin);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isAdmin,
        isLoading,
        language,
        setLanguage,
        login,
        logout,
        switchUser,
        refreshUser,
        updateCurrentUser
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
