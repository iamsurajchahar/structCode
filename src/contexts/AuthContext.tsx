import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  debugSession: () => Promise<void>;
  retryOAuth: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Save or update user profile data in the database (non-blocking)
  const saveUserProfile = async (currentUser: User) => {
    if (!currentUser) return;
    
    // Run profile operations in background without blocking auth flow
    setTimeout(async () => {
      try {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', currentUser.id)
          .single();
        
        const userData = {
          id: currentUser.id,
          email: currentUser.email,
          full_name: currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || '',
          avatar_url: currentUser.user_metadata?.avatar_url || null,
          updated_at: new Date().toISOString(),
        };
        
        if (!existingProfile) {
          await supabase
            .from('profiles')
            .insert([{
              ...userData,
              created_at: new Date().toISOString()
            }]);
        } else {
          await supabase
            .from('profiles')
            .update(userData)
            .eq('id', currentUser.id);
        }
      } catch (error) {
        console.error('Background profile save error:', error);
      }
    }, 0);
  };

  // Admin functionality removed
  useEffect(() => {
    setIsAdmin(false);
  }, [user]);

  // Enhanced OAuth redirect handling with better timing
  const handleOAuthRedirect = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const hasAuthParams = urlParams.has('access_token') || 
                         urlParams.has('refresh_token') || 
                         urlParams.has('error') || 
                         urlParams.has('code') ||
                         urlParams.has('provider');
    
    if (hasAuthParams) {
      console.log('OAuth redirect detected, processing...');
      setLoading(true);
      
      // Check for OAuth errors first
      const error = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');
      
      if (error) {
        console.error('OAuth error detected:', error, errorDescription);
        toast.error(`Authentication failed: ${errorDescription || error}`);
        setLoading(false);
        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }
      
      try {
        // Wait for Supabase to process the OAuth response
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Get the current session after OAuth redirect
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session after OAuth:', error);
          toast.error('Authentication failed. Please try again.');
          return;
        }
        
        if (data?.session) {
          console.log('OAuth session found:', data.session.user.email);
          setSession(data.session);
          setUser(data.session.user);
          
          // Save profile in background
          saveUserProfile(data.session.user);
          
          // Clear URL parameters
          window.history.replaceState({}, document.title, window.location.pathname);
          
          toast.success(`Welcome back, ${data.session.user.user_metadata?.full_name || data.session.user.email}!`);
        } else {
          console.log('No session found after OAuth redirect');
          setSession(null);
          setUser(null);
          toast.error('Authentication failed. No session was created.');
        }
      } catch (error) {
        console.error('Error processing OAuth redirect:', error);
        toast.error('Authentication failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Load session from localStorage on initial render (optimized)
  useEffect(() => {
    const loadSessionFromStorage = async () => {
      setLoading(true);
      
      try {
        // First check for OAuth redirect
        await handleOAuthRedirect();
        
        // Then get the current session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error.message);
          throw error;
        }
        
        if (data?.session) {
          console.log('Session found on load:', data.session.user.email);
          setSession(data.session);
          setUser(data.session.user);
          // Save profile in background
          saveUserProfile(data.session.user);
        } else {
          console.log('No session found on load');
          setSession(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Session restoration error:', error);
        await supabase.auth.signOut().catch(console.error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSessionFromStorage();
  }, []);

  // Function to manually refresh the session
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Error refreshing session:', error.message);
        throw error;
      }
      
      if (data?.session) {
        setSession(data.session);
        setUser(data.session.user);
        // Save profile in background
        saveUserProfile(data.session.user);
      }
    } catch (error) {
      console.error('Session refresh error:', error);
    }
  };

  // Debug function to check current session
  const debugSession = async () => {
    console.log('=== DEBUG SESSION ===');
    console.log('Current user state:', user);
    console.log('Current session state:', session);
    
    try {
      const { data, error } = await supabase.auth.getSession();
      console.log('Supabase session check:', data?.session?.user?.email);
      console.log('Supabase session error:', error);
      
      if (data?.session) {
        setSession(data.session);
        setUser(data.session.user);
      }
    } catch (err) {
      console.error('Debug session error:', err);
    }
  };

  // Manual OAuth retry function for debugging
  const retryOAuth = async () => {
    console.log('=== MANUAL OAUTH RETRY ===');
    setLoading(true);
    
    try {
      // Clear any existing auth data
      await supabase.auth.signOut();
      
      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Try OAuth again
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) {
        console.error('OAuth retry error:', error);
        toast.error(`OAuth retry failed: ${error.message}`);
      } else {
        console.log('OAuth retry initiated');
      }
    } catch (err) {
      console.error('OAuth retry failed:', err);
      toast.error('OAuth retry failed');
    } finally {
      setLoading(false);
    }
  };

  // Listen for auth changes (optimized)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.email);
        
        // Immediately update state
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
        
        if (event === 'SIGNED_IN' && currentSession?.user) {
          console.log('User signed in successfully:', currentSession.user.email);
          
          // Save profile in background without blocking
          saveUserProfile(currentSession.user);
          
          // Clear OAuth redirect parameters
          if (window.location.search.includes('access_token') || 
              window.location.search.includes('refresh_token') || 
              window.location.search.includes('code')) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed for user:', currentSession?.user?.email);
        } else if (event === 'USER_UPDATED') {
          console.log('User updated:', currentSession?.user?.email);
          if (currentSession?.user) {
            saveUserProfile(currentSession.user);
          }
        } else if (event === 'INITIAL_SESSION') {
          console.log('Initial session loaded:', currentSession?.user?.email);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      // Clear state immediately
      setUser(null);
      setSession(null);
      
      // Sign out from supabase
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) throw error;
      
      // Clear browser storage and redirect
      window.location.href = '/';
    } catch (error: any) {
      console.error('Error signing out:', error.message);
      toast.error('Error signing out');
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut,
    refreshSession,
    debugSession,
    retryOAuth,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
