"use client";

import { useState } from "react";
import { useAdminProductsQuery, AdminProductSearchParams } from "@/services/admin-products";
import { ProductTable } from "@/components/admin/ProductTable";
import { Button } from "@/components/ui/button"; // Importar componente UI
import { Input } from "@/components/ui/input";   // Importar input UI
import { Search, Plus, Loader2 } from "lucide-react"; // Usar Lucide (consistente con tu proyecto)
import Link from "next/link"; // Para navegar a crear producto

export default function AdminProductsPage() {
  const [params, setParams] = useState<AdminProductSearchParams>({
    page: 1,
    pageSize: 10,
    search: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, isError, isFetching } = useAdminProductsQuery(params);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams((prev) => ({ ...prev, page: 1, search: searchTerm }));
  };

  const handlePageChange = (newPage: number) => {
    if (data && newPage > 0 && newPage <= data.totalPages) {
      setParams((prev) => ({ ...prev, page: newPage }));
    }
  };

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;

  if (isError) return (
    <div className="p-10 text-center text-red-500">
      Error al cargar productos. Verifica tu conexión.
    </div>
  );

  const productList = data || { products: [], totalPages: 0, currentPage: 1, totalCount: 0 };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Productos</h1>
          <p className="text-muted-foreground">Gestiona el inventario de la tienda.</p>
        </div>
        <Link href="/admin/products/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2 bg-background/50 p-1 rounded-lg">
        <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-sm">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" disabled={isFetching}>
            {isFetching ? <Loader2 className="animate-spin h-4 w-4" /> : "Buscar"}
          </Button>
        </form>
      </div>

      <ProductTable products={productList.products} />

      {productList.totalPages > 1 && (
        <div className="flex justify-between items-center pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => handlePageChange(productList.currentPage - 1)}
            disabled={productList.currentPage === 1 || isFetching}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {productList.currentPage} de {productList.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => handlePageChange(productList.currentPage + 1)}
            disabled={productList.currentPage === productList.totalPages || isFetching}
          >
            Siguiente
          </Button>
        </div>
      )}

      {isFetching && <p className="text-center text-sm text-primary mt-2">Cargando datos...</p>}
    </div>
  );
}