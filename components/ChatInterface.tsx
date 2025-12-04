import { useState, useRef, useEffect } from 'react';
import type { FC, FormEvent } from 'react';
import { MessageSquare, X, Send, Sparkles } from './Icons';
import { ChatService } from '../services/geminiService';
import { ChatMessage } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';

export const ChatInterface: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hi! I'm ZenSpace. Ask me anything about organizing your home, cleaning tips, or decluttering methods." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatServiceRef = useRef<ChatService | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatServiceRef.current = new ChatService();
  }, []);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await chatServiceRef.current?.sendMessage(userMessage);
      if (response) {
        setMessages(prev => [...prev, { role: 'model', text: response }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now. Please try again.", isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-8 right-8 z-50 p-5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 ${
          isOpen ? 'bg-stone-900 rotate-90 opacity-0 pointer-events-none' : 'bg-stone-900 text-white hover:bg-black'
        }`}
        aria-label="Open Chat"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-8 right-8 z-50 w-[90vw] md:w-[400px] h-[600px] glass-panel rounded-3xl shadow-2xl flex flex-col border border-white/60 transition-all duration-300 transform origin-bottom-right overflow-hidden ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-12 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-stone-900/95 backdrop-blur-md text-white border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-teal-500 rounded-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-serif font-semibold text-lg leading-none">ZenSpace</h3>
              <span className="text-xs text-stone-400 font-medium">AI Organizer</span>
            </div>
          </div>
          <button onClick={toggleChat} className="p-2 hover:bg-stone-800 rounded-full transition-colors text-stone-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-white/40">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-stone-900 text-white rounded-br-sm'
                    : 'bg-white text-stone-700 rounded-bl-sm border border-white/60'
                } ${msg.isError ? 'bg-red-50 text-red-600 border-red-200' : ''}`}
              >
                 {msg.role === 'model' ? (
                   <MarkdownRenderer content={msg.text} className="prose-sm prose-p:my-1 prose-headings:text-stone-800" />
                 ) : (
                   <p className="leading-relaxed">{msg.text}</p>
                 )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-2xl rounded-bl-sm border border-white/60 shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-stone-300 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-stone-300 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-stone-300 rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 bg-white/80 border-t border-white/60 backdrop-blur-md">
          <div className="flex items-center gap-2 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about organization..."
              className="w-full pl-5 pr-12 py-3.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-200 focus:border-stone-400 transition-all text-sm text-stone-800 placeholder:text-stone-400 shadow-sm"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 disabled:opacity-50 disabled:hover:bg-stone-900 transition-all shadow-md hover:shadow-lg"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};