import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ConversationListProps {
  vin: string;
}

export function ConversationList({ vin }: ConversationListProps) {
  return (
    <Card>
      <CardHeader><CardTitle>Conversations for {vin}</CardTitle></CardHeader>
      <CardContent><p className="text-muted-foreground">Conversation list will be loaded here.</p></CardContent>
    </Card>
  );
}
