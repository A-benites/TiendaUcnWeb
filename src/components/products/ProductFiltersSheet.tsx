"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SlidersHorizontal, X, RotateCcw } from "lucide-react";
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

export interface ProductFilters {
    categoryId?: number;
    brandId?: number;
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
    const handleChange = (key: keyof ProductFilters, value: string) => {
        const numValue = value ? parseInt(value, 10) : undefined;
        if (value && isNaN(numValue as number)) return;
        onChange({ ...filters, [key]: numValue });
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
                        <Label htmlFor="categoryId">ID de Categoría</Label>
                        <Input
                            id="categoryId"
                            type="number"
                            placeholder="Ej: 1, 2, 3..."
                            value={filters.categoryId ?? ""}
                            onChange={(e) => handleChange("categoryId", e.target.value)}
                            min={1}
                        />
                    </div>

                    {/* Marca */}
                    <div className="space-y-2">
                        <Label htmlFor="brandId">ID de Marca</Label>
                        <Input
                            id="brandId"
                            type="number"
                            placeholder="Ej: 1, 2, 3..."
                            value={filters.brandId ?? ""}
                            onChange={(e) => handleChange("brandId", e.target.value)}
                            min={1}
                        />
                    </div>

                    {/* Rango de Precio */}
                    <div className="space-y-2">
                        <Label>Rango de Precio</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                placeholder="Mín"
                                value={filters.minPrice ?? ""}
                                onChange={(e) => handleChange("minPrice", e.target.value)}
                                min={0}
                            />
                            <span className="text-muted-foreground">-</span>
                            <Input
                                type="number"
                                placeholder="Máx"
                                value={filters.maxPrice ?? ""}
                                onChange={(e) => handleChange("maxPrice", e.target.value)}
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
