import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    "https://mehkqondzeigwbgpotkr.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1laGtxb25kemVpZ3diZ3BvdGtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MTQwNjYsImV4cCI6MjA4MTM5MDA2Nn0.CKlqDmf6iczuzwPBNvksodXeQ-hwtheVwMAa0XFGXw8"
);
