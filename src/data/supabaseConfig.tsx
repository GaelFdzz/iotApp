import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient('https://hyfckuzlgbkzzkmfnypq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5ZmNrdXpsZ2JrenprbWZueXBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjUxNzM2OCwiZXhwIjoyMDU4MDkzMzY4fQ.1KSC-2uVhMRHPfeGA9FJRwi15gSZPUnWyrNb35e_giw')
