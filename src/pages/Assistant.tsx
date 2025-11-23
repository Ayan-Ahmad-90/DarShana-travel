import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Shield, Languages, Phone } from 'lucide-react';
import { getChatResponse } from '../services/geminiService';

const Assistant: React.FC = () => {
  const [messages, setMessages] = useState<{role: string, parts: {text: string}[]}[]>([
    { role: 'model', parts: [{ text: "Namaste! I am Yatra Sahayak, your AI travel companion. How can I help you explore India today?" }] }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;
    
    const userMsg = { role: 'user', parts: [{ text }] };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Pass history excluding the last user message we just added locally for display, 
      // or pass full history if service handles it. 
      // Since we update state locally first, we pass the current 'messages' + new one.
      const responseText = await getChatResponse([...messages, userMsg], text);
      
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: responseText || "I'm having trouble connecting right now." }] }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: "Sorry, I encountered an error. Please try again." }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { label: "Emergency Numbers", icon: Phone, prompt: "What are the emergency numbers in India?" },
    { label: "Hindi Phrases", icon: Languages, prompt: "Teach me 5 essential Hindi phrases for travelers." },
    { label: "Travel Safety", icon: Shield, prompt: "Give me some safety tips for solo travelers in India." },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 h-[calc(100vh-80px)] flex flex-col">
      <div className="flex-1 bg-white rounded-2xl shadow-lg border border-stone-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-teal-700 p-4 flex items-center gap-3 text-white">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="font-bold">Yatra Sahayak</h2>
            <p className="text-xs text-teal-100">Always here to help</p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
          {messages.map((msg, idx) => {
            const isAi = msg.role === 'model';
            return (
              <div key={idx} className={`flex ${isAi ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  isAi 
                    ? 'bg-white text-stone-800 border border-stone-200 rounded-tl-none shadow-sm' 
                    : 'bg-teal-700 text-white rounded-tr-none shadow-sm'
                }`}>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.parts[0].text}</p>
                </div>
              </div>
            );
          })}
          {isLoading && (
             <div className="flex justify-start">
               <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-stone-200 shadow-sm flex gap-1">
                 <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"></span>
                 <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce delay-75"></span>
                 <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce delay-150"></span>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions (only if chat is short) */}
        {messages.length < 4 && (
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
            {quickActions.map((action, i) => (
              <button 
                key={i}
                onClick={() => handleSend(action.prompt)}
                className="flex items-center gap-2 whitespace-nowrap bg-stone-100 hover:bg-stone-200 text-stone-600 px-3 py-2 rounded-full text-xs font-medium transition"
              >
                <action.icon size={14} /> {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-stone-100">
          <div className="flex items-center gap-2 bg-stone-100 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-teal-500 transition ring-offset-1">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about destinations, food, or culture..."
              className="flex-1 bg-transparent border-none focus:outline-none text-stone-800 placeholder-stone-400"
            />
            <button 
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="p-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 disabled:opacity-50 transition shadow-sm"
            >
              <Send size={18} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Assistant;