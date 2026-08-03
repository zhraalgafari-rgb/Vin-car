import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STATUS_COLORS } from "@/lib/constants";

interface OrderWorkflowProps {
  orders?: any[];
}

export function OrderWorkflow({ orders = [] }: OrderWorkflowProps) {
  const stages = [
    "new_request", "under_review", "ai_analysis_completed", "sent_to_supplier",
    "waiting_for_supplier_response", "quotation_received", "price_approved",
    "purchase_confirmed", "production", "shipping", "arrived", "delivered", "completed",
  ];

  return (
    <Card>
      <CardHeader><CardTitle>Order Pipeline</CardTitle></CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 overflow-x-auto pb-4">
          {stages.map((stage, i) => (
            <div key={stage} className="flex items-center gap-2 shrink-0">
              <div className={`w-3 h-3 rounded-full ${i < stages.length - 1 ? "bg-primary" : "bg-muted"}`} />
              <span className="text-xs whitespace-nowrap">{stage.replace(/_/g, " ")}</span>
              {i < stages.length - 1 && <div className="w-8 h-0.5 bg-border" />}
            </div>
          ))}
        </div>
        {orders.length > 0 && (
          <div className="mt-4 space-y-2">
            {orders.map((order: any) => (
              <div key={order.id} className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm font-mono">{order.order_number}</span>
                <Badge className={STATUS_COLORS[order.status] || "bg-gray-100 text-gray-800"}>
                  {order.status.replace(/_/g, " ")}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
