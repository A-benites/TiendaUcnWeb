"use client";

import { useParams, useRouter } from "next/navigation";
import { useAdminOrderDetail, useUpdateOrderStatus } from "@/services/admin-orders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, Package, User, Mail, Calendar, CreditCard, Truck } from "lucide-react";
import { formatCurrency, formatDate, getOrderStatus } from "@/utils/format";
import Image from "next/image";
import { toast } from "sonner";

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { data: order, isLoading, refetch } = useAdminOrderDetail(id);
  const statusMutation = useUpdateOrderStatus();

  const handleStatusChange = (newStatus: string) => {
    statusMutation.mutate({ id, status: newStatus }, { onSuccess: () => refetch() });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  if (!order) {
    return <div className="p-10 text-center">Pedido no encontrado</div>;
  }

  // ACCESO SEGURO A LA LISTA DE PRODUCTOS
  // Usamos orderItems que es lo que viene del backend
  const items = order.orderItems || [];

  // Estado actual (asegúrate de que tu backend envíe 'status', si no, esto saldrá 'Pendiente')
  const currentStatusString = order.status || "Pending";
  const currentStatusInfo = getOrderStatus(currentStatusString);

  return (
    <div className="container mx-auto p-4 md:py-8 max-w-6xl animate-in fade-in zoom-in-95 duration-500">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 pl-0 hover:bg-transparent hover:text-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Pedidos
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            Pedido <span className="font-mono text-primary">#{order.code}</span>
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Calendar className="h-4 w-4" /> {formatDate(order.createdAt)}
          </p>
        </div>

        {/* Tarjeta de Control de Estado */}
        <Card className="border-primary/20 shadow-sm bg-muted/30">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">
                Estado Actual
              </span>
              <Badge className={`mt-1 ${currentStatusInfo.color}`}>{currentStatusInfo.label}</Badge>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">
                Cambiar a
              </span>
              <Select
                value={currentStatusString}
                onValueChange={handleStatusChange}
                disabled={statusMutation.isPending}
              >
                <SelectTrigger className="w-[140px] h-8 text-xs bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pendiente</SelectItem>
                  <SelectItem value="Paid">Pagado</SelectItem>
                  <SelectItem value="Shipped">Enviado</SelectItem>
                  <SelectItem value="Delivered">Entregado</SelectItem>
                  <SelectItem value="Cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Productos */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="bg-muted/10 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5 text-primary" /> Productos ({items.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {items.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    No se encontraron items.
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-6 hover:bg-muted/5 transition-colors"
                    >
                      <div className="relative h-20 w-20 bg-white rounded-lg border shadow-sm overflow-hidden shrink-0">
                        <Image
                          src={item.imageAtMoment || "/placeholder.png"}
                          alt={item.titleAtMoment}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-semibold text-base">{item.titleAtMoment}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {item.descriptionAtMoment}
                          </p>
                        </div>
                        <div className="flex justify-between items-end mt-2">
                          <span className="text-sm font-medium bg-muted px-2 py-1 rounded">
                            {item.quantity} x {formatCurrency(item.priceAtMoment)}
                          </span>
                          <span className="font-bold text-lg text-primary">
                            {formatCurrency(item.priceAtMoment * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumen */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4 text-primary" /> Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {order.userName ? order.userName.charAt(0) : "U"}
                </div>
                <div>
                  <p className="font-medium">{order.userName || "Nombre no disponible"}</p>
                  <p className="text-xs text-muted-foreground">ID: {order.userId || "N/A"}</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />{" "}
                  <span>{order.userEmail || "Email no disponible"}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Truck className="h-4 w-4" /> <span>Retiro en Campus</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 shadow-md">
            <CardHeader className="bg-primary/5 pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <CreditCard className="h-4 w-4 text-primary" /> Totales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(order.subTotal)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(order.total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
