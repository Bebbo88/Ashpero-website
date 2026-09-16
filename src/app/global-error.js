"use client";

import { useEffect } from "react";

// Only triggers if the root layout itself throws (extremely rare — the
// per-locale error.js handles everything else). Next.js requires this file
// to render its own complete <html>/<body>, since it replaces the root
// layout entirely; the [locale] layout (and its LangProvider) isn't
// available here, so this stays plain/bilingual rather than using useLanguage().
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Unhandled root layout error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "24px",
            fontFamily: "sans-serif",
          }}
        >
          <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "12px" }}>
            Something Went Wrong / حدث خطأ ما
          </h1>
          <p style={{ color: "#666", marginBottom: "24px", maxWidth: "360px" }}>
            An unexpected error occurred. Please try again.
            <br />
            حصل خطأ غير متوقع. من فضلك حاول تاني.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: "14px 32px",
              borderRadius: "9999px",
              background: "#0c6d6d",
              color: "#fff",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            Try Again / حاول تاني
          </button>
        </div>
      </body>
    </html>
  );
}
