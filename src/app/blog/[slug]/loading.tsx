import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-3xl space-y-4 mb-10">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-5/6" />
      </div>
      <Skeleton className="aspect-video w-full rounded-2xl mb-10" />
      <div className="space-y-4 max-w-3xl">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
        <Skeleton className="h-4 w-2/3" />
        <div className="py-4" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}
