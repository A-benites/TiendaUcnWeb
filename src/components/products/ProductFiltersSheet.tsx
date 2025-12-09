"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal, X, RotateCcw, Loader2 } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet";
import { useFiltersData } from "@/hooks/useFilters";

export interface ProductFilters {
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
}

interface ProductFiltersProps {
    filters: ProductFilters;
    onChange: (filters: ProductFilters) => void;
    onReset: () => void;
    activeFiltersCount: number;
}

export function ProductFiltersSheet({
    filters,
    onChange,
    onReset,
    activeFiltersCount,
}: ProductFiltersProps) {
    const { data: filtersData, isLoading: isLoadingFilters } = useFiltersData();

    const handlePriceChange = (key: "minPrice" | "maxPrice", value: string) => {
        const numValue = value ? parseInt(value, 10) : undefined;
        if (value && isNaN(numValue as number)) return;
        onChange({ ...filters, [key]: numValue });
    };

    const handleSelectChange = (key: "category" | "brand", value: string) => {
        onChange({ ...filters, [key]: value === "all" ? undefined : value });
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filtros
                    {activeFiltersCount > 0 && (
                        <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                            {activeFiltersCount}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <SlidersHorizontal className="h-5 w-5" />
                        Filtros
                    </SheetTitle>
                    <SheetDescription>
                        Ajusta los filtros para encontrar los productos que buscas
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                    {/* Categoría */}
                    <div className="space-y-2">
                        <Label htmlFor="category">Categoría</Label>
                        {isLoadingFilters ? (
                            <div className="flex h-10 items-center justify-center rounded-md border">
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            <Select
                                value={filters.category ?? "all"}
                                onValueChange={(value) => handleSelectChange("category", value)}
                            >
                                <SelectTrigger id="category">
                                    <SelectValue placeholder="Todas las categorías" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas las categorías</SelectItem>
                                    {filtersData?.categories.map((category) => (
                                        <SelectItem key={category.id} value={category.name}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    {/* Marca */}
                    <div className="space-y-2">
                        <Label htmlFor="brand">Marca</Label>
                        {isLoadingFilters ? (
                            <div className="flex h-10 items-center justify-center rounded-md border">
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            <Select
                                value={filters.brand ?? "all"}
                                onValueChange={(value) => handleSelectChange("brand", value)}
                            >
                                <SelectTrigger id="brand">
                                    <SelectValue placeholder="Todas las marcas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas las marcas</SelectItem>
                                    {filtersData?.brands.map((brand) => (
                                        <SelectItem key={brand.id} value={brand.name}>
                                            {brand.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    {/* Rango de Precio */}
                    <div className="space-y-2">
                        <Label>Rango de Precio</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                placeholder="Mín"
                                value={filters.minPrice ?? ""}
                                onChange={(e) => handlePriceChange("minPrice", e.target.value)}
                                min={0}
                            />
                            <span className="text-muted-foreground">-</span>
                            <Input
                                type="number"
                                placeholder="Máx"
                                value={filters.maxPrice ?? ""}
                                onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
                                min={0}
                            />
                        </div>
                    </div>
                </div>

                <SheetFooter className="mt-6 flex gap-2">
                    {activeFiltersCount > 0 && (
                        <Button variant="outline" onClick={onReset} className="gap-2">
                            <RotateCcw className="h-4 w-4" />
                            Limpiar filtros
                        </Button>
                    )}
                    <SheetClose asChild>
                        <Button className="gap-2">
                            <X className="h-4 w-4" />
                            Cerrar
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
