import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

let authInitPromise;

export async function ensureSupabaseSession() {
  if (!authInitPromise) {
    authInitPromise = (async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (session) {
        return session;
      }

      const { data, error } = await supabase.auth.signInAnonymously();

      if (error) {
        throw new Error(error.message || "Supabase anonymous sign-in failed.");
      }

      return data.session;
    })().catch((error) => {
      authInitPromise = null;
      throw error;
    });
  }

  return authInitPromise;
}
