// Auth testing utilities for development
console.log('🔧 Auth testing utilities loaded');

// Add global debug functions
window.authDebug = {
  // Check Supabase configuration
  checkConfig: () => {
    console.log('=== SUPABASE CONFIG CHECK ===');
    console.log('URL:', import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing');
    console.log('Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
    console.log('Service Role Key:', import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');
    
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      console.error('❌ Missing required Supabase environment variables!');
      console.error('Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
    }
  },
  
  // Test OAuth flow
  testOAuth: async () => {
    console.log('=== TESTING OAUTH FLOW ===');
    try {
      const { data, error } = await window.supabaseClient.auth.signInWithOAuth({
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
        console.error('❌ OAuth error:', error);
      } else {
        console.log('✅ OAuth redirect initiated');
      }
    } catch (err) {
      console.error('❌ OAuth test failed:', err);
    }
  },
  
  // Check current session
  checkSession: async () => {
    console.log('=== SESSION CHECK ===');
    try {
      const { data, error } = await window.supabaseClient.auth.getSession();
      if (error) {
        console.error('❌ Session error:', error);
      } else if (data?.session) {
        console.log('✅ Session found:', data.session.user.email);
      } else {
        console.log('❌ No session found');
      }
    } catch (err) {
      console.error('❌ Session check failed:', err);
    }
  },
  
  // Clear all auth data
  clearAuth: () => {
    console.log('=== CLEARING AUTH DATA ===');
    try {
      localStorage.clear();
      sessionStorage.clear();
      console.log('✅ Auth data cleared');
    } catch (err) {
      console.error('❌ Failed to clear auth data:', err);
    }
  }
};

// Auto-check configuration on load
setTimeout(() => {
  window.authDebug.checkConfig();
}, 1000);

console.log('🔧 Use window.authDebug to access debugging functions'); 