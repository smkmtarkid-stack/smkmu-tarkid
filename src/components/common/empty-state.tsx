import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon, className = "" }: EmptyStateProps) {
  return (
    <div className={`flex min-h-32 flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/30 px-6 py-10 text-center ${className}`}>
      {icon && <div className="mb-3 text-brand-primary/60">{icon}</div>}
      <p className="font-semibold text-foreground">{title}</p>
      {description && <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}
