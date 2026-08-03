import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PartCardProps {
  part: any;
}

export function PartCard({ part }: PartCardProps) {
  return (
    <Card>
      <CardHeader><CardTitle>{part.english_name}</CardTitle></CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">OEM: {part.oem_number}</p>
      </CardContent>
    </Card>
  );
}
