"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/common/ProductCard";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError, error } = useProducts(search);

  if (isLoading) return <p className="p-6">Cargando productos...</p>;
  if (isError)
    return <p className="p-6">Error al cargar productos: {String(error)}</p>;

  const products = data?.products ?? [];
  console.log("Productos que se van a renderizar:", products);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Productos</h1>

      <input
        type="text"
        placeholder="Buscar productos..."
        className="border p-2 rounded w-full mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {products.length === 0 ? (
        <p>No se encontraron productos.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
