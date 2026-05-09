"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ShoppingBag } from "lucide-react";

import { getSavedOrders } from "@/utils/ordersStorage";
import { getTrackedOrder } from "@/services/orderService";

function getStatusColor(status) {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-700";

    case "shipped":
      return "bg-blue-100 text-blue-700";

    case "processing":
      return "bg-amber-100 text-amber-700";

    case "cancelled":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

function getPaymentColor(status) {
  switch (status) {
    case "paid":
      return "bg-emerald-100 text-emerald-700";

    case "failed":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const savedOrders = getSavedOrders();

        if (!savedOrders.length) {
          setOrders([]);
          return;
        }

        const results = await Promise.all(
          savedOrders.map((order) => getTrackedOrder(order.merchantOrderId)),
        );

        setOrders(results.filter(Boolean));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  return (
    <main className="min-h-screen bg-bg-primary">
      <section className="container mx-auto px-4 py-10 md:py-14">
        <div className="mb-10 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange">
            <Package className="h-7 w-7" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-text-primary">My Orders</h1>

            <p className="mt-1 text-sm text-text-secondary">
              Track all your recent orders and payment statuses.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-3xl border border-border-color bg-bg-secondary p-5"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <div className="h-4 w-40 rounded bg-slate-200" />
                    <div className="mt-3 h-3 w-24 rounded bg-slate-200" />
                  </div>

                  <div className="h-8 w-24 rounded-full bg-slate-200" />
                </div>

                <div className="h-16 rounded-2xl bg-slate-100" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-border-color bg-bg-secondary px-6 py-16 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
              <ShoppingBag className="h-10 w-10" />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-text-primary">
              No Orders Yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-text-secondary">
              Looks like you haven’t placed any orders yet. Start exploring our
              products and place your first order.
            </p>

            <Link
              href="/all-products"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-5">
            {orders.map((order) => (
              <div
                key={order._id}
                className="overflow-hidden rounded-[28px] border border-border-color bg-bg-secondary shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-bold text-text-primary">
                        {order.merchantOrderId}
                      </h2>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusColor(
                          order.orderStatus,
                        )}`}
                      >
                        {order.orderStatus}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getPaymentColor(
                          order.paymentStatus,
                        )}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text-secondary">
                      <p>{order.customerName}</p>

                      <p>{new Date(order.createdAt).toLocaleDateString()}</p>

                      <p className="font-semibold text-text-primary">
                        EGP {order.finalPrice}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-2xl bg-bg-primary px-4 py-3">
                    <Package className="h-5 w-5 text-brand-orange" />

                    <div>
                      <p className="text-xs text-text-secondary">
                        Current Status
                      </p>

                      <p className="text-sm font-bold capitalize text-text-primary">
                        {order.orderStatus}
                      </p>
                    </div>
                  </div>
                </div>

                {order.items?.length ? (
                  <div className="border-t border-border-color bg-bg-primary/40 px-6 py-5">
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-4"
                        >
                          <div>
                            <p className="font-semibold text-text-primary">
                              {item.productName}
                            </p>

                            <p className="mt-1 text-sm text-text-secondary">
                              Qty: {item.quantity}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="font-semibold text-text-primary">
                              EGP {item.priceAtPurchase}
                            </p>

                            {item.size ? (
                              <p className="mt-1 text-xs text-text-secondary">
                                Size: {item.size}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
