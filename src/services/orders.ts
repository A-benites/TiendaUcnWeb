// src/services/orders.ts

// Usamos la importación CON NOMBRE para el cliente 'api'
import { api } from '@/lib/axios'; 
import { useQuery, UseQueryResult } from '@tanstack/react-query';

// --- Tipos de Datos (Basados en tus DTOs de C#) ---

export interface OrderItemDTO {
  id: number;
  quantity: number;
  priceAtMoment: number;
  titleAtMoment: string;
  descriptionAtMoment: string;
  imageAtMoment: string;
  discountAtMoment: number;
}

export interface OrderDTO {
  id: number;
  code: string;
  total: number;
  subTotal: number;
  createdAt: string | null;
  orderItems: OrderItemDTO[];
}

export interface OrderListDTO {
  orders: OrderDTO[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

export interface UserOrderFilterDTO {
  page: number;
  pageSize: number;
  code?: string;
}

// --- Funciones de Fetching ---

export async function getOrders(filter: UserOrderFilterDTO): Promise<OrderListDTO> {
  const params = {
    page: filter.page,
    pageSize: filter.pageSize,
    ...(filter.code && { code: filter.code }),
  };

  const response = await api.get('/api/orders', { params });
  return response.data.data;
}

export async function getOrderDetail(id: number): Promise<OrderDTO> {
  const response = await api.get(`/api/orders/${id}`);
  return response.data.data;
}


const ORDERS_QUERY_KEY = 'userOrders';

export const useOrdersQuery = (
  filter: UserOrderFilterDTO
): UseQueryResult<OrderListDTO, Error> => {
  return useQuery<OrderListDTO, Error>({
    queryKey: [ORDERS_QUERY_KEY, filter],
    queryFn: () => getOrders(filter),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
};
export const useOrderDetailQuery = (id: number): UseQueryResult<OrderDTO, Error> => {
  return useQuery<OrderDTO, Error>({
    queryKey: ['orderDetail', id],
    queryFn: () => getOrderDetail(id),
    enabled: id > 0,
  });
};