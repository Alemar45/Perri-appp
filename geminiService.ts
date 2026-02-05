
import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, VetClinic } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const getGeminiResponse = async (history: ChatMessage[], message: string) => {
  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: "Eres 'Perri AI', el asistente canino definitivo. Eres experto en veterinaria, comportamiento y nutrición. Tu tono es cálido, profesional y usas emojis. SIEMPRE respondes en ESPAÑOL. Si te preguntan algo fuera de perros, reconduce amablemente al mundo perruno.",
      },
    });

    const response = await chat.sendMessage({ message });
    return response.text || "Guau... me distraje persiguiendo una mosca. ¿Qué decías?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "¡Ups! Algo salió mal en mi conexión perruna.";
  }
};

export const getVetsByZone = async (zone: string): Promise<VetClinic[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Busca 4 veterinarias REALES o probables en '${zone}'. Devuelve JSON estricto.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            clinics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  distance: { type: Type.STRING },
                  address: { type: Type.STRING },
                  phone: { type: Type.STRING },
                  rating: { type: Type.NUMBER },
                  status: { type: Type.STRING },
                  closingTime: { type: Type.STRING },
                  services: { type: Type.ARRAY, items: { type: Type.STRING } },
                  imageUrl: { type: Type.STRING },
                  lat: { type: Type.NUMBER },
                  lng: { type: Type.NUMBER }
                },
                required: ["id", "name", "distance", "address", "phone", "rating", "status", "closingTime", "services"]
              }
            }
          },
          required: ["clinics"]
        }
      }
    });

    const data = JSON.parse(response.text || '{"clinics": []}');
    return data.clinics;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};
