"use client";

import { createClient } from "@/lib/supabase/client";
import { SupabaseProvider as Provider } from "@supabase/auth-helpers-react";
import { ReactNode } from "react";

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  return <Provider supabaseClient={supabase}>{children}</Provider>;
}
