import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, CheckCircle, Save, RefreshCw } from 'lucide-react';

const ProfilePage = () => {
  const { user, signOut, refreshSession } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    avatar_url: '',
    created_at: '',
    updated_at: '',
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  // Fetch profile data with optimization
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        console.log('Fetching profile data for user:', user.id);
        
        // Add timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
        );
        
        // Optimize query to only select needed fields
        const fetchPromise = supabase
          .from('profiles')
          .select('full_name, email, avatar_url, created_at, updated_at')
          .eq('id', user.id)
          .single();
        
        const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;
        
        console.log('Profile data result:', data, error);
        
        if (error && error.code !== 'PGRST116') { // Not found error
          console.error('Error fetching profile data:', error);
          // Instead of throwing, use user auth data as fallback
          setProfileData({
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
            email: user.email || '',
            avatar_url: user.user_metadata?.avatar_url || '',
            created_at: user.created_at || '',
            updated_at: user.updated_at || '',
          });
        } else if (data) {
          setProfileData({
            full_name: data.full_name || user.user_metadata?.full_name || user.user_metadata?.name || '',
            email: data.email || user.email || '',
            avatar_url: data.avatar_url || user.user_metadata?.avatar_url || '',
            created_at: data.created_at || user.created_at || '',
            updated_at: data.updated_at || user.updated_at || '',
          });
        } else {
          // Use data from auth user if profile not found
          setProfileData({
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
            email: user.email || '',
            avatar_url: user.user_metadata?.avatar_url || '',
            created_at: user.created_at || '',
            updated_at: user.updated_at || '',
          });
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        // Use default values instead of showing an error toast
        setProfileData({
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
          email: user.email || '',
          avatar_url: user.user_metadata?.avatar_url || '',
          created_at: user.created_at || '',
          updated_at: user.updated_at || '',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [user]);

  // Update profile information
  const handleUpdateProfile = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      
      // Update the profiles table
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Also update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: profileData.full_name,
        }
      });
      
      if (updateError) {
        throw updateError;
      }
      
      // Refresh session to get updated user data
      await refreshSession();
      
      toast({
        title: "Success",
        description: "Your profile has been updated",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-dsa-purple/5 to-dsa-purple-light/5 py-12 px-4">
      <div className="w-full max-w-3xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
        </div>
        
        {loading && !profileData.email ? (
          <div className="flex justify-center py-8">
            <RefreshCw className="animate-spin h-8 w-8 text-dsa-purple" />
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-[300px_1fr] gap-6">
              {/* Profile Summary Card */}
              <Card>
                <CardHeader className="flex flex-col items-center">
                  <Avatar className="h-32 w-32">
                    {profileData.avatar_url ? (
                      <AvatarImage src={profileData.avatar_url} alt={profileData.full_name} />
                    ) : (
                      <AvatarFallback className="text-3xl bg-dsa-purple/20">
                        {profileData.full_name.slice(0, 2).toUpperCase() || "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <CardTitle className="mt-4">{profileData.full_name}</CardTitle>
                  <div className="text-sm text-muted-foreground">{profileData.email}</div>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    {profileData.email === 'contact.chahar@gmail.com' ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Email verified</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 text-yellow-500" />
                        <span>Email pending verification</span>
                      </>
                    )}
                  </div>
                  <Separator className="my-2" />
                  <div>
                    <div className="text-muted-foreground">Member since</div>
                    <div>{new Date(profileData.created_at || Date.now()).toLocaleDateString()}</div>
                  </div>
                  <Separator className="my-2" />
                  <Button variant="outline" className="mt-2" onClick={signOut}>
                    Sign out
                  </Button>
                </CardContent>
              </Card>
              
              {/* Profile Edit Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        placeholder="Enter your full name"
                        value={profileData.full_name}
                        onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        readOnly
                        disabled
                        value={profileData.email}
                        className="pl-10 opacity-70"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleUpdateProfile} 
                    disabled={saving} 
                    className="w-full bg-dsa-purple hover:bg-dsa-purple/90"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Account Management Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Account Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Reset Password</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Receive an email to reset your password
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={async () => {
                      try {
                        const { error } = await supabase.auth.resetPasswordForEmail(profileData.email, {
                          redirectTo: `${window.location.origin}/auth/update-password`,
                        });
                        if (error) throw error;
                        toast({
                          title: "Password reset email sent",
                          description: "Check your email for the reset link",
                        });
                      } catch (error) {
                        console.error('Error sending reset password email:', error);
                        toast({
                          title: "Error",
                          description: "Failed to send password reset email",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    Send Password Reset Email
                  </Button>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold text-red-600 mb-2">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Permanently delete your account and all your data
                  </p>
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      const confirm = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
                      if (confirm) {
                        toast({
                          title: "Contact Admin",
                          description: "Please contact the administrator to delete your account",
                        });
                      }
                    }}
                  >
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage; 