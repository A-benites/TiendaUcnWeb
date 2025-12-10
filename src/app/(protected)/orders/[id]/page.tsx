
'use client';

import { useOrderDetailQuery } from '@/services/orders';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';


const toMoney = (amount: number) => `$${amount.toFixed(2)}`;

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = Number(params.id); 

  const { data, isLoading, isError } = useOrderDetailQuery(orderId);

  if (isLoading) return <div className="text-center py-10">Cargando detalle del pedido...</div>;
  if (isError) return <div className="text-center py-10 text-red-600">Error al cargar el detalle del pedido.</div>;
  if (!data) return <div className="text-center py-10 text-gray-500">Pedido no encontrado o no autorizado.</div>;

  const order = data;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Detalle del Pedido #{order.code} 📄</h1>
      <p className="mb-6 text-gray-600">
        Fecha del Pedido: {order.createdAt
          ? format(new Date(order.createdAt), 'dd MMMM yyyy HH:mm') 
          : 'Fecha no registrada'
        }
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Resumen de Totales */}
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Resumen de Totales</h2>
          <div className="space-y-2">
            <p className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span className="font-medium">{toMoney(order.subTotal)}</span>
            </p>
            <p className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
              <span>TOTAL PAGADO:</span>
              <span className="text-green-600">{toMoney(order.total)}</span>
            </p>
          </div>

          {/* Opcional (Fase Final): Botón de Descarga de PDF */}
          <button
            onClick={() => alert("Función de descarga de PDF pendiente.")}
            className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Descargar Comprobante (PDF) ⬇️
          </button>
        </div>

        {/* Ítems del Pedido */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Productos ({order.orderItems.length})</h2>
          <div className="space-y-5">
            {order.orderItems.map((item) => (
              <div key={item.id} className="flex gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                {/* Aquí iría la imagen del producto */}
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0"
                     style={{backgroundImage: `url(${item.imageAtMoment})`, backgroundSize: 'cover', backgroundPosition: 'center'}}
                />
                <div className="flex-grow">
                  <h3 className="font-medium text-lg">{item.titleAtMoment}</h3>
                  <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                  {item.discountAtMoment > 0 && (
                    <p className="text-xs text-red-500 font-semibold">Descuento aplicado: {item.discountAtMoment}%</p>
                  )}
                </div>
                <div className="text-right flex flex-col justify-end">
                  <p className="font-semibold text-gray-900">
                    {toMoney(item.priceAtMoment * item.quantity * (1 - item.discountAtMoment / 100))}
                  </p>
                  <p className="text-xs text-gray-400">
                    @{toMoney(item.priceAtMoment)} c/u
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}