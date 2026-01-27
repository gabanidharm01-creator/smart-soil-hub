export async function getGeminiResponse(prompt: string): Promise<string> {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "";

    const response = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: prompt })
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const message =
        (errorBody && (errorBody.error || errorBody.reply)) ||
        `Backend error with status ${response.status}`;
      throw new Error(message);
    }

    const data = (await response.json()) as { reply?: string };

    if (!data.reply) {
      throw new Error("No reply received from backend.");
    }

    return data.reply;
  } catch (error) {
    console.error("Gemini frontend error:", error);

    if (error instanceof Error) {
      throw new Error(`Failed to get AI response from Gemini: ${error.message}`);
    }
    throw new Error(`Failed to get AI response from Gemini`);
  }
}

export function isGeminiConfigured(): boolean {
  // Frontend no longer knows the API key.
  // Consider it "configured" if either:
  // - VITE_API_BASE_URL is a non-empty string, or
  // - it's undefined and you're relying on a dev proxy (/api/*).
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  if (typeof baseUrl === "string") {
    return baseUrl.trim().length > 0;
  }

  // If baseUrl is undefined, we assume a relative /api/gemini proxy is set up.
  return true;
}
