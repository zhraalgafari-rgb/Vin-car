import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@supabase/auth-helpers-react";
import { DataTable } from "@/components/tables/data-table";
import { partColumns } from "@/components/parts/columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { PartForm } from "@/components/parts/part-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PartsListProps {
  vinId: string;
}

export function PartsList({ vinId }: PartsListProps) {
  const supabase = createClient();
  const user = useUser();
  const [showForm, setShowForm] = useState(false);

  const { data: parts = [], isLoading } = useQuery({
    queryKey: ["parts", vinId],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("parts")
        .select("*")
        .eq("vin_id", vinId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user && !!vinId,
  });

  if (isLoading) {
    return <Card><CardContent className="p-6"><div className="animate-pulse space-y-2"><div className="h-4 bg-muted rounded w-full" /><div className="h-4 bg-muted rounded w-full" /></div></CardContent></Card>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Parts Library</CardTitle>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          {showForm ? "Cancel" : "Add Part"}
        </Button>
      </CardHeader>
      <CardContent>
        {showForm && <PartForm vinId={vinId} onSaved={() => setShowForm(false)} />}
        <DataTable columns={partColumns} data={parts} />
      </CardContent>
    </Card>
  );
}
