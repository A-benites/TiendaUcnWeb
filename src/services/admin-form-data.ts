import { api } from "@/lib/axios";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ProductDetailForAdminDTO } from "./admin-products";

/**
 * <summary>
 * Data Transfer Object representing a generic option for dropdown select inputs.
 * Used for Categories and Brands.
 * </summary>
 */
export interface SelectOptionDTO {
  id: number;
  name: string;
}

// --- Fetching Functions ---

/**
 * <summary>
 * Fetches the list of available product categories from the API.
 * </summary>
 * <returns>A Promise resolving to an array of SelectOptionDTO.</returns>
 * <remarks>
 * Includes safety checks to ensure an array is always returned, even if the API structure varies.
 * </remarks>
 */
export async function getCategories(): Promise<SelectOptionDTO[]> {
  try {
    const response = await api.get("/admin/categories");
    const data = response.data.data || response.data;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error loading categories:", error);
    return [];
  }
}

/**
 * <summary>
 * Fetches the list of available product brands from the API.
 * </summary>
 * <returns>A Promise resolving to an array of SelectOptionDTO.</returns>
 * <remarks>
 * Includes safety checks to ensure an array is always returned.
 * </remarks>
 */
export async function getBrands(): Promise<SelectOptionDTO[]> {
  try {
    const response = await api.get("/admin/brands");
    const data = response.data.data || response.data;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error loading brands:", error);
    return [];
  }
}

/**
 * <summary>
 * Fetches the full detailed information of a specific product for administration purposes.
 * </summary>
 * <param name="id">The unique identifier of the product.</param>
 * <returns>A Promise resolving to the ProductDetailForAdminDTO.</returns>
 */
export async function getProductDetails(id: number): Promise<ProductDetailForAdminDTO> {
  const response = await api.get(`/admin/products/${id}`);
  return response.data.data as ProductDetailForAdminDTO;
}

// --- React Query Hooks ---

/**
 * <summary>
 * React Query hook to retrieve and cache the list of categories.
 * </summary>
 */
export const useCategoriesQuery = (): UseQueryResult<SelectOptionDTO[], Error> => {
  return useQuery<SelectOptionDTO[], Error>({
    queryKey: ["categoriesList"],
    queryFn: getCategories,
    staleTime: Infinity,
  });
};

/**
 * <summary>
 * React Query hook to retrieve and cache the list of brands.
 * </summary>
 */
export const useBrandsQuery = (): UseQueryResult<SelectOptionDTO[], Error> => {
  return useQuery<SelectOptionDTO[], Error>({
    queryKey: ["brandsList"],
    queryFn: getBrands,
    staleTime: Infinity,
  });
};

/**
 * <summary>
 * React Query hook to retrieve the details of a specific product.
 * </summary>
 * <param name="id">The product ID. If null or invalid, the query is disabled.</param>
 */
export const useProductDetailsQuery = (
  id: number | null
): UseQueryResult<ProductDetailForAdminDTO, Error> => {
  return useQuery<ProductDetailForAdminDTO, Error>({
    queryKey: ["productDetail", id],
    queryFn: () => getProductDetails(id!),
    enabled: !!id && id > 0,
  });
};