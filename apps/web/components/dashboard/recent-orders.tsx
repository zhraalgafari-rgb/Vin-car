import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RecentOrders() {
  return (
    <Card>
      <CardHeader><CardTitle>Recent Orders</CardTitle></CardHeader>
      <CardContent><p className="text-muted-foreground">Recent orders will appear here.</p></CardContent>
    </Card>
  );
}
