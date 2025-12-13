"use client";

import { useState } from "react";
import { useOrdersQuery } from "@/services/orders";
import { OrderTable } from "./OrderTable";
import { Search, ChevronLeft, ChevronRight, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * <summary>
 * Container component responsible for managing the state, fetching data,
 * and displaying the user's paginated order history.
 * </summary>
 * <remarks>
 * Handles pagination, search filtering by code, and displays loading/error/data states.
 * </remarks>
 * <returns>A React component rendering the order list view.</returns>
 */
export const OrderList = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [searchCode, setSearchCode] = useState("");
  const [codeFilter, setCodeFilter] = useState("");

  const filter = { page, pageSize, code: codeFilter };

  // Utiliza el hook que incluye la solución de contingencia
  const { data, isLoading, isError, isFetching } = useOrdersQuery(filter);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setCodeFilter(searchCode);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col justify-center items-center h-48 bg-gray-50 dark:bg-muted/30 rounded-lg gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Cargando historial de pedidos...</p>
        </div>
      </div>
    );
  }

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
        </div>
      </div>
    );
  }

  // Si la función getOrders maneja el 401/403, 'data' debería existir aquí (incluso si está vacío)
  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center py-20 bg-background rounded-lg border border-dashed">
          <p className="text-xl text-muted-foreground">No hay datos disponibles para mostrar.</p>
        </div>
      </div>
    );
  }

  const orderList = data;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Historial de Compras</h1>
          <p className="text-muted-foreground">
            Revisa el estado y detalles de tus pedidos anteriores.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-grow max-w-sm">
            <Input
              type="text"
              placeholder="Buscar por código de pedido..."
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          </div>
          <Button type="submit" disabled={isFetching}>
            {isFetching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Buscando...
              </>
            ) : (
              "Buscar"
            )}
          </Button>
        </form>

        {/* Order Table Display */}
        {orderList.orders.length > 0 ? (
          <>
            <OrderTable orders={orderList.orders} />

            {/* Pagination Controls */}
            <div className="flex justify-between items-center pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1 || isFetching}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" /> Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                Página <span className="font-medium text-foreground">{orderList.currentPage}</span>{" "}
                de <span className="font-medium text-foreground">{orderList.totalPages}</span>
                <span className="ml-2 hidden sm:inline-block text-xs">
                  ({orderList.totalCount} pedidos)
                </span>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => (prev < orderList.totalPages ? prev + 1 : prev))}
                disabled={page === orderList.totalPages || isFetching}
                className="gap-2"
              >
                Siguiente <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-background rounded-lg border border-dashed gap-4">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-xl font-semibold">
                {codeFilter
                  ? `No se encontraron pedidos con el código "${codeFilter}"`
                  : "No tienes pedidos en tu historial"}
              </p>
              <p className="text-muted-foreground">
                {codeFilter
                  ? "Intenta con otro código o limpia el filtro."
                  : "Tus compras aparecerán aquí una vez que realices un pedido."}
              </p>
            </div>
            {codeFilter && (
              <Button
                variant="link"
                onClick={() => {
                  setCodeFilter("");
                  setSearchCode("");
                }}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Ver todos los pedidos
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
