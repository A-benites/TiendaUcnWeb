import { api } from "@/lib/axios";
import { ProductListResponse, Product } from "@/models/product.types";

export async function getProducts(search?: string): Promise<ProductListResponse> {
  const res = await api.get("/products", {
    params: {
      pageNumber: 1,
      pageSize: 10,
      searchTerm: search || undefined,
    },
  });

  console.log("API response:", res.data); // 🔍 Para depurar

  // Soporte para distintos formatos de payload
  const backend = res.data?.data ?? res.data ?? {};

  return {
    products: backend.products ?? [],
    totalCount: backend.totalCount ?? 0,
    page: backend.page ?? 1,
    pageSize: backend.pageSize ?? 10,
    totalPages: backend.totalPages ?? 0,
  };
}

export async function getProductById(id: number): Promise<Product> {
  const res = await api.get(`/products/${id}`);
  const payload = res.data?.data ?? res.data;
  return payload as Product;
}
