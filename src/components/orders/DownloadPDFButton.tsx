"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { OrderPDF } from "./OrderPDF";
import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { OrderDTO } from "@/services/orders";
import { useEffect, useState } from "react";

interface DownloadPDFButtonProps {
  order: OrderDTO;
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showLabel?: boolean;
}

export const DownloadPDFButton = ({ 
  order, 
  variant = "outline", 
  size = "sm", 
  className,
  showLabel = true 
}: DownloadPDFButtonProps) => {
  const isClient = typeof window !== "undefined";

  if (!isClient) {
    return (
      <Button variant={variant} size={size} disabled className={className}>
        <FileText className="h-4 w-4" />
        {showLabel && <span className="ml-2">PDF</span>}
      </Button>
    );
  }

  return (
    <PDFDownloadLink
      document={<OrderPDF order={order} />}
      fileName={`orden-${order.code}.pdf`}
    >
      {/* @ts-expect-error - PDFDownloadLink children type definition might be outdated */}
      {({ blob, url, loading, error }) => (
        <Button variant={variant} size={size} disabled={loading} className={className}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
          {showLabel && <span className="ml-2">{loading ? "Generando..." : "Descargar PDF"}</span>}
        </Button>
      )}
    </PDFDownloadLink>
  );
};
