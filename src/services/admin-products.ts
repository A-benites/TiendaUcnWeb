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
import { toast } from "sonner";

// --- INTERFACES ---

export interface AdminProductSearchParams {
  page: number;
  pageSize: number;
  search?: string;
  categoryId?: number;
  brandId?: number;
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

// Interfaces para Edición
export interface ProductDetailForAdminDTO {
  id: number;
  title: string;
  description: string;
  price: string | number;
  discount: number;
  stock: number;
  isAvailable: boolean;
  statusName: string;
  categoryId: number;
  brandId: number;
  mainImageURL?: string;
  imagesURL?: string[];
  // Agregar IDs de imágenes para poder eliminarlas
  images?: { id: number; url: string }[];
}

export interface ProductUpdateDTO {
  title: string;
  description: string;
  price: number;
  stock: number;
  discount: number;
  status: number;
  categoryId?: number;
  brandId?: number;
}

// Interface para crear producto
export interface ProductCreateFormData {
  title: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  status: string; // "New" o "Used"
  categoryId: number;
  brandId: number;
  images: File[];
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
  if (params.categoryId) {
    queryParams.CategoryId = params.categoryId;
  }
  if (params.brandId) {
    queryParams.BrandId = params.brandId;
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

// ========================
// FUNCIONES PARA CREAR PRODUCTO (FormData con imágenes)
// ========================

/**
 * Crea un producto nuevo con imágenes usando FormData (multipart/form-data)
 */
export async function createAdminProduct(data: ProductCreateFormData): Promise<string> {
  const formData = new FormData();
  formData.append("Title", data.title);
  formData.append("Description", data.description);
  formData.append("Price", data.price.toString());
  formData.append("Discount", data.discount.toString());
  formData.append("Stock", data.stock.toString());
  formData.append("Status", data.status); // "New" o "Used"
  formData.append("CategoryId", data.categoryId.toString());
  formData.append("BrandId", data.brandId.toString());

  // Agregar imágenes al FormData
  data.images.forEach((file) => {
    formData.append("Images", file);
  });

  const response = await api.post("/admin/products", formData);
  return response.data.data;
}

/**
 * Sube imágenes adicionales a un producto existente
 */
export async function uploadProductImages(productId: number, files: File[]): Promise<void> {
  console.log("Uploading files:", files);
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("images", file);
  });

  // Debug log for FormData entries
  for (const pair of formData.entries()) {
    console.log(pair[0] + ', ' + pair[1]);
  }

  await api.post(`/admin/products/${productId}/images`, formData);
}

/**
 * Elimina una imagen de un producto
 */
export async function deleteProductImage(productId: number, imageId: number): Promise<void> {
  await api.delete(`/admin/products/${productId}/images/${imageId}`);
}

// Funciones para Edición
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

// Hooks para Edición
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

// ========================
// HOOKS PARA CREAR PRODUCTO
// ========================

export const useCreateAdminProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<string, AxiosError, ProductCreateFormData>({
    mutationFn: createAdminProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_PRODUCTS_QUERY_KEY] });
      toast.success("Producto creado exitosamente");
    },
    onError: (error) => {
      const message = (error.response?.data as any)?.message || "Error al crear el producto";
      toast.error(message);
    },
  });
};

// ========================
// HOOKS PARA GESTIÓN DE IMÁGENES
// ========================

export const useUploadProductImages = () => {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, { productId: number; files: File[] }>({
    mutationFn: ({ productId, files }) => uploadProductImages(productId, files),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["adminProduct", variables.productId] });
      toast.success("Imágenes subidas exitosamente");
    },
    onError: () => {
      toast.error("Error al subir las imágenes");
    },
  });
};

export const useDeleteProductImage = () => {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, { productId: number; imageId: number }>({
    mutationFn: ({ productId, imageId }) => deleteProductImage(productId, imageId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["adminProduct", variables.productId] });
      toast.success("Imagen eliminada");
    },
    onError: () => {
      toast.error("Error al eliminar la imagen");
    },
  });
};
