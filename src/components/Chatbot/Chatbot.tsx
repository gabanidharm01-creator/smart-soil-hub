import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, MessageCircle, X, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';
import ChatMessage from './ChatMessage';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const { t, tNested, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isAiMode, setIsAiMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: '1',
          text: t('chatbotGreeting'),
          isBot: true,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length, t]);

  const getBasicResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Intent matching
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('नमस्ते') || lowerMessage.includes('હેલો')) {
      return tNested('chatResponses.greeting');
    }
    if (lowerMessage.includes('moisture') || lowerMessage.includes('नमी') || lowerMessage.includes('ભેજ')) {
      return tNested('chatResponses.moisture');
    }
    if (lowerMessage.includes('nitrogen') || lowerMessage.includes('नाइट्रोजन') || lowerMessage.includes('નાઇટ્રોજન')) {
      return tNested('chatResponses.nitrogen');
    }
    if (lowerMessage.includes('phosphorus') || lowerMessage.includes('फास्फोरस') || lowerMessage.includes('ફોસ્ફરસ')) {
      return tNested('chatResponses.phosphorus');
    }
    if (lowerMessage.includes('potassium') || lowerMessage.includes('पोटेशियम') || lowerMessage.includes('પોટેશિયમ')) {
      return tNested('chatResponses.potassium');
    }
    if (lowerMessage.includes('ph')) {
      return tNested('chatResponses.ph');
    }
    if (lowerMessage.includes('fertilizer') || lowerMessage.includes('उर्वरक') || lowerMessage.includes('ખાતર')) {
      return tNested('chatResponses.fertilizer');
    }
    if (lowerMessage.includes('weather') || lowerMessage.includes('मौसम') || lowerMessage.includes('હવામાન')) {
      return tNested('chatResponses.weather');
    }
    
    return tNested('chatResponses.default');
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate response delay
    setTimeout(() => {
      let response: string;

      if (isAiMode) {
        // AI mode - more sophisticated response (simulated)
        response = `🤖 [AI Mode] Based on your question about "${input}", I would recommend analyzing your soil's current nutrient levels. For optimal crop growth, maintain NPK ratios suitable for your target crop. Would you like specific recommendations for any particular crop?`;
      } else {
        // Basic mode - predefined responses
        response = getBasicResponse(input);
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat toggle button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50",
          "flex h-14 w-14 items-center justify-center rounded-full",
          "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground",
          "shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30",
          "transition-all duration-300 hover:scale-110 active:scale-95",
          isOpen && "hidden"
        )}
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-accent" />
        </span>
      </button>

      {/* Chat window */}
      <div
        className={cn(
          "fixed z-50 transition-all duration-300",
          "bottom-24 right-4 md:bottom-8 md:right-8",
          "w-[calc(100vw-2rem)] max-w-[380px]",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none",
          isMinimized && "h-[60px]"
        )}
      >
        <div
          className={cn(
            "flex flex-col rounded-2xl overflow-hidden",
            "bg-card/95 backdrop-blur-xl border border-border/50 shadow-card",
            isMinimized ? "h-[60px]" : "h-[500px]"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 p-4 border-b border-border/50 bg-gradient-to-r from-primary/10 to-transparent">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                  <Bot className="h-5 w-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 ring-2 ring-card" />
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-sm">{t('chatbotTitle')}</h3>
                <p className="text-xs text-muted-foreground">
                  {isAiMode ? '✨ AI-Powered' : '💬 Basic Mode'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <Minimize2 className="h-4 w-4 text-muted-foreground" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* AI Mode Toggle */}
              <div className="flex items-center justify-between px-4 py-2 bg-muted/50">
                <div className="flex items-center gap-2">
                  <Sparkles className={cn(
                    "h-4 w-4 transition-colors",
                    isAiMode ? "text-accent" : "text-muted-foreground"
                  )} />
                  <span className="text-xs font-medium">
                    {isAiMode ? t('aiMode') : t('basicMode')}
                  </span>
                </div>
                <Switch
                  checked={isAiMode}
                  onCheckedChange={setIsAiMode}
                  className="data-[state=checked]:bg-accent"
                />
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg.text}
                    isBot={msg.isBot}
                    timestamp={msg.timestamp}
                  />
                ))}
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex gap-1">
                        <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border/50">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t('chatbotPlaceholder')}
                    className="rounded-xl border-border/50 bg-muted/50 focus-visible:ring-primary"
                  />
                  <Button
                    onClick={handleSend}
                    size="icon"
                    className="rounded-xl shrink-0 bg-primary hover:bg-primary/90"
                    disabled={!input.trim()}
                  >
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
