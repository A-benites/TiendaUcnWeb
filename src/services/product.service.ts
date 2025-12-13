import { api } from "@/lib/axios";
import { ProductListResponse, ProductDetail } from "@/models/product.types";

// Sort options matching backend ProductSortOption enum
export type ProductSortOption = "Newest" | "PriceAsc" | "PriceDesc" | "NameAsc" | "NameDesc";

export interface GetProductsParams {
  search?: string;
  page?: number;
  pageSize?: number;
  category?: string; // Filter by category name
  brand?: string; // Filter by brand name
  minPrice?: number;
  maxPrice?: number;
  sortBy?: ProductSortOption;
}

export async function getProducts(params: GetProductsParams = {}): Promise<ProductListResponse> {
  const { search, page = 1, pageSize = 12, category, brand, minPrice, maxPrice, sortBy } = params;

  const queryParams: Record<string, string | number> = {
    pageNumber: page,
    pageSize: pageSize,
  };

  // Build search term combining user search with category/brand filters
  // The backend searchTerm searches in title, description, category name, and brand name
  const searchParts: string[] = [];

  if (search && search.trim().length >= 2) {
    searchParts.push(search.trim());
  }

  // Note: For exact category/brand filtering, we rely on client-side filtering
  // since backend searchTerm does partial matching across multiple fields
  if (searchParts.length > 0) {
    queryParams.searchTerm = searchParts.join(" ");
  }

  // Map category ID string to backend categoryId
  if (category && category !== "all") {
    const catId = parseInt(category, 10);
    if (!isNaN(catId)) {
        queryParams.categoryId = catId;
    }
  }

  // Map brand ID string to backend brandId
  if (brand && brand !== "all") {
    const brandId = parseInt(brand, 10);
    if (!isNaN(brandId)) {
        queryParams.brandId = brandId;
    }
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

  const products = backend.products ?? [];

  return {
    products,
    totalCount: backend.totalCount ?? products.length,
    page: backend.pageNumber ?? backend.page ?? page,
    pageSize: backend.pageSize ?? pageSize,
    totalPages: backend.totalPages ?? (Math.ceil((backend.totalCount ?? products.length) / (backend.pageSize ?? pageSize)) || 1),
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
