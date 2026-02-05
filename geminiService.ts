
import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, VetClinic } from "./types";

const getAI = () => {
  // Usamos casting a 'any' para evitar que TSC bloquee el build si no reconoce 'process'
  const env = (window as any).process?.env || (import.meta as any).env || {};
  const apiKey = process.env.API_KEY || env.API_KEY;
  
  if (!apiKey) {
    console.warn("API_KEY no detectada todavía.");
  }
  return new GoogleGenAI({ apiKey: apiKey || "" });
};

export const getGeminiResponse = async (history: ChatMessage[], message: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message,
      config: {
        systemInstruction: "Eres 'Perri AI', el asistente canino definitivo en español. Tu tono es cálido y profesional. Ayuda a los dueños de perros.",
      },
    });

    return response.text || "¡Guau! ¿Podrías repetir eso?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "¡Ups! Revisa tu conexión o la configuración de tu API_KEY en Vercel.";
  }
};

export const getVetsByZone = async (zone: string, lat?: number, lng?: number): Promise<VetClinic[]> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Busca 5 veterinarias reales en '${zone}'.`,
      config: {
        tools: [{ googleMaps: {} }],
        ...(lat && lng ? {
          toolConfig: {
            retrievalConfig: { latLng: { latitude: lat, longitude: lng } }
          }
        } : {})
      },
    });

    const parser = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Extrae las veterinarias de este texto a JSON: ${response.text}`,
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
                  name: { type: Type.STRING },
                  address: { type: Type.STRING },
                  phone: { type: Type.STRING },
                  rating: { type: Type.NUMBER },
                  services: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            }
          }
        }
      }
    });

    const data = JSON.parse(parser.text || '{"clinics": []}');
    return data.clinics.map((c: any, i: number) => ({
      ...c,
      id: `vet-${i}`,
      status: 'Abierto',
      distance: 'Cerca',
      closingTime: '20:00',
      imageUrl: '',
      lat: lat || 0,
      lng: lng || 0
    }));
  } catch (error) {
    return [];
  }
};
