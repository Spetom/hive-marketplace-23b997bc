// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zctmsuwlcvvvzezyncsl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjdG1zdXdsY3Z2dnplenluY3NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzODU5NjYsImV4cCI6MjA1OTk2MTk2Nn0.A4OL1yQEATglB9xpm1dxCoZDNG7Wg93PuGhRzmlV8F0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);