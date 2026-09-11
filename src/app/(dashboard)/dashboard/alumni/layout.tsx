import { requireRole } from "@/lib/authorization";

export default async function AlumniDashboardLayout({ children }: { children: React.ReactNode }) {
  await requireRole(["alumni"]);
  return children;
}
