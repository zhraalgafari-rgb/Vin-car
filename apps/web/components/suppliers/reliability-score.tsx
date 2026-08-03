import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";

interface ReliabilityScoreProps {
  score: number;
  rating: number;
}

export function ReliabilityScore({ score, rating }: ReliabilityScoreProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Reliability</span>
          <span className="text-sm font-bold">{Math.round(score * 100)}%</span>
        </div>
        <Progress value={score * 100} className="mb-2" />
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-3 w-3 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
          ))}
          <span className="text-xs text-muted-foreground ml-1">{rating}/5</span>
        </div>
      </CardContent>
    </Card>
  );
}
