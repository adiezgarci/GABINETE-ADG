import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'http://sxbjqxmuypsmshmllfr.supabase.co'
const SUPABASE_KEY = 'sb_publishable_Saz8iGLGm1TmD0iEeLFMgg_2cQr2KW0'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
