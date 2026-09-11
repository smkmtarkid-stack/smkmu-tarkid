import { requireRole } from "@/lib/authorization";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  await requireRole(["admin", "superadmin"]);
  return children;
}
