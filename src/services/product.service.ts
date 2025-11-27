import { api } from "@/lib/axios";
import { ProductListResponse, ProductDetail } from "@/models/product.types";

export interface GetProductsParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

export async function getProducts(params: GetProductsParams = {}): Promise<ProductListResponse> {
  const { search, page = 1, pageSize = 12 } = params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const queryParams: any = {
    pageNumber: page,
    pageSize: pageSize,
  };

  if (search && search.trim().length >= 2) {
    queryParams.searchTerm = search.trim();
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
