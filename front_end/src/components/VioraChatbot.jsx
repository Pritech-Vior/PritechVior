import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Minimize2 } from "lucide-react";

const VioraChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm Viora, your PritechVior assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickReplies = [
    { text: "Our Services", value: "services" },
    { text: "Student Projects", value: "projects" },
    { text: "E-Learning", value: "elearning" },
    { text: "Contact Support", value: "contact" },
  ];

  const botResponses = {
    services: "PritechVior offers comprehensive tech solutions including:\n\n• Custom Software Development\n• E-Learning Platform (ThinkForge)\n• E-Commerce Solutions (ViorMart)\n• Student Project Support\n• IT Consulting & Innovation\n• Software Archive & Hosting\n\nWhich service interests you most?",
    
    projects: "We provide excellent support for student projects:\n\n• Final Year Project Development\n• Academic Research & Writing\n• Programming Tutoring\n• Project Templates & Resources\n\nOur success rate is 98% with over 500 students helped. Would you like to know more about any specific service?",
    
    elearning: "ThinkForge is our comprehensive e-learning platform offering:\n\n• Full-Stack Web Development (MERN)\n• Mobile App Development\n• Digital Marketing\n• Professional Certifications\n\nCourses start from 50,000 TZS with flexible payment options. Interested in enrolling?",
    
    contact: "You can reach us through:\n\n📧 Email: info@pritechvior.co.tz\n📱 WhatsApp: +255 627 147 681\n🌐 Website: pritechvior.co.tz\n📍 Location: Mbeya, Tanzania\n\nOur support team is available 24/7. How else can I help you?",
    
    pricing: "Our pricing is very competitive:\n\n• Student Projects: 150,000 - 500,000 TZS\n• Custom Websites: 800,000+ TZS\n• E-Learning Courses: 50,000 - 200,000 TZS\n• Consulting: 100,000+ TZS/month\n\nWe offer flexible payment plans and student discounts!",
    
    default: "I understand you're asking about that topic. Here are some ways I can help:\n\n• Information about our services\n• Student project support\n• Course enrollment\n• Technical support\n• Pricing inquiries\n\nWhat specific information would you like?"
  };

  const getAIResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('service') || lowerMessage.includes('what do you do')) {
      return botResponses.services;
    }
    if (lowerMessage.includes('project') || lowerMessage.includes('student') || lowerMessage.includes('academic')) {
      return botResponses.projects;
    }
    if (lowerMessage.includes('course') || lowerMessage.includes('learn') || lowerMessage.includes('thinkforge')) {
      return botResponses.elearning;
    }
    if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email')) {
      return botResponses.contact;
    }
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('fee')) {
      return botResponses.pricing;
    }
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! Great to meet you! I'm Viora, here to help with all your PritechVior needs. What can I assist you with today?";
    }
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return "You're very welcome! I'm always here to help. Is there anything else you'd like to know about PritechVior's services?";
    }
    
    return botResponses.default;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI typing delay
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getAIResponse(inputMessage),
        isBot: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickReply = (value) => {
    const response = botResponses[value];
    setMessages(prev => [...prev, 
      {
        id: prev.length + 1,
        text: quickReplies.find(q => q.value === value)?.text || value,
        isBot: false,
        timestamp: new Date(),
      },
      {
        id: prev.length + 2,
        text: response,
        isBot: true,
        timestamp: new Date(),
      }
    ]);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-color-1 to-color-2 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-pulse"
          aria-label="Open chat"
        >
          <MessageCircle size={24} />
        </button>
        <div className="absolute -top-12 -left-8 bg-n-8 text-n-1 px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
          Chat with Viora
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-80 h-96'
    }`}>
      {/* Chat Window */}
      <div className="bg-n-8 border border-n-6 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-color-1 to-color-2 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Viora</h3>
              <p className="text-white/80 text-xs">PritechVior Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <Minimize2 size={16} />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-4 bg-n-7">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.isBot
                      ? 'bg-n-6 text-n-1'
                      : 'bg-gradient-to-r from-color-1 to-color-2 text-white'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      {message.isBot ? (
                        <Bot size={12} className="text-color-1" />
                      ) : (
                        <User size={12} className="text-white/80" />
                      )}
                      <span className="text-xs opacity-80">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-n-6 text-n-1 px-3 py-2 rounded-lg max-w-xs">
                    <div className="flex items-center gap-2">
                      <Bot size={12} className="text-color-1" />
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-color-1 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-color-1 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-color-1 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length === 1 && (
              <div className="p-4 border-t border-n-6">
                <p className="text-n-3 text-xs mb-2">Quick options:</p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply.value}
                      onClick={() => handleQuickReply(reply.value)}
                      className="px-3 py-1 bg-n-6 text-n-2 rounded-full text-xs hover:bg-color-1 hover:text-white transition-colors"
                    >
                      {reply.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-n-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 bg-n-6 border border-n-5 rounded-lg px-3 py-2 text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="bg-gradient-to-r from-color-1 to-color-2 text-white p-2 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VioraChatbot;
