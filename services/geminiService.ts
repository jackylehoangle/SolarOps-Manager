import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// Initialize Gemini API
// API Key is automatically injected via process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `Bạn là trợ lý ảo chuyên gia (SolarOps AI) cho một công ty thi công điện năng lượng mặt trời.
      Nhiệm vụ của bạn là hỗ trợ các kỹ sư, quản lý dự án và nhân viên kho.
      
      Kiến thức chuyên môn cần có:
      - Tính toán công suất hệ thống (kWp), số lượng tấm pin, inverter.
      - Các quy chuẩn kỹ thuật điện, đấu nối hòa lưới tại Việt Nam.
      - Tư vấn về góc nghiêng, hướng lắp đặt tối ưu.
      - Viết báo cáo tiến độ, email gửi khách hàng.
      - Giải thích các thuật ngữ kỹ thuật.
      
      Phong cách trả lời: Chuyên nghiệp, ngắn gọn, chính xác và hữu ích.
      `,
      temperature: 0.7,
    },
  });
};

export const sendMessageToGemini = async (chat: Chat, message: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "Không nhận được phản hồi từ AI.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Xin lỗi, đã xảy ra lỗi khi kết nối với trợ lý AI. Vui lòng thử lại sau.";
  }
};