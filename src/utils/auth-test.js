async function checkAuth() {
  // Access the Supabase client from window
  const { supabase } = window;
  
  if (!supabase) {
    console.error("Supabase client not found in window object");
    return;
  }
  
  console.group('🔐 Auth State Check');
  
  try {
    // Get current session
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Error getting session:", error);
      return;
    }
    
    if (data?.session) {
      console.log("✅ User is logged in");
      console.log("User ID:", data.session.user.id);
      console.log("Email:", data.session.user.email);
      console.log("Auth Provider:", data.session.user.app_metadata.provider);
      console.log("Session expires at:", new Date(data.session.expires_at * 1000).toLocaleString());
      
      // Check if user has a profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.session.user.id)
        .single();
      
      if (profileError) {
        console.error("❌ Error fetching user profile:", profileError);
      } else if (profileData) {
        console.log("✅ User profile found:", profileData);
      } else {
        console.warn("⚠️ No profile found for this user!");
      }
    } else {
      console.log("❌ No active session - user is not logged in");
    }
  } catch (err) {
    console.error("Error in auth check:", err);
  }
  
  console.groupEnd();
  return "Auth check complete";
}

// Test signup function (for debugging only)
async function testSignUp(email, password, fullName = "Test User") {
  const { supabase } = window;
  
  if (!supabase) {
    console.error("Supabase client not found");
    return;
  }
  
  console.group('🔐 Test Sign Up');
  console.log(`Attempting to sign up: ${email}`);
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        },
        emailRedirectTo: null // Disable email verification for testing
      }
    });
    
    if (error) {
      console.error("❌ Sign up failed:", error);
    } else {
      console.log("✅ Sign up response:", data);
    }
  } catch (err) {
    console.error("❌ Error during sign up:", err);
  }
  
  console.groupEnd();
  return "Signup test complete";
}

// Test sign in function
async function testSignIn(email, password) {
  const { supabase } = window;
  
  if (!supabase) {
    console.error("Supabase client not found");
    return;
  }
  
  console.group('🔐 Test Sign In');
  console.log(`Attempting to sign in: ${email}`);
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error("❌ Sign in failed:", error);
    } else {
      console.log("✅ Sign in successful:", data);
    }
  } catch (err) {
    console.error("❌ Error during sign in:", err);
  }
  
  console.groupEnd();
  return "Signin test complete";
}

// Manually save a profile
async function saveProfile(userId, userData) {
  const { supabase } = window;
  
  if (!supabase) {
    console.error("Supabase client not found");
    return;
  }
  
  console.group('🧑‍💼 Save Profile');
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert([{
        id: userId,
        email: userData.email,
        full_name: userData.full_name || 'User',
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      }]);
    
    if (error) {
      console.error("❌ Profile save failed:", error);
    } else {
      console.log("✅ Profile saved successfully:", data);
    }
  } catch (err) {
    console.error("❌ Error saving profile:", err);
  }
  
  console.groupEnd();
  return "Profile save complete";
}

// Force sign out (useful for testing)
async function signOut() {
  const { supabase } = window;
  
  if (!supabase) {
    console.error("Supabase client not found");
    return;
  }
  
  console.group('🔐 Sign Out Test');
  
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("❌ Sign out failed:", error);
    } else {
      console.log("✅ Signed out successfully");
    }
  } catch (err) {
    console.error("❌ Error during sign out:", err);
  }
  
  console.groupEnd();
  return "Signout test complete";
}

// Export for browser console use
const authTest = {
  checkAuth,
  testSignUp,
  testSignIn,
  saveProfile,
  signOut
};

// Expose to window
window.authTest = authTest;

console.log("%c🔐 Auth Testing Utilities Loaded", "background: #593d88; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;");
console.log("%cTry: %cauthTest.checkAuth()", "font-weight: bold", "color: #593d88; font-weight: bold");

export default authTest; 