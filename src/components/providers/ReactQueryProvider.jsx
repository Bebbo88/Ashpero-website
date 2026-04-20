"use client";

import { useMemo } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { queryClient } from "@/queries/queryClient";

const CACHE_PERSIST_KEY = "ashperoo-react-query-cache-v1";
const CACHE_MAX_AGE = 1000 * 60 * 60 * 24 * 30; // 30 days

export default function ReactQueryProvider({ children }) {
  const isBrowser = typeof window !== "undefined";

  const persister = useMemo(() => {
    if (!isBrowser) {
      return null;
    }

    return createSyncStoragePersister({
      storage: window.localStorage,
      key: CACHE_PERSIST_KEY,
      throttleTime: 1000,
    });
  }, [isBrowser]);

  if (!isBrowser || !persister) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: CACHE_MAX_AGE,
        buster: "home-cache-v1",
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
