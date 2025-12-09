import { useQuery } from "@tanstack/react-query";
import { getProducts, getProductById, GetProductsParams } from "@/services/product.service";
import { ProductListResponse, ProductDetail } from "@/models/product.types";

export function useProducts(params: GetProductsParams = {}) {
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

  return useQuery<ProductListResponse>({
    queryKey: ["products", { search, page, pageSize, categoryId, brandId, minPrice, maxPrice, sortBy }],
    queryFn: () => getProducts({ search, page, pageSize, categoryId, brandId, minPrice, maxPrice, sortBy }),
    placeholderData: (previousData) => previousData, // Mantiene datos anteriores mientras carga
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
