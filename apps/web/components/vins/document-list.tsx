import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DocumentListProps {
  vin: string;
}

export function DocumentList({ vin }: DocumentListProps) {
  return (
    <Card>
      <CardHeader><CardTitle>Documents for {vin}</CardTitle></CardHeader>
      <CardContent><p className="text-muted-foreground">Document list will be loaded here.</p></CardContent>
    </Card>
  );
}
