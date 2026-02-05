import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, VetClinic } from "./types";

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY no encontrada. Configúrala en las variables de entorno de Vercel.");
  }
  return new GoogleGenAI({ apiKey });
};

export const getGeminiResponse = async (history: ChatMessage[], message: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message,
      config: {
        systemInstruction: "Eres 'Perri AI', el asistente canino definitivo en español. Eres experto en veterinaria, comportamiento y nutrición. Tu tono es cálido, profesional y usas muchos emojis de perros. Tu misión es ayudar a los dueños a cuidar mejor de sus perros.",
      },
    });

    return response.text || "¡Guau! Me quedé dormido un segundo. ¿Me repites la pregunta?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "¡Ups! Mi conexión perruna falló. Revisa que tu API_KEY esté bien configurada en el panel de Vercel.";
  }
};

export const getVetsByZone = async (zone: string, lat?: number, lng?: number): Promise<VetClinic[]> => {
  try {
    const ai = getAI();
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Busca 5 veterinarias reales en la zona de '${zone}'. Necesito sus nombres, direcciones exactas y teléfonos.`,
      config: {
        tools: [{ googleMaps: {} }],
        ...(lat && lng ? {
          toolConfig: {
            retrievalConfig: {
              latLng: { latitude: lat, longitude: lng }
            }
          }
        } : {})
      },
    });

    const text = response.text || "";
    
    const parser = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Convierte este texto en un JSON con el campo 'clinics' (name, address, phone, rating, services[]). Texto: ${text}`,
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
      distance: 'Cerca de ti',
      closingTime: '20:00',
      imageUrl: '',
      lat: lat || 0,
      lng: lng || 0
    }));
  } catch (error) {
    console.error("Error al buscar veterinarias:", error);
    return [];
  }
};
