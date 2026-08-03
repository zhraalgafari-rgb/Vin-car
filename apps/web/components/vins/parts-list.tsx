import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PartsListProps {
  vin: string;
}

export function PartsList({ vin }: PartsListProps) {
  return (
    <Card>
      <CardHeader><CardTitle>Parts for {vin}</CardTitle></CardHeader>
      <CardContent><p className="text-muted-foreground">Parts list will be loaded here.</p></CardContent>
    </Card>
  );
}
