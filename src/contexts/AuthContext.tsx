
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { cleanupAuthState } from '@/lib/auth-utils';

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  linkedin_headline: string | null;
  profile_picture_url: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          // Defer loading the user profile to avoid potential deadlocks
          setTimeout(() => {
            fetchUserProfile(newSession.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      // First check if profile exists
      const { data: profileExists, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      if (checkError || !profileExists) {
        // Profile doesn't exist, create it using the user's metadata
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData?.user) {
          const firstName = userData.user.user_metadata?.first_name || '';
          const lastName = userData.user.user_metadata?.last_name || '';
          
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              first_name: firstName,
              last_name: lastName
            });
            
          if (insertError) {
            throw insertError;
          }
        }
      }
      
      // Now fetch the profile (either existing or newly created)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setProfile(data as Profile);
      } else {
        // This should not happen, but handle it just in case
        throw new Error("Profile not found after creation attempt");
      }
    } catch (error: any) {
      console.error('Error fetching user profile:', error.message);
      toast({
        variant: "destructive",
        title: "Error loading profile",
        description: "Failed to load profile information.",
      });
      
      // Don't sign out, but set profile to null
      setProfile(null);
    }
  };

  const signOut = async () => {
    try {
      // Clean up auth state
      cleanupAuthState();
      
      // Attempt global sign out
      await supabase.auth.signOut({ scope: 'global' });
      
      // Reset state
      setUser(null);
      setSession(null);
      setProfile(null);
      
      // Force page reload for a clean state
      window.location.href = '/auth';
      
    } catch (error: any) {
      console.error('Error signing out:', error.message);
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: "Failed to sign out. Please try again."
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
