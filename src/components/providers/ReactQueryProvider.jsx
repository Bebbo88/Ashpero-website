"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/queries/queryClient";

export default function ReactQueryProvider({ children }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
