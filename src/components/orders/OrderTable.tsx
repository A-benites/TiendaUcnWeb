

import { OrderDTO } from '@/services/orders';
import Link from 'next/link';
import { format } from 'date-fns';

// Helper simple para moneda (asume que tienes algo similar o lo implementas)
const toMoney = (amount: number) => `$${amount.toFixed(2)}`;

interface OrderTableProps {
  orders: OrderDTO[];
}

export const OrderTable = ({ orders }: OrderTableProps) => {
  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Código</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Fecha</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider text-right">Total</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50 transition duration-150">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                <Link href={`/orders/${order.id}`}>{order.code}</Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.createdAt 
                ? format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm') 
                : 'N/A'
            }
                </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800 text-right">
                {toMoney(order.total)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <Link href={`/orders/${order.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                  Ver Detalle
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};