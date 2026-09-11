import { requireRole } from "@/lib/authorization";

export default async function SiswaDashboardLayout({ children }: { children: React.ReactNode }) {
  await requireRole(["siswa"]);
  return children;
}
