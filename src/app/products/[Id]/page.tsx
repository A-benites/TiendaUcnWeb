"use client";

import { useParams } from "next/navigation";
import { useProduct } from "@/hooks/useProducts";

export default function ProductDetailPage() {
  const { id } = useParams();
  const productId = Number(id);

  const { data: product, isLoading, isError, error } = useProduct(
    productId > 0 ? productId : 0
  );

  if (isLoading) return <p className="p-6">Cargando producto...</p>;
  if (isError) return <p className="p-6">Error: {String(error)}</p>;
  if (!product) return <p className="p-6">Producto no encontrado</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{product.title}</h1>
      <p className="text-gray-600 mt-2">{product.description}</p>
      <p className="text-xl font-bold mt-2">{product.finalPrice}</p>
      <p className="text-sm text-gray-500">
        Stock: {product.stock} ({product.stockIndicator})
      </p>
      <p className="text-sm text-gray-500">Categoría: {product.categoryName}</p>
      <p className="text-sm text-gray-500">Marca: {product.brandName}</p>
      <p className="text-sm text-gray-500">Estado: {product.statusName}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {product.imagesURL.map((img, index) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={index}
            src={img}
            alt={product.title}
            className="w-full h-32 object-cover rounded"
          />
        ))}
      </div>
    </div>
  );
}
