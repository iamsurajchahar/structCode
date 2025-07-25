import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { supabase, adminSupabase } from '@/integrations/supabase/client';
import { checkUserExists, manuallyConfirmUser } from '@/integrations/supabase/rpcTypes';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, User, Loader2 } from 'lucide-react';


const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, refreshSession, retryOAuth } = useAuth();

  // Normalize email input
  const normalizeEmail = (email: string) => email.trim().toLowerCase();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Check for OAuth errors in URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');
    
    if (error) {
      console.error('OAuth error in URL:', error, errorDescription);
      setOauthError(`Authentication failed: ${errorDescription || error}`);
      // Clear the error from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Check if user exists in the database
  const checkUserExistence = async (email: string): Promise<boolean> => {
    try {
      console.log('Checking user existence for:', email);
      const { data, error } = await checkUserExists(email);
      
      if (error) {
        console.error('Error checking user existence:', error);
        // If we can't check, assume user doesn't exist to be safe
        return false;
      }
      
      const exists = data?.exists || false;
      console.log('User exists check result:', exists);
      return exists;
    } catch (error) {
      console.error('Error checking user existence:', error);
      // If we can't check, assume user doesn't exist to be safe
      return false;
    }
  };

  // Optimized user profile saving (non-blocking)
  const saveUserProfile = async (userId: string, userData: any) => {
    setTimeout(async () => {
      try {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', userId)
          .single();

        if (!existingProfile) {
          await supabase
            .from('profiles')
            .insert([{ 
              id: userId, 
              full_name: userData.full_name,
              email: userData.email,
              created_at: new Date().toISOString()
            }]);
        }
      } catch (error) {
        console.error('Background profile save error:', error);
      }
    }, 0);
  };

  const handleDebug = async () => {
    setLoading(true);
    
    try {
      const normalizedEmail = normalizeEmail(email);
      
      const { data: checkData } = await checkUserExists(normalizedEmail);
      
      if (checkData && checkData.exists) {
        // Try to confirm user
        try {
          if (adminSupabase) {
            await adminSupabase.auth.admin.updateUserById(
              checkData.id || '',
              { email_confirm: true }
            );
          }
          
          await manuallyConfirmUser(normalizedEmail);
          
          toast.success("Account found and confirmation attempted. Please try signing in.");
        } catch (error) {
          console.error('Confirmation error:', error);
        }
              } else {
          setOauthError("No account was found with this email address. Please sign up first.");
        }
    } catch (error) {
      console.error('Error during troubleshooting:', error);
      setOauthError(error.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOauthError(null);

    try {
      const normalizedEmail = normalizeEmail(email);
      console.log('Starting email auth for:', normalizedEmail, 'isSignUp:', isSignUp);
      
      if (isSignUp) {
        // Check if user already exists
        console.log('Checking if user exists for signup...');
        const userExists = await checkUserExistence(normalizedEmail);
        
        if (userExists) {
          console.log('User already exists, switching to signin mode');
          setOauthError("You already have an account. Please sign in.");
          setIsSignUp(false);
          setEmail(normalizedEmail);
          setPassword('');
          setFullName('');
          setLoading(false);
          return;
        }

        console.log('User does not exist, proceeding with signup');
        // Validate inputs
        if (password.length < 6) {
          setOauthError("Password must be at least 6 characters long");
          setLoading(false);
          return;
        }

        if (!fullName.trim()) {
          setOauthError("Please enter your full name to create an account.");
          setLoading(false);
          return;
        }
        
        // Try admin API first for faster signup
        if (adminSupabase) {
          console.log('Using admin API for signup');
          const { data, error } = await adminSupabase.auth.admin.createUser({
            email: normalizedEmail,
            password,
            email_confirm: true,
            user_metadata: {
              full_name: fullName,
            }
          });
          
          if (error) {
            console.error('Admin signup error:', error);
            if (error.message.includes('User already registered') || 
                error.message.includes('already exists') ||
                error.message.includes('duplicate key')) {
              setOauthError("You already have an account. Please sign in.");
              setIsSignUp(false);
              setEmail(normalizedEmail);
              setPassword('');
              setFullName('');
              setLoading(false);
              return;
            }
            throw error;
          }
          
          console.log('Admin signup successful, signing in...');
          // Sign in immediately after admin signup
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password
          });
          
          if (signInError) {
            console.error('Signin after admin signup error:', signInError);
            throw signInError;
          }
          
          if (signInData?.session) {
            console.log('Signin after admin signup successful');
            // Save profile in background
            saveUserProfile(
              signInData.user.id, 
              { 
                full_name: fullName, 
                email: signInData.user.email 
              }
            );
            
            await refreshSession();
            
            toast.success("Account created and verified! Welcome to StructCode!");
            
            localStorage.setItem('hasVisitedBefore', 'true');
            navigate('/');
            return;
          }
        }
        
        // Fallback to regular signup
        console.log('Using regular signup');
        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: null
          }
        });
        
        if (error) {
          console.error('Regular signup error:', error);
          if (error.message.includes('User already registered') || 
              error.message.includes('already exists') ||
              error.message.includes('duplicate key')) {
            toast.error("You already have an account. Please sign in.");
            setIsSignUp(false);
            setEmail(normalizedEmail);
            setPassword('');
            setFullName('');
            setLoading(false);
            return;
          }
          throw error;
        }

        if (data?.session) {
          console.log('Regular signup successful with session');
          // Save profile in background
          saveUserProfile(
            data.user.id, 
            { 
              full_name: fullName, 
              email: data.user.email 
            }
          );
          
          await refreshSession();
          
          toast.success("Account created successfully! Welcome to StructCode!");
          
          localStorage.setItem('hasVisitedBefore', 'true');
          navigate('/');
          return;
        }
        
        // Try manual confirmation for immediate access
        console.log('Trying manual confirmation');
        try {
          await manuallyConfirmUser(normalizedEmail);
          
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password
          });
          
          if (!signInError && signInData?.session) {
            console.log('Manual confirmation successful');
            // Save profile in background
            saveUserProfile(
              signInData.user.id, 
              { 
                full_name: fullName, 
                email: signInData.user.email 
              }
            );
            
            await refreshSession();
            
            toast.success("Account created successfully! Welcome to StructCode!");
            
            localStorage.setItem('hasVisitedBefore', 'true');
            navigate('/');
            return;
          }
        } catch (confirmError) {
          console.error('Manual confirmation error:', confirmError);
        }
        
        // Fallback message for email verification
        toast({
          title: "Account Created",
          description: "Please check your email to verify your account before signing in.",
        });
        
      } else {
        // Sign in flow - check if user exists first
        console.log('Checking if user exists for signin...');
        const userExists = await checkUserExistence(normalizedEmail);
        
        if (!userExists) {
          console.log('User does not exist, switching to signup mode');
          setOauthError("No account found. Please sign up first.");
          setIsSignUp(true);
          setEmail(normalizedEmail);
          setPassword('');
          setFullName('');
          setLoading(false);
          return;
        }
        
        console.log('User exists, attempting signin');
        console.log('Attempting sign in with:', normalizedEmail);
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });
        
        if (error) {
          console.error('Sign in error:', error.message);
          
          // Try to confirm user if they exist but aren't confirmed
          try {
            const { data: checkData } = await checkUserExists(normalizedEmail);
            
            if (checkData && checkData.exists) {
              console.log('User exists but may not be confirmed, attempting confirmation');
              await manuallyConfirmUser(normalizedEmail);
              
              // Try signing in again
              const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
                email: normalizedEmail,
                password,
              });
              
              if (!retryError && retryData?.session) {
                console.log('Signin successful after confirmation');
                await refreshSession();
                
                toast.success("Welcome back! You have successfully signed in.");
                
                localStorage.setItem('hasVisitedBefore', 'true');
                navigate('/');
                return;
              } else {
                console.error('Still failed after confirmation:', retryError);
              }
            } else {
              console.log('User does not exist');
            }
          } catch (checkError) {
            console.error('Error checking user existence:', checkError);
          }
          
          // Show more specific error messages
          if (error.message.includes('Invalid login credentials')) {
            setOauthError("Invalid credentials. Please check your email and password and try again.");
          } else if (error.message.includes('Email not confirmed')) {
            setOauthError("Please check your email and click the verification link before signing in.");
          } else {
            setOauthError(error.message);
          }
          return;
        }
        
        if (data?.session) {
          console.log('Sign in successful');
          await refreshSession();
          
          toast.success("Welcome back! You have successfully signed in.");
          
          localStorage.setItem('hasVisitedBefore', 'true');
          navigate('/');
        } else {
          throw new Error("Failed to create session");
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error.message);
      setOauthError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setOauthError(null);
    
    try {
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
        console.error('Google OAuth error:', error);
        setOauthError(`Google Sign-in Error: ${error.message}`);
        return;
      }
      
      // Don't show toast here as we're redirecting
      console.log('OAuth redirect initiated');
      
    } catch (error: any) {
      console.error('Google OAuth error:', error);
      setOauthError(`Google Sign-in Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dsa-purple/10 via-background to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </CardTitle>
          <p className="text-center text-muted-foreground">
            {isSignUp ? 'Sign up to start your DSA journey' : 'Sign in to continue your progress'}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {oauthError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{oauthError}</p>
              <button
                type="button"
                onClick={() => setOauthError(null)}
                className="text-xs text-red-500 hover:underline mt-1"
              >
                Dismiss
              </button>
            </div>
          )}
          
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleAuth}
            disabled={loading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Redirecting to Google...
              </>
            ) : (
              'Continue with Google'
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                    required={isSignUp}
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full bg-dsa-purple hover:bg-dsa-purple/90" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            </span>
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-dsa-purple hover:underline"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </div>
          
          <div className="text-center text-xs mt-4">
            <span className="text-muted-foreground">Having issues? </span>
            <button
              type="button"
              onClick={handleDebug}
              className="text-dsa-purple/90 hover:underline"
            >
              Troubleshoot my account
            </button>
          </div>
          
          {/* Debug section for development */}
          {import.meta.env.DEV && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <details className="text-xs">
                <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                  Debug Info (Development Only)
                </summary>
                <div className="mt-2 space-y-1">
                  <div>User: {user?.email || 'Not signed in'}</div>
                  <div>Loading: {loading ? 'Yes' : 'No'}</div>
                  <div>URL Params: {window.location.search || 'None'}</div>
                  <div>Supabase URL: {import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</div>
                  <div>Supabase Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</div>
                  <button
                    type="button"
                    onClick={() => {
                      console.log('=== DEBUG INFO ===');
                      console.log('User:', user);
                      console.log('Loading:', loading);
                      console.log('URL:', window.location.href);
                      console.log('URL Params:', window.location.search);
                    }}
                    className="text-xs text-blue-500 hover:underline"
                  >
                    Log Debug Info
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await refreshSession();
                        toast.success('Session refreshed');
                      } catch (error) {
                        toast.error('Failed to refresh session');
                      }
                    }}
                    className="text-xs text-green-500 hover:underline ml-2"
                  >
                    Refresh Session
                  </button>
                  <button
                    type="button"
                    onClick={retryOAuth}
                    className="text-xs text-yellow-500 hover:underline ml-2"
                  >
                    Retry OAuth
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.authDebug) {
                        window.authDebug.testOAuth();
                      } else {
                        console.log('Auth debug not available');
                      }
                    }}
                    className="text-xs text-purple-500 hover:underline ml-2"
                  >
                    Test OAuth
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // Manually trigger OAuth redirect handling
                      const urlParams = new URLSearchParams(window.location.search);
                      const hasAuthParams = urlParams.has('access_token') || 
                                           urlParams.has('refresh_token') || 
                                           urlParams.has('error') || 
                                           urlParams.has('code') ||
                                           urlParams.has('provider');
                      console.log('Manual OAuth check:', hasAuthParams ? 'Has params' : 'No params');
                      console.log('URL params:', window.location.search);
                    }}
                    className="text-xs text-orange-500 hover:underline ml-2"
                  >
                    Check OAuth Params
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // Clear URL parameters
                      window.history.replaceState({}, document.title, window.location.pathname);
                      console.log('URL parameters cleared');
                      toast.success('URL parameters cleared');
                    }}
                    className="text-xs text-red-500 hover:underline ml-2"
                  >
                    Clear URL Params
                  </button>
                </div>
              </details>
            </div>
          )}

        </CardContent>
      </Card>
      

    </div>
  );
};

export default AuthPage;
