import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@supabase/auth-helpers-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Phone, Mail, Video } from "lucide-react";

interface ConversationListProps {
  vinId: string;
}

export function ConversationList({ vinId }: ConversationListProps) {
  const supabase = createClient();
  const user = useUser();

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["conversations", vinId],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("vin_id", vinId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user && !!vinId,
  });

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "whatsapp": return <Phone className="h-4 w-4" />;
      case "telegram": return <MessageSquare className="h-4 w-4" />;
      case "email": return <Mail className="h-4 w-4" />;
      case "voice": return <Video className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  if (isLoading) return <Card><CardContent className="p-6"><div className="animate-pulse space-y-2"><div className="h-4 bg-muted rounded w-full" /><div className="h-4 bg-muted rounded w-full" /></div></CardContent></Card>;

  return (
    <Card>
      <CardHeader><CardTitle>Conversations</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-2">
          {conversations.map((conv: any) => (
            <div key={conv.id} className="flex items-center gap-3 p-3 border rounded-lg">
              {getChannelIcon(conv.channel)}
              <div className="flex-1">
                <p className="font-medium text-sm">{conv.title || conv.channel}</p>
                <p className="text-xs text-muted-foreground">{conv.channel} • {conv.participants?.length || 0} participants</p>
              </div>
              <Badge variant="outline">{conv.channel}</Badge>
            </div>
          ))}
          {conversations.length === 0 && <p className="text-muted-foreground text-center py-4">No conversations yet</p>}
        </div>
      </CardContent>
    </Card>
  );
}
