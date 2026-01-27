import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, MessageCircle, X, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ChatMessage from './ChatMessage';
import { cn } from '@/lib/utils';
import { getGeminiResponse, isGeminiConfigured } from '@/lib/geminiApi';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: crypto.randomUUID(),
          text: 'Hello 👋 I am your AI assistant. How can I help you?',
          isBot: true,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;

    setMessages(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text: userText,
        isBot: false,
        timestamp: new Date(),
      },
    ]);

    setInput('');
    setIsTyping(true);

    try {
      if (!isGeminiConfigured()) {
        throw new Error('Gemini backend not configured');
      }

      const reply = await getGeminiResponse(userText);

      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: reply,
          isBot: true,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      const errMsg = error instanceof Error && error.message ? error.message : 'AI is not responding right now. Please try again later.';
      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: `⚠️ ${errMsg}`,
          isBot: true,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Open Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50",
          "flex h-14 w-14 items-center justify-center rounded-full",
          "bg-primary text-primary-foreground shadow-lg",
          isOpen && "hidden"
        )}
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed z-50 bottom-24 right-4 md:bottom-8 md:right-8",
          "w-[calc(100vw-2rem)] max-w-[380px]",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="flex flex-col rounded-2xl bg-card shadow-lg h-[500px]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">AI Assistant</h3>
                <p className="text-xs text-muted-foreground">Powered by Gemini</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsMinimized(!isMinimized)}>
                <Minimize2 className="h-4 w-4" />
              </button>
              <button onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(msg => (
                  <ChatMessage
                    key={msg.id}
                    message={msg.text}
                    isBot={msg.isBot}
                    timestamp={msg.timestamp}
                  />
                ))}
                {isTyping && (
                  <p className="text-sm text-muted-foreground">AI is typing...</p>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                  />
                  <Button onClick={handleSend} disabled={!input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Chatbot;
