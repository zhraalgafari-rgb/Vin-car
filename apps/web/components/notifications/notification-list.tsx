import { useNotifications, useMarkNotificationRead } from "@/hooks/use-notifications";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function NotificationList() {
  const { data: notifications = [] } = useNotifications();
  const markRead = useMarkNotificationRead();

  return (
    <div className="space-y-2">
      {notifications.map((n: any) => (
        <Card key={n.id} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{n.title}</p>
              <p className="text-sm text-muted-foreground">{n.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{n.created_at}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => markRead.mutate(n.id)}>
              Mark as read
            </Button>
          </div>
        </Card>
      ))}
      {notifications.length === 0 && <p className="text-muted-foreground text-center py-8">No notifications</p>}
    </div>
  );
}
