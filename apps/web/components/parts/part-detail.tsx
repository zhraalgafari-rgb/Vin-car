import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@supabase/auth-helpers-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Download } from "lucide-react";

interface PartDetailProps {
  partId: string;
}

export function PartDetail({ partId }: PartDetailProps) {
  const supabase = createClient();
  const user = useUser();

  const { data: part, isLoading } = useQuery({
    queryKey: ["part", partId],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("parts")
        .select("*, oem_numbers(*), supplier_quotes(*), vin_records(vin)")
        .eq("id", partId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!partId,
  });

  if (isLoading) return <Card><CardContent className="p-6"><div className="animate-pulse space-y-2"><div className="h-4 bg-muted rounded w-1/2" /><div className="h-4 bg-muted rounded w-full" /></div></CardContent></Card>;

  if (!part) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{part.english_name}</CardTitle>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-muted-foreground">OEM Number:</span> {part.oem_number}</div>
          <div><span className="text-muted-foreground">Category:</span> {part.part_category}</div>
          <div><span className="text-muted-foreground">Status:</span> <Badge>{part.status}</Badge></div>
          <div><span className="text-muted-foreground">Quantity:</span> {part.quantity}</div>
          <div><span className="text-muted-foreground">VIN:</span> {part.vin_records?.vin}</div>
          <div><span className="text-muted-foreground">Brands:</span> {part.brands?.join(", ")}</div>
        </div>
        {part.notes && <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm">{part.notes}</div>}
      </CardContent>
    </Card>
  );
}
