import { z } from "zod";

/**
 * <summary>
 * Zod validation schema for the Product Create/Edit form.
 * </summary>
 * <remarks>
 * Defines validation rules and transformations (preprocessing) to handle
 * string-to-number conversions required by HTML inputs.
 * </remarks>
 */
export const ProductFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  description: z.string().min(10, "Description must be at least 10 characters long."),

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

  categoryId: z.preprocess(
    (val) => parseInt(String(val)),
    z.number().int().positive("Category is required.")
  ),
  brandId: z.preprocess(
    (val) => parseInt(String(val)),
    z.number().int().positive("Brand is required.")
  ),

  /**
   * <summary>
   * Array of new File objects uploaded by the user.
   * </summary>
   */
  newImages: z.array(z.instanceof(File)).optional().nullable(),

  /**
   * <summary>
   * Array of existing images retrieved from the backend.
   * Includes a flag to mark images for deletion.
   * </summary>
   */
  existingImages: z
    .array(
      z.object({
        id: z.number().int(),
        url: z.string().url(),
        isDeleted: z.boolean().optional().default(false),
      })
    )
    .optional()
    .default([]),

  /**
   * <summary>
   * Identifier for the main image (can be an existing ID or a temporary key for new files).
   * </summary>
   */
  mainImageKey: z.string().min(1, "A main image must be selected."),
});

/**
 * <summary>
 * Type definition inferred from the Zod schema.
 * Represents the shape of the form values.
 * </summary>
 */
export type ProductFormValues = z.infer<typeof ProductFormSchema>;