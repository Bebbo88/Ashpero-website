import React from "react";
import { cookies } from "next/headers";
import { fetchTips } from "@/services/tipService";
import TipsAndTricksClient from "./TipsAndTricksClient";
import { unstable_noStore as noStore } from "next/cache";

// Force the page to be dynamic to ensure fresh data fetching on every request
export const dynamic = "force-dynamic";

export default async function TipsAndTricksPage() {
  // 1. Opt out of the Next.js Data Cache for this request
  noStore();

  // 2. Get current locale from cookies (set by our LangProvider)
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";

  // 2. Fetch data directly on the server
  let initialTips = [];
  try {
    initialTips = await fetchTips(locale);
  } catch (error) {
    console.error("Error fetching tips on server:", error);
  }

  // 3. Pass data to the Client Component for interactive UI
  return <TipsAndTricksClient initialTips={initialTips} />;
}
