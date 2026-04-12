import React from "react";
import { cookies } from "next/headers";
import { fetchTips } from "@/services/tipService";
import TipsAndTricksClient from "./TipsAndTricksClient";

// Use ISR with a 10 second revalidation period.
// This gives us the speed of a static page without the hour-long cache.
export const dynamic = "force-static";
export const revalidate = 10;

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
