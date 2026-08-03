import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SupplierCardProps {
  supplier: any;
}

export function SupplierCard({ supplier }: SupplierCardProps) {
  return (
    <Card>
      <CardHeader><CardTitle>{supplier.name}</CardTitle></CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{supplier.email} | {supplier.phone}</p>
      </CardContent>
    </Card>
  );
}
