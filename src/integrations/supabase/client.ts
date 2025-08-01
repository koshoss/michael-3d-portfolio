// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zxyxyadmfmbiwkwylgdc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4eXh5YWRtZm1iaXdrd3lsZ2RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1NDg4MTUsImV4cCI6MjA2OTEyNDgxNX0.2fKOfiS352ryDWstbgCqz1_yFEVWzaAtPOfRpbeQXcQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});