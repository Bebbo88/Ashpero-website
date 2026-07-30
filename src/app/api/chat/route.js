import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

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
      return new Response(
        JSON.stringify({ error: "Gemini API key is not configured on the server." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { history, message } = body;

    // We use the Gemini 2.5 Flash model which supports system instructions natively
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    // Format previous history into Gemini's format:
    const formattedHistory = (history || []).map((msg) => ({
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

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    return new Response(
      JSON.stringify({ response: responseText }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Gemini API Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to process AI chat request." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
