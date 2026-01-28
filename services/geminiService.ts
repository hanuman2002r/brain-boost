
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { QuizQuestion, QuizDifficulty } from "../types";

// Note: process.env.API_KEY is handled by the platform
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuiz = async (topic: string, difficulty: QuizDifficulty): Promise<QuizQuestion[]> => {
  const ai = getAI();
  
  const difficultyContext = {
    easy: "Focus on fundamental concepts, basic definitions, and simple recognition tasks suitable for beginners.",
    medium: "Provide a balanced mix of conceptual understanding and practical application, requiring some critical thinking.",
    hard: "Focus on complex reasoning, multi-step problems, subtle distinctions, and advanced application of principles."
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a 5-question ${difficulty} level quiz for students about "${topic}". 
    ${difficultyContext[difficulty]}
    Include detailed explanations for each answer.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Four multiple choice options"
            },
            correctAnswer: { 
              type: Type.INTEGER, 
              description: "Index (0-3) of the correct option" 
            },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });

  return JSON.parse(response.text || "[]");
};

export const getBrainBoostFact = async (): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Provide a unique, fascinating daily 'Brain Boost' scientific fact or memory hack for a student. Keep it short and motivating.",
  });
  return response.text || "Learn something new every day!";
};

export const chatWithBuddy = async (message: string, history: { role: string, parts: string }[]) => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: 'You are Brainy, a friendly and supportive AI study buddy. You help students understand complex concepts, offer memory tips, and encourage them. Use simple language and educational analogies.',
    },
  });
  
  const result = await chat.sendMessage({ message });
  return result.text;
};

export const generateStudyVisual = async (prompt: string, size: '1K' | '2K' | '4K') => {
  const ai = getAI();
  // Use Pro model for 2K/4K, Flash model for standard 1K
  const model = size === '1K' ? 'gemini-2.5-flash-image' : 'gemini-3-pro-image-preview';
  
  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [{ text: `A clear, educational diagram or artistic illustration of ${prompt}. Style: bright, clean, educational, high quality.` }]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        ...(size !== '1K' ? { imageSize: size } : {})
      }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};
