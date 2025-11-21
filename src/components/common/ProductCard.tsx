"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/models/product.types";

export function ProductCard({ product }: { product: Product }) {
  const img = product.mainImageURL || "/placeholder.png";

  return (
    <Link
      href={`/products/${product.id}`}
      className="border rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col"
    >
      <div className="w-full h-48 relative rounded-md overflow-hidden bg-gray-100">
        <Image src={img} alt={product.title} fill className="object-cover" />
      </div>

      <h2 className="text-lg font-semibold mt-4 line-clamp-2">
        {product.title}
      </h2>

      <p className="text-sm text-gray-500">{product.categoryName}</p>
      <p className="text-xl font-bold mt-2">
        ${product.finalPrice.toLocaleString("es-CL")}
      </p>
      <p className="text-sm text-gray-600 mt-1">Stock: {product.stock}</p>
    </Link>
  );
}
