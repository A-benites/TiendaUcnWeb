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

// --- INTERFACES ---

export interface AdminProductSearchParams {
  page: number;
  pageSize: number;
  search?: string;
}

export interface ProductForAdminDTO {
  id: number;
  title: string;
  mainImageURL?: string;
  price: string;
  stock: number;
  stockIndicator: string;
  categoryName: string;
  brandName: string;
  statusName: string;
  isAvailable: boolean;
  updatedAt: string;
}

export interface ListedProductsForAdminDTO {
  products: ProductForAdminDTO[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// Interfaces para Edición (NUEVAS)
export interface ProductDetailForAdminDTO {
  id: number;
  title: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  status: number; // 0: Inactivo, 1: Activo
  categoryId: number;
  brandId: number;
  mainImageURL?: string;
  imagesURL?: string[];
}

export interface ProductUpdateDTO {
  title: string;
  description: string;
  price: number;
  stock: number;
  discount: number;
  status: number;
}

// --- CLAVES DE QUERY ---
export const ADMIN_PRODUCTS_QUERY_KEY = "adminProductsList";

// --- FUNCIONES API ---

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

export async function toggleProductStatus(id: number): Promise<void> {
  await api.patch(`/admin/products/${id}/status`);
}

// Funciones para Edición (NUEVAS)
export async function getAdminProductById(id: number): Promise<ProductDetailForAdminDTO> {
  // Ajusta la ruta según tu backend real. Asumimos GET /api/admin/products/{id}
  const { data } = await api.get<{ data: ProductDetailForAdminDTO }>(`/admin/products/${id}`);
  return data.data; // O data directamente si tu backend no envuelve en "data"
}

export async function updateAdminProduct(id: number, productData: ProductUpdateDTO): Promise<void> {
  await api.put(`/admin/products/${id}`, productData);
}

// --- HOOKS ---

export const useAdminProductsQuery = (
  params: AdminProductSearchParams
): UseQueryResult<ListedProductsForAdminDTO, Error> => {
  return useQuery<ListedProductsForAdminDTO, Error>({
    queryKey: [ADMIN_PRODUCTS_QUERY_KEY, params],
    queryFn: () => getAdminProducts(params),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60,
  });
};

export const useToggleProductStatusMutation = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: toggleProductStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_PRODUCTS_QUERY_KEY] });
    },
  });
};

// Hooks para Edición (NUEVOS)
export const useAdminProductDetail = (id: number) => {
  return useQuery<ProductDetailForAdminDTO, Error>({
    queryKey: ["adminProduct", id],
    queryFn: () => getAdminProductById(id),
    enabled: id > 0,
  });
};

export const useAdminUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductUpdateDTO }) =>
      updateAdminProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_PRODUCTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ["adminProduct"] });
    },
  });
};
