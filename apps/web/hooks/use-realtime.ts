import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@supabase/auth-helpers-react";

export function useRealtime<T>(
  channel: string,
  table: string,
  callback: (payload: T) => void
) {
  const user = useUser();

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    const channelObj = supabase
      .channel(channel)
      .on("postgres_changes", { event: "*", schema: "public", table }, callback)
      .subscribe();

    return () => {
      supabase.removeChannel(channelObj);
    };
  }, [channel, table, callback, user]);
}
