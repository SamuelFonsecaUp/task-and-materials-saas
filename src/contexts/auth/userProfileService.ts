
import { supabase } from "@/integrations/supabase/client";
import { AuthUser, UserRole } from "./types";

/**
 * Service for handling user profile operations
 */
export class UserProfileService {
  /**
   * Get user profile from public.users table
   */
  static async getUserProfile(userId: string): Promise<AuthUser | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role as UserRole,
        avatar: data.avatar_url,
      };
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      return null;
    }
  }
}
