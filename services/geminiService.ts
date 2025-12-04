import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// Helper to convert File to Base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not defined in the environment.");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeRoomImage = async (base64Image: string, mimeType: string): Promise<string> => {
  const ai = getClient();
  
  const prompt = `
    Analyze this image of a room. I want to organize and declutter it.
    Please provide a structured response in Markdown format with the following sections:
    1. **Observation**: Briefly describe the current state of the room and identify the main clutter points.
    2. **Quick Wins**: List 3-5 immediate actions I can take to make a big difference quickly.
    3. **Organization Strategy**: Suggest storage solutions or layout changes suitable for this specific space.
    4. **The "Keep vs. Toss" Mindset**: Give me a specific question to ask myself while sorting items in this room.
    
    Be encouraging, practical, and specific to the items seen in the photo.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          { text: prompt }
        ]
      }
    });

    return response.text || "I couldn't generate an analysis for this image. Please try again.";
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw new Error("Failed to analyze image. Please check your connection and try again.");
  }
};

export class ChatService {
  private chat: Chat | null = null;
  private modelId = 'gemini-3-pro-preview';

  constructor() {
    this.initChat();
  }

  private initChat() {
    const ai = getClient();
    this.chat = ai.chats.create({
      model: this.modelId,
      config: {
        systemInstruction: "You are a professional home organizer and interior design assistant (ZenSpace AI). Your goal is to help users declutter, organize, and beautify their living spaces. You are empathetic, non-judgmental, and practical. Keep responses concise and actionable.",
      }
    });
  }

  async sendMessage(message: string): Promise<string> {
    if (!this.chat) {
      this.initChat();
    }
    
    try {
      if (!this.chat) throw new Error("Chat not initialized");
      
      const response: GenerateContentResponse = await this.chat.sendMessage({
        message: message
      });
      return response.text || "I didn't catch that.";
    } catch (error) {
      console.error("Chat error:", error);
      // Reset chat on critical error to recover session
      this.initChat();
      throw error;
    }
  }
}
