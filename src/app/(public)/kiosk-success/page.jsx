"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Receipt, Copy, CheckCircle2, CircleDollarSign } from "lucide-react";
import { useState } from "react";

export default function KioskSuccessPage() {
  const searchParams = useSearchParams();

  const reference = searchParams.get("reference") || "";
  const orderId = searchParams.get("orderId") || "";

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!reference) return;

    try {
      await navigator.clipboard.writeText(reference);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (_error) {}
  };

  return (
    <div className="min-h-screen bg-bg-primary px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-3xl border border-border-color bg-white shadow-card">
          <div className="bg-brand-mint/10 px-6 py-10 text-center border-b border-border-color">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-brand-mint text-white shadow-lg">
              <Receipt className="h-10 w-10" />
            </div>

            <h1 className="font-playfair text-3xl font-bold text-text-primary">
              Fawry Payment Reference
            </h1>

            <p className="mt-3 text-sm text-text-secondary">
              Use the following code to complete your payment through Fawry,
              Aman, Masary, Momken, or Bee.
            </p>
          </div>

          <div className="px-6 py-8">
            <div className="rounded-2xl border border-dashed border-brand-mint bg-brand-mint/5 p-6 text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">
                Payment Reference
              </p>

              <div className="break-all font-mono text-3xl font-bold tracking-[0.15em] text-brand-mint">
                {reference || "N/A"}
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-mint px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Reference
                  </>
                )}
              </button>
            </div>

            <div className="mt-8 rounded-2xl border border-border-color bg-bg-secondary/40 p-5">
              <div className="mb-4 flex items-center gap-2">
                <CircleDollarSign className="h-5 w-5 text-brand-mint" />

                <h2 className="font-semibold text-text-primary">How to pay</h2>
              </div>

              <ol className="space-y-3 text-sm leading-7 text-text-secondary">
                <li>
                  1. Visit the nearest Fawry, Aman, Masary, Momken, or Bee
                  branch.
                </li>

                <li>
                  2. Tell the cashier you want to pay using a payment reference
                  code.
                </li>

                <li>3. Provide the reference code shown above.</li>

                <li>
                  4. Once payment is completed, your order will be confirmed
                  automatically.
                </li>
              </ol>
            </div>

            {orderId ? (
              <div className="mt-6 text-center text-sm text-text-secondary">
                Order ID:
                <span className="ms-2 font-semibold text-text-primary">
                  {orderId}
                </span>
              </div>
            ) : null}

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="flex-1 rounded-xl bg-brand-mint px-5 py-3 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Back to Home
              </Link>

              <Link
                href="/all-products"
                className="flex-1 rounded-xl border border-border-color px-5 py-3 text-center text-sm font-semibold text-text-primary transition-colors hover:bg-bg-secondary"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
