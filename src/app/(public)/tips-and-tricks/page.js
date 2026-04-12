import React from "react";
import { cookies } from "next/headers";
import { fetchTips } from "@/services/tipService";
import TipsAndTricksClient from "./TipsAndTricksClient";

// Force the page to be static and revalidate occasionally if needed,
// or just let it be fully static.
export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour

export default async function TipsAndTricksPage() {
  // 1. Get current locale from cookies (set by our LangProvider)
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
