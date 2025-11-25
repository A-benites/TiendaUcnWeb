import { api } from "@/lib/axios";
import { ProductListResponse, ProductDetail } from "@/models/product.types";

export async function getProducts(search?: string): Promise<ProductListResponse> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: any = {
    pageNumber: 1,
    pageSize: 10,
  };

  if (search && search.trim().length >= 2) {
    params.searchTerm = search.trim();
  }

  const res = await api.get("/products", { params });
  const backend = res.data?.data ?? res.data ?? {};

  return {
    products: backend.products ?? [],
    totalCount: backend.totalCount ?? 0,
    page: backend.page ?? 1,
    pageSize: backend.pageSize ?? 10,
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
