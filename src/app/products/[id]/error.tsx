"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Opcional: Loguear el error a un servicio de reporte
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-full mb-4">
        <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
      </div>
      <h2 className="text-2xl font-bold mb-2">¡Algo salió mal!</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        No pudimos cargar los detalles del producto. Puede ser un problema de conexión o que el producto no exista.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} variant="outline">
          Intentar de nuevo
        </Button>
        <Button onClick={() => window.location.href = '/products'} variant="default">
          Volver al catálogo
        </Button>
      </div>
    </div>
  );
}
