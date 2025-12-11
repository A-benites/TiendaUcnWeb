// app/(admin)/admin/layout.tsx

import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

/**
 * Componente que representa el Layout base para todas las rutas de /admin.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar: Estructura simple de navegación */}
      <AdminSidebar />
      
      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}