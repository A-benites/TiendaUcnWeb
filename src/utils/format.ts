// src/utils/format.ts

/**
 * Formats a number as Chilean Pesos (CLP).
 * Example: 15000 -> "$15.000"
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(amount);
};

/**
 * Formats a date string to a readable Spanish format.
 * Example: 2023-12-15T10:00:00 -> "15 de diciembre de 2023"
 */
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return "Fecha desconocida";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

/**
 * Translates backend status codes to user-friendly Spanish text and colors.
 */
export const getOrderStatus = (status: string) => {
  const statusMap: Record<string, { label: string; color: string }> = {
    Pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800" },
    Paid: { label: "Pagado", color: "bg-blue-100 text-blue-800" },
    Shipped: { label: "Enviado", color: "bg-purple-100 text-purple-800" },
    Delivered: { label: "Entregado", color: "bg-green-100 text-green-800" },
    Cancelled: { label: "Cancelado", color: "bg-red-100 text-red-800" },
    Processing: { label: "Procesando", color: "bg-orange-100 text-orange-800" },
  };

  return statusMap[status] || { label: status, color: "bg-gray-100 text-gray-800" };
};
