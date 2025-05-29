
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "./types";

/**
 * Authentication actions
 */
export class AuthActions {
  /**
   * Login function
   */
  static async login(email: string, password: string): Promise<void> {
    try {
      console.log('Attempting login...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      console.log('Login successful, auth state change will handle the rest');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  /**
   * Signup function
   */
  static async signup(email: string, password: string, name: string, role: UserRole = "client"): Promise<void> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          }
        }
      });

      if (error) {
        throw error;
      }

      console.log('Signup successful');
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  }

  /**
   * Logout function
   */
  static async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  }
}
