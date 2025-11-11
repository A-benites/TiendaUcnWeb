"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ReactNode } from "react";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: unknown) => {
        if (error && typeof error === "object") {
          const axiosError = error as AxiosError;
          const status = axiosError?.response?.status;
          if (typeof status === "number") {
            if (status >= 400 && status < 500 && status !== 408) {
              return false;
            }
          }
        }

        return failureCount < 3;
      },
      refetchOnWindowFocus: true,
    },
  },
});

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
