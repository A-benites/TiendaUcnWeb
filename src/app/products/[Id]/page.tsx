"use client";

import { useParams } from "next/navigation";
import { useProduct } from "@/hooks/useProducts";
import { AddToCartControl } from "@/components/products/AddToCartControl";
import Image from "next/image";
import { useState } from "react";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Number(params.id);
  const [imgError, setImgError] = useState(false);

  const { data: product, isLoading, isError, error } = useProduct(productId > 0 ? productId : 0);

  if (isLoading) return <p className="p-6">Cargando producto...</p>;
  if (isError) return <p className="p-6">Error: {String(error)}</p>;
  if (!product) return <p className="p-6">Producto no encontrado</p>;

  const mainImage = product.mainImageURL || "/placeholder.png";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* SECCIÓN IZQUIERDA: Galería de Imágenes */}
        <div className="space-y-4">
          {/* Imagen Principal */}
          <div className="relative aspect-square overflow-hidden rounded-lg border bg-gray-100 dark:bg-gray-800">
            {!imgError ? (
              <Image
                src={mainImage}
                alt={product.title}
                fill
                className="object-cover"
                priority
                unoptimized
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                <span>Sin imagen disponible</span>
              </div>
            )}
          </div>

          {/* Miniaturas (si hay más de una imagen) */}
          {product.imagesURL.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.imagesURL.map((img, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-md overflow-hidden border cursor-pointer hover:opacity-80 transition"
                >
                  <Image
                    src={img}
                    alt={`Vista ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECCIÓN DERECHA: Información y Compra */}
        <div className="flex flex-col gap-6">
          <div>
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {product.brandName} · {product.categoryName}
            </span>
            <h1 className="text-3xl font-bold mt-2 text-foreground">{product.title}</h1>
          </div>

          {/* Precio */}
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-primary">{product.finalPrice}</span>
            {product.discount > 0 && (
              <span className="text-lg text-muted-foreground line-through mb-1">
                {product.price}
              </span>
            )}
            {product.discount > 0 && (
              <span className="mb-1 px-2 py-0.5 text-xs font-bold bg-red-100 text-red-600 rounded-full">
                -{product.discount}%
              </span>
            )}
          </div>

          {/* Descripción */}
          <div className="prose prose-sm text-muted-foreground">
            <p>{product.description}</p>
          </div>

          {/* Estado del Stock */}
          <div className="flex items-center gap-2">
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2
               ${product.isAvailable ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800"}`}
            >
              <span
                className={`h-2 w-2 rounded-full ${product.isAvailable ? "bg-green-500" : "bg-red-500"}`}
              />
              {product.statusName} ({product.stock} unid.)
            </div>
          </div>

          {/* CONTROLES DE CARRITO */}
          <div className="mt-4 pt-6 border-t">
            <AddToCartControl product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
