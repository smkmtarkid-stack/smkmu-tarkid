import "server-only";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export const APP_ROLES = ["superadmin", "admin", "siswa", "alumni"] as const;
export type AppRole = (typeof APP_ROLES)[number];

export async function requireRole(allowedRoles: readonly AppRole[]) {
  const supabase = await createServerSupabaseClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const email = claimsData?.claims?.email;

  if (typeof email !== "string") {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role, status")
    .eq("email", email)
    .maybeSingle();

  if (!profile || profile.status !== "active" || !allowedRoles.includes(profile.role as AppRole)) {
    redirect("/");
  }

  return { email, role: profile.role as AppRole };
}
