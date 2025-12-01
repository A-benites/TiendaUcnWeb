"use client";

import { useEffect, useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/common/ProductCard";
import { Pagination } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Search, Package, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const PAGE_SIZE = 12;

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce de búsqueda
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // Reset página al buscar
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading, isFetching, isError, error } = useProducts({
    search: debouncedSearch,
    page: currentPage,
    pageSize: PAGE_SIZE,
  });

  const products = data?.products ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalCount = data?.totalCount ?? 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll suave al inicio
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Skeleton loader para productos
  const ProductSkeleton = () => (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-card">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-6 w-24 mt-2" />
      </div>
    </div>
  );

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Productos</h1>
        <p className="mt-2 text-muted-foreground">
          Explora nuestro catálogo de productos universitarios
        </p>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar productos..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Info de resultados */}
        {!isLoading && (
          <p className="text-sm text-muted-foreground">
            {totalCount > 0 ? (
              <>
                Mostrando{" "}
                <span className="font-medium text-foreground">
                  {(currentPage - 1) * PAGE_SIZE + 1}-
                  {Math.min(currentPage * PAGE_SIZE, totalCount)}
                </span>{" "}
                de <span className="font-medium text-foreground">{totalCount}</span> productos
              </>
            ) : (
              "No se encontraron productos"
            )}
          </p>
        )}
      </div>

      {/* Estado de error */}
      {isError && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
            <Package className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Error al cargar productos</h3>
          <p className="mt-2 text-sm text-muted-foreground">{String(error)}</p>
        </div>
      )}

      {/* Loading inicial */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Grid de productos */}
      {!isLoading && !isError && (
        <>
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-4">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No se encontraron productos</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {debouncedSearch
                  ? `No hay resultados para "${debouncedSearch}"`
                  : "No hay productos disponibles en este momento"}
              </p>
            </div>
          ) : (
            <>
              {/* Indicador de carga durante fetch */}
              {isFetching && (
                <div className="mb-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Actualizando...
                </div>
              )}

              {/* Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Paginación */}
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  isLoading={isFetching}
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
