import { ThemeToggle } from "@/components/layout/theme-toggle";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { UserMenu } from "@/components/layout/user-menu";

export function Header() {
  return (
    <header className="h-[60px] border-b flex items-center justify-between px-6 bg-card">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold">Automotive Parts KMS</h1>
      </div>
      <div className="flex items-center gap-4">
        <NotificationBell />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
