// contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  // GoogleAuthProvider
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Add console logging for debugging
    console.log('Setting up auth state listener');
    
    try {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        console.log('Auth state changed:', currentUser ? 'User logged in' : 'No user');
        setUser(currentUser);
        setLoading(false);
      }, (error) => {
        console.error('Auth state error:', error);
        setLoading(false);
      });

      return () => {
        console.log('Unsubscribing from auth state');
        unsubscribe();
      };
    } catch (error) {
      console.error('Error in auth setup:', error);
      setLoading(false);
      return () => {}; // Return empty cleanup function
    }
  }, []);

  const signInWithGoogle = async () => {
    try {
      console.log('Attempting Google sign in');
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google', error);
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('Attempting sign out');
      setLoading(true);
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out', error);
      setLoading(false);
    }
  };

  const contextValue = {
    user,
    loading,
    signInWithGoogle,
    signOut
  };

  console.log('Auth context value:', { user: user?.displayName || null, loading });

  return (
    <AuthContext.Provider value={contextValue}>
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