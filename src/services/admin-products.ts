/* eslint-disable @typescript-eslint/no-explicit-any */

import { api } from "@/lib/axios"; // Asume tu cliente Axios configurado
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

// --- Interfaces de Datos (Basadas en tus DTOs de C#) ---

/**
 * <summary>
 * Data Transfer Object (DTO) for filtering and pagination parameters
 * when retrieving the admin product list.
 * </summary>
 * <remarks>
 * Maps to SearchParamsDTO in the C# backend.
 * </remarks>
 */
export interface AdminProductSearchParams {
  /** <summary>The page number to retrieve (must be >= 1).</summary> */
  page: number;
  /** <summary>The number of products per page.</summary> */
  pageSize: number;
  /** <summary>Optional search term to filter by product title or description.</summary> */
  search?: string;
  // ... other filters (CategoryId, BrandId, etc.) could be added here
}

/**
 * <summary>
 * Data Transfer Object (DTO) for a single product entry in the administration table.
 * </summary>
 * <remarks>
 * Maps to ProductForAdminDTO in the C# backend.
 * </remarks>
 */
export interface ProductForAdminDTO {
  /** <summary>Unique product identifier.</summary> */
  id: number;
  /** <summary>Product title.</summary> */
  title: string;
  /** <summary>URL of the product's main image.</summary> */
  mainImageURL?: string;
  /** <summary>Product price (formatted string).</summary> */
  price: string;
  /** <summary>Available stock quantity.</summary> */
  stock: number;
  /** <summary>Stock indicator (e.g., "Low", "High").</summary> */
  stockIndicator: string;
  /** <summary>Product category name.</summary> */
  categoryName: string;
  /** <summary>Product brand name.</summary> */
  brandName: string;
  /** <summary>Product status text (e.g., "New", "Used").</summary> */
  statusName: string;
  /** <summary>Indicates whether the product is currently available for sale.</summary> */
  isAvailable: boolean;
  /** <summary>Product last update date (ISO string).</summary> */
  updatedAt: string;
}

/**
 * <summary>
 * Data Transfer Object (DTO) representing a paginated list of products for administration.
 * </summary>
 * <remarks>
 * Maps to ListedProductsForAdminDTO in the C# backend.
 * </remarks>
 */
export interface ListedProductsForAdminDTO {
  /** <summary>List of products in the current page.</summary> */
  products: ProductForAdminDTO[];
  /** <summary>Total count of products found.</summary> */
  totalCount: number;
  /** <summary>Total number of pages available.</summary> */
  totalPages: number;
  /** <summary>Current query page.</summary> */
  currentPage: number;
  /** <summary>Number of products per page.</summary> */
  pageSize: number;
}

// --- Clave de Consulta ---
const ADMIN_PRODUCTS_QUERY_KEY = "adminProductsList";

// --- Funciones de Fetching y Mutación ---

/**
 * <summary>
 * Fetches a paginated list of products for the administration panel.
 * </summary>
 * <param name="params">The pagination and optional search parameters.</param>
 * <returns>A Promise resolving to a ListedProductsForAdminDTO object.</returns>
 * <remarks>
 * Maps frontend parameters (page, pageSize, search) to backend names (PageNumber, PageSize, SearchTerm).
 * Includes contingency error handling for the workshop, returning an empty list
 * for 4xx errors (e.g., 400, 401, 403).
 * </remarks>
 */
export async function getAdminProducts(
  params: AdminProductSearchParams
): Promise<ListedProductsForAdminDTO> {
  // Map frontend names to backend required names (e.g., Page -> PageNumber)
  const queryParams: Record<string, any> = {
    PageNumber: Number(params.page),
    PageSize: Number(params.pageSize),
  }; // Only include search term if it has a value
  if (params.search && params.search.trim() !== "") {
    queryParams.SearchTerm = params.search.trim();
  }
  try {
    const response = await api.get("/admin/products", { params: queryParams });
    return response.data.data;
  } catch (err) {
    console.error("Error fetching admin products. Check parameters or auth:", err);
    const error = err as AxiosError; // Contingency for 4xx client errors (400, 401, 403)
    if (error.response && error.response.status >= 400 && error.response.status < 500) {
      return {
        products: [],
        totalCount: 0,
        currentPage: params.page,
        pageSize: params.pageSize,
        totalPages: 0,
      };
    } // Re-throw other errors (5xx, network failures)
    throw error;
  }
}

/**
 * <summary>
 * Toggles the availability status of a specific product (Active/Inactive).
 * </summary>
 * <param name="id">The unique identifier of the product to update.</param>
 * <returns>A Promise that resolves upon successful status update.</returns>
 * <remarks>
 * Calls the protected endpoint: PATCH /admin/products/{id}/status.
 * </remarks>
 */
export async function toggleProductStatus(id: number): Promise<void> {
  await api.patch(`/admin/products/${id}/status`);
}

// --- Hooks de React Query ---

/**
 * <summary>
 * React Query hook for fetching the paginated admin product list.
 * </summary>
 * <param name="params">The filter and pagination parameters.</param>
 * <returns>The result object from the useQuery hook (with error type set to Error).</returns>
 */
export const useAdminProductsQuery = (
  params: AdminProductSearchParams
): UseQueryResult<ListedProductsForAdminDTO, Error> => {
  return useQuery<ListedProductsForAdminDTO, Error>({
    queryKey: [ADMIN_PRODUCTS_QUERY_KEY, params],
    queryFn: () => getAdminProducts(params),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60, // 1 minute
  });
};

/**
 * <summary>
 * React Query hook for mutating the product status (toggle Active/Inactive).
 * </summary>
 * <returns>The result object from the useMutation hook.</returns>
 * <remarks>
 * On success, it automatically invalidates the primary admin product list query
 * to refresh the table UI.
 * </remarks>
 */
export const useToggleProductStatusMutation = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: toggleProductStatus,
    onSuccess: () => {
      // Invalidate the product list query to show the updated status immediately
      queryClient.invalidateQueries({ queryKey: [ADMIN_PRODUCTS_QUERY_KEY] });
    },
  });
};
