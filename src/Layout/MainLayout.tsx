import { Outlet } from "react-router";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset
} from "@/components/ui/sidebar";

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background/95 backdrop-blur-sm">
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b border-sidebar-border/30 bg-background/50 backdrop-blur-md">
          <SidebarTrigger className="-ml-1 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50" />
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <div className="h-8 w-px bg-sidebar-border/30" />
            <div className="text-xs text-sidebar-foreground/50 font-light">
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
