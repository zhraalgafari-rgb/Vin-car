import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrderTimelineProps {
  vin: string;
}

export function OrderTimeline({ vin }: OrderTimelineProps) {
  return (
    <Card>
      <CardHeader><CardTitle>Order Timeline for {vin}</CardTitle></CardHeader>
      <CardContent><p className="text-muted-foreground">Order timeline will be loaded here.</p></CardContent>
    </Card>
  );
}
