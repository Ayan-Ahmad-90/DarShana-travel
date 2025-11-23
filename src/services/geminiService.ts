import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

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
    const prompt = `Explain the cultural, historical, and tourism significance of the Indian festival "${festivalName}". 
Make it short, helpful, and easy to understand for travelers.`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      safetySettings,
    });

    return result.response.text();

  } catch (error) {
    console.error("Festival fetch error:", error);
    return "Sorry, unable to fetch festival details.";
  }
}

export async function getSustainableRouteOptions(from: string, to: string) {
  try {
    const prompt = `Suggest 3-5 sustainable, eco-friendly travel options for going from "${from}" to "${to}" in India. For each, provide: name, short route, a one-sentence description, and top eco-friendly tips. Respond in markdown table format or as a short structured list.`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      safetySettings,
    });

    return result.response.text();

  } catch (error) {
    console.error("Eco route fetch error:", error);
    return "Sorry, unable to fetch sustainable route options.";
  }
}

