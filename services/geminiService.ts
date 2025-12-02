import { GoogleGenAI, Type } from "@google/genai";
import { AlienResponse, ThreatAnalysisResponse } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Keep the old one just in case, or for legacy support
export const generateAlienSlogan = async (topic: string): Promise<AlienResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a marketing slogan for: ${topic}`,
      config: {
        systemInstruction: `You are the Director of Disinformation for 'UFO Studios'. 
        Generate a catchy, dark, cynical marketing slogan and a brief strategic rationale.
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
    if (!text) throw new Error("No signal received.");
    
    return JSON.parse(text) as AlienResponse;
  } catch (error) {
    throw error;
  }
};

export const analyzeSectorImage = async (base64Image: string): Promise<ThreatAnalysisResponse> => {
  try {
    // Remove header if present (data:image/jpeg;base64,)
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64
            }
          },
          {
            text: "Analyze this image for 'hidden threats'. You are a paranoid AI defense system. Identify 3 ordinary objects in the photo but describe them as if they are alien technology, surveillance devices, or glitches in the simulation. Be creative, sci-fi, and paranoid. Assign a threat level."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sectorStatus: { type: Type.STRING, description: "Overall status of the area (e.g., COMPROMISED, STABLE, WATCHING)" },
            anomalies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  object: { type: Type.STRING, description: "The actual object seen (e.g. 'Coffee Mug')" },
                  designation: { type: Type.STRING, description: "The sci-fi military code name (e.g. 'LIQUID STORAGE UNIT 9')" },
                  threatLevel: { type: Type.STRING, enum: ['LOW', 'MODERATE', 'CRITICAL', 'EXISTENTIAL'] },
                  description: { type: Type.STRING, description: "Paranoid explanation of what it actually is." }
                },
                required: ["object", "designation", "threatLevel", "description"]
              }
            }
          },
          required: ["sectorStatus", "anomalies"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Signal jammed.");

    return JSON.parse(text) as ThreatAnalysisResponse;

  } catch (error) {
    console.error("Visual analysis failed:", error);
    throw error;
  }
}
