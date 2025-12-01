import { GoogleGenAI, Type } from "@google/genai";
import { AlienResponse } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAlienSlogan = async (topic: string): Promise<AlienResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a marketing slogan for: ${topic}`,
      config: {
        systemInstruction: `You are the Director of Disinformation for 'UFO Studios', a covert government storytelling agency established in 1987. 
        Your tone is bureaucratic, authoritative, slightly paranoid, and highly classified.
        You use terminology related to surveillance, redaction, psychological operations, and national security.
        
        Generate a catchy, short marketing slogan (it can be dark or cynical) and a brief "Strategic Rationale" explaining why it will control the masses.
        Return ONLY JSON.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            slogan: { type: Type.STRING },
            rationale: { type: Type.STRING },
          },
          required: ["slogan", "rationale"],
        }
      },
    });

    const text = response.text;
    if (!text) throw new Error("No signal received from the mothership.");
    
    return JSON.parse(text) as AlienResponse;
  } catch (error) {
    console.error("Transmission failed:", error);
    throw error;
  }
};