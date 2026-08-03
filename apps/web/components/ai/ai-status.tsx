import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, ScanEye, Type, ImageIcon, Link } from "lucide-react";

interface AIStatusProps {
  status: "idle" | "processing" | "completed" | "error";
  progress: number;
  step: string;
}

export function AIStatus({ status, progress, step }: AIStatusProps) {
  const steps = [
    { name: "OCR Processing", icon: ScanEye },
    { name: "Text Extraction", icon: Type },
    { name: "Image Analysis", icon: ImageIcon },
    { name: "Entity Linking", icon: Link },
  ];

  const currentStepIndex = steps.findIndex(s => s.name === step);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Processing
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress value={progress} />
          <div className="space-y-2">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const isActive = i <= currentStepIndex;
              const isCurrent = i === currentStepIndex;
              return (
                <div key={s.name} className={`flex items-center gap-2 text-sm ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                  <Icon className={`h-4 w-4 ${isCurrent ? "animate-pulse" : ""}`} />
                  <span>{s.name}</span>
                  {isActive && <span className="ml-auto text-xs text-green-600">Done</span>}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
