"use client";

import { useState, useMemo } from "react";
import { useAdminTaxonomy } from "@/services/admin-taxonomy";
import { TaxonomyTableSkeleton } from "@/components/admin/skeletons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Edit, Trash2, Plus, AlertTriangle, Layers, Search } from "lucide-react";

export default function AdminCategoriesPage() {
  // Desestructuramos isError y refetch del hook (Asegúrate de haber actualizado el servicio)
  const { items, isLoading, isError, refetch, create, update, remove } =
    useAdminTaxonomy("categories");

  // Ensure items is always an array
  const safeItems = Array.isArray(items) ? items : [];

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ id: number; name: string } | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar items por búsqueda
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return safeItems;
    return safeItems.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [safeItems, searchTerm]);

  const handleCreate = () => {
    if (!formName.trim()) return;
    create.mutate(formName, {
      onSuccess: () => {
        setIsCreateOpen(false);
        setFormName("");
      },
    });
  };

  const handleUpdate = () => {
    if (!editingItem || !formName.trim()) return;
    update.mutate(
      { id: editingItem.id, name: formName },
      {
        onSuccess: () => {
          setEditingItem(null);
          setFormName("");
        },
      }
    );
  };

  const handleDelete = () => {
    if (deletingId) remove.mutate(deletingId, { onSuccess: () => setDeletingId(null) });
  };

  if (isLoading) return <TaxonomyTableSkeleton />;

  return (
    <div className="space-y-6">
      {/* Header responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <Layers className="h-5 w-5 sm:h-6 sm:w-6" /> Gestión de Categorías
        </h1>
        <Button
          onClick={() => {
            setFormName("");
            setIsCreateOpen(true);
          }}
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" /> Nueva Categoría
        </Button>
      </div>

      {/* Barra de búsqueda */}
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar categoría..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Vista Desktop - Tabla */}
      <div className="hidden sm:block border rounded-md bg-white dark:bg-black overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 uppercase">
            <tr>
              <th className="px-4 md:px-6 py-3">ID</th>
              <th className="px-4 md:px-6 py-3">Nombre</th>
              <th className="px-4 md:px-6 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-muted/20">
                <td className="px-4 md:px-6 py-4 font-medium">{item.id}</td>
                <td className="px-4 md:px-6 py-4">{item.name}</td>
                <td className="px-4 md:px-6 py-4 text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFormName(item.name);
                      setEditingItem(item);
                    }}
                  >
                    <Edit className="h-4 w-4 text-blue-500" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeletingId(item.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </td>
              </tr>
            ))}
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                  {searchTerm ? "No se encontraron categorías." : "No hay categorías."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Vista Mobile - Cards */}
      <div className="sm:hidden space-y-3">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border rounded-lg">
            {searchTerm ? "No se encontraron categorías." : "No hay categorías."}
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border rounded-lg bg-background"
            >
              <div>
                <p className="text-xs text-muted-foreground">ID: {item.id}</p>
                <p className="font-medium">{item.name}</p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setFormName(item.name);
                    setEditingItem(item);
                  }}
                >
                  <Edit className="h-4 w-4 text-blue-500" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setDeletingId(item.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modales */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Categoría</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            <Label>Nombre</Label>
            <Input value={formName} onChange={(e) => setFormName(e.target.value)} />
          </div>
          <DialogFooter>
            <Button onClick={handleCreate} disabled={create.isPending}>
              {create.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Editar */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Categoría</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            <Label>Nombre</Label>
            <Input value={formName} onChange={(e) => setFormName(e.target.value)} />
          </div>
          <DialogFooter>
            <Button onClick={handleUpdate} disabled={update.isPending}>
              {update.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Actualizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Eliminar */}
      <Dialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600 flex gap-2">
              <AlertTriangle /> Confirmar Eliminación
            </DialogTitle>
          </DialogHeader>
          <p>¿Seguro? No se podrá eliminar si tiene productos asociados.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingId(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={remove.isPending}>
              {remove.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
