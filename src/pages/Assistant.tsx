import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Send, Bot, User, Loader2, RefreshCw } from 'lucide-react';
import { askAI } from '../lib/gemini';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../lib/AuthContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Assistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Greetings, bibliophile. I am Lumina, your literary guide. What kind of stories are you searching for today? Tell me about your favorite genres, or ask for a recommendation based on a mood.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: userMessage },
    ]);
    setIsTyping(true);

    try {
      const response = await askAI(userMessage);

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'I apologize, but my literary senses are a bit clouded at the moment. Could you try asking again?',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 bg-brand-50 flex flex-col items-center px-4">
      <div className="w-full max-w-4xl flex-1 flex flex-col glass-card rounded-[2rem] overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-brand-200 flex items-center justify-between bg-white/50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-brand-800 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-brand-900">
                Lumina Assistant
              </h1>
              <p className="text-xs text-brand-500 font-medium">
                Your personal literary guide
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              setMessages([
                {
                  role: 'assistant',
                  content:
                    'Greetings, bibliophile. I am Lumina, your literary guide. What kind of stories are you searching for today?',
                },
              ])
            }
            className="p-2 text-brand-400 hover:text-cyan-600 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth"
        >
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`flex max-w-[85%] space-x-4 ${
                  msg.role === 'user'
                    ? 'flex-row-reverse space-x-reverse'
                    : ''
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-brand-200 text-brand-700'
                      : 'bg-brand-800 text-white'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <User className="w-5 h-5" />
                  ) : (
                    <Bot className="w-5 h-5" />
                  )}
                </div>

                <div
                  className={`p-5 rounded-2xl shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-brand-700 text-white rounded-tr-none'
                      : 'bg-white text-brand-900 rounded-tl-none border border-brand-100'
                  }`}
                >
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex space-x-4">
                <div className="w-10 h-10 rounded-xl bg-brand-800 text-white flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="bg-white p-5 rounded-2xl rounded-tl-none border border-brand-100 flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
                  <span className="text-sm text-brand-500 italic">
                    Lumina is thinking...
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white/50 border-t border-brand-200">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Ask for a recommendation, e.g., 'What's a good fantasy book like Harry Potter?'"
              className="w-full pl-6 pr-16 py-4 bg-white border border-brand-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all shadow-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />

            <button
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className="absolute right-2 p-3 bg-brand-800 text-white rounded-xl hover:bg-purple-600 transition-all disabled:opacity-50 active:scale-95 shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          <p className="mt-3 text-center text-[10px] text-brand-400 uppercase tracking-widest">
            Powered by Gemini AI • Lumina Literary Intelligence
          </p>
        </div>
      </div>
    </div>
  );
}