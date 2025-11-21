"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/common/ProductCard";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = useProducts(search);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Productos</h1>

      {/* Campo de búsqueda */}
      <input
        type="text"
        placeholder="Buscar productos..."
        className="border p-2 rounded w-full mb-6"
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Loading */}
      {isLoading && <p>Cargando productos...</p>}

      {/* Error */}
      {isError && <p>Error al cargar productos.</p>}

      {/* Renderizado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(data?.products ?? []).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
