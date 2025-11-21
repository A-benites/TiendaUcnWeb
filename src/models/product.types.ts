export interface Product {
  id: number;
  title: string;
  description: string;
  mainImageURL: string;
  price: number;
  discount: number;
  finalPrice: number;
  stock: number;
  categoryName: string;
  brandName: string;
}

export interface ProductListResponse {
  products: Product[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductDetail {
  id: number;
  title: string;
  description: string;
  imagesURL: string[];
  price: string;
  discount: number;
  finalPrice: string;
  stock: number;
  stockIndicator: string;
  categoryName: string;
  brandName: string;
  statusName: string;
  isAvailable: boolean;
}