"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/models/product.types";
import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const [imgError, setImgError] = useState(false);
  const img = product.mainImageURL || "/placeholder.png";
  const hasDiscount = product.discount > 0;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      {/* Badge de descuento */}
      {hasDiscount && (
        <div className="absolute left-3 top-3 z-10 rounded-full bg-red-500 px-2.5 py-1 text-xs font-semibold text-white">
          -{product.discount}%
        </div>
      )}

      {/* Imagen */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        {!imgError ? (
          <Image
            src={img}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-4">
        {/* Categoría */}
        <span className="text-xs font-medium text-muted-foreground">{product.categoryName}</span>

        {/* Título */}
        <h2 className="mt-1 line-clamp-2 text-sm font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
          {product.title}
        </h2>

        {/* Precios */}
        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">
              {formatPrice(product.finalPrice)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="mt-2 flex items-center gap-1.5">
            <div
              className={`h-2 w-2 rounded-full ${product.stock > 10
                  ? "bg-green-500"
                  : product.stock > 0
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
            />
            <span className="text-xs text-muted-foreground">
              {product.stock > 10
                ? "En stock"
                : product.stock > 0
                  ? `Últimas ${product.stock} unidades`
                  : "Sin stock"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
