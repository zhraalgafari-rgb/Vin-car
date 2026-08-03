import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@supabase/auth-helpers-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Engine, Fuel, Gauge, Cpu, Weight } from "lucide-react";

interface VehicleInfoProps {
  vin: string;
}

export function VehicleInfo({ vin }: VehicleInfoProps) {
  const supabase = createClient();
  const user = useUser();

  const { data: vehicle, isLoading } = useQuery({
    queryKey: ["vehicle", vin],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("vin_records")
        .select("*")
        .eq("vin", vin)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!vin,
  });

  if (isLoading) {
    return <Card><CardContent className="p-6"><div className="animate-pulse space-y-2"><div className="h-4 bg-muted rounded w-1/4" /><div className="h-4 bg-muted rounded w-1/2" /></div></CardContent></Card>;
  }

  if (!vehicle) return null;

  const specs = [
    { label: "Manufacturer", value: vehicle.manufacturer, icon: Car },
    { label: "Brand", value: vehicle.brand, icon: Car },
    { label: "Model", value: vehicle.model, icon: Car },
    { label: "Year", value: String(vehicle.production_year), icon: Car },
    { label: "Engine Code", value: vehicle.engine_code, icon: Engine },
    { label: "Engine Size", value: vehicle.engine_size, icon: Gauge },
    { label: "Fuel Type", value: vehicle.fuel_type, icon: Fuel },
    { label: "Transmission", value: vehicle.transmission, icon: Cpu },
    { label: "Drive Type", value: vehicle.drive_type, icon: Gauge },
    { label: "Body Style", value: vehicle.body_style, icon: Car },
    { label: "Trim Level", value: vehicle.trim_level, icon: Car },
    { label: "Market", value: vehicle.market, icon: Car },
    { label: "Country of Origin", value: vehicle.country_of_origin, icon: Car },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          Vehicle Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div className="font-mono text-2xl font-bold">{vehicle.vin}</div>
          <Badge variant="secondary">{vehicle.brand} {vehicle.model}</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {specs.map((spec) => {
            const Icon = spec.icon;
            return (
              <div key={spec.label} className="flex items-center gap-2 text-sm">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{spec.label}:</span>
                <span className="font-medium">{spec.value || "—"}</span>
              </div>
            );
          })}
        </div>
        {vehicle.notes && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm">{vehicle.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
