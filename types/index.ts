// Global type definitions for Eye Do Plan
export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  clientName: string;
  weddingDate: Date;
  venue: string;
  status: 'planning' | 'active' | 'completed';
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NavigationProps {
  navigation: any;
  route: any;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}