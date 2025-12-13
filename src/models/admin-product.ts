
export interface ProductForAdmin {
  id: number;
  title: string;
  mainImageURL?: string;
  price: string;
  stock: number;
  stockIndicator: string;
  categoryName: string;
  brandName: string;
  statusName: string;
  isAvailable: boolean;
  updatedAt: Date;
}

export interface ListedProductsForAdmin {
  products: ProductForAdmin[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface AdminProductSearchParams {
  page: number;
  pageSize: number;
  search?: string;
  status?: 'available' | 'unavailable' | 'all';
}