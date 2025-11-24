"use client";

import { useParams } from "next/navigation";
import Image from "next/image"; 
import { useProduct } from "@/hooks/useProducts";
import { AddToCartControl } from "@/components/products/AddToCartControl"; 
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailPage() {
  // 1. Obtener el ID de la URL
  const { id } = useParams();
  const productId = Number(id);

  // 2. Obtener datos del producto usando tu hook existente
  const { data: product, isLoading, isError, error } = useProduct(
    productId > 0 ? productId : 0
  );

  // 3. Manejo de estados (Carga y Error)
  if (isLoading) return <ProductDetailSkeleton />;
  if (isError) return <div className="p-6 text-red-500">Error al cargar: {String(error)}</div>;
  if (!product) return <div className="p-6">Producto no encontrado</div>;

  // Helper para obtener la imagen principal segura
  const mainImage = product.imagesURL && product.imagesURL.length > 0 
    ? product.imagesURL[0] 
    : "/placeholder.png";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* SECCIÓN IZQUIERDA: Galería de Imágenes */}
        <div className="space-y-4">
          {/* Imagen Principal */}
          <div className="relative aspect-square overflow-hidden rounded-lg border bg-gray-100 dark:bg-gray-800">
            <Image
              src={mainImage}
              alt={product.title}
              fill
              className="object-cover"
              priority // Carga prioritaria para la imagen principal
            />
          </div>

          {/* Miniaturas (si hay más de una imagen) */}
          {product.imagesURL.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.imagesURL.map((img, index) => (
                <div key={index} className="relative aspect-square rounded-md overflow-hidden border cursor-pointer hover:opacity-80 transition">
                  <Image
                    src={img}
                    alt={`Vista ${index + 1}`}
                    fill
                    className="object-cover"
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
             <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2
               ${product.isAvailable ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800'}`}>
                <span className={`h-2 w-2 rounded-full ${product.isAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
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

// Este componente se usa arriba en el "if (isLoading)"
function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Skeleton Imágenes */}
      <div className="space-y-4">
        <Skeleton className="aspect-square w-full rounded-lg" />
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-md" />
          ))}
        </div>
      </div>
      
      {/* Skeleton Textos */}
      <div className="flex flex-col gap-4">
         <Skeleton className="h-4 w-32" /> 
         <Skeleton className="h-10 w-3/4" /> 
         <Skeleton className="h-8 w-40" /> 
         <div className="space-y-2 py-4">
           <Skeleton className="h-4 w-full" />
           <Skeleton className="h-4 w-full" />
           <Skeleton className="h-4 w-2/3" />
         </div>
         <div className="mt-8 flex gap-4">
           <Skeleton className="h-12 w-32" /> 
           <Skeleton className="h-12 w-full" /> 
         </div>
      </div>
    </div>
  );
}