// 1. Supabase client library se createClient import kar rahe hain
import { createClient } from "@supabase/supabase-js";

// 2. .env.local se Supabase URL aur Anon Key nikal rahe hain
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 3. Poore app mein Supabase use karne ke liye single client instance export kar rahe hain
export const supabase = createClient(supabaseUrl, supabaseAnonKey);