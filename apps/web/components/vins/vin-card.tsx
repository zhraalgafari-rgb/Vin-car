import { Link } from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car } from "lucide-react";
import { cn } from "@/lib/utils";

interface VinCardProps {
  vin: string;
  brand?: string;
  model?: string;
  year?: number;
  className?: string;
}

export function VinCard({ vin, brand, model, year, className }: VinCardProps) {
  return (
    <Card className={cn("hover:shadow-md transition-shadow cursor-pointer", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-mono">{vin}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {brand} {model} {year}
        </p>
      </CardContent>
    </Card>
  );
}
