import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();

console.log("PORT:", process.env.PORT);
console.log("API KEY EXISTS:", !!process.env.GEMINI_API_KEY);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from frontend build
const frontendBuildPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendBuildPath));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
console.log('Using Gemini model:', MODEL_NAME);

// Fallback crop recommendation logic
function getLocalRecommendation(N, P, K, temperature, humidity, ph, rainfall) {
  const crops = {
    rice: { score: 0, emoji: '🍚' },
    maize: { score: 0, emoji: '🌽' },
    chickpea: { score: 0, emoji: '🫘' },
    "kidney beans": { score: 0, emoji: '🫘' },
    pigeonpea: { score: 0, emoji: '🫘' },
    mothbeans: { score: 0, emoji: '🫘' },
    mungbean: { score: 0, emoji: '🫘' },
    blackgram: { score: 0, emoji: '🫘' },
    lentil: { score: 0, emoji: '🫘' },
    pomegranate: { score: 0, emoji: '🍎' },
    banana: { score: 0, emoji: '🍌' },
    mango: { score: 0, emoji: '🥭' },
    grapes: { score: 0, emoji: '🍇' },
    watermelon: { score: 0, emoji: '🍉' },
    muskmelon: { score: 0, emoji: '🍈' },
    apple: { score: 0, emoji: '🍎' },
    orange: { score: 0, emoji: '🍊' },
    papaya: { score: 0, emoji: '🧡' },
    coconut: { score: 0, emoji: '🥥' },
    cotton: { score: 0, emoji: '☁️' },
    sugarcane: { score: 0, emoji: '🍯' },
    tobacco: { score: 0, emoji: '🚬' },
    jute: { score: 0, emoji: '📦' }
  };

  // Scoring logic based on inputs
  if (temperature >= 20 && temperature <= 30 && humidity >= 60 && rainfall >= 150) {
    crops.rice.score += 20;
    crops.maize.score += 15;
  }
  if (N >= 40 && P >= 20 && K >= 150) {
    crops.rice.score += 15;
    crops.maize.score += 15;
  }
  if (temperature >= 25 && humidity >= 65) {
    crops.banana.score += 15;
    crops.mango.score += 10;
  }
  if (ph >= 6 && ph <= 7) {
    crops.rice.score += 10;
    crops.wheat.score += 10;
  }

  let bestCrop = 'rice';
  let maxScore = 0;
  for (const [crop, data] of Object.entries(crops)) {
    if (data.score > maxScore) {
      maxScore = data.score;
      bestCrop = crop;
    }
  }

  return bestCrop || 'rice';
}

// Health check to verify server is reachable
app.get('/_health', (req, res) => {
  res.json({ ok: true });
});

// Crop Recommendation endpoint - connects to ML API
app.post("/api/crop-recommendation", async (req, res) => {
  try {
    console.log("Crop recommendation request:", req.body);

    const { N, P, K, temperature, humidity, ph, rainfall } = req.body;

    // Validate required fields
    if (N === undefined || P === undefined || K === undefined || temperature === undefined || humidity === undefined || ph === undefined || rainfall === undefined) {
      return res.status(400).json({ error: "Missing required fields: N, P, K, temperature, humidity, ph, rainfall" });
    }

    let recommendedCrop = null;

    // Try to call Python ML API
    try {
      const mlResponse = await fetch("http://localhost:5001/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          N,
          P,
          K,
          temperature,
          humidity,
          ph,
          rainfall
        }),
        timeout: 5000 // 5 second timeout
      });

      if (mlResponse.ok) {
        const mlData = await mlResponse.json();
        console.log("✅ ML API response:", mlData);
        recommendedCrop = mlData.recommended_crop;
      } else {
        console.warn("ML API returned error status:", mlResponse.status);
      }
    } catch (mlError) {
      console.warn("⚠️ ML API unavailable, using local fallback:", mlError.message);
    }

    // Fallback to local recommendation if ML API fails
    if (!recommendedCrop) {
      recommendedCrop = getLocalRecommendation(N, P, K, temperature, humidity, ph, rainfall);
      console.log("📊 Using local recommendation:", recommendedCrop);
    }

    res.json({
      recommended_crop: recommendedCrop,
      success: true
    });
  } catch (error) {
    console.error("🔥 CROP RECOMMENDATION ERROR 🔥");
    console.error(error);
    // Return a default crop as last resort
    res.json({
      recommended_crop: 'rice',
      success: false,
      fallback: true
    });
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ reply: "No message provided" });
    }

    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
    });

    console.log("Calling Gemini...");

    // try sendMessage first (some models support it), fall back to generateContent
    let result;
    try {
      result = await model.sendMessage(message);
    } catch (e) {
      console.warn('sendMessage failed, trying generateContent as fallback');
      result = await model.generateContent(message);
    }

    console.log("=== GENERATE CONTENT RESULT ===");
    console.log(result);
    try {
      if (result && typeof result === 'object') {
        console.log('result.keys:', Object.keys(result));
      }
    } catch (e) {
      console.error('Error inspecting result object:', e);
    }

    // Extract reply safely from known shapes
    let reply = '';
    try {
      if (result?.response && typeof result.response.text === 'function') {
        reply = result.response.text();
      } else if (result?.response?.candidates && result.response.candidates[0]) {
        reply = result.response.candidates[0]?.content?.[0]?.text || '';
      } else if (typeof result?.response === 'string') {
        reply = result.response;
      } else if (result?.response?.output && result.response.output[0]) {
        reply = result.response.output[0]?.content?.[0]?.text || '';
      }
    } catch (e) {
      console.error('Error extracting reply:', e);
    }

    console.log('Reply extracted:', reply);
    if (!reply) {
      console.warn('No reply extracted from Gemini result');
      return res.status(500).json({ reply: 'Gemini backend error' });
    }

    res.json({ reply });
  } catch (error) {
    console.error("🔥 GEMINI ERROR 🔥");
    console.error(error);
    console.error(error?.stack);
    try {
      console.error('Error props:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    } catch (e) {
      console.error('Error while stringifying error:', e);
    }

    const userMessage = (error && error.status === 404)
      ? 'AI model not found or not enabled on this API key' : 'Gemini backend error';

    const responseBody = { reply: userMessage };
    if (process.env.NODE_ENV !== 'production' && error && error.message) {
      responseBody.error = error.message;
    }

    res.status(500).json(responseBody);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
  console.log(`📱 Frontend available at http://localhost:${PORT}`);
});

// Serve index.html for all routes (SPA fallback)
app.get('*', (req, res) => {
  // Skip API routes
  if (!req.path.startsWith('/api') && !req.path.startsWith('/_')) {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  }
});
