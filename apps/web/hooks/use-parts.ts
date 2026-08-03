import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@supabase/auth-helpers-react";

export function useParts(vinId?: string) {
  const supabase = createClient();
  const user = useUser();

  return useQuery({
    queryKey: ["parts", vinId],
    queryFn: async () => {
      if (!user) return [];
      let query = supabase.from("parts").select("*").order("created_at", { ascending: false });
      if (vinId) query = query.eq("vin_id", vinId);
      const { data, error } = await query.limit(200);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });
}

export function useCreatePart() {
  const supabase = createClient();
  const user = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (partData: { vin_id?: string; [key: string]: unknown }) => {
      const { data, error } = await supabase
        .from("parts")
        .insert({ ...partData, created_by: user?.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parts"] });
    },
  });
}
