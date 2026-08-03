import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function KnowledgeGraph() {
  return (
    <Card>
      <CardHeader><CardTitle>Knowledge Graph</CardTitle></CardHeader>
      <CardContent>
        <div className="h-[400px] flex items-center justify-center border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">Interactive knowledge graph visualization coming soon</p>
        </div>
      </CardContent>
    </Card>
  );
}
