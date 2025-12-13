
import { z } from "zod";

export const ProductFormSchema = z.object({
  // Campos requeridos para C#
  title: z.string().min(3, "Title must be at least 3 characters long."),
  description: z.string().min(10, "Description must be at least 10 characters long."),

  // Números que deben ser parseados y validados
  price: z.preprocess(
    (val) => parseFloat(String(val)),
    z.number().positive("Price must be greater than zero.")
  ),
  discount: z.preprocess(
    (val) => parseInt(String(val)),
    z.number().int().min(0).max(100, "Discount cannot exceed 100%.")
  ),
  stock: z.preprocess(
    (val) => parseInt(String(val)),
    z.number().int().min(0, "Stock cannot be negative.")
  ),

  // IDs de Select (deben ser números, validamos el parseo y que no sea 0/NaN)
  categoryId: z.preprocess(
    (val) => parseInt(String(val)),
    z.number().int().positive("Category is required.")
  ),
  brandId: z.preprocess(
    (val) => parseInt(String(val)),
    z.number().int().positive("Brand is required.")
  ),

  // Manejo de Imágenes
  // 'newImages' guarda los archivos File[] subidos por el usuario (solo para CREACIÓN/EDICIÓN)
  newImages: z.array(z.instanceof(File)).optional().nullable(),

  // 'existingImages' es solo para EDICIÓN, para mantener el rastro de imágenes existentes
  existingImages: z
    .array(
      z.object({
        id: z.number().int(),
        url: z.string().url(),
        // Usamos este campo para marcar si la imagen debe ser eliminada
        isDeleted: z.boolean().optional().default(false),
      })
    )
    .optional()
    .default([]),

  // 'mainImageId' indica qué imagen existente o nueva debe ser la principal.
  // Usamos string para el input radio, luego transformamos a number o a string temporal.
  mainImageKey: z.string().min(1, "A main image must be selected."),
});

/**
 * Tipo derivado de Zod para el formato del formulario (usado en RHF).
 */
export type ProductFormValues = z.infer<typeof ProductFormSchema>;
