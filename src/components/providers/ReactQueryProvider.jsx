"use client";

import { useState, useEffect, useMemo } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { queryClient } from "@/queries/queryClient";

const CACHE_PERSIST_KEY = "ashperoo-react-query-cache-v1";
const CACHE_MAX_AGE = 1000 * 60 * 60 * 24 * 30; // 30 days

export default function ReactQueryProvider({ children }) {
  // ── Hydration-safe approach ──
  // Render with a plain QueryClientProvider on the very first paint
  // (both server-side AND client-side first render).
  // Only after the component mounts do we switch to the persisted
  // provider – this guarantees the initial client render matches
  // the server HTML (empty/loading state), avoiding a mismatch
  // between cached data (client) vs no-data (server).
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const persister = useMemo(() => {
    if (!isMounted) return null;

    return createSyncStoragePersister({
      storage: window.localStorage,
      key: CACHE_PERSIST_KEY,
      throttleTime: 1000,
    });
  }, [isMounted]);

  // Before mount (SSR + first client render) → plain provider, no cache restore
  if (!isMounted || !persister) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  // After mount → persisted provider restores cache *after* hydration is done
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
