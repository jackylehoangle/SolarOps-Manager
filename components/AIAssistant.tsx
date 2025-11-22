import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { createChatSession, sendMessageToGemini } from '../services/geminiService';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { Chat } from "@google/genai";

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Xin chào! Tôi là SolarOps AI. Tôi có thể giúp bạn tính toán công suất, tư vấn kỹ thuật hoặc soạn thảo báo cáo dự án. Bạn cần hỗ trợ gì hôm nay?',
      timestamp: Date.now(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat session once
    chatSessionRef.current = createChatSession();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || !chatSessionRef.current) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(chatSessionRef.current, userMsg.text);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Error in chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-6 ml-64 bg-slate-50 h-screen flex flex-col">
      <div className="mb-4">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <Sparkles className="text-emerald-500" />
          Trợ lý Kỹ thuật AI
        </h2>
        <p className="text-slate-500 mt-1">Hỏi đáp kỹ thuật, tính toán và hỗ trợ quản lý.</p>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'model' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {msg.role === 'model' ? <Bot size={18} /> : <User size={18} />}
              </div>
              
              <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 leading-relaxed ${
                msg.role === 'model' 
                  ? 'bg-slate-50 text-slate-800 border border-slate-100' 
                  : 'bg-emerald-600 text-white'
              }`}>
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div className="bg-slate-50 rounded-2xl px-5 py-3 border border-slate-100 flex items-center">
                <Loader2 size={18} className="animate-spin text-slate-400 mr-2" />
                <span className="text-slate-500 text-sm">SolarOps AI đang suy nghĩ...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="relative flex items-center gap-2">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Nhập câu hỏi kỹ thuật hoặc yêu cầu tính toán (ví dụ: Tính số tấm pin cho mái nhà 50m2)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none h-14 max-h-32 shadow-inner"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !inputText.trim()}
              className="absolute right-2 top-2 bottom-2 p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Send size={20} />
            </button>
          </div>
          <div className="text-xs text-slate-400 mt-2 text-center">
            AI có thể mắc sai sót. Vui lòng kiểm tra lại các thông số kỹ thuật quan trọng.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;