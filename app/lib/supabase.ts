import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://lnukvkkwuihxwnxucxsr.supabase.co"
const supabasePublishableKey = "sb_publishable_ZFRZ_4QwsrqvTNErfjViBg_0vKgh3BE"

export const supabase = createClient(
  supabaseUrl, 
  supabasePublishableKey
)