import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@supabase/auth-helpers-react";
import { DataTable } from "@/components/tables/data-table";
import { customerColumns } from "@/components/customers/columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CustomerForm } from "@/components/customers/customer-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomerListProps {
  vinId: string;
}

export function CustomerList({ vinId }: CustomerListProps) {
  const supabase = createClient();
  const user = useUser();
  const [showForm, setShowForm] = useState(false);

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["customers", vinId],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("customers")
        .select("*")
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
        <CardTitle>Customers</CardTitle>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="mr-2 h-4 w-4" />{showForm ? "Cancel" : "Add Customer"}</Button>
      </CardHeader>
      <CardContent>
        {showForm && <CustomerForm onSaved={() => setShowForm(false)} />}
        <DataTable columns={customerColumns} data={customers} />
      </CardContent>
    </Card>
  );
}
