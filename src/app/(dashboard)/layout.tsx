import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <div className="hidden md:block shrink-0 w-64 fixed h-screen left-0 top-0 overflow-hidden">
        <DashboardSidebar />
      </div>
      
      <div className="flex-1 flex flex-col md:pl-64">
        <DashboardHeader />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
