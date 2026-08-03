import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Package, Truck, Users, AlertTriangle, Clock } from "lucide-react";

export function StatsCards() {
  const stats = [
    { title: "Total VINs", value: "1,234", icon: Car },
    { title: "Active Parts", value: "5,678", icon: Package },
    { title: "Suppliers", value: "89", icon: Truck },
    { title: "Pending Orders", value: "23", icon: Clock },
    { title: "Overdue", value: "7", icon: AlertTriangle },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{stat.value}</div></CardContent>
          </Card>
        );
      })}
    </div>
  );
}
