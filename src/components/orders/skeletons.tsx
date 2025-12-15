import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function OrdersListSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Title skeleton */}
            <Skeleton className="h-9 w-48 mb-8" />

            {/* Desktop table skeleton */}
            <div className="hidden sm:block border rounded-md overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50">
                        <tr>
                            {["Código", "Fecha", "Total", "Estado", "Acciones"].map((_, i) => (
                                <th key={i} className="px-6 py-3">
                                    <Skeleton className="h-4 w-20" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {Array.from({ length: 5 }).map((_, rowIndex) => (
                            <tr key={rowIndex}>
                                <td className="px-6 py-4">
                                    <Skeleton className="h-4 w-24" />
                                </td>
                                <td className="px-6 py-4">
                                    <Skeleton className="h-4 w-32" />
                                </td>
                                <td className="px-6 py-4">
                                    <Skeleton className="h-4 w-20" />
                                </td>
                                <td className="px-6 py-4">
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                </td>
                                <td className="px-6 py-4">
                                    <Skeleton className="h-8 w-24" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile cards skeleton */}
            <div className="sm:hidden space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <Skeleton className="h-5 w-28" />
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-5 w-24" />
                            </div>
                            <Skeleton className="h-9 w-full mt-2" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export function OrderDetailSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Back button */}
            <Skeleton className="h-10 w-32 mb-6" />

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-9 w-48" />
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Products column */}
                <div className="md:col-span-2 space-y-4">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex gap-4 items-center">
                                    <Skeleton className="h-16 w-16 rounded" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-40" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                    <Skeleton className="h-5 w-20" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Summary column */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-40" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <Skeleton className="h-px w-full" />
                            <div className="flex justify-between">
                                <Skeleton className="h-5 w-16" />
                                <Skeleton className="h-6 w-28" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
