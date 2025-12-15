"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCartStore } from "@/stores/cart.store";
import {
  useUpdateQuantityMutation,
  useRemoveItemMutation,
  useClearCartMutation,
} from "@/hooks/useCart";
import { CartItemRow, RemoveItemDialog, ClearCartDialog } from "@/components/cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShoppingBag, ArrowLeft, Loader2, ShieldAlert, LogIn, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function CartPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, getTotalPrice } = useCartStore();

  // Estado para los modales
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  // Estados de carga para operaciones individuales
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);

  // Mutations de React Query
  const updateQuantityMutation = useUpdateQuantityMutation();
  const removeItemMutation = useRemoveItemMutation();
  const clearCartMutation = useClearCartMutation();

  // Verificar si es administrador
  const isAdmin =
    session?.user?.role?.toLowerCase() === "admin" ||
    session?.user?.role?.toLowerCase() === "administrador";

  const isAuthenticated = status === "authenticated";
  const isLoadingAuth = status === "loading";

  const totalPrice = getTotalPrice();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Obtener el nombre del producto a eliminar para el modal
  const itemToDeleteName = itemToDelete
    ? items.find((item) => item.id === itemToDelete)?.title
    : undefined;

  const handleUpdateQuantity = async (productId: number, quantity: number) => {
    setUpdatingItemId(productId);
    try {
      await updateQuantityMutation.mutateAsync({ productId, quantity });
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemoveItem = async () => {
    if (itemToDelete !== null) {
      try {
        await removeItemMutation.mutateAsync(itemToDelete);
        setItemToDelete(null);
      } catch {
        // El error ya se maneja en el hook
      }
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCartMutation.mutateAsync();
      setIsClearModalOpen(false);
    } catch {
      // El error ya se maneja en el hook
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para realizar una compra");
      router.push("/login?callbackUrl=/checkout");
      return;
    }

    if (isAdmin) {
      toast.error("Los administradores no pueden realizar compras");
      return;
    }

    router.push("/checkout");
  };

  // Carrito vacío
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <div className="mx-auto mb-4 w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle>Tu carrito está vacío</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              No has agregado ningún producto a tu carrito todavía.
            </p>
            <Link href="/products">
              <Button className="w-full">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Ver Productos
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Carrito de Compras</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de productos */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={(productId) => setItemToDelete(productId)}
              isUpdating={updatingItemId === item.id}
              isRemoving={removeItemMutation.isPending && itemToDelete === item.id}
            />
          ))}

          <Button
            variant="outline"
            onClick={() => setIsClearModalOpen(true)}
            className="w-full"
            disabled={clearCartMutation.isPending}
          >
            {clearCartMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Vaciando...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Vaciar Carrito
              </>
            )}
          </Button>
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Productos ({items.length})</span>
                  <span>{totalItems} unidades</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    ${totalPrice.toLocaleString("es-CL")}
                  </span>
                </div>
              </div>

              {/* Alertas de restricciones */}
              {!isLoadingAuth && !isAuthenticated && (
                <Alert variant="default" className="border-amber-500 bg-amber-50 dark:bg-amber-950">
                  <LogIn className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-amber-800 dark:text-amber-200">
                    Inicia sesión
                  </AlertTitle>
                  <AlertDescription className="text-amber-700 dark:text-amber-300">
                    Debes iniciar sesión para realizar una compra.
                  </AlertDescription>
                </Alert>
              )}

              {isAuthenticated && isAdmin && (
                <Alert variant="destructive">
                  <ShieldAlert className="h-4 w-4" />
                  <AlertTitle>Acceso restringido</AlertTitle>
                  <AlertDescription>
                    Los administradores no pueden realizar compras.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={isLoadingAuth || isAdmin}
              >
                {isLoadingAuth ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : !isAuthenticated ? (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Iniciar sesión para comprar
                  </>
                ) : isAdmin ? (
                  <>
                    <ShieldAlert className="mr-2 h-4 w-4" />
                    No disponible para admins
                  </>
                ) : (
                  "Proceder al Pago"
                )}
              </Button>
              <Link href="/products" className="w-full">
                <Button variant="outline" className="w-full">
                  Continuar Comprando
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Modal Confirmación Eliminar Item */}
      <RemoveItemDialog
        isOpen={itemToDelete !== null}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleRemoveItem}
        isLoading={removeItemMutation.isPending}
        productName={itemToDeleteName}
      />

      {/* Modal Confirmación Vaciar Carrito */}
      <ClearCartDialog
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={handleClearCart}
        isLoading={clearCartMutation.isPending}
      />
    </div>
  );
}
