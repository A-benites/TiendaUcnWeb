"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { CheckCircle2, Package, ShoppingBag } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="mx-auto mb-4 h-20 w-20 bg-green-100 rounded-full flex items-center justify-center dark:bg-green-900/30">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-3xl">¡Gracias por tu compra!</CardTitle>
          <CardDescription className="text-lg mt-2">
            Tu pedido ha sido procesado correctamente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Hemos enviado un correo de confirmación con los detalles de tu pedido. Puedes revisar el
            estado de tu compra en tu historial.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Link href="/orders" className="w-full">
            <Button className="w-full" size="lg">
              <Package className="mr-2 h-4 w-4" />
              Ver mis Pedidos
            </Button>
          </Link>
          <Link href="/products" className="w-full">
            <Button variant="outline" className="w-full">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Seguir Comprando
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
