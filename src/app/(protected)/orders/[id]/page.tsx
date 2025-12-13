"use client";

import { useOrderDetailQuery } from "@/services/orders";
import { useParams, useRouter } from "next/navigation";
import { formatCurrency, formatDate } from "@/utils/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
    <div className="container mx-auto p-4 md:py-8">
      <Button
        onClick={() => router.back()}
        variant="ghost"
        className="mb-6 pl-0 hover:bg-transparent hover:text-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al historial
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            Pedido #{order.code}
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground mt-2 text-sm md:text-base">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <p>
              Realizado el {order.createdAt ? formatDate(order.createdAt) : "Fecha no registrada"}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20">
          Completado
        </span>
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
              <div key={item.id} className="flex flex-col sm:flex-row gap-4">
                {/* Product Image */}
                <div className="relative h-32 sm:h-24 w-full sm:w-24 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                  <Image
                    src={item.imageAtMoment || "/placeholder.png"}
                    alt={item.titleAtMoment}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between gap-2">
                  <div>
                    <h3 className="font-medium text-base sm:text-lg line-clamp-2">{item.titleAtMoment}</h3>
                    <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-sm text-muted-foreground">
                      <p>
                        Cantidad:{" "}
                        <span className="font-medium text-foreground">{item.quantity}</span>
                      </p>
                      <span className="hidden sm:inline">•</span>
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
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-red-100 text-red-900 hover:bg-red-200">
                        -{item.discountAtMoment}% Descuento
                      </span>
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
