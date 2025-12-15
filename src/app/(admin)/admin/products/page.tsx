"use client";

import { useState, useMemo } from "react";
import { useAdminProductsQuery, AdminProductSearchParams } from "@/services/admin-products";
import { useAdminTaxonomy } from "@/services/admin-taxonomy";
import { ProductTable } from "@/components/admin/ProductTable";
import { AdminProductsTableSkeleton } from "@/components/admin/skeletons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Loader2, Package, ChevronLeft, ChevronRight, X, Filter } from "lucide-react";
import Link from "next/link";

export default function AdminProductsPage() {
  const [params, setParams] = useState<AdminProductSearchParams>({
    page: 1,
    pageSize: 10,
    search: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, isError, isFetching, refetch } = useAdminProductsQuery(params);

  // Obtener categorías y marcas para filtros
  const { items: categories } = useAdminTaxonomy("categories");
  const { items: brands } = useAdminTaxonomy("brands");

  // Ordenar categorías y marcas alfabéticamente
  const sortedCategories = useMemo(() => {
    const safe = Array.isArray(categories) ? categories : [];
    return [...safe].sort((a, b) => a.name.localeCompare(b.name, "es"));
  }, [categories]);

  const sortedBrands = useMemo(() => {
    const safe = Array.isArray(brands) ? brands : [];
    return [...safe].sort((a, b) => a.name.localeCompare(b.name, "es"));
  }, [brands]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams((prev) => ({ ...prev, page: 1, search: searchTerm }));
  };

  const handlePageChange = (newPage: number) => {
    if (data && newPage > 0 && newPage <= data.totalPages) {
      setParams((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleCategoryChange = (value: string) => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      categoryId: value === "all" ? undefined : parseInt(value),
    }));
  };

  const handleBrandChange = (value: string) => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      brandId: value === "all" ? undefined : parseInt(value),
    }));
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setParams({
      page: 1,
      pageSize: 10,
      search: "",
      categoryId: undefined,
      brandId: undefined,
    });
  };

  const hasActiveFilters = params.search || params.categoryId || params.brandId;

  if (isLoading) return <AdminProductsTableSkeleton />;

  if (isError)
    return (
      <div className="p-10 text-center text-red-500">
        Error al cargar productos. Verifica tu conexión.
      </div>
    );

  const productList = data || { products: [], totalPages: 0, currentPage: 1, totalCount: 0 };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Package className="h-5 w-5 sm:h-6 sm:w-6" /> Productos
          </h1>
          <p className="text-sm text-muted-foreground">Gestiona el inventario de la tienda.</p>
        </div>
        <Link href="/admin/products/create" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
          </Button>
        </Link>
      </div>

      {/* Filtros responsive */}
      <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Filter className="h-4 w-4" /> Filtros
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background"
            />
          </div>
          <Button type="submit" disabled={isFetching}>
            {isFetching ? <Loader2 className="animate-spin h-4 w-4" /> : "Buscar"}
          </Button>
        </form>

        <div className="flex flex-col sm:flex-row gap-2">
          <Select
            value={params.categoryId?.toString() || "all"}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="w-full sm:w-[200px] bg-background">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {sortedCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={params.brandId?.toString() || "all"}
            onValueChange={handleBrandChange}
          >
            <SelectTrigger className="w-full sm:w-[200px] bg-background">
              <SelectValue placeholder="Marca" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las marcas</SelectItem>
              {sortedBrands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id.toString()}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="default"
              onClick={handleClearFilters}
              className="gap-1 bg-background"
            >
              <X className="h-4 w-4" /> Limpiar
            </Button>
          )}
        </div>
      </div>

      {/* Tabla de productos */}
      <ProductTable products={productList.products} />

      {/* Paginación responsive */}
      {productList.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t">
          <span className="text-sm text-muted-foreground order-2 sm:order-1">
            Página {productList.currentPage} de {productList.totalPages} ({productList.totalCount} productos)
          </span>
          <div className="flex gap-2 order-1 sm:order-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(productList.currentPage - 1)}
              disabled={productList.currentPage === 1 || isFetching}
            >
              <ChevronLeft className="h-4 w-4" /> Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(productList.currentPage + 1)}
              disabled={productList.currentPage === productList.totalPages || isFetching}
            >
              Siguiente <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {isFetching && !isLoading && (
        <p className="text-center text-sm text-primary">Actualizando...</p>
      )}
    </div>
  );
}
