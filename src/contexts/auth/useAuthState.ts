
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthUser } from "./types";
import { UserProfileService } from "./userProfileService";

/**
 * Custom hook for managing authentication state
 */
export const useAuthState = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setIsLoading(false);
          }
          return;
        }

        if (session?.user && mounted) {
          console.log('Session found, loading user profile...');
          const userProfile = await UserProfileService.getUserProfile(session.user.id);
          if (mounted && userProfile) {
            setUser(userProfile);
            setIsAuthenticated(true);
            console.log('User authenticated successfully:', userProfile);
          } else if (mounted) {
            console.log('User profile not found');
            setUser(null);
            setIsAuthenticated(false);
          }
        } else if (mounted) {
          console.log('No session found');
          setUser(null);
          setIsAuthenticated(false);
        }

        if (mounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error in initializeAuth:', error);
        if (mounted) {
          setUser(null);
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state change:', event, session ? 'with session' : 'no session');
        
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null);
          setIsAuthenticated(false);
          setIsLoading(false);
          console.log('User signed out');
          return;
        }

        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in, loading profile...');
          const userProfile = await UserProfileService.getUserProfile(session.user.id);
          if (mounted && userProfile) {
            setUser(userProfile);
            setIsAuthenticated(true);
            console.log('User profile loaded after sign in:', userProfile);
          } else if (mounted) {
            console.log('Failed to load user profile after sign in');
            setUser(null);
            setIsAuthenticated(false);
          }
          if (mounted) {
            setIsLoading(false);
          }
        }
      }
    );

    // Initialize auth state
    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    setUser,
    setIsAuthenticated,
    setIsLoading
  };
};
