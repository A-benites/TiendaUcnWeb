import { OrderDTO } from "@/services/orders";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/utils/format";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

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
    <>
      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto rounded-md border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Código
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Items
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Total
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-border">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-muted/30 transition duration-150">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <span className="font-mono">{order.code}</span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {order.createdAt ? formatDate(order.createdAt) : "N/A"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200/80">
                    {order.orderItems.reduce((acc, item) => acc + item.quantity, 0)} productos
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-right">
                  {formatCurrency(order.total)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
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

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-background border rounded-lg p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Código</p>
                <p className="font-mono font-medium">{order.code}</p>
              </div>
              <Link href={`/orders/${order.id}`}>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Eye className="h-3 w-3" />
                  Ver
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Fecha</p>
                <p>{order.createdAt ? formatDate(order.createdAt) : "N/A"}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Items</p>
                <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-900">
                  {order.orderItems.reduce((acc, item) => acc + item.quantity, 0)} productos
                </span>
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-lg font-bold text-primary">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
