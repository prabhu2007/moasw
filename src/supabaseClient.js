import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hvwdkuoptfkpoahkgevk.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2d2RrdW9wdGZrcG9haGtnZXZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc4NjU2MDYsImV4cCI6MjA0MzQ0MTYwNn0.bKCUEjR7-phG9PZqDNLnxeAdT_BC6FsuQYbX4Kuzhuc';
//const supabase = createClient(supabaseUrl, supabaseKey);

export const supabase = createClient(supabaseUrl, supabaseKey);
