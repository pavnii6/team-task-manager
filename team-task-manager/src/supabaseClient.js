import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase env vars. Check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Persist session in localStorage
    persistSession: true,
    // Auto-refresh tokens before they expire
    autoRefreshToken: true,
    // Detect session from URL (for magic links / OAuth callbacks)
    detectSessionInUrl: true,
  },
})
