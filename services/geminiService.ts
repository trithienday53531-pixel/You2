import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Question } from "../types";

const SYSTEM_INSTRUCTION = `
Bạn là một chuyên gia tạo đề thi trắc nghiệm. Nhiệm vụ của bạn là phân tích tài liệu được cung cấp và trích xuất các câu hỏi trắc nghiệm.
1. Nếu tài liệu đã có sẵn câu hỏi, hãy trích xuất chính xác.
2. Nếu tài liệu là nội dung văn bản chưa có câu hỏi, hãy TỰ ĐỘNG TẠO câu hỏi trắc nghiệm dựa trên nội dung đó.
3. Luôn đảm bảo có 4 đáp án (A, B, C, D) cho mỗi câu hỏi.
4. Xác định đáp án đúng chính xác.
5. Ngôn ngữ đầu ra phải giống với ngôn ngữ của tài liệu (ưu tiên Tiếng Việt).
`;

const RESPONSE_SCHEMA: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING, description: "Unique identifier for the question (e.g., q1, q2)" },
      text: { type: Type.STRING, description: "The content of the question" },
      options: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "An array of exactly 4 strings representing options" 
      },
      correctAnswer: { type: Type.STRING, description: "The exact string content of the correct option" },
      explanation: { type: Type.STRING, description: "Brief explanation why the answer is correct" }
    },
    required: ["id", "text", "options", "correctAnswer"]
  }
};

export const generateQuizFromContent = async (fileData: { mimeType: string, data: string }): Promise<Question[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: fileData.mimeType,
              data: fileData.data
            }
          },
          {
            text: "Hãy tạo danh sách câu hỏi trắc nghiệm từ tài liệu này. Trả về JSON."
          }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.3 // Lower temperature for more deterministic/accurate extraction
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data returned from AI");

    const questions = JSON.parse(jsonText) as Question[];
    return questions;

  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Không thể phân tích tài liệu. Vui lòng thử lại.");
  }
};