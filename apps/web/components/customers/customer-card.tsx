import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomerCardProps {
  customer: any;
}

export function CustomerCard({ customer }: CustomerCardProps) {
  return (
    <Card>
      <CardHeader><CardTitle>{customer.name}</CardTitle></CardHeader>
      <CardContent><p className="text-sm text-muted-foreground">{customer.email} | {customer.phone}</p></CardContent>
    </Card>
  );
}
