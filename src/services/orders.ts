import { api } from "@/lib/axios";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { AxiosError } from "axios";

/**
 * <summary>
 * Data Transfer Object (DTO) representing a single item within an order.
 * </summary>
 */
export interface OrderItemDTO {
  /** <summary>Unique identifier for the order item.</summary> */
  id: number;
  /** <summary>Quantity of the product purchased.</summary> */
  quantity: number;
  /** <summary>Price of the product at the moment the order was placed.</summary> */
  priceAtMoment: number;
  /** <summary>Title of the product at the moment of purchase.</summary> */
  titleAtMoment: string;
  /** <summary>Description of the product at the moment of purchase.</summary> */
  descriptionAtMoment: string;
  /** <summary>Image URL of the product at the moment of purchase.</summary> */
  imageAtMoment: string;
  /** <summary>Discount percentage applied to the product at the moment of purchase.</summary> */
  discountAtMoment: number;
}

/**
 * <summary>
 * Data Transfer Object (DTO) representing a complete order detail.
 * </summary>
 */
export interface OrderDTO {
  /** <summary>Unique identifier for the order.</summary> */
  id: number;
  /** <summary>The unique code identifying the order.</summary> */
  code: string;
  /** <summary>The final total amount of the order (after discounts).</summary> */
  total: number;
  /** <summary>The subtotal amount of the order (before discounts).</summary> */
  subTotal: number;
  /** <summary>The current status of the order.</summary> */
  status: string;
  /** <summary>The date and time when the order was created.</summary> */
  createdAt: string | null;
  /** <summary>List of items included in the order.</summary> */
  orderItems: OrderItemDTO[];
}

/**
 * <summary>
 * Data Transfer Object (DTO) representing a paginated list of orders.
 * </summary>
 */
export interface OrderListDTO {
  /** <summary>List of orders in the current page.</summary> */
  orders: OrderDTO[];
  /** <summary>Total count of orders matching the filter criteria.</summary> */
  totalCount: number;
  /** <summary>Current page number.</summary> */
  currentPage: number;
  /** <summary>Number of items per page.</summary> */
  pageSize: number;
  /** <summary>Total number of pages available.</summary> */
  totalPages: number;
}

/**
 * <summary>
 * Data Transfer Object (DTO) for filtering and pagination parameters
 * when retrieving a user's order history.
 * </summary>
 */
export interface UserOrderFilterDTO {
  /** <summary>The page number to retrieve (starts at 1).</summary> */
  page: number;
  /** <summary>The number of orders per page.</summary> */
  pageSize: number;
  /** <summary>Optional filter to search by order code.</summary> */
  code?: string;
}

/**
 * <summary>
 * Fetches a paginated list of orders for the authenticated user.
 * </summary>
 * <param name="filter">The pagination and optional search parameters.</param>
 * <returns>A Promise resolving to an OrderListDTO object.</returns>
 * <remarks>
 * Includes contingency error handling for the workshop, returning an empty list
 * for 4xx errors instead of throwing, to prevent crashing the UI (401/403 errors).
 * </remarks>
 */
export async function getOrders(filter: UserOrderFilterDTO): Promise<OrderListDTO> {
  const params = {
    page: filter.page,
    pageSize: filter.pageSize,
    ...(filter.code && { code: filter.code }),
  };

  try {
    const response = await api.get("/orders", { params });
    return response.data.data;
  } catch (err) {
    // Log the error for debugging backend issues
    console.error("Error fetching orders. Check API connectivity or token validity:", err);

    const error = err as AxiosError; // Type casting for Axios properties

    // Contingency: If the error is a client error (4xx like 401/403/404), return empty data
    if (error.response && error.response.status >= 400 && error.response.status < 500) {
      return {
        orders: [],
        totalCount: 0,
        currentPage: filter.page,
        pageSize: filter.pageSize,
        totalPages: 0,
      };
    }
    // For server errors (5xx) or network errors, re-throw the error
    throw error;
  }
}

/**
 * <summary>
 * Fetches the detailed information for a specific order by its ID.
 * </summary>
 * <param name="id">The unique identifier of the order.</param>
 * <returns>A Promise resolving to an OrderDTO object (the order detail).</returns>
 */
export async function getOrderDetail(id: number): Promise<OrderDTO> {
  const response = await api.get(`/orders/${id}`);
  return response.data.data;
}

/**
 * <summary>
 * Creates a new order from the current backend cart.
 * </summary>
 * <returns>A Promise resolving to the created OrderDTO.</returns>
 */
export async function createOrder(): Promise<OrderDTO> {
  const response = await api.post("/orders");
  return response.data;
}

const ORDERS_QUERY_KEY = "userOrders";

/**
 * <summary>
 * React Query hook for fetching the paginated order list.
 * </summary>
 * <param name="filter">The filter and pagination parameters.</param>
 * <returns>The result object from the useQuery hook.</returns>
 */
export const useOrdersQuery = (filter: UserOrderFilterDTO): UseQueryResult<OrderListDTO, Error> => {
  return useQuery<OrderListDTO, Error>({
    queryKey: [ORDERS_QUERY_KEY, filter],
    queryFn: () => getOrders(filter),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
};

/**
 * <summary>
 * React Query hook for fetching the detailed information of a single order.
 * </summary>
 * <param name="id">The ID of the order to fetch. Query is disabled if id is 0 or less.</param>
 * <returns>The result object from the useQuery hook.</returns>
 */
export const useOrderDetailQuery = (id: number): UseQueryResult<OrderDTO, Error> => {
  return useQuery<OrderDTO, Error>({
    queryKey: ["orderDetail", id],
    queryFn: () => getOrderDetail(id),
    enabled: id > 0,
  });
};
