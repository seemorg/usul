import { Skeleton } from "@/components/ui/skeleton";

export default function CollectionFormSkeleton() {
  return (
    <div className="max-w-2xl space-y-8">
      {/* Name field skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Description field skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-20 w-full" />
      </div>

      {/* Slug field skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Visibility field skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <div className="mt-2 space-y-2">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Submit button skeleton */}
      <div className="pt-4">
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}
