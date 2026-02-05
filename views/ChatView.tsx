
import React, { useState, useRef, useEffect } from 'react';
import { getGeminiResponse } from '../geminiService';
import { ChatMessage } from '../types';

const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', parts: [{ text: "¡Hola! Soy Perri AI 🐾. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre salud, alimentación o comportamiento de tu perro." }] }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: ChatMessage = { role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    const response = await getGeminiResponse(messages, input);
    setMessages(prev => [...prev, { role: 'model', parts: [{ text: response }] }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
      <header className="p-4 bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 flex items-center gap-3">
        <div className="size-10 bg-primary rounded-full flex items-center justify-center text-black shadow-lg">
          <span className="material-symbols-outlined font-black">smart_toy</span>
        </div>
        <div>
          <h2 className="font-black text-sm uppercase tracking-widest">Perri AI</h2>
          <div className="flex items-center gap-1">
            <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[9px] font-black text-emerald-600 uppercase">En línea</span>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar pb-40">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] p-4 rounded-[2rem] text-sm ${
              msg.role === 'user' 
                ? 'bg-primary text-black rounded-br-none shadow-xl shadow-primary/10 font-bold' 
                : 'bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-tl-none shadow-sm text-gray-800 dark:text-gray-100'
            }`}>
              {msg.parts[0].text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-zinc-800 p-5 rounded-[2rem] rounded-tl-none flex gap-1">
              <div className="size-1.5 bg-primary rounded-full animate-bounce"></div>
              <div className="size-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="size-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-24 left-0 right-0 p-4 max-w-md mx-auto z-50">
        <div className="flex gap-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl p-2 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/20">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Pregúntame algo..."
            className="flex-1 bg-transparent border-none focus:ring-0 px-4 text-sm font-bold text-gray-800 dark:text-white"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="size-12 bg-primary rounded-full flex items-center justify-center text-black shadow-lg active:scale-90 transition-all disabled:opacity-30"
          >
            <span className="material-symbols-outlined font-black">arrow_upward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
