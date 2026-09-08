interface SectionSkeletonProps {
  variant?: "card" | "list" | "image";
  count?: number;
}

export function SectionSkeleton({ variant = "card", count = 3 }: SectionSkeletonProps) {
  return (
    <div className={variant === "list" ? "space-y-4" : "grid grid-cols-1 gap-6 md:grid-cols-3"} aria-busy="true" aria-label="Memuat konten">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={variant === "list" ? "flex gap-4 rounded-xl border p-4" : "overflow-hidden rounded-2xl border bg-card"}
        >
          <div className={variant === "list" ? "h-16 w-16 shrink-0 rounded-lg" : "h-44 w-full"}>
            <div className="h-full w-full animate-pulse rounded-lg bg-muted" />
          </div>
          <div className={variant === "list" ? "flex-1 space-y-3" : "space-y-3 p-5"}>
            <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
            <div className="h-5 w-4/5 animate-pulse rounded bg-muted" />
            <div className="h-3 w-full animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
