import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Car,
  Package,
  Truck,
  Users,
  MessageSquare,
  FileText,
  Search,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/vins", label: "VINs", icon: Car },
  { href: "/dashboard/parts", label: "Parts Library", icon: Package },
  { href: "/dashboard/suppliers", label: "Suppliers", icon: Truck },
  { href: "/dashboard/customers", label: "Customers", icon: Users },
  { href: "/dashboard/orders", label: "Orders", icon: MessageSquare },
  { href: "/dashboard/documents", label: "Documents", icon: FileText },
  { href: "/dashboard/search", label: "Search", icon: Search },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "border-r bg-card transition-all duration-300 flex flex-col",
        collapsed ? "w-[60px]" : "w-[260px]"
      )}
    >
      <div className="flex h-[60px] items-center justify-between px-4 border-b">
        {!collapsed && (
          <Link href="/dashboard" className="font-bold text-lg">
            AutoParts KMS
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-accent"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
