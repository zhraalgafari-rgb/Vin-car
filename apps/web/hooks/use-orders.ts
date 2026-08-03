import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@supabase/auth-helpers-react";

export function useOrders() {
  const supabase = createClient();
  const user = useUser();

  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("orders")
        .select("*, vin_records(vin), parts(english_name), customers(name), suppliers(name)")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });
}

export function useCreateOrder() {
  const supabase = createClient();
  const user = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: { [key: string]: unknown }) => {
      const { data, error } = await supabase
        .from("orders")
        .insert({ ...orderData, created_by: user?.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
