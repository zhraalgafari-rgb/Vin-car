import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "card" | "table" | "chart";
}

export function Skeleton({ className, variant = "text" }: SkeletonProps) {
  const baseClasses = "animate-pulse bg-muted rounded";

  const variantClasses = {
    text: "h-4 w-full",
    card: "h-32 w-full",
    table: "h-8 w-full",
    chart: "h-48 w-full",
  };

  return <div className={cn(baseClasses, variantClasses[variant], className)} />;
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-4 w-${100 - i * 20}%`} />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="space-y-3 p-4">
      <Skeleton variant="text" className="h-4 w-1/4" />
      <Skeleton variant="text" className="h-4 w-full" />
      <Skeleton variant="text" className="h-4 w-3/4" />
    </div>
  );
}
