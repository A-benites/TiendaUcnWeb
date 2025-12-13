"use client";

import { useOrderDetailQuery } from "@/services/orders";
import { useParams, useRouter } from "next/navigation";
import { formatCurrency, formatDate } from "@/utils/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Loader2, Download, Package, Calendar, FileText } from "lucide-react";
import Image from "next/image";

/**
 * <summary>
 * Page component to display the detailed information of a specific order.
 * </summary>
 * <remarks>
 * Uses the dynamic URL parameter [id] to fetch the specific order detail.
 * </remarks>
 * <returns>A React component rendering the order detail view.</returns>
 */
export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = Number(params.id);

  const { data, isLoading, isError } = useOrderDetailQuery(orderId);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Cargando detalle del pedido...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <p className="text-lg font-medium text-destructive">
          Error al cargar el detalle del pedido.
        </p>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <p className="text-lg text-muted-foreground">Pedido no encontrado o no autorizado.</p>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </div>
    );
  }

  const order = data;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Button
        onClick={() => router.back()}
        variant="ghost"
        className="mb-6 -ml-2 hover:bg-transparent hover:text-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al historial
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">Pedido #{order.code}</h1>
          <div className="flex items-center gap-2 text-muted-foreground mt-2">
            <Calendar className="h-4 w-4" />
            <p>
              Realizado el {order.createdAt ? formatDate(order.createdAt) : "Fecha no registrada"}
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className="text-sm py-1 px-3 border-primary/20 bg-primary/5 text-primary"
        >
          Completado
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Order Items */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Productos ({order.orderItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {order.orderItems.map((item) => (
              <div key={item.id} className="flex gap-4">
                {/* Product Image */}
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                  <Image
                    src={item.imageAtMoment || "/placeholder.png"}
                    alt={item.titleAtMoment}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-medium text-lg line-clamp-1">{item.titleAtMoment}</h3>
                    <div className="mt-1 flex text-sm text-muted-foreground">
                      <p className="border-r pr-2 mr-2">
                        Cantidad:{" "}
                        <span className="font-medium text-foreground">{item.quantity}</span>
                      </p>
                      <p>
                        Precio unitario:{" "}
                        <span className="font-medium text-foreground">
                          {formatCurrency(item.priceAtMoment)}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    {item.discountAtMoment > 0 ? (
                      <Badge
                        variant="secondary"
                        className="text-xs font-normal text-destructive bg-destructive/10"
                      >
                        -{item.discountAtMoment}% Descuento
                      </Badge>
                    ) : (
                      <span></span>
                    )}
                    <p className="font-bold text-lg">
                      {formatCurrency(
                        item.priceAtMoment * item.quantity * (1 - item.discountAtMoment / 100)
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Summary Totals */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Resumen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subTotal)}</span>
              </div>
              {/* You can add shipping or tax rows here if needed */}
              <Separator />
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-lg">Total Pagado</span>
                <span className="font-bold text-xl text-primary">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => alert("La función de descarga de PDF está pendiente.")}
              >
                <Download className="h-4 w-4" />
                Descargar Comprobante
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
