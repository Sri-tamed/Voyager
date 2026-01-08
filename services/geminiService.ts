
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const getSafetyAdvice = async (locationName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide 3 very short, practical safety tips for a traveler in ${locationName}. Focus on confidence and situational awareness. Keep it minimal and professional.`,
      config: {
        temperature: 0.5,
        maxOutputTokens: 150
      }
    });
    return response.text || "Stay aware of your surroundings and keep your phone charged.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Stay vigilant in unfamiliar areas and keep emergency contacts ready.";
  }
};
