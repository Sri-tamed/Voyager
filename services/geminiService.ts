
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyBebS-fAiQbYyHCP__DrdAWTNkBatumMTU" || process.env.API_KEY || "" });

export const getSafetyAdvice = async (locationName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide 3 very short, actionable, and professional safety tips for a traveler in ${locationName}. 
      Return only the tips, each on a new line starting with a bullet point (•). 
      Focus on situational awareness and confidence. No introductory text.`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 200
      }
    });
    return response.text || "• Stay aware of your surroundings.\n• Keep your phone charged.\n• Trust your instincts.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "• Stay vigilant in unfamiliar areas.\n• Keep emergency contacts ready.\n• Maintain a low profile.";
  }
};
