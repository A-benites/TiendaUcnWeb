

import Link from 'next/link';
import { FaBoxes, FaHome, FaSignOutAlt, FaShoppingCart } from 'react-icons/fa';

/**
 * <summary>
 * Component representing the fixed navigation sidebar for the administration panel.
 * </summary>
 * <returns>A React component rendering the navigation menu.</returns>
 */
export const AdminSidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        Admin Panel
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Link href="/admin/dashboard" className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition duration-150">
          <FaHome className="mr-3" /> Dashboard
        </Link>
        <Link href="/admin/products" className="flex items-center p-3 rounded-lg bg-gray-700 hover:bg-gray-700 transition duration-150">
          <FaBoxes className="mr-3" /> Products
        </Link>
        
        <Link href="/admin/orders" className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition duration-150">
          <FaShoppingCart className="mr-3" /> Orders
        </Link>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button className="flex items-center p-3 w-full rounded-lg hover:bg-red-600 transition duration-150">
          <FaSignOutAlt className="mr-3" /> Logout
        </button>
      </div>
    </div>
  );
};