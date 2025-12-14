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
import { Separator } from "@/components/ui/separator";
import {
  SlidersHorizontal,
  RotateCcw,
  Loader2,
  Tag,
  Building2,
  DollarSign,
  Check,
  Sparkles,
} from "lucide-react";
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
      <SheetContent className="flex flex-col">
        <SheetHeader className="space-y-1">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
            </div>
            Filtros
          </SheetTitle>
          <SheetDescription>
            Ajusta los filtros para encontrar los productos que buscas
          </SheetDescription>
        </SheetHeader>

        <Separator className="my-4" />

        <div className="flex-1 space-y-6 overflow-y-auto pr-1">
          {/* Categoría */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="category" className="text-sm font-medium">
                Categoría
              </Label>
            </div>
            {isLoadingFilters ? (
              <div className="flex h-10 items-center justify-center rounded-md border border-dashed bg-muted/30">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="ml-2 text-xs text-muted-foreground">Cargando...</span>
              </div>
            ) : (
              <Select
                value={filters.category ?? "all"}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5" />
                      Todas las categorías
                    </span>
                  </SelectItem>
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
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="brand" className="text-sm font-medium">
                Marca
              </Label>
            </div>
            {isLoadingFilters ? (
              <div className="flex h-10 items-center justify-center rounded-md border border-dashed bg-muted/30">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="ml-2 text-xs text-muted-foreground">Cargando...</span>
              </div>
            ) : (
              <Select
                value={filters.brand ?? "all"}
                onValueChange={(value) => handleSelectChange("brand", value)}
              >
                <SelectTrigger id="brand" className="w-full">
                  <SelectValue placeholder="Todas las marcas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5" />
                      Todas las marcas
                    </span>
                  </SelectItem>
                  {filtersData?.brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.name}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <Separator />

          {/* Rango de Precio */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Rango de Precio</Label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="minPrice" className="text-xs text-muted-foreground">
                  Precio mínimo
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="minPrice"
                    type="number"
                    placeholder="0"
                    className="pl-7"
                    value={filters.minPrice ?? ""}
                    onChange={(e) => handlePriceChange("minPrice", e.target.value)}
                    min={0}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">
                  Precio máximo
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="maxPrice"
                    type="number"
                    placeholder="Sin límite"
                    className="pl-7"
                    value={filters.maxPrice ?? ""}
                    onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
                    min={0}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <SheetFooter className="flex-col gap-2 sm:flex-col">
          <SheetClose asChild>
            <Button className="w-full gap-2">
              <Check className="h-4 w-4" />
              Aplicar filtros
            </Button>
          </SheetClose>
          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              onClick={onReset}
              className="w-full gap-2 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" />
              Limpiar todos los filtros ({activeFiltersCount})
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
