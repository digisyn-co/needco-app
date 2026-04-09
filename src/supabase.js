import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mfrdfujhtragqzvalxqd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mcmRmdWpodHJhZ3F6dmFseHFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MjY5MDksImV4cCI6MjA5MTMwMjkwOX0.m4mGhbTeG9rwXt3Ccx2leoleeyM9bDJutobIrCvKqc0'

export const supabase = createClient(supabaseUrl, supabaseKey)
