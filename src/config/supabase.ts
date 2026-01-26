import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://fonwtnxbxyursbmafqsu.supabase.co";
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "test_dummy_key";

const supabase = createClient(SUPABASE_URL, supabaseAnonKey);

export default supabase;