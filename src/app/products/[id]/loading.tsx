import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Imagen Principal */}
        <Skeleton className="aspect-square w-full rounded-xl" />

        {/* Información */}
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          <Skeleton className="h-24 w-full" /> {/* Descripción */}
          <div className="space-y-2">
            <Skeleton className="h-10 w-32" /> {/* Precio */}
            <Skeleton className="h-10 w-full" /> {/* Botón Añadir */}
          </div>
        </div>
      </div>
    </div>
  );
}
