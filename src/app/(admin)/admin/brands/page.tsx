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
import { Edit, Trash2, Plus, Loader2, AlertTriangle, Bookmark } from "lucide-react";

export default function AdminBrandsPage() {
  const { items, isLoading, create, update, remove } = useAdminTaxonomy("brands");

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

  if (isLoading)
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bookmark className="h-6 w-6" /> Gestión de Marcas
        </h1>
        <Button
          onClick={() => {
            setFormName("");
            setIsCreateOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Nueva Marca
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
                  No hay marcas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Reuse Modals logic from Categories    (Sasdimplified for brevity) */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Marca</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label>Nombre</Label>
            <Input value={formName} onChange={(e) => setFormName(e.target.value)} />
          </div>
          <DialogFooter>
            <Button onClick={handleCreate}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Marca</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label>Nombre</Label>
            <Input value={formName} onChange={(e) => setFormName(e.target.value)} />
          </div>
          <DialogFooter>
            <Button onClick={handleUpdate}>Actualizar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Confirmar Eliminación</DialogTitle>
          </DialogHeader>
          <p>Si la marca tiene productos, no se podrá eliminar.</p>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
