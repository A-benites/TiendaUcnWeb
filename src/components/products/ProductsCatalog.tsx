"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/common/ProductCard";
import { Pagination } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Package, Loader2, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SortDropdown, ProductFiltersSheet, ProductFilters } from "@/components/products";
import type { SortOption } from "@/components/products";
import type { ProductSortOption } from "@/services/product.service";

const PAGE_SIZE = 12;

export function ProductsCatalog() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    // Read initial values from URL
    const initialSearch = searchParams.get("search") ?? "";
    const initialPage = parseInt(searchParams.get("page") ?? "1", 10);
    const initialCategoryId = searchParams.get("categoryId")
        ? parseInt(searchParams.get("categoryId")!, 10)
        : undefined;
    const initialBrandId = searchParams.get("brandId")
        ? parseInt(searchParams.get("brandId")!, 10)
        : undefined;
    const initialMinPrice = searchParams.get("minPrice")
        ? parseInt(searchParams.get("minPrice")!, 10)
        : undefined;
    const initialMaxPrice = searchParams.get("maxPrice")
        ? parseInt(searchParams.get("maxPrice")!, 10)
        : undefined;
    const initialSortBy = (searchParams.get("sortBy") as SortOption) ?? undefined;

    // Local state
    const [search, setSearch] = useState(initialSearch);
    const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [sortBy, setSortBy] = useState<SortOption | undefined>(initialSortBy);
    const [filters, setFilters] = useState<ProductFilters>({
        categoryId: initialCategoryId,
        brandId: initialBrandId,
        minPrice: initialMinPrice,
        maxPrice: initialMaxPrice,
    });

    // Update URL when params change
    const updateURL = useCallback(
        (params: {
            search?: string;
            page?: number;
            sortBy?: SortOption;
            categoryId?: number;
            brandId?: number;
            minPrice?: number;
            maxPrice?: number;
        }) => {
            const newParams = new URLSearchParams();

            if (params.search) newParams.set("search", params.search);
            if (params.page && params.page > 1) newParams.set("page", params.page.toString());
            if (params.sortBy) newParams.set("sortBy", params.sortBy);
            if (params.categoryId) newParams.set("categoryId", params.categoryId.toString());
            if (params.brandId) newParams.set("brandId", params.brandId.toString());
            if (params.minPrice) newParams.set("minPrice", params.minPrice.toString());
            if (params.maxPrice) newParams.set("maxPrice", params.maxPrice.toString());

            const queryString = newParams.toString();
            startTransition(() => {
                router.push(queryString ? `/products?${queryString}` : "/products", { scroll: false });
            });
        },
        [router]
    );

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            if (search !== debouncedSearch) {
                setDebouncedSearch(search);
                setCurrentPage(1);
                updateURL({
                    search: search || undefined,
                    page: 1,
                    sortBy,
                    ...filters,
                });
            }
        }, 400);

        return () => clearTimeout(handler);
    }, [search, debouncedSearch, sortBy, filters, updateURL]);

    // Sync URL changes to state (for browser back/forward)
    useEffect(() => {
        const urlSearch = searchParams.get("search") ?? "";
        const urlPage = parseInt(searchParams.get("page") ?? "1", 10);
        const urlSortBy = (searchParams.get("sortBy") as SortOption) ?? undefined;
        const urlCategoryId = searchParams.get("categoryId")
            ? parseInt(searchParams.get("categoryId")!, 10)
            : undefined;
        const urlBrandId = searchParams.get("brandId")
            ? parseInt(searchParams.get("brandId")!, 10)
            : undefined;
        const urlMinPrice = searchParams.get("minPrice")
            ? parseInt(searchParams.get("minPrice")!, 10)
            : undefined;
        const urlMaxPrice = searchParams.get("maxPrice")
            ? parseInt(searchParams.get("maxPrice")!, 10)
            : undefined;

        setSearch(urlSearch);
        setDebouncedSearch(urlSearch);
        setCurrentPage(urlPage);
        setSortBy(urlSortBy);
        setFilters({
            categoryId: urlCategoryId,
            brandId: urlBrandId,
            minPrice: urlMinPrice,
            maxPrice: urlMaxPrice,
        });
    }, [searchParams]);

    // Query products
    const { data, isLoading, isFetching, isError, error } = useProducts({
        search: debouncedSearch || undefined,
        page: currentPage,
        pageSize: PAGE_SIZE,
        categoryId: filters.categoryId,
        brandId: filters.brandId,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        sortBy: sortBy as ProductSortOption,
    });

    const products = data?.products ?? [];
    const totalPages = data?.totalPages ?? 0;
    const totalCount = data?.totalCount ?? 0;

    // Handlers
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        updateURL({
            search: debouncedSearch || undefined,
            page,
            sortBy,
            ...filters,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSortChange = (newSortBy: SortOption | undefined) => {
        setSortBy(newSortBy);
        setCurrentPage(1);
        updateURL({
            search: debouncedSearch || undefined,
            page: 1,
            sortBy: newSortBy,
            ...filters,
        });
    };

    const handleFiltersChange = (newFilters: ProductFilters) => {
        setFilters(newFilters);
        setCurrentPage(1);
        updateURL({
            search: debouncedSearch || undefined,
            page: 1,
            sortBy,
            ...newFilters,
        });
    };

    const handleResetFilters = () => {
        setFilters({});
        setSortBy(undefined);
        setCurrentPage(1);
        updateURL({
            search: debouncedSearch || undefined,
            page: 1,
        });
    };

    const handleClearSearch = () => {
        setSearch("");
        setDebouncedSearch("");
        setCurrentPage(1);
        updateURL({
            page: 1,
            sortBy,
            ...filters,
        });
    };

    // Count active filters
    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (filters.categoryId) count++;
        if (filters.brandId) count++;
        if (filters.minPrice !== undefined) count++;
        if (filters.maxPrice !== undefined) count++;
        return count;
    }, [filters]);

    // Skeleton loader
    const ProductSkeleton = () => (
        <div className="flex flex-col overflow-hidden rounded-xl border bg-card">
            <Skeleton className="aspect-square w-full" />
            <div className="p-4 space-y-3">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-6 w-24 mt-2" />
            </div>
        </div>
    );

    return (
        <div className="container mx-auto max-w-screen-2xl px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Productos</h1>
                <p className="mt-2 text-muted-foreground">
                    Explora nuestro catálogo de productos universitarios
                </p>
            </div>

            {/* Toolbar: Búsqueda, Filtros, Ordenamiento */}
            <div className="mb-8 flex flex-col gap-4">
                {/* Row 1: Search + Actions */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Search */}
                    <div className="relative max-w-md flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Buscar productos..."
                            className="pl-10 pr-10"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {search && (
                            <button
                                onClick={handleClearSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <ProductFiltersSheet
                            filters={filters}
                            onChange={handleFiltersChange}
                            onReset={handleResetFilters}
                            activeFiltersCount={activeFiltersCount}
                        />
                        <SortDropdown value={sortBy} onChange={handleSortChange} />
                    </div>
                </div>

                {/* Row 2: Active filters badges + Results count */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                    {/* Active filters badges */}
                    <div className="flex flex-wrap items-center gap-2">
                        {filters.categoryId && (
                            <FilterBadge
                                label={`Categoría: ${filters.categoryId}`}
                                onRemove={() => handleFiltersChange({ ...filters, categoryId: undefined })}
                            />
                        )}
                        {filters.brandId && (
                            <FilterBadge
                                label={`Marca: ${filters.brandId}`}
                                onRemove={() => handleFiltersChange({ ...filters, brandId: undefined })}
                            />
                        )}
                        {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
                            <FilterBadge
                                label={`Precio: ${filters.minPrice ?? 0} - ${filters.maxPrice ?? "∞"}`}
                                onRemove={() =>
                                    handleFiltersChange({ ...filters, minPrice: undefined, maxPrice: undefined })
                                }
                            />
                        )}
                        {sortBy && (
                            <FilterBadge
                                label={`Ordenado: ${getSortLabel(sortBy)}`}
                                onRemove={() => handleSortChange(undefined)}
                            />
                        )}
                    </div>

                    {/* Results info */}
                    {!isLoading && (
                        <p className="text-sm text-muted-foreground">
                            {totalCount > 0 ? (
                                <>
                                    Mostrando{" "}
                                    <span className="font-medium text-foreground">
                                        {(currentPage - 1) * PAGE_SIZE + 1}-
                                        {Math.min(currentPage * PAGE_SIZE, totalCount)}
                                    </span>{" "}
                                    de <span className="font-medium text-foreground">{totalCount}</span> productos
                                </>
                            ) : (
                                "No se encontraron productos"
                            )}
                        </p>
                    )}
                </div>
            </div>

            {/* Loading indicator for transitions */}
            {(isPending || isFetching) && !isLoading && (
                <div className="mb-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Actualizando...
                </div>
            )}

            {/* Error state */}
            {isError && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
                        <Package className="h-8 w-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">Error al cargar productos</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{String(error)}</p>
                </div>
            )}

            {/* Loading skeleton */}
            {isLoading && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                        <ProductSkeleton key={i} />
                    ))}
                </div>
            )}

            {/* Products grid */}
            {!isLoading && !isError && (
                <>
                    {products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="rounded-full bg-muted p-4">
                                <Package className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold">No se encontraron productos</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {debouncedSearch || activeFiltersCount > 0
                                    ? "Intenta ajustar tus filtros o términos de búsqueda"
                                    : "No hay productos disponibles en este momento"}
                            </p>
                            {(debouncedSearch || activeFiltersCount > 0) && (
                                <Button variant="outline" className="mt-4" onClick={handleResetFilters}>
                                    Limpiar filtros
                                </Button>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Grid */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-8 flex justify-center">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                        isLoading={isFetching}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}

// Helper component for filter badges
function FilterBadge({ label, onRemove }: { label: string; onRemove: () => void }) {
    return (
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {label}
            <button onClick={onRemove} className="ml-1 hover:text-primary/70">
                <X className="h-3 w-3" />
            </button>
        </span>
    );
}

// Helper to get sort label
function getSortLabel(sortBy: SortOption): string {
    const labels: Record<SortOption, string> = {
        Newest: "Más recientes",
        PriceAsc: "Precio ↑",
        PriceDesc: "Precio ↓",
        NameAsc: "A-Z",
        NameDesc: "Z-A",
    };
    return labels[sortBy];
}
