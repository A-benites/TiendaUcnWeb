"use client";

import { useState } from "react";
import { useAdminTaxonomy } from "@/services/admin-taxonomy";
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
import { Edit, Trash2, Plus, Loader2, AlertTriangle, Layers, RefreshCw } from "lucide-react";
// Asegúrate de que la ruta coincida con donde creaste el archivo de skeletons
import { TableSkeleton } from "@/components/ui/skeletons";

export default function AdminCategoriesPage() {
  // Desestructuramos isError y refetch del hook (Asegúrate de haber actualizado el servicio)
  const { items, isLoading, isError, refetch, create, update, remove } =
    useAdminTaxonomy("categories");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ id: number; name: string } | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [formName, setFormName] = useState("");

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

  // 1. Loading State con Skeleton
  if (isLoading) {
    return (
      <div className="p-6">
        <TableSkeleton rows={5} />
      </div>
    );
  }

  // 2. Error State con Botón Reintentar
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-10 gap-4 text-red-500">
        <p>Error al cargar las categorías.</p>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" /> Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Layers className="h-6 w-6" /> Gestión de Categorías
        </h1>
        <Button
          onClick={() => {
            setFormName("");
            setIsCreateOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Nueva Categoría
        </Button>
      </div>

      <div className="border rounded-md bg-white dark:bg-black">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 uppercase">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-muted/20">
                <td className="px-6 py-4 font-medium">{item.id}</td>
                <td className="px-6 py-4">{item.name}</td>
                <td className="px-6 py-4 text-right space-x-2">
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
            {items.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center">
                  No hay categorías.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Crear */}
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
