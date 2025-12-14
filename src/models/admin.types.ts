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

  // NOTA: Tu OrderDTO.cs actual NO tiene la propiedad Status.
  // Asumiremos que la agregas o que viene extra, para que el frontend funcione.
  status?: string;

  // Estos campos no están en tu OrderDTO.cs, pero el diseño los usa.
  // Si no vienen del backend, aparecerán vacíos.
  userId?: string;
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
