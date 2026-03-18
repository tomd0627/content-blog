import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-48" />
      </div>
      <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))" }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-video w-full rounded-xl" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
