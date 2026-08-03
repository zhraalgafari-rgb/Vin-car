import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@supabase/auth-helpers-react";

export function useVIN(vin: string | null) {
  const supabase = createClient();
  const user = useUser();

  return useQuery({
    queryKey: ["vin", vin],
    queryFn: async () => {
      if (!vin || !user) return null;
      const { data, error } = await supabase
        .from("vin_records")
        .select("*")
        .eq("vin", vin)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!vin && !!user,
  });
}

export function useVINs() {
  const supabase = createClient();
  const user = useUser();

  return useQuery({
    queryKey: ["vins"],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("vin_records")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });
}

export function useCreateVIN() {
  const supabase = createClient();
  const user = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vinData: { vin: string; [key: string]: unknown }) => {
      const { data, error } = await supabase
        .from("vin_records")
        .insert({ ...vinData, created_by: user?.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vins"] });
    },
  });
}
