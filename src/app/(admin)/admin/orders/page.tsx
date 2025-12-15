"use client";

import { useState } from "react";
import { useAdminOrders } from "@/services/admin-orders";
import { AdminOrderSearchParams } from "@/models/admin.types";
import { OrdersTableSkeleton } from "@/components/admin/skeletons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Eye, ShoppingBag, ChevronLeft, ChevronRight, Filter, X } from "lucide-react";
import Link from "next/link";
import { formatCurrency, getOrderStatus, formatDate } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/ui/skeletons";

export default function AdminOrdersPage() {
  const [params, setParams] = useState<AdminOrderSearchParams>({
    page: 1,
    pageSize: 10,
    search: "",
    status: "all",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, isFetching } = useAdminOrders(params);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams((prev) => ({ ...prev, page: 1, search: searchTerm }));
  };

  const handlePageChange = (newPage: number) => {
    if (data && newPage > 0 && newPage <= data.totalPages) {
      setParams((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setParams({
      page: 1,
      pageSize: 10,
      search: "",
      status: "all",
    });
  };

  const hasActiveFilters = params.search || (params.status && params.status !== "all");

  if (isLoading) return <OrdersTableSkeleton />;

  const orders = data?.orders || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6" /> Gestión de Pedidos
        </h1>
      </div>

      {/* Filtros responsive con mejor UI */}
      <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Filter className="h-4 w-4" /> Filtros
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
            <Button type="submit" disabled={isFetching}>
              Buscar
            </Button>
          </form>

          <Select
            value={params.status}
            onValueChange={(val) => setParams((p) => ({ ...p, page: 1, status: val }))}
          >
            <SelectTrigger className="w-full sm:w-[180px] bg-background">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="Pending">Pendiente</SelectItem>
              <SelectItem value="Paid">Pagado</SelectItem>
              <SelectItem value="Shipped">Enviado</SelectItem>
              <SelectItem value="Delivered">Entregado</SelectItem>
              <SelectItem value="Cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="gap-1 bg-background"
            >
              <X className="h-4 w-4" /> Limpiar
            </Button>
          )}
        </div>
      </div>

      {/* Vista Desktop - Tabla */}
      <div className="hidden md:block border rounded-md overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 uppercase text-xs">
            <tr>
              <th className="px-4 lg:px-6 py-3">Código</th>
              <th className="px-4 lg:px-6 py-3">Fecha</th>
              <th className="px-4 lg:px-6 py-3">Cliente</th>
              <th className="px-4 lg:px-6 py-3">Total</th>
              <th className="px-4 lg:px-6 py-3">Estado</th>
              <th className="px-4 lg:px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-muted/10">
                <td className="px-4 lg:px-6 py-4 font-mono text-sm">{order.code}</td>
                <td className="px-4 lg:px-6 py-4 text-muted-foreground text-sm">
                  {order.createdAt ? formatDate(order.createdAt) : "N/A"}
                </td>
                <td className="px-4 lg:px-6 py-4">
                  <div>
                    <p className="font-medium">{order.userName || "N/A"}</p>
                    <p className="text-xs text-muted-foreground">{order.userEmail || "N/A"}</p>
                  </div>
                </td>
                <td className="px-4 lg:px-6 py-4 font-semibold">{formatCurrency(order.total)}</td>
                <td className="px-4 lg:px-6 py-4">
                  <Badge className={getOrderStatus(order.status || "Pending").color}>
                    {getOrderStatus(order.status || "Pending").label}
                  </Badge>
                </td>
                <td className="px-4 lg:px-6 py-4 text-center">
                  <Link href={`/admin/orders/${order.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-2" /> Detalle
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                  No se encontraron pedidos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Vista Mobile - Cards */}
      <div className="md:hidden space-y-3">
        {orders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border rounded-lg">
            No se encontraron pedidos.
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4 space-y-3 bg-background">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono font-medium">{order.code}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.createdAt ? formatDate(order.createdAt) : "N/A"}
                  </p>
                </div>
                <Badge className={getOrderStatus(order.status || "Pending").color}>
                  {getOrderStatus(order.status || "Pending").label}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-muted-foreground">Cliente</p>
                  <p className="font-medium">{order.userName || order.userEmail || "N/A"}</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-bold text-primary">{formatCurrency(order.total)}</p>
                </div>
              </div>
              <Link href={`/admin/orders/${order.id}`} className="block">
                <Button variant="outline" size="sm" className="w-full">
                  <Eye className="h-4 w-4 mr-2" /> Ver Detalle
                </Button>
              </Link>
            </div>
          ))
        )}
      </div>

      {/* Paginación */}
      {data && data.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t">
          <span className="text-sm text-muted-foreground">
            Página {data.currentPage} de {data.totalPages} ({data.totalCount} pedidos)
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(params.page - 1)}
              disabled={params.page === 1 || isFetching}
            >
              <ChevronLeft className="h-4 w-4" /> Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(params.page + 1)}
              disabled={params.page === data.totalPages || isFetching}
            >
              Siguiente <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
