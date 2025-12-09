import { Suspense } from "react";
import { Metadata } from "next";
import { ProductsCatalog } from "@/components/products";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamic metadata for SEO
export const metadata: Metadata = {
  title: "Catálogo de Productos | Tienda UCN",
  description:
    "Explora nuestro catálogo completo de productos universitarios. Encuentra artículos de calidad con los mejores precios para estudiantes y funcionarios de la UCN.",
  keywords: [
    "productos universitarios",
    "tienda UCN",
    "artículos universitarios",
    "Universidad Católica del Norte",
  ],
  openGraph: {
    title: "Catálogo de Productos | Tienda UCN",
    description: "Explora nuestro catálogo completo de productos universitarios.",
    type: "website",
  },
};

// Loading skeleton component
function CatalogSkeleton() {
  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-8">
      <div className="mb-8">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="mt-2 h-5 w-96" />
      </div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-44" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex flex-col overflow-hidden rounded-xl border bg-card">
            <Skeleton className="aspect-square w-full" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-6 w-24 mt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <ProductsCatalog />
    </Suspense>
  );
}
