import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@supabase/auth-helpers-react";

export function useSuppliers() {
  const supabase = createClient();
  const user = useUser();

  return useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });
}

export function useCreateSupplier() {
  const supabase = createClient();
  const user = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (supplierData: { [key: string]: unknown }) => {
      const { data, error } = await supabase
        .from("suppliers")
        .insert({ ...supplierData, created_by: user?.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
}
