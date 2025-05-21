
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
    // Check for existing session first
    const initAuth = async () => {
      try {
        // Check for existing session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession?.user) {
          console.log("Found existing session for user:", currentSession.user.email);
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Defer profile loading to avoid potential race conditions
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id);
          }, 0);
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initAuth();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state changed:", event, "User:", newSession?.user?.email);
        
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Handle profile loading based on auth events
        if (event === 'SIGNED_IN' && newSession?.user) {
          console.log("Signed in event detected");
          
          // Use setTimeout to avoid potential race conditions
          setTimeout(() => {
            fetchUserProfile(newSession.user.id);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          console.log("Signed out event detected");
          setProfile(null);
        }
      }
    );

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    console.log("Fetching profile for user ID:", userId);
    try {
      // First check if profile exists
      const { data: profileExists, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle instead of single to avoid errors when no profile is found

      if (checkError || !profileExists) {
        console.log("Profile doesn't exist, creating one");
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
            console.error("Error creating profile:", insertError);
            throw insertError;
          } else {
            console.log("Profile created successfully");
          }
        }
      } else {
        console.log("Profile exists, proceeding to fetch");
      }
      
      // Now fetch the profile (either existing or newly created)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle instead of single

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }

      if (data) {
        console.log("Profile data loaded successfully:", data);
        setProfile(data as Profile);
      } else {
        console.warn("No profile data returned");
        // This can happen if the profile was just created but isn't available yet due to database propagation
        // Set profile to a minimal object with just the ID to prevent repeated creation attempts
        setProfile({ id: userId, first_name: null, last_name: null, linkedin_headline: null, profile_picture_url: null });
      }
    } catch (error: any) {
      console.error('Error in profile flow:', error.message);
      toast({
        variant: "destructive",
        title: "Error loading profile",
        description: "Failed to load profile information. We'll continue without it for now.",
      });
      
      // Don't sign out, but set profile to a minimal object with just the ID
      // This prevents a sign-out loop by ensuring there's at least an ID to work with
      setProfile({ id: userId, first_name: null, last_name: null, linkedin_headline: null, profile_picture_url: null });
    }
  };

  const signOut = async () => {
    console.log("Signing out...");
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
