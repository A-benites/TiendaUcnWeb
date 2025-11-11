export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetProductsParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface GetProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}
