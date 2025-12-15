"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Admin Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
      <div className="bg-red-50 text-red-600 p-4 rounded-full mb-4">
        <AlertCircle className="h-10 w-10" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Algo salió mal en la administración</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Ocurrió un error inesperado al cargar esta sección. Por favor, intenta recargar la página.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => window.location.reload()} variant="outline">
          Recargar página
        </Button>
        <Button onClick={() => reset()}>Intentar de nuevo</Button>
      </div>
    </div>
  );
}