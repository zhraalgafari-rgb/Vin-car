import { Badge } from "@/components/ui/badge";
import { STATUS_COLORS } from "@/lib/constants";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const colorClass = STATUS_COLORS[status] || "bg-gray-100 text-gray-800";
  return <Badge className={colorClass}>{status.replace(/_/g, " ")}</Badge>;
}
