import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';

export default function AIAdvisor() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: 'Hello! I am the Lanceview AI Advisor. I can help answer questions about Surplus Funds Recovery or our B2B Real Estate services. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user' as const, content: userMsg }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages.map(m => ({ role: m.role === 'ai' ? 'model' : 'user', content: m.content })) }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, { role: 'ai', content: data.text }]);
      
      // If the AI decides to submit an inquiry, we could check the response for a special tag
      // Or the backend can handle emailing directly if a function call is triggered.
      
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'ai', content: 'I encountered an error connecting to our system. Please try again or contact us directly at info@lanceviewconsulting.com or (601) 568-8374.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 bg-editorial-ink hover:bg-editorial-rust text-white p-4 rounded-full shadow-lg transition-transform duration-300 ${isOpen ? 'scale-0' : 'scale-100'} flex items-center justify-center`}
        aria-label="Open AI Advisor"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 z-50 w-[350px] max-w-[calc(100vw-3rem)] bg-editorial-paper border border-editorial-card shadow-2xl rounded-lg overflow-hidden flex flex-col transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
        style={{ height: '500px', maxHeight: 'calc(100vh - 6rem)' }}
      >
        {/* Header */}
        <div className="bg-editorial-ink text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-editorial-rust" />
            <span className="font-serif font-semibold tracking-wide">Lanceview AI Advisor</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-white/70 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-editorial-bg text-sm">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-editorial-rust text-white' : 'bg-editorial-ink text-white'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`px-4 py-2 rounded-lg max-w-[75%] font-sans whitespace-pre-wrap ${msg.role === 'user' ? 'bg-editorial-rust text-white rounded-tr-none' : 'bg-editorial-paper border border-editorial-card text-editorial-ink rounded-tl-none'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3 flex-row">
              <div className="w-8 h-8 rounded-full bg-editorial-ink text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="px-4 py-3 rounded-lg bg-editorial-paper border border-editorial-card text-editorial-ink rounded-tl-none flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-editorial-muted rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-editorial-muted rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-editorial-muted rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-editorial-paper border-t border-editorial-card shrink-0">
          <form onSubmit={handleSubmit} className="flex items-center gap-2 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 bg-editorial-bg border border-editorial-card rounded-md px-3 py-2 text-sm text-editorial-ink focus:outline-none focus:border-editorial-rust transition"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="bg-editorial-ink hover:bg-editorial-rust text-white p-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-[10px] text-center text-editorial-muted mt-2 font-mono">
            Or contact us: <a href="tel:6015688374" className="hover:text-editorial-rust">(601) 568-8374</a> | <a href="mailto:info@lanceviewconsulting.com" className="hover:text-editorial-rust">info@lanceviewconsulting.com</a>
          </div>
        </div>
      </div>
    </>
  );
}
