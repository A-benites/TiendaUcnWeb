import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-6 w-48" />
      </div>

      {/* Search Input Skeleton */}
      <div className="mb-8">
        <div className="max-w-md">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="flex flex-col h-full overflow-hidden">
            <CardHeader className="p-0">
              <Skeleton className="aspect-square w-full" />
            </CardHeader>
            <CardContent className="grow p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3 mb-3" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
