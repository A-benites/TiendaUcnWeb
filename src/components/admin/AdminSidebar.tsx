import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Tags, Bookmark, LogOut, Home } from "lucide-react";

interface AdminSidebarProps {
  onNavigate?: () => void;
}

/**
 * <summary>
 * Component representing the fixed navigation sidebar for the administration panel.
 * </summary>
 * <returns>A React component rendering the navigation menu.</returns>
 */
export const AdminSidebar = ({ onNavigate }: AdminSidebarProps) => {
  const handleClick = () => {
    onNavigate?.();
  };

  return (
    <div className="w-full bg-gray-900 text-white flex flex-col h-full">
      <div className="p-4 md:p-6 text-xl md:text-2xl font-bold border-b border-gray-800 flex items-center gap-2">
        <span className="text-blue-500">Admin</span>Panel
      </div>

      <nav className="flex-1 p-3 md:p-4 space-y-1 md:space-y-2 overflow-y-auto">
        <Link
          href="/admin/dashboard"
          onClick={handleClick}
          className="flex items-center p-2.5 md:p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
        >
          <LayoutDashboard className="mr-3 h-5 w-5" />
          Dashboard
        </Link>

        <div className="pt-3 md:pt-4 pb-2">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Catálogo
          </p>
        </div>

        <Link
          href="/admin/products"
          onClick={handleClick}
          className="flex items-center p-2.5 md:p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
        >
          <Package className="mr-3 h-5 w-5" />
          Productos
        </Link>

        <Link
          href="/admin/categories"
          onClick={handleClick}
          className="flex items-center p-2.5 md:p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
        >
          <Tags className="mr-3 h-5 w-5" />
          Categorías
        </Link>

        <Link
          href="/admin/brands"
          onClick={handleClick}
          className="flex items-center p-2.5 md:p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
        >
          <Bookmark className="mr-3 h-5 w-5" />
          Marcas
        </Link>

        <div className="pt-3 md:pt-4 pb-2">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Ventas
          </p>
        </div>

        <Link
          href="/admin/orders"
          onClick={handleClick}
          className="flex items-center p-2.5 md:p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
        >
          <ShoppingCart className="mr-3 h-5 w-5" />
          Pedidos
        </Link>
      </nav>

      <div className="p-3 md:p-4 border-t border-gray-800 space-y-2">
        <Link
          href="/"
          onClick={handleClick}
          className="flex items-center p-2.5 md:p-3 w-full rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
        >
          <Home className="mr-3 h-5 w-5" />
          Ir a la Tienda
        </Link>
        <button className="flex items-center p-2.5 md:p-3 w-full rounded-lg hover:bg-red-900/50 text-red-400 hover:text-red-300 transition-colors">
          <LogOut className="mr-3 h-5 w-5" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};
