// src/contexts/AuthContext.tsx
import { LoadingState } from '@/components/ui/LoadingState';
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { AuthService } from '../services/authService';
import { AuthContextType, User, UserPreferences, UserSubscription } from '../types/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_INITIALIZED'; payload: boolean };

const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
  initialized: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_INITIALIZED':
      return { ...state, initialized: action.payload };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Subscribe to authentication state changes
    const unsubscribe = AuthService.onAuthStateChanged((user) => {
      dispatch({ type: 'SET_USER', payload: user });
      if (!state.initialized) {
        dispatch({ type: 'SET_INITIALIZED', payload: true });
      }
    });

    return unsubscribe;
  }, [state.initialized]);

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const user = await AuthService.signIn(email, password);
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.userMessage || error.message });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, displayName?: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const user = await AuthService.signUp(email, password, displayName);
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.userMessage || error.message });
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await AuthService.signOut();
      dispatch({ type: 'SET_USER', payload: null });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.userMessage || error.message });
      throw error;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      await AuthService.resetPassword(email);
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.userMessage || error.message });
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    try {
      if (!state.user) throw new Error('No user logged in');
      
      await AuthService.updateUserProfile(state.user.id, updates);
      dispatch({ type: 'SET_USER', payload: { ...state.user, ...updates } });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.userMessage || error.message });
      throw error;
    }
  };

  const uploadProfileImage = async (imageUri: string): Promise<string> => {
    try {
      if (!state.user) throw new Error('No user logged in');
      
      const photoURL = await AuthService.uploadProfileImage(state.user.id, imageUri);
      dispatch({ type: 'SET_USER', payload: { ...state.user, photoURL } });
      return photoURL;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.userMessage || error.message });
      throw error;
    }
  };

  const value: AuthContextType = {
    user: state.user,
    loading: state.loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    uploadProfileImage,
    updatePreferences: function (updates: Partial<UserPreferences>): Promise<void> {
      throw new Error('Function not implemented.');
    },
    sendEmailVerification: function (): Promise<void> {
      throw new Error('Function not implemented.');
    },
    deleteAccount: function (): Promise<void> {
      throw new Error('Function not implemented.');
    },
    updateSubscription: function (subscription: Partial<UserSubscription>): Promise<void> {
      throw new Error('Function not implemented.');
    }
  };

  // Don't render children until auth state is initialized
  if (!state.initialized) {
    return <LoadingState message="Initializing..." />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};