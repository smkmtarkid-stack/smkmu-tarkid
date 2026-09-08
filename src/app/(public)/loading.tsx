export default function PublicLoading() {
  return (
    <div className="min-h-screen bg-background pt-24" aria-busy="true" aria-label="Memuat halaman">
      <div className="container-custom space-y-8 py-16">
        <div className="mx-auto h-10 w-2/3 animate-pulse rounded bg-muted" />
        <div className="mx-auto h-5 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-72 animate-pulse rounded-3xl bg-muted" />
      </div>
    </div>
  );
}
