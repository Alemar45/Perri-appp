
 import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, VetClinic } from "./types";

// Replaced getAI with direct initialization in each function to ensure fresh instance as per guidelines
export const getGeminiResponse = async (history: ChatMessage[], message: string) => {
  try {
    // Initializing with process.env.API_KEY directly in the function call context
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      // Correctly passing previous conversation history + new message to generateContent
      contents: [...history, { role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: "Eres 'Perri AI', el asistente canino definitivo en español. Tu tono es cálido y profesional. Ayuda a los dueños de perros con consejos sobre salud, entrenamiento y bienestar.",
      },
    });

    return response.text || "¡Guau! ¿Podrías repetir eso?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "¡Ups! Revisa tu conexión o la configuración de tu API_KEY.";
  }
};

export const getVetsByZone = async (zone: string, lat?: number, lng?: number): Promise<VetClinic[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    // Using gemini-2.5-flash which is the required model for Maps Grounding tasks
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Encuentra las 6 mejores veterinarias en '${zone}'. Prioriza aquellas que ofrecen atención de urgencias o 24 horas.`,
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
      contents: `De este texto, extrae una lista estructurada de veterinarias en JSON: ${response.text}. Asegúrate de identificar correctamente si atienden 24 horas.`,
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
                  is24h: { type: Type.BOOLEAN },
                  closingTime: { type: Type.STRING, description: "Hora de cierre o 'Abierto 24hs'" },
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
      id: `vet-${i}-${Date.now()}`,
      status: c.is24h ? 'Abierto 24hs' : 'Abierto',
      distance: 'A pocos minutos',
      imageUrl: '',
      lat: lat || 0,
      lng: lng || 0
    }));
  } catch (error) {
    console.error("Error buscando veterinarias:", error);
    return [];
  }
};
