
import React, { useState, useRef, useEffect } from 'react';
import { chatWithBuddy } from '../services/geminiService';

const StudyBuddy: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'buddy', text: string }[]>([
    { role: 'buddy', text: "Hi there! I'm Brainy, your personal study companion. What are we exploring today? I can help explain concepts, give memory tips, or just cheer you on!" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const response = await chatWithBuddy(userMsg, []);
      setMessages(prev => [...prev, { role: 'buddy', text: response || "I'm not sure about that, let's try another question!" }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'buddy', text: "Oops, I hit a brain block! Can you try asking that again?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-180px)] md:pl-20 flex flex-col gap-4">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex-1 flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-50 flex items-center gap-3 bg-indigo-50/30">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xl">🤖</div>
          <div>
            <h3 className="font-bold text-slate-800">Brainy</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Online & Helpful</span>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-700 rounded-tl-none'}`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none flex gap-1">
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-50 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Brainy anything..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
          >
            🚀
          </button>
        </form>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {["Explain photosynthesis", "Memory tips?", "Study motivation", "Quick math trick"].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setInput(suggestion)}
            className="px-3 py-2 bg-white border border-slate-100 rounded-xl text-xs font-semibold text-slate-500 hover:border-indigo-200 hover:text-indigo-600 transition-all truncate"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StudyBuddy;
