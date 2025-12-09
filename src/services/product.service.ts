import { api } from "@/lib/axios";
import { ProductListResponse, ProductDetail } from "@/models/product.types";

// Sort options matching backend ProductSortOption enum
export type ProductSortOption = "Newest" | "PriceAsc" | "PriceDesc" | "NameAsc" | "NameDesc";

export interface GetProductsParams {
  search?: string;
  page?: number;
  pageSize?: number;
  categoryId?: number;
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: ProductSortOption;
}

export async function getProducts(params: GetProductsParams = {}): Promise<ProductListResponse> {
  const {
    search,
    page = 1,
    pageSize = 12,
    categoryId,
    brandId,
    minPrice,
    maxPrice,
    sortBy,
  } = params;

  const queryParams: Record<string, string | number> = {
    pageNumber: page,
    pageSize: pageSize,
  };

  if (search && search.trim().length >= 2) {
    queryParams.searchTerm = search.trim();
  }

  if (categoryId) {
    queryParams.categoryId = categoryId;
  }

  if (brandId) {
    queryParams.brandId = brandId;
  }

  if (minPrice !== undefined && minPrice >= 0) {
    queryParams.minPrice = minPrice;
  }

  if (maxPrice !== undefined && maxPrice > 0) {
    queryParams.maxPrice = maxPrice;
  }

  if (sortBy) {
    queryParams.sortBy = sortBy;
  }

  const res = await api.get("/products", { params: queryParams });
  const backend = res.data?.data ?? res.data ?? {};

  return {
    products: backend.products ?? [],
    totalCount: backend.totalCount ?? 0,
    page: backend.page ?? page,
    pageSize: backend.pageSize ?? pageSize,
    totalPages: backend.totalPages ?? 0,
  };
}

export async function getProductById(id: number): Promise<ProductDetail> {
  const res = await api.get(`/products/${id}`);

  const payload = res.data?.data;

  if (!payload) {
    throw new Error("Producto no encontrado");
  }

  return payload as ProductDetail;
}
