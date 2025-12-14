"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

export type SortOption = "Newest" | "PriceAsc" | "PriceDesc" | "NameAsc" | "NameDesc";

interface SortDropdownProps {
  value: SortOption | undefined;
  onChange: (value: SortOption | undefined) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "Newest", label: "Más recientes" },
  { value: "PriceAsc", label: "Precio: Menor a Mayor" },
  { value: "PriceDesc", label: "Precio: Mayor a Menor" },
  { value: "NameAsc", label: "Nombre: A-Z" },
  { value: "NameDesc", label: "Nombre: Z-A" },
];

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <Select
      value={value || ""}
      onValueChange={(val) => onChange(val === "" ? undefined : (val as SortOption))}
    >
      <SelectTrigger className="w-[180px]">
        <ArrowUpDown className="h-4 w-4 mr-2" />
        <SelectValue placeholder="Ordenar por" />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
