import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const OrderDetailSkeleton = () => {
  return (
    <div className="container mx-auto p-4 md:py-8">
      {/* Back Button Skeleton */}
      <Button variant="ghost" disabled className="mb-6 pl-0">
        <ArrowLeft className="mr-2 h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </Button>

      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <div className="flex items-center gap-2 mt-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Order Items Skeleton */}
        <Card className="md:col-span-2">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-4">
                {/* Image Skeleton */}
                <Skeleton className="h-32 sm:h-24 w-full sm:w-24 rounded-md" />
                <div className="flex flex-1 flex-col justify-between gap-2">
                  <div>
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <Skeleton className="h-5 w-24 rounded-full" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Summary Skeleton */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="h-px bg-muted my-2" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-6 w-24" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};
