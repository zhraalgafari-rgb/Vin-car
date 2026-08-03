import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VehicleInfoProps {
  vin: string;
}

export function VehicleInfo({ vin }: VehicleInfoProps) {
  return (
    <Card>
      <CardHeader><CardTitle>Vehicle Information</CardTitle></CardHeader>
      <CardContent>
        <p className="text-muted-foreground">VIN: {vin}</p>
        <p className="text-muted-foreground">Vehicle details will be loaded here.</p>
      </CardContent>
    </Card>
  );
}
