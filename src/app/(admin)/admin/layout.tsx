
import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

/**
 * <summary>
 * Layout component that defines the structure for all administrative routes (/admin).
 * </summary>
 * <param name="props">The children components to be rendered within the main content area.</param>
 * <returns>A React component rendering the fixed sidebar and the main content area.</returns>
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar: Structure for fixed navigation */}
      <AdminSidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}