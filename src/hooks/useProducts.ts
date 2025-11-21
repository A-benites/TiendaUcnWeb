import { useQuery } from "@tanstack/react-query";
import { getProducts, getProductById } from "@/services/product.service";
import { Product, ProductListResponse } from "@/models/product.types";

export function useProducts(search?: string) {
  return useQuery<ProductListResponse>({
    queryKey: ["products", search],
    queryFn: () => getProducts(search),
  });
}

export function useProduct(id: number) {
  return useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: id > 0,
  });
}
