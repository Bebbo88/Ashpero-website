"use client";

import { useEffect, useState } from "react";
import { getPublicOrderSummary } from "@/services/orderService";
import { loadPendingCheckout } from "@/utils/checkoutSession";

function getOrderIdFromSearchParams(searchParams) {
  const queryOrderId = searchParams?.get("orderId");

  if (queryOrderId) {
    return queryOrderId;
  }

  const pendingCheckout = loadPendingCheckout();
  return pendingCheckout?.orderId || "";
}

export function useCheckoutSummary(searchParams, options = {}) {
  const shouldPoll = Boolean(options.poll);
  const [summary, setSummary] = useState(() => loadPendingCheckout());
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    const orderId = getOrderIdFromSearchParams(searchParams);

    if (!orderId) {
      return undefined;
    }

    let isMounted = true;
    let intervalId = null;

    async function loadSummary() {
      try {
        setStatus("loading");
        const nextSummary = await getPublicOrderSummary(orderId);

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
  }, [searchParams, shouldPoll]);

  return {
    orderId: getOrderIdFromSearchParams(searchParams),
    summary,
    status
  };
}
