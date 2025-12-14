import { Skeleton } from "@/components/ui/skeleton";

// Skeleton para Tablas (Admin Products, Admin Orders, User Orders)
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4 w-full">
      {/* Barra de herramientas simulada */}
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>

      {/* Tabla */}
      <div className="border rounded-md">
        {/* Header */}
        <div className="h-12 border-b bg-muted/50 px-4 flex items-center gap-4">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 flex-1" />
        </div>

        {/* Filas */}
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center p-4 border-b last:border-0 gap-4">
            <Skeleton className="h-10 w-10 rounded-md shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-3 w-[150px]" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Skeleton para Listas de Tarjetas (si lo necesitas en el futuro)
export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 rounded-md border p-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );
}

// src/components/ui/skeletons.tsx (Agrega esto al final del archivo)

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Título */}
      <Skeleton className="h-10 w-48" />

      {/* Stats Grid (4 tarjetas pequeñas) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <div className="space-y-2 mt-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid (2 tarjetas grandes) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Gráfico Principal */}
        <div className="col-span-4 rounded-xl border bg-card p-6 shadow-sm">
          <Skeleton className="h-6 w-32 mb-6" />
          <Skeleton className="h-[200px] w-full rounded-md" />
        </div>

        {/* Ventas Recientes */}
        <div className="col-span-3 rounded-xl border bg-card p-6 shadow-sm">
          <Skeleton className="h-6 w-32 mb-6" />
          <div className="space-y-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
