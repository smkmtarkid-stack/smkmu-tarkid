"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

interface LogoutButtonProps {
  compact?: boolean;
  onComplete?: () => void;
}

export function LogoutButton({ compact = false, onComplete }: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error("Gagal keluar akun. Silakan coba lagi.");
      setIsLoading(false);
      return;
    }

    onComplete?.();
    router.replace("/login");
    router.refresh();
  };

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={handleLogout}
      disabled={isLoading}
      className={compact
        ? "flex w-full items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 rounded-xl"
        : "w-full justify-start text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors font-medium"
      }
    >
      <LogOut className={compact ? "h-4 w-4" : "mr-2.5 h-4 w-4"} />
      {isLoading ? "Keluar..." : compact ? "Keluar Akun" : "Keluar Portal"}
    </Button>
  );
}
