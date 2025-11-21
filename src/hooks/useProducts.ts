import { useQuery } from "@tanstack/react-query";
import { getProducts, getProductById } from "@/services/product.service";
import { ProductListResponse,ProductDetail } from "@/models/product.types";

export function useProducts(search?: string) {
  return useQuery<ProductListResponse>({
    queryKey: ["products", search],
    queryFn: () => getProducts(search),
  });
}

export function useProduct(id: number) {
  return useQuery<ProductDetail>({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: id > 0,
    staleTime: 1000 * 60,
    retry: 2,
  });
}
