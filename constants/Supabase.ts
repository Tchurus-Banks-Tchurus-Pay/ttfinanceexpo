import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const supabaseUrl = "https://nhbndiidngbfuhycsyla.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oYm5kaWlkbmdiZnVoeWNzeWxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTMyMjkwNTYsImV4cCI6MjAwODgwNTA1Nn0.F8Qm2e5bxDGLDGZMg879tnyUsomgI3uoNklW7Vw-iT0";

export const supabase = createClient(supabaseUrl, supabaseKey);
