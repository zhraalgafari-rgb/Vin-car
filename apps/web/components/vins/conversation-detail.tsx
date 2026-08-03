import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@supabase/auth-helpers-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Send, Phone, Mail, MessageSquare, Volume2 } from "lucide-react";

interface ConversationDetailProps {
  conversationId: string;
}

export function ConversationDetail({ conversationId }: ConversationDetailProps) {
  const supabase = createClient();
  const user = useUser();

  const { data: conversation, isLoading } = useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("conversations")
        .select("*, messages(*)")
        .eq("id", conversationId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!conversationId,
  });

  if (isLoading) return <Card><CardContent className="p-6"><div className="animate-pulse space-y-2"><div className="h-4 bg-muted rounded w-full" /><div className="h-4 bg-muted rounded w-full" /></div></CardContent></Card>;

  if (!conversation) return null;

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "whatsapp": return <Phone className="h-4 w-4" />;
      case "telegram": return <MessageSquare className="h-4 w-4" />;
      case "email": return <Mail className="h-4 w-4" />;
      case "voice": return <Volume2 className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getChannelIcon(conversation.channel)}
          {conversation.title || conversation.channel}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {conversation.messages?.map((msg: any) => (
              <div key={msg.id} className={`p-3 rounded-lg ${msg.sender_type === "internal" ? "bg-accent" : "bg-muted/50"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium">{msg.sender}</span>
                  <Badge variant="outline" className="text-xs">{msg.sender_type}</Badge>
                  <span className="text-xs text-muted-foreground">{msg.timestamp ? new Date(msg.timestamp).toLocaleString() : ""}</span>
                </div>
                <p className="text-sm">{msg.content}</p>
                {msg.ocr_extracted_text && (
                  <div className="mt-2 p-2 bg-background rounded text-xs">
                    <span className="text-muted-foreground">OCR:</span> {msg.ocr_extracted_text}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
