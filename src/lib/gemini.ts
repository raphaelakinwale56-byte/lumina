import { auth } from './firebase';

export async function getGeminiResponse(prompt: string, context: string = "") {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `System Instruction: You are Lumina, a premium literary assistant. Help users discover books, recommend titles based on their taste, and answer literary questions. Be elegant, insightful, and passionate about stories.\n\nContext: ${context}\n\nUser: ${prompt}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
