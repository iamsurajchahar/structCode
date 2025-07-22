// Add proper TypeScript typing for Supabase RPC functions

import { supabase } from './client';

export interface UserExistenceInfo {
  exists: boolean;
  is_confirmed: boolean;
  id?: string;
  created_at?: string;
  last_sign_in_at?: string;
}

/**
 * Checks if a user exists and whether their email is confirmed
 */
export async function checkUserExists(email: string) {
  // Use type assertion to bypass TypeScript checking
  return (supabase.rpc as any)('check_user_exists', {
    user_email: email
  }) as Promise<{
    data: UserExistenceInfo | null;
    error: any;
  }>;
}

/**
 * Manually confirms a user account by setting email_confirmed_at
 */
export async function manuallyConfirmUser(email: string) {
  // Use type assertion to bypass TypeScript checking
  return (supabase.rpc as any)('manually_confirm_user', {
    user_email: email
  }) as Promise<{
    data: null;
    error: any;
  }>;
}

export default {
  checkUserExists,
  manuallyConfirmUser
}; 