/* eslint-disable @typescript-eslint/no-explicit-any */

import { api } from "@/lib/axios";
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

/**
 * <summary>
 * Data Transfer Object (DTO) for product images.
 * </summary>
 */
export interface ProductImageDTO {
  /** <summary>Image identifier.</summary> */
  id: number;
  /** <summary>Image URL.</summary> */
  url: string;
  /** <summary>Cloudinary public ID (optional).</summary> */
  publicId?: string;
}

/**
 * <summary>
 * Data Transfer Object (DTO) for displaying detailed product information in administration.
 * Used for the Edit Form.
 * </summary>
 * <remarks>
 * Maps to ProductDetailForAdminDTO in the C# backend.
 * </remarks>
 */
export interface ProductDetailForAdminDTO {
  /** <summary>Unique identifier for the product.</summary> */
  id: number;
  /** <summary>Product title.</summary> */
  title: string;
  /** <summary>Product description.</summary> */
  description: string;
  /** <summary>List of product images.</summary> */
  images: ProductImageDTO[]; // Mapeado de Images en C#
  /** <summary>Product price (formatted as string).</summary> */
  price: string;
  /** <summary>Discount percentage applied to the product.</summary> */
  discount: number;
  /** <summary>Final price with discount applied.</summary> */
  finalPrice: string;
  /** <summary>Available stock quantity.</summary> */
  stock: number;
  /** <summary>Stock indicator.</summary> */
  stockIndicator: string;
  /** <summary>Name of the product's category.</summary> */
  categoryName: string;
  /** <summary>ID of the product's category.</summary> */
  categoryId: number;
  /** <summary>Name of the product's brand.</summary> */
  brandName: string;
  /** <summary>ID of the product's brand.</summary> */
  brandId: number;
  /** <summary>Product status as text.</summary> */
  statusName: string;
  /** <summary>Indicates whether the product is available for sale.</summary> */
  isAvailable: boolean;
  /** <summary>Product creation date.</summary> */
  createdAt: string;
  /** <summary>Product last update date.</summary> */
  updatedAt: string;
  /** <summary>URL of the main product image.</summary> */
  mainImageURL?: string;

}


const ADMIN_PRODUCTS_QUERY_KEY = "adminProductsList";


/**
 * <summary>
 * Fetches a paginated list of products for the administration panel.
 * </summary>
 */
export async function getAdminProducts(
  params: AdminProductSearchParams
): Promise<ListedProductsForAdminDTO> {
  const queryParams: Record<string, any> = {
    PageNumber: Number(params.page),
    PageSize: Number(params.pageSize),
  };
  if (params.search && params.search.trim() !== "") {
    queryParams.SearchTerm = params.search.trim();
  }
  try {
    const response = await api.get("/admin/products", { params: queryParams });
    return response.data.data;
  } catch (err) {
    console.error("Error fetching admin products. Check parameters or auth:", err);
    const error = err as AxiosError;
    if (error.response && error.response.status >= 400 && error.response.status < 500) {
      return {
        products: [],
        totalCount: 0,
        currentPage: params.page,
        pageSize: params.pageSize,
        totalPages: 0,
      };
    }
    throw error;
  }
}

/**
 * <summary>
 * Toggles the availability status of a specific product (Active/Inactive).
 * </summary>
 */
export async function toggleProductStatus(id: number): Promise<void> {
  await api.patch(`/admin/products/${id}/status`);
}

// --- Hooks de React Query ---

/**
 * <summary>
 * React Query hook for fetching the paginated admin product list.
 * </summary>
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
 */
export const useToggleProductStatusMutation = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: toggleProductStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_PRODUCTS_QUERY_KEY] });
    },
  });
};