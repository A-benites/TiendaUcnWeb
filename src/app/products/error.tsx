"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PackageX } from "lucide-react";

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Products Error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
      <div className="bg-muted p-6 rounded-full mb-6">
        <PackageX className="h-12 w-12 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold mb-2">No pudimos cargar los productos</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Hubo un problema al conectar con el catálogo. Verifica tu conexión o intenta nuevamente.
      </p>
      <Button onClick={() => reset()}>Intentar de nuevo</Button>
    </div>
  );
}