
import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, VetClinic } from "./types";

export const getGeminiResponse = async (history: ChatMessage[], message: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
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
    
    // Prompt mejorado: pedimos explícitamente una mezcla para que el filtro 24h de la UI tenga sentido
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Busca las veterinarias más importantes en '${zone}'. Incluye una mezcla de clínicas con horario comercial normal y clínicas de urgencias 24 horas.`,
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
      contents: `Extrae la información de estas veterinarias en formato JSON: ${response.text}. 
      REGLA CRÍTICA: Identifica si son 'is24h: true' solo si atienden toda la noche. Si tienen hora de cierre, pon 'is24h: false' y especifica su 'closingTime'.`,
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
                  closingTime: { type: Type.STRING, description: "Ej: 'Cierra 20:00' o 'Abierto 24hs'" },
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
      status: c.is24h ? 'Abierto 24hs' : (c.closingTime || 'Abierto'),
      distance: 'Cerca de ti',
      imageUrl: '',
      lat: lat || 0,
      lng: lng || 0
    }));
  } catch (error) {
    console.error("Error buscando veterinarias:", error);
    return [];
  }
};
