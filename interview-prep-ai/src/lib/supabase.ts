import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://itkztuaanrytkuskuvai.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0a3p0dWFhbnJ5dGt1c2t1dmFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NTk2NDksImV4cCI6MjA3NzUzNTY0OX0.SdOXjVB-NACmvqiurH7q97iFbpltzCLQ9Lpvm2MFpvw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
