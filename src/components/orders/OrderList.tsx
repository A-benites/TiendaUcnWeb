"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useOrdersQuery } from "@/services/orders";
import { OrderTable } from "./OrderTable";
import { OrdersTableSkeleton } from "./OrdersTableSkeleton";
import { Search, Loader2, RotateCcw, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const OrderList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Read initial values from URL
  const initialSearch = searchParams.get("code") ?? "";
  const initialPage = parseInt(searchParams.get("page") ?? "1", 10);
  const initialPageSize = parseInt(searchParams.get("pageSize") ?? "10", 10);

  // Local state
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Update URL when params change
  const updateURL = useCallback(
    (params: { code?: string; page?: number; pageSize?: number }) => {
      const newParams = new URLSearchParams();

      if (params.code) newParams.set("code", params.code);
      if (params.page && params.page > 1) newParams.set("page", params.page.toString());
      if (params.pageSize && params.pageSize !== 10)
        newParams.set("pageSize", params.pageSize.toString());

      const queryString = newParams.toString();
      startTransition(() => {
        router.push(queryString ? `/orders?${queryString}` : "/orders", { scroll: false });
      });
    },
    [router]
  );

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (search !== debouncedSearch) {
        setDebouncedSearch(search);
        setCurrentPage(1);
        updateURL({
          code: search || undefined,
          page: 1,
          pageSize,
        });
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [search, debouncedSearch, pageSize, updateURL]);

  // Track previous searchParams to detect URL changes (browser back/forward)
  const prevSearchParamsRef = useRef(searchParams.toString());

  // Sync URL changes to state (for browser back/forward)
  useEffect(() => {
    const currentParamsString = searchParams.toString();
    if (prevSearchParamsRef.current === currentParamsString) {
      return;
    }
    prevSearchParamsRef.current = currentParamsString;
    const urlSearch = searchParams.get("code") ?? "";
    const urlPage = parseInt(searchParams.get("page") ?? "1", 10);
    const urlPageSize = parseInt(searchParams.get("pageSize") ?? "10", 10);
    // Agrupa el estado en un solo objeto para evitar renders en cascada
    setState({
      search: urlSearch,
      debouncedSearch: urlSearch,
      currentPage: urlPage,
      pageSize: urlPageSize,
    });
  }, [searchParams]);

  // Nuevo: estado agrupado
  const [state, setState] = useState({
    search: initialSearch,
    debouncedSearch: initialSearch,
    currentPage: initialPage,
    pageSize: initialPageSize,
  });

  const { search, debouncedSearch, currentPage, pageSize } = state;

  const filter = {
    page: currentPage,
    pageSize,
    code: debouncedSearch || undefined,
  };

  const { data, isLoading, isError, isFetching } = useOrdersQuery(filter);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL({
      code: debouncedSearch || undefined,
      page,
      pageSize,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageSizeChange = (value: string) => {
    const newSize = parseInt(value, 10);
    setPageSize(newSize);
    setCurrentPage(1);
    updateURL({
      code: debouncedSearch || undefined,
      page: 1,
      pageSize: newSize,
    });
  };

  const handleClearSearch = () => {
    setSearch("");
    setDebouncedSearch("");
    setCurrentPage(1);
    updateURL({
      page: 1,
      pageSize,
    });
  };

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col items-center justify-center py-10 text-center gap-3 bg-red-50 dark:bg-red-950/20 p-6 rounded-lg border border-red-100 dark:border-red-900/30">
          <p className="text-lg font-medium text-red-800 dark:text-red-400">
            Error al cargar los pedidos.
          </p>
          <p className="text-sm text-red-600 dark:text-red-500">
            Por favor verifica tu conexión o intenta nuevamente más tarde.
          </p>
          <Button onClick={() => refetch()} variant="outline" className="gap-2 mt-2">
            <RefreshCw className="h-4 w-4" />
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Historial de Compras</h1>
            <p className="text-muted-foreground">
              Revisa el estado y detalles de tus pedidos anteriores.
            </p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-end sm:items-center justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Input
              type="text"
              placeholder="Buscar por código de pedido..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            {search && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Mostrar:</span>
            <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading State for Transitions */}
        {(isPending || (isFetching && !isLoading)) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
            <Loader2 className="h-4 w-4 animate-spin" />
            Actualizando resultados...
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <OrdersTableSkeleton />
        ) : !data || data.orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-background rounded-lg border border-dashed gap-4">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-xl font-semibold">
                {debouncedSearch
                  ? `No se encontraron pedidos con el código "${debouncedSearch}"`
                  : "No tienes pedidos en tu historial"}
              </p>
              <p className="text-muted-foreground">
                {debouncedSearch
                  ? "Intenta con otro código o limpia el filtro."
                  : "Tus compras aparecerán aquí una vez que realices un pedido."}
              </p>
            </div>
            {debouncedSearch && (
              <Button variant="link" onClick={handleClearSearch} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Limpiar búsqueda
              </Button>
            )}
          </div>
        ) : (
          <>
            <OrderTable orders={data.orders} />

            {data.totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination
                  currentPage={data.currentPage}
                  totalPages={data.totalPages}
                  onPageChange={handlePageChange}
                  isLoading={isFetching}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};