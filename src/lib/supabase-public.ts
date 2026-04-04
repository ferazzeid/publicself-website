import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Anonymous Supabase client for server-side reads (RPCs granted to anon).
 * No service role — do not use for privileged operations.
 */
export function createPublicSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createClient(url, anonKey);
}
