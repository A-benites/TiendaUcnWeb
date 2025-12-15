"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ProductDetail } from "@/models/product.types";
import { useCartStore } from "@/stores/cart.store";
import { ShoppingCart, Plus, Minus, Check } from "lucide-react";
import { toast } from "sonner";

interface AddToCartControlProps {
  product: ProductDetail;
}

export function AddToCartControl({ product }: AddToCartControlProps) {
  const [quantity, setQuantity] = useState(1);
  const { items, addItem } = useCartStore();

  // Find item in cart to check current quantity
  const existingItem = items.find((i) => i.id === product.id);
  const inCartQty = existingItem?.quantity || 0;
  const remainingStock = product.stock - inCartQty;

  // Reset quantity to 1 when product changes or when added to cart
  useEffect(() => {
    // Solo actualiza si realmente cambió el producto o el stock en carrito
    if (quantity !== 1) {
      setQuantity(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id, inCartQty]);

  const handleIncrement = () => {
    if (quantity < remainingStock) setQuantity((prev) => prev + 1);
    else toast.error(`Solo quedan ${remainingStock} unidades disponibles para agregar`);
  };

  const handleDecrement = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    if (quantity > remainingStock) {
      toast.error("No hay suficiente stock disponible");
      return;
    }
    addItem(product, quantity);
  };

  // Si no hay stock o no está disponible
  if (product.stock === 0 || !product.isAvailable) {
    return (
      <Button disabled variant="secondary" className="w-full md:w-auto">
        Agotado
      </Button>
    );
  }

  // Si ya tiene todo el stock en el carrito
  if (remainingStock <= 0) {
    return (
      <div className="flex flex-col gap-2">
        <Button disabled variant="outline" className="w-full md:w-auto gap-2 border-primary text-primary">
          <Check className="h-4 w-4" />
          ¡Tienes todo el stock en el carrito!
        </Button>
        <p className="text-xs text-muted-foreground">
          Ya has agregado las {product.stock} unidades disponibles.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 mt-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDecrement}
            disabled={quantity <= 1}
            className="h-10 w-10"
          >
            <Minus className="h-4 w-4" />
          </Button>

          <div className="w-12 text-center font-medium">{quantity}</div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleIncrement}
            disabled={quantity >= remainingStock}
            className="h-10 w-10"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <Button onClick={handleAddToCart} className="w-full md:w-auto gap-2">
          <ShoppingCart className="h-4 w-4" />
          {inCartQty > 0 ? "Agregar más al Carrito" : "Agregar al Carrito"}
        </Button>

        <span className="text-sm text-muted-foreground">{product.stock} disponibles</span>
      </div>

      {inCartQty > 0 && (
        <p className="text-sm text-primary font-medium flex items-center gap-1.5">
          <Check className="h-3.5 w-3.5" />
          Tienes {inCartQty} unidades en tu carrito
        </p>
      )}
    </div>
  );
}
