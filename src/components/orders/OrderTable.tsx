import { OrderDTO } from "@/services/orders";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/utils/format";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/**
 * <summary>
 * Defines the properties required by the OrderTable component.
 * </summary>
 */
interface OrderTableProps {
  /** <summary>The list of orders (OrderDTO) to be displayed in the table.</summary> */
  orders: OrderDTO[];
}

/**
 * <summary>
 * Presentation component to display a list of customer orders in a paginated table format.
 * </summary>
 * <param name="props">The component's properties, containing the list of orders.</param>
 * <returns>A React component rendering the order table.</returns>
 */
export const OrderTable = ({ orders }: OrderTableProps) => {
  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Código
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Fecha
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Items
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-background divide-y divide-border">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-muted/30 transition duration-150">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <span className="font-mono">{order.code}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                {order.createdAt ? formatDate(order.createdAt) : "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                <Badge variant="secondary" className="font-normal">
                  {order.orderItems.reduce((acc, item) => acc + item.quantity, 0)} productos
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-right">
                {formatCurrency(order.total)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                <Link href={`/orders/${order.id}`}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Eye className="h-4 w-4 text-primary" />
                    <span className="sr-only">Ver detalle</span>
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
