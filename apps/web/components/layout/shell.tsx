import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Suspense } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Suspense fallback={<div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
