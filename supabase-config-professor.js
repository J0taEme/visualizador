import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const supabase = createClient(
  "https://nygrgpkqibbbydwyabdj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55Z3JncGtxaWJiYnlkd3lhYmRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4Njg0MzYsImV4cCI6MjEwMzQ0NDQzNn0.yaTJMO88RZbhh1fdJOcfLa_ro0bi6u_vQfps_cbrjGA",
  {
    auth: {
      storageKey: "painel-professor-auth",
    }
  }
);
