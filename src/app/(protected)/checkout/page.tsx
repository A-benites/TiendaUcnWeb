"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCartStore } from "@/stores/cart.store";
import { cartService } from "@/services/cart.service";
import { createOrder } from "@/services/orders";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, ShieldCheck, AlertCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";

// Helper para parsear precio (puede ser string "$1.500" o number)
const parsePrice = (price: string | number): number => {
  if (typeof price === "number") return price;
  return parseFloat(price.replace(/[^0-9]/g, "")) || 0;
};

export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { data: session } = useSession();
  const user = session?.user;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPrice = getTotalPrice();

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  const handleCheckout = async () => {
    // Basic Admin check (if user object has role, otherwise relying on backend)
    // Assuming backend returns 403 if admin tries to buy

    setIsLoading(true);
    setError(null);

    try {
      // 0. Asegurar que existe la cookie buyerId haciendo GET al carrito
      await cartService.getCart();

      // 1. Sync client cart to backend cart
      // We clear the backend cart first to ensure it matches the client's selection
      await cartService.clearCart();

      // Add all items to backend cart
      // using Promise.all for better performance
      await Promise.all(
        items.map((item) =>
          cartService.addItem({
            productId: item.id,
            quantity: item.quantity,
          })
        )
      );

      // 2. Create Order
      await createOrder();

      // 3. Clear client cart and redirect
      clearCart();

      // 4. Invalidate product queries to update stock (both list and individual products)
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });

      toast.success("¡Pedido realizado con éxito!");
      router.push("/checkout/success");
    } catch (err) {
      console.error("Checkout error:", err);
      const axiosError = err as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message || "Ocurrió un error al procesar el pedido.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button
        onClick={() => router.back()}
        variant="ghost"
        className="mb-4 pl-0 hover:bg-transparent hover:text-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al carrito
      </Button>

      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <ShieldCheck className="h-8 w-8 text-primary" />
        Finalizar Compra
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Productos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="relative h-16 w-16 bg-muted rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={item.mainImageURL || "/placeholder.png"}
                      alt={item.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium line-clamp-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} x ${parsePrice(item.finalPrice).toLocaleString("es-CL")}
                    </p>
                  </div>
                  <div className="text-right font-semibold">
                    ${(parsePrice(item.finalPrice) * item.quantity).toLocaleString("es-CL")}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* User Info Confirmation */}
          <Card>
            <CardHeader>
              <CardTitle>Datos del Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold">Nombre:</p>
                  <p>
                    {user?.firstName} {user?.lastName}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Email:</p>
                  <p>{user?.email}</p>
                </div>
                <div>
                  <p className="font-semibold">RUT:</p>
                  <p>{user?.rut}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment & Actions */}
        <div className="md:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Total a Pagar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-lg font-medium">
                <span>Subtotal</span>
                <span>${totalPrice.toLocaleString("es-CL")}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-2xl font-bold text-primary">
                <span>Total</span>
                <span>${totalPrice.toLocaleString("es-CL")}</span>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-md flex items-start gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  "Confirmar Compra"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
