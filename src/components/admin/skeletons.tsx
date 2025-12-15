import { Skeleton } from "@/components/ui/skeleton";

interface AdminTableSkeletonProps {
    columns: number;
    rows?: number;
}

export function AdminTableSkeleton({ columns, rows = 5 }: AdminTableSkeletonProps) {
    return (
        <div className="border rounded-md bg-white dark:bg-black overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-muted/50">
                    <tr>
                        {Array.from({ length: columns }).map((_, i) => (
                            <th key={i} className="px-6 py-3">
                                <Skeleton className="h-4 w-20" />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <tr key={rowIndex} className="animate-pulse">
                            {Array.from({ length: columns }).map((_, colIndex) => (
                                <td key={colIndex} className="px-6 py-4">
                                    <Skeleton
                                        className={`h-4 ${colIndex === columns - 1 ? "w-16 ml-auto" : "w-24"}`}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function OrdersTableSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header skeleton */}
            <Skeleton className="h-8 w-48" />

            {/* Filters skeleton */}
            <div className="flex gap-4">
                <div className="flex gap-2 w-full max-w-md">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-10" />
                </div>
                <Skeleton className="h-10 w-[200px]" />
            </div>

            {/* Table skeleton */}
            <AdminTableSkeleton columns={5} rows={5} />
        </div>
    );
}

export function AdminProductsTableSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header skeleton */}
            <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-40" />
            </div>

            {/* Filters skeleton */}
            <div className="flex gap-4 flex-wrap">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-10 w-40" />
            </div>

            {/* Table skeleton */}
            <AdminTableSkeleton columns={6} rows={8} />

            {/* Pagination skeleton */}
            <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-32" />
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-10" />
                    <Skeleton className="h-10 w-10" />
                    <Skeleton className="h-10 w-10" />
                </div>
            </div>
        </div>
    );
}

export function TaxonomyTableSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header skeleton */}
            <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-36" />
            </div>

            {/* Table skeleton */}
            <AdminTableSkeleton columns={3} rows={6} />
        </div>
    );
}

export function OrderDetailSkeleton() {
    return (
        <div className="space-y-6">
            {/* Back button skeleton */}
            <Skeleton className="h-10 w-24" />

            {/* Title skeleton */}
            <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-6 w-20" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Client info card */}
                <div className="border rounded-lg p-6 space-y-4">
                    <Skeleton className="h-6 w-40" />
                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-36" />
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </div>
                </div>

                {/* Order info card */}
                <div className="border rounded-lg p-6 space-y-4">
                    <Skeleton className="h-6 w-40" />
                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Products list skeleton */}
            <div className="border rounded-lg p-6 space-y-4">
                <Skeleton className="h-6 w-32" />
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex gap-4 items-center py-3 border-b last:border-0">
                        <Skeleton className="h-16 w-16 rounded" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-5 w-20" />
                    </div>
                ))}
            </div>
        </div>
    );
}
