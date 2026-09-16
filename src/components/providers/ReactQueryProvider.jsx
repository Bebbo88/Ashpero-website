"use client";

import { useEffect, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { queryClient } from "@/queries/queryClient";

const CACHE_PERSIST_KEY = "ashperoo-react-query-cache-v1";
const CACHE_MAX_AGE = 1000 * 60 * 60 * 24 * 7; // 7 days (safe 32-bit integer)

// Only ever persist public catalog data. Any future query namespace (e.g. an
// authenticated account/order-history query) is excluded by default and must
// be added here deliberately, so account-scoped data never lands in
// localStorage by accident.
const PERSISTABLE_QUERY_NAMESPACES = ["home", "offer", "product", "tips"];

// `queryClient` is a module-level singleton, but this provider can remount
// without a full page reload (e.g. navigating between locale segments like
// "/" and "/ar" remounts the layout tree). persistQueryClient() must only
// ever be wired up once per browser session, or the second call conflicts
// with the first's still-active subscription/restore.
let hasPersisted = false;

export default function ReactQueryProvider({ children }) {
  useEffect(() => {
    if (typeof window === "undefined" || hasPersisted) return;
    hasPersisted = true;

    try {
      const persister = createSyncStoragePersister({
        storage: window.localStorage,
        key: CACHE_PERSIST_KEY,
        throttleTime: 1000,
      });

      persistQueryClient({
        queryClient,
        persister,
        maxAge: CACHE_MAX_AGE,
        // Tied to the app version so a deploy that changes cached shapes/prices
        // invalidates old persisted data instead of serving it for up to 7 days.
        buster: process.env.NEXT_PUBLIC_APP_VERSION || "unversioned",
        dehydrateOptions: {
          shouldDehydrateQuery: (query) =>
            PERSISTABLE_QUERY_NAMESPACES.includes(query.queryKey?.[0]),
        },
      });
    } catch (err) {
      console.warn("React Query persistence error:", err);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

