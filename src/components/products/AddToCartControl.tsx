"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductDetail } from "@/models/product.types";
import { useCartStore } from "@/stores/cart.store";
import { ShoppingCart, Plus, Minus } from "lucide-react";

interface AddToCartControlProps {
  product: ProductDetail;
}

export function AddToCartControl({ product }: AddToCartControlProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const handleIncrement = () => {
    if (quantity < product.stock) setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleAddToCart = () => {
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

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center mt-6">
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
        
        <div className="w-12 text-center font-medium">
          {quantity}
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleIncrement}
          disabled={quantity >= product.stock}
          className="h-10 w-10"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Button onClick={handleAddToCart} className="w-full md:w-auto gap-2">
        <ShoppingCart className="h-4 w-4" />
        Agregar al Carrito
      </Button>

      <span className="text-sm text-muted-foreground">
        {product.stock} disponibles
      </span>
    </div>
  );
}