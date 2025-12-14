"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DollarSign } from "lucide-react";

interface PriceRangeFilterProps {
  minPrice: number | undefined;
  maxPrice: number | undefined;
  onMinChange: (value: number | undefined) => void;
  onMaxChange: (value: number | undefined) => void;
  onApply: () => void;
}

export function PriceRangeFilter({
  minPrice,
  maxPrice,
  onMinChange,
  onMaxChange,
  onApply,
}: PriceRangeFilterProps) {
  const [localMin, setLocalMin] = useState<string>(minPrice?.toString() ?? "");
  const [localMax, setLocalMax] = useState<string>(maxPrice?.toString() ?? "");

  const handleApply = () => {
    const min = localMin ? parseInt(localMin, 10) : undefined;
    const max = localMax ? parseInt(localMax, 10) : undefined;

    if (min !== undefined && isNaN(min)) return;
    if (max !== undefined && isNaN(max)) return;

    onMinChange(min);
    onMaxChange(max);
    onApply();
  };

  const handleClear = () => {
    setLocalMin("");
    setLocalMax("");
    onMinChange(undefined);
    onMaxChange(undefined);
    onApply();
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium flex items-center gap-2">
        <DollarSign className="h-4 w-4" />
        Rango de precio
      </Label>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          placeholder="Mín"
          value={localMin}
          onChange={(e) => setLocalMin(e.target.value)}
          className="w-24"
          min={0}
        />
        <span className="text-muted-foreground">-</span>
        <Input
          type="number"
          placeholder="Máx"
          value={localMax}
          onChange={(e) => setLocalMax(e.target.value)}
          className="w-24"
          min={0}
        />
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={handleApply} className="flex-1">
          Aplicar
        </Button>
        {(localMin || localMax) && (
          <Button size="sm" variant="outline" onClick={handleClear}>
            Limpiar
          </Button>
        )}
      </div>
    </div>
  );
}
