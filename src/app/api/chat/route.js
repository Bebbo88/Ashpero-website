import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY_MESSAGES = 20;
const REQUEST_TIMEOUT_MS = 20000;

// Best-effort per-instance rate limit — no new infra, just enough to close
// the unbounded-cost abuse vector. Resets on redeploy/restart and is not
// shared across instances, but meaningfully raises the cost of abuse.
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const requestTimestampsByIp = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const recentTimestamps = (requestTimestampsByIp.get(ip) || []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  recentTimestamps.push(now);
  requestTimestampsByIp.set(ip, recentTimestamps);

  return recentTimestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

function getClientIp(req) {
  const forwardedFor = req.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.headers.get("x-real-ip") || "unknown";
}

function jsonResponse(payload, status) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// System persona configuration for Ashpero skincare bot
const SYSTEM_INSTRUCTION = `You are Dr. ASH, an advanced AI Dermatology and Skincare expert explicitly designed for the "Ashpero" e-commerce brand.
Your name is strictly "Dr. ASH" (or Ash). Never refer to yourself as "Dr. Skincare". When introducing yourself or responding to questions about your identity, always state that you are "Dr. ASH".
Be friendly, professional, concise, and helpful.
You offer advice on skincare routines, ingredient benefits (like Vitamin C, Retinol, Niacinamide), and resolving common skin issues.
Always politely refer to consulting a real dermatologist if a user describes a severe medical condition.
Use markdown formatting where appropriate to make your responses easy to read.`;

export async function POST(req) {
  try {
    if (!genAI) {
      return jsonResponse({ error: "Gemini API key is not configured on the server." }, 500);
    }

    if (isRateLimited(getClientIp(req))) {
      return jsonResponse(
        { error: "Too many requests. Please wait a moment and try again." },
        429,
      );
    }

    const body = await req.json();
    const { history, message } = body || {};

    if (typeof message !== "string" || !message.trim()) {
      return jsonResponse({ error: "message is required" }, 400);
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return jsonResponse(
        { error: `message must be ${MAX_MESSAGE_LENGTH} characters or fewer` },
        400,
      );
    }

    // We use the Gemini 2.5 Flash model which supports system instructions natively
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    // Format previous history into Gemini's format, capped so a client can't
    // send an unbounded history array on every request.
    const formattedHistory = (Array.isArray(history) ? history : [])
      .slice(-MAX_HISTORY_MESSAGES)
      .filter(
        (msg) =>
          msg && typeof msg.text === "string" && msg.text.length <= MAX_MESSAGE_LENGTH,
      )
      .map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }));

    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    });

    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), REQUEST_TIMEOUT_MS);

    let result;
    try {
      result = await chat.sendMessage(message, { signal: abortController.signal });
    } finally {
      clearTimeout(timeoutId);
    }

    const responseText = result.response.text();

    return jsonResponse({ response: responseText }, 200);
  } catch (error) {
    console.error("Gemini API Error:", error);

    if (error.name === "AbortError") {
      return jsonResponse({ error: "The AI assistant took too long to respond." }, 504);
    }

    return jsonResponse({ error: error.message || "Failed to process AI chat request." }, 500);
  }
}
