// Supabase 配置
const SUPABASE_URL = 'https://fjebscpxvvrxbbcrmfzi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqZWJzY3B4dnZyeGJiY3JtZnppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwOTYyMjksImV4cCI6MjA4NzY3MjIyOX0.jpeU30Hp8BfCN6lg7bEFTOP3AwZa-RziWVYCeV8PrFA';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
