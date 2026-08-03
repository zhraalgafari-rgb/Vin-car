import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@supabase/auth-helpers-react";

export function useSearch(query: string) {
  const supabase = createClient();
  const user = useUser();

  return useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      if (!query || !user) return [];
      const { data, error } = await supabase
        .from("vin_records")
        .select("*, parts(id, english_name, oem_number), customers(id, name), suppliers(id, name)")
        .or(`vin.ilike.%${query}%,brand.ilike.%${query}%,model.ilike.%${query}%,english_name.ilike.%${query}%,oem_number.ilike.%${query}%`)
        .limit(20);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!query && !!user,
  });
}
