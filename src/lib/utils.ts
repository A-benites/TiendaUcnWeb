import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formatea un precio en formato chileno (sin decimales, con separador de miles)
 * @param price - El precio a formatear (puede ser string o number)
 * @returns El precio formateado como string (ej: "$12.990")
 */
export function formatPrice(price: string | number): string {
  // Convertir a número si es string
  const numPrice = typeof price === "string" ? parseFloat(price) : price;

  // Si no es un número válido, retornar $0
  if (isNaN(numPrice)) return "$0";

  // Formatear sin decimales con separador de miles chileno
  return `$${Math.round(numPrice).toLocaleString("es-CL")}`;
}
