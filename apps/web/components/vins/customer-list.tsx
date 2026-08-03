import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomerListProps {
  vin: string;
}

export function CustomerList({ vin }: CustomerListProps) {
  return (
    <Card>
      <CardHeader><CardTitle>Customers for {vin}</CardTitle></CardHeader>
      <CardContent><p className="text-muted-foreground">Customer list will be loaded here.</p></CardContent>
    </Card>
  );
}
