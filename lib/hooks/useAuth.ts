import { useState, useEffect, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import supabase from '../supabase';
import { Alert } from 'react-native';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get current session
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user || null);

        // Set up auth state change listener
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            setSession(newSession);
            setUser(newSession?.user || null);
          }
        );

        return () => {
          authListener.subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Sign up function
  const signUp = useCallback(async (email: string, password: string) => {
    try {
      // For demo purposes, we'll just simulate a successful signup
      console.log('Signing up with:', email, password);
      // In a real app, this would call supabase.auth.signUp
      
      // Simulate successful signup
      return { error: null };
    } catch (error) {
      console.error('Error signing up:', error);
      return { error };
    }
  }, []);

  // Sign in function
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      // For demo purposes, we'll just simulate a successful login
      console.log('Signing in with:', email, password);
      // In a real app, this would call supabase.auth.signIn
      
      // Simulate successful login
      setUser({ id: '1', email: email } as User);
      setSession({ user: { id: '1', email: email } as User } as Session);
      
      return { error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error };
    }
  }, []);

  // Sign out function
  const signOut = useCallback(async () => {
    try {
      // For demo purposes, we'll just clear the user state
      setUser(null);
      setSession(null);
      // In a real app, this would call supabase.auth.signOut
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out');
    }
  }, []);

  // Refresh session
  const refreshSession = useCallback(async () => {
    try {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user || null);
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  }, []);

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    refreshSession,
  };
}