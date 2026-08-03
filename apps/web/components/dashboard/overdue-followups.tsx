import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OverdueFollowups() {
  return (
    <Card>
      <CardHeader><CardTitle>Overdue Follow-ups</CardTitle></CardHeader>
      <CardContent><p className="text-muted-foreground">No overdue follow-ups.</p></CardContent>
    </Card>
  );
}
