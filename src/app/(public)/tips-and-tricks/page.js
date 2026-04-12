import React from "react";
import { cookies } from "next/headers";
import { fetchTips } from "@/services/tipService";
import TipsAndTricksClient from "./TipsAndTricksClient";

// Use force-dynamic to ensure the server component always fetches the latest data
// without any client-side loading spinners.
export const dynamic = "force-dynamic";
export const revalidate = 0;

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
