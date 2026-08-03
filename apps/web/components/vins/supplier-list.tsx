import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@supabase/auth-helpers-react";
import { DataTable } from "@/components/tables/data-table";
import { supplierColumns } from "@/components/suppliers/columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { SupplierForm } from "@/components/suppliers/supplier-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SupplierListProps {
  vinId: string;
}

export function SupplierList({ vinId }: SupplierListProps) {
  const supabase = createClient();
  const user = useUser();
  const [showForm, setShowForm] = useState(false);

  const { data: suppliers = [], isLoading } = useQuery({
    queryKey: ["suppliers", vinId],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("suppliers")
        .select("*, supplier_quotes(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });

  if (isLoading) return <Card><CardContent className="p-6"><div className="animate-pulse space-y-2"><div className="h-4 bg-muted rounded w-full" /><div className="h-4 bg-muted rounded w-full" /></div></CardContent></Card>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Suppliers</CardTitle>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="mr-2 h-4 w-4" />{showForm ? "Cancel" : "Add Supplier"}</Button>
      </CardHeader>
      <CardContent>
        {showForm && <SupplierForm onSaved={() => setShowForm(false)} />}
        <DataTable columns={supplierColumns} data={suppliers} />
      </CardContent>
    </Card>
  );
}
