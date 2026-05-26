import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://sxbjqxmuypsmshmllfr.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4YmpxeG11eXBzbXNobWxsZmZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MjM2NDMsImV4cCI6MjA5NTM5OTY0M30.ratpumU4RTprSEh6bqyIn_vYXmMxl3FE74UXS1mrfXY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
