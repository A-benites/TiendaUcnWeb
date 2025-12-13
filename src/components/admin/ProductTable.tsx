import Image from "next/image";
import Link from "next/link";
import { ProductForAdminDTO, useToggleProductStatusMutation } from "@/services/admin-products";
import { Edit, Power, PowerOff, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface ProductTableProps {
  products: ProductForAdminDTO[];
}

export const ProductTable = ({ products }: ProductTableProps) => {
  const toggleMutation = useToggleProductStatusMutation();

  const handleToggleStatus = (id: number, title: string) => {
    toggleMutation.mutate(id, {
      onSuccess: () => toast.success(`Estado de "${title}" actualizado`)
    });
  };

  return (
    <div className="rounded-md border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead>Precio / Stock</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="hidden sm:table-cell">Ultima Edicion</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const isMutating = toggleMutation.isPending && toggleMutation.variables === product.id;

            const cn = (...classes: (string | undefined | false)[]) => {
              return classes.filter(Boolean).join(" ");
            };

            return (
              <TableRow key={product.id}>
                <TableCell className="font-medium text-muted-foreground">
                  #{product.id}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-md border bg-muted flex-shrink-0">
                      <Image
                        src={product.mainImageURL || "/placeholder.png"}
                        alt={product.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium truncate">{product.title}</span>
                      <span className="text-xs text-muted-foreground truncate">{product.brandName} - {product.categoryName}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold">{product.price}</span>
                    <span className={cn("text-xs", product.stock < 10 ? "text-red-500" : "text-green-600")}>
                      {product.stock} unids.
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={product.isAvailable ? "default" : "secondary"}>
                    {product.isAvailable ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs hidden sm:table-cell">
                  {format(new Date(product.updatedAt), "dd/MM/yy HH:mm")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/products/edit/${product.id}`}>
                        <Edit className="h-4 w-4 text-blue-500" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleStatus(product.id, product.title)}
                      disabled={isMutating}
                    >
                      {isMutating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : product.isAvailable ? (
                        <Power className="h-4 w-4 text-green-600" />
                      ) : (
                        <PowerOff className="h-4 w-4 text-red-500" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
