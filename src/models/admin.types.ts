// src/models/admin.types.ts

// --- Taxonomía ---
export interface TaxonomyItem {
  id: number;
  name: string;
}

export interface TaxonomyResponse {
  message: string;
  data: TaxonomyItem;
}

// --- Admin Orders ---
export interface AdminOrderSearchParams {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
}

// Coincide con OrderItemDTO.cs del backend
export interface AdminOrderItemDTO {
  id: number;
  quantity: number;
  priceAtMoment: number;
  titleAtMoment: string;
  descriptionAtMoment: string;
  imageAtMoment: string;
  discountAtMoment: number;
  // Campos calculados u opcionales
  productId?: number;
  productName?: string; // Fallback
}

// Coincide con OrderDTO.cs del backend
export interface AdminOrderDTO {
  id: number;
  code: string;
  total: number;
  subTotal: number;
  createdAt: string;
  // IMPORTANTE: El backend lo llama OrderItems, aquí orderItems (camelCase)
  orderItems: AdminOrderItemDTO[];

  // Status viene del enum OrderStatus del backend
  status?: string;

  // Datos del cliente que vienen del mapeo con User
  userId?: number;
  userName?: string;
  userEmail?: string;
}

export interface AdminOrderListResponse {
  orders: AdminOrderDTO[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}
