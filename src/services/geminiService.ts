import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// 👉 Your Gemini API Key yaha daalo
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

// --- MODEL CONFIG ---
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",  
});

// --- SAFETY SETTINGS (optional but recommended) ---
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
];

// ----------------------------------------------
// 1️⃣ FUNCTION → Chatbot reply for Assistant.jsx
// ----------------------------------------------
export async function getChatResponse(history: any[], userInput: string) {
  try {
    // Gemini format convert
    const formattedHistory = history.map(msg => ({
      role: msg.role === "model" ? "model" : "user",
      parts: msg.parts,
    }));

    const chatSession = model.startChat({
      safetySettings,
      history: formattedHistory,
    });

    const result = await chatSession.sendMessage(userInput);
    return result.response.text();

  } catch (error) {
    console.error("Gemini chat error:", error);
    return "Sorry, I couldn't process that. Please try again.";
  }
}

// -----------------------------------------------------
// 2️⃣ FUNCTION → Festival Insight for Festivals.jsx
// -----------------------------------------------------
export async function getFestivalDetails(festivalName: string) {
  try {
    const prompt = `
      Give a simple, short and clear explanation about the Indian festival:
      "${festivalName}"
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("Festival Error:", err);
    return "Unable to fetch festival details.";
  }
}


// ---------------------------------------------------------------
// 3️⃣ FUNCTION → Mood Analyzer (Used in MoodAnalyzer.jsx)
// ---------------------------------------------------------------
export async function analyzeMoodAndRecommend(imageBase64: string) {
  try {
    const prompt = `
You are an AI emotion reader expert. Analyze the person's facial expression from this image and determine:

1. Mood (happy, sad, stressed, excited, calm, angry, etc.)
2. Reasoning (1–2 lines)
3. Recommend 3 Indian travel destinations based on this mood.

Return JSON exactly in this format:
{
  "detectedMood": "...",
  "reasoning": "...",
  "recommendations": [
    {
      "name": "...",
      "location": "...",
      "description": "...",
      "tags": ["...", "..."]
    }
  ]
}
    `;

    const result = await model.generateContent({
      safetySettings,
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            { inlineData: { mimeType: "image/jpeg", data: imageBase64.split(",")[1] } }
          ]
        }
      ],
    });

    const text = result.response.text();
    return JSON.parse(text); // convert JSON string → object

  } catch (err) {
    console.error("Mood analysis error:", err);
    return {
      detectedMood: "Unknown",
      reasoning: "Could not analyze the image.",
      recommendations: [],
    };
  }
}

// ----------------------------------------------
// 3️⃣ FUNCTION → Sustainable Travel Routes
// ----------------------------------------------
export async function getSustainableRouteOptions(location: string) {
  try {
    const prompt = `
      Suggest sustainable and eco-friendly travel route options for:
      "${location}"

      Include:
      - best transport mode (eco-friendly)
      - approx cost
      - CO2 emission
      - why this is sustainable
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      safetySettings,
    });

    return result.response.text();

  } catch (error) {
    console.error("Eco Route Error:", error);
    return "Sorry, unable to fetch sustainable travel routes.";
  }
}

