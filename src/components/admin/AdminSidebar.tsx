import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Tags, Bookmark, LogOut } from "lucide-react";

/**
 * <summary>
 * Component representing the fixed navigation sidebar for the administration panel.
 * </summary>
 * <returns>A React component rendering the navigation menu.</returns>
 */
export const AdminSidebar = () => {
  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-full">
      <div className="p-6 text-2xl font-bold border-b border-gray-800 flex items-center gap-2">
        <span className="text-blue-500">Admin</span>Panel
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link
          href="/admin/dashboard"
          className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
        >
          <LayoutDashboard className="mr-3 h-5 w-5" />
          Dashboard
        </Link>
        
        <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Catálogo
            </p>
        </div>

        <Link
          href="/admin/products"
          className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
        >
          <Package className="mr-3 h-5 w-5" />
          Productos
        </Link>

        <Link
          href="/admin/categories"
          className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
        >
          <Tags className="mr-3 h-5 w-5" />
          Categorías
        </Link>

        <Link
          href="/admin/brands"
          className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
        >
          <Bookmark className="mr-3 h-5 w-5" />
          Marcas
        </Link>

        <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Ventas
            </p>
        </div>

        <Link
          href="/admin/orders"
          className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
        >
          <ShoppingCart className="mr-3 h-5 w-5" />
          Pedidos
        </Link>
      </nav>
      
      <div className="p-4 border-t border-gray-800">
        <button className="flex items-center p-3 w-full rounded-lg hover:bg-red-900/50 text-red-400 hover:text-red-300 transition-colors">
          <LogOut className="mr-3 h-5 w-5" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};
