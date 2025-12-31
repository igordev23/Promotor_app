import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const SUPABASE_URL = "https://fonwtnxbxyursbmafqsu.supabase.co";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
  throw new Error(
    "A variável de ambiente SUPABASE_ANON_KEY não está definida."
  );
}

const supabase = createClient(SUPABASE_URL, supabaseAnonKey);

export default supabase;
