import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SupplierListProps {
  vin: string;
}

export function SupplierList({ vin }: SupplierListProps) {
  return (
    <Card>
      <CardHeader><CardTitle>Suppliers for {vin}</CardTitle></CardHeader>
      <CardContent><p className="text-muted-foreground">Supplier list will be loaded here.</p></CardContent>
    </Card>
  );
}
