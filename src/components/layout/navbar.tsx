"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cart.store";

const emptySubscribe = () => () => {};

export function Navbar() {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <span className="font-bold">Tienda UCN</span>
          </Link>

          {/* Rutas corregidas */}
          <nav className="flex items-center gap-6 text-sm">
            <Link
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/products"
            >
              Productos
            </Link>

            <Link
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/categories"
            >
              Categorías
            </Link>

            <Link
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/about"
            >
              Acerca de
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center gap-2">
            <Link
              className="relative transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-2"
              href="/cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {isClient && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
              <span className="hidden sm:inline">Carrito</span>
            </Link>

            <Link
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/login"
            >
              Iniciar Sesión
            </Link>
          </nav>
        </div>
      </div>
    </nav>
  );
}
