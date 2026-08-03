import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@supabase/auth-helpers-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AuditLog() {
  const supabase = createClient();
  const user = useUser();

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });

  if (isLoading) return <Card><CardContent className="p-6"><div className="animate-pulse space-y-2"><div className="h-4 bg-muted rounded w-full" /><div className="h-4 bg-muted rounded w-full" /></div></CardContent></Card>;

  return (
    <Card>
      <CardHeader><CardTitle>Audit Log</CardTitle></CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {logs.map((log: any) => (
              <div key={log.id} className="p-2 border rounded text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{log.action}</span>
                  <span className="text-muted-foreground">{log.entity_type}</span>
                </div>
                <p className="text-muted-foreground">{new Date(log.created_at).toLocaleString()}</p>
              </div>
            ))}
            {logs.length === 0 && <p className="text-muted-foreground text-center py-4">No audit logs</p>}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
