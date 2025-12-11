/* eslint-disable @next/next/no-img-element */
// src/components/admin/ProductTable.tsx

import { ProductForAdminDTO, useToggleProductStatusMutation } from '@/services/admin-products';
import { FaEdit, FaToggleOn, FaToggleOff, FaSpinner } from 'react-icons/fa';
import { format } from 'date-fns';
import Link from 'next/link';

interface ProductTableProps {
  products: ProductForAdminDTO[];
}

/**
 * Tabla de presentación que muestra los productos y las acciones de administración.
 */
export const ProductTable = ({ products }: ProductTableProps) => {
  // Implementar mutaciones para las acciones (PATCH /api/admin/products/[id]/status)
  const toggleMutation = useToggleProductStatusMutation();

  const handleToggleStatus = (id: number) => {
    if (confirm("Are you sure you want to change the product status?")) {
      toggleMutation.mutate(id);
    }
  };

  return (
    <div className="overflow-x-auto shadow-lg sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Product</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Price/Stock</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Last Update</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => {
            const isMutating = toggleMutation.isPending && toggleMutation.variables === product.id;
            
            return (
              <tr key={product.id} className="hover:bg-gray-50 transition duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.id}</td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img className="h-10 w-10 rounded-full mr-4 object-cover"
                         src={product.mainImageURL || '/placeholder-image.png'} 
                         alt={product.title} />
                    <span className="text-sm font-medium text-gray-900">{product.title}</span>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <p className="font-semibold">{product.price}</p>
                  <p className={`text-xs ${product.stockIndicator === 'Low' ? 'text-red-500' : 'text-green-500'}`}>
                    Stock: {product.stock} ({product.stockIndicator})
                  </p>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <span 
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {product.isAvailable ? 'Available' : 'Inactive'}
                  </span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(product.updatedAt), 'dd/MM/yy HH:mm')}
                </td>
                
                {/* Acciones */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                  <div className="flex justify-center space-x-3">
                    {/* Acción 1: Editar (simplemente redirige) */}
                    <Link 
                      href={`/admin/products/edit/${product.id}`} 
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Edit Product"
                    >
                      <FaEdit className="w-5 h-5" />
                    </Link>
                    
                    {/* Acción 2: Activar/Desactivar (Usa la mutación) */}
                    <button
                      onClick={() => handleToggleStatus(product.id)}
                      disabled={isMutating}
                      className={`text-gray-500 hover:text-gray-900 ${isMutating ? 'opacity-50' : ''}`}
                      title={product.isAvailable ? 'Deactivate' : 'Activate'}
                    >
                      {isMutating ? (
                        <FaSpinner className="w-5 h-5 animate-spin text-gray-500" />
                      ) : product.isAvailable ? (
                        <FaToggleOn className="w-5 h-5 text-green-500" />
                      ) : (
                        <FaToggleOff className="w-5 h-5 text-red-500" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};