"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/common/ProductCard";
import { productService } from "@/services";
import type { GetProductsParams } from "@/models/product.model";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Configuración de parámetros para la API
  const params: GetProductsParams = {
    search: searchTerm || undefined,
    page: 1,
    limit: 12,
  };

  // Query con TanStack Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products", searchTerm],
    queryFn: () => productService.getProducts(params),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Catálogo de Productos</h1>
        <p className="text-gray-600">Explora nuestra selección de productos</p>
      </div>

      {/* Filtro de búsqueda */}
      <div className="mb-8">
        <div className="max-w-md">
          <Input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        {data && (
          <p className="text-sm text-gray-600 mt-2">
            {data.total} {data.total === 1 ? "producto encontrado" : "productos encontrados"}
          </p>
        )}
      </div>

      {/* Estados de carga y error */}
      {isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      )}

      {isError && (
        <div className="text-center py-12">
          <p className="text-red-600">
            Error al cargar los productos: {error?.message || "Intenta nuevamente"}
          </p>
        </div>
      )}

      {/* Grid de productos */}
      {data && data.products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Sin resultados */}
      {data && data.products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">
            No se encontraron productos que coincidan con tu búsqueda.
          </p>
        </div>
      )}
    </div>
  );
}
