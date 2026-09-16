"use client";

import { useEffect, useState } from "react";
import { getPublicOrderSummary } from "@/services/orderService";
import { loadPendingCheckout } from "@/utils/checkoutSession";

function getOrderIdFromSearchParams(searchParams, pendingCheckout) {
  const queryOrderId = searchParams?.get("orderId");

  if (queryOrderId) {
    return queryOrderId;
  }

  return pendingCheckout?.orderId || "";
}

function getMerchantOrderIdFromSearchParams(searchParams, pendingCheckout) {
  const queryMerchantOrderId = searchParams?.get("merchantOrderId");

  if (queryMerchantOrderId) {
    return queryMerchantOrderId;
  }

  return pendingCheckout?.merchantOrderId || "";
}

export function useCheckoutSummary(searchParams, options = {}) {
  const shouldPoll = Boolean(options.poll);
  // Must start identical on server and client — sessionStorage has no value
  // during SSR, and reading it directly in a useState initializer (as this
  // used to) meant the client's first render disagreed with the server's,
  // the same hydration-mismatch anti-pattern already fixed once this session
  // in HomeDropperLoader. The actual sessionStorage read now only happens in
  // the effect below, which only ever runs client-side after hydration.
  const [pendingCheckout, setPendingCheckout] = useState(null);
  const [summary, setSummary] = useState(null);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    const loaded = loadPendingCheckout();
    setPendingCheckout(loaded);
    setSummary((current) => current ?? loaded);
  }, []);

  useEffect(() => {
    const orderId = getOrderIdFromSearchParams(searchParams, pendingCheckout);
    const merchantOrderId = getMerchantOrderIdFromSearchParams(searchParams, pendingCheckout);

    if (!orderId || !merchantOrderId) {
      return undefined;
    }

    let isMounted = true;
    let intervalId = null;

    async function loadSummary() {
      try {
        setStatus("loading");
        const nextSummary = await getPublicOrderSummary(orderId, merchantOrderId);

        if (!isMounted) {
          return;
        }

        setSummary(nextSummary);
        setStatus("success");
      } catch (_error) {
        if (!isMounted) {
          return;
        }

        setStatus("error");
      }
    }

    loadSummary();

    if (shouldPoll) {
      intervalId = window.setInterval(loadSummary, 3000);
    }

    return () => {
      isMounted = false;

      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [searchParams, shouldPoll, pendingCheckout]);

  return {
    orderId: getOrderIdFromSearchParams(searchParams, pendingCheckout),
    summary,
    status
  };
}
