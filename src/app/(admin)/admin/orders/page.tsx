"use client";

import { useState } from "react";
import { useAdminOrders } from "@/services/admin-orders";
import { AdminOrderSearchParams } from "@/models/admin.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Eye, RefreshCw } from "lucide-react";
import Link from "next/link";
import { formatCurrency, getOrderStatus } from "@/utils/format";
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
  const { data, isLoading, isError, refetch } = useAdminOrders(params);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams((prev) => ({ ...prev, page: 1, search: searchTerm }));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gestión de Pedidos</h1>
      <div className="flex gap-4">
        <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-md">
          <Input
            placeholder="Buscar por código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit">
            <Search className="h-4 w-4" />
          </Button>
        </form>
        <Select
          value={params.status}
          onValueChange={(val) => setParams((p) => ({ ...p, page: 1, status: val }))}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="Pending">Pendiente</SelectItem>
            <SelectItem value="Paid">Pagado</SelectItem>
            <SelectItem value="Shipped">Enviado</SelectItem>
            <SelectItem value="Delivered">Entregado</SelectItem>
            <SelectItem value="Cancelled">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <TableSkeleton rows={10} />
      ) : isError ? (
        <div className="flex flex-col items-center gap-4 py-10 border rounded-md">
          <p className="text-red-500 font-medium">No se pudieron cargar los pedidos</p>
          <Button onClick={() => refetch()} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" /> Reintentar
          </Button>
        </div>
      ) : (
        <div className="border rounded-md">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 uppercase">
              <tr>
                <th className="px-6 py-3">Código</th>
                <th className="px-6 py-3">Cliente</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data?.orders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/10">
                  <td className="px-6 py-4 font-mono">{order.code}</td>
                  <td className="px-6 py-4">{order.userEmail}</td>
                  <td className="px-6 py-4">{formatCurrency(order.total)}</td>
                  <td className="px-6 py-4">
                    <Badge className={getOrderStatus(order.status || "Pending").color}>
                      {getOrderStatus(order.status || "Pending").label}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-2" /> Detalle
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
