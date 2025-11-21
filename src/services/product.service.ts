import { api } from "@/lib/axios";
import { ProductListResponse, ProductDetail } from "@/models/product.types";

export async function getProducts(search?: string): Promise<ProductListResponse> {
  const res = await api.get("/products", {
    params: {
      pageNumber: 1,
      pageSize: 10,
      searchTerm: search || undefined,
    },
  });
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
  console.log("Respuesta API completa:", res.data);
  
  const payload = res.data?.data;
  console.log("Payload extraído:", payload);

  if (!payload) {
    throw new Error("Producto no encontrado");
  }

  return payload as ProductDetail;
}
