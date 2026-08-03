import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@supabase/auth-helpers-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, AlertCircle, Truck, Package, CreditCard } from "lucide-react";
import { STATUS_COLORS } from "@/lib/constants";

interface OrderTimelineProps {
  vinId: string;
}

export function OrderTimeline({ vinId }: OrderTimelineProps) {
  const supabase = createClient();
  const user = useUser();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders", vinId],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("orders")
        .select("*, vin_records(vin), parts(english_name), suppliers(name), customers(name)")
        .eq("vin_id", vinId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user && !!vinId,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new_request": return <Clock className="h-4 w-4" />;
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "cancelled": return <XCircle className="h-4 w-4" />;
      case "shipping": return <Truck className="h-4 w-4" />;
      case "production": return <Package className="h-4 w-4" />;
      case "price_approved": return <CreditCard className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (isLoading) return <Card><CardContent className="p-6"><div className="animate-pulse space-y-2"><div className="h-4 bg-muted rounded w-full" /><div className="h-4 bg-muted rounded w-full" /></div></CardContent></Card>;

  return (
    <Card>
      <CardHeader><CardTitle>Order Timeline</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order: any) => (
            <div key={order.id} className="flex items-start gap-3 p-3 border rounded-lg">
              <div className="mt-1">{getStatusIcon(order.status)}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{order.order_number}</span>
                  <Badge className={STATUS_COLORS[order.status] || "bg-gray-100 text-gray-800"}>
                    {order.status.replace(/_/g, " ")}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {order.parts?.english_name} • {order.suppliers?.name} • {order.customers?.name}
                </p>
                <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
          {orders.length === 0 && <p className="text-muted-foreground text-center py-4">No orders yet</p>}
        </div>
      </CardContent>
    </Card>
  );
}
