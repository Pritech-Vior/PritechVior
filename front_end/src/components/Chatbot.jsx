import { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Minimize2,
  Maximize2,
  CheckCircle,
  Code,
  Database,
  FileText,
  Clock,
  Target,
  Award,
  Book,
  DollarSign,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Star,
  Building,
  Globe,
  Zap,
} from "lucide-react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm Viora, your AI assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
      options: ["Services", "Shop", "Contact"],
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Helper function to render message with icons
  const renderMessageWithIcons = (text) => {
    const lines = text.split("\n");
    return lines.map((line, index) => {
      if (
        line.includes("• Complete system") ||
        line.includes("• Full-stack") ||
        line.includes("• Database") ||
        line.includes("• Testing") ||
        line.includes("• Documentation") ||
        line.includes("• 6 months")
      ) {
        return (
          <div key={index} className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
            <span>{line.replace("• ", "")}</span>
          </div>
        );
      }
      if (
        line.includes("• Topic selection") ||
        line.includes("• Complete development") ||
        line.includes("• Documentation & presentation")
      ) {
        return (
          <div key={index} className="flex items-center gap-2 mb-1">
            <Book className="w-3 h-3 text-blue-400 flex-shrink-0" />
            <span>{line.replace("• ", "")}</span>
          </div>
        );
      }
      if (line.includes("• Guaranteed high grades")) {
        return (
          <div key={index} className="flex items-center gap-2 mb-1">
            <Target className="w-3 h-3 text-yellow-400 flex-shrink-0" />
            <span>{line.replace("• ", "")}</span>
          </div>
        );
      }
      if (line.includes("• 3-6 months timeline")) {
        return (
          <div key={index} className="flex items-center gap-2 mb-1">
            <Clock className="w-3 h-3 text-purple-400 flex-shrink-0" />
            <span>{line.replace("• ", "")}</span>
          </div>
        );
      }
      if (
        line.includes("• Student Projects") ||
        line.includes("• Custom Software") ||
        line.includes("• Tutoring") ||
        line.includes("• Courses")
      ) {
        return (
          <div key={index} className="flex items-center gap-2 mb-1">
            <DollarSign className="w-3 h-3 text-green-400 flex-shrink-0" />
            <span>{line.replace("• ", "")}</span>
          </div>
        );
      }
      if (line.includes("• Email:")) {
        return (
          <div key={index} className="flex items-center gap-2 mb-1">
            <Mail className="w-3 h-3 text-blue-400 flex-shrink-0" />
            <span>{line.replace("• ", "")}</span>
          </div>
        );
      }
      if (line.includes("• WhatsApp:")) {
        return (
          <div key={index} className="flex items-center gap-2 mb-1">
            <Phone className="w-3 h-3 text-green-400 flex-shrink-0" />
            <span>{line.replace("• ", "")}</span>
          </div>
        );
      }
      if (line.includes("• Website:")) {
        return (
          <div key={index} className="flex items-center gap-2 mb-1">
            <Globe className="w-3 h-3 text-purple-400 flex-shrink-0" />
            <span>{line.replace("• ", "")}</span>
          </div>
        );
      }
      if (line.includes("• Location:")) {
        return (
          <div key={index} className="flex items-center gap-2 mb-1">
            <MapPin className="w-3 h-3 text-red-400 flex-shrink-0" />
            <span>{line.replace("• ", "")}</span>
          </div>
        );
      }
      if (line.includes("• Mon-Fri:") || line.includes("• Sat:")) {
        return (
          <div key={index} className="flex items-center gap-2 mb-1">
            <Calendar className="w-3 h-3 text-blue-400 flex-shrink-0" />
            <span>{line.replace("• ", "")}</span>
          </div>
        );
      }
      if (
        line.includes("• Leading IT") ||
        line.includes("• Expert team") ||
        line.includes("• Focus on") ||
        line.includes("• 200+") ||
        line.includes("• Serving clients")
      ) {
        return (
          <div key={index} className="flex items-center gap-2 mb-1">
            <Zap className="w-3 h-3 text-yellow-400 flex-shrink-0" />
            <span>{line.replace("• ", "")}</span>
          </div>
        );
      }

      return (
        <div key={index} className="mb-1">
          {line}
        </div>
      );
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const predefinedResponses = {
    // Services & Solutions
    services: {
      text: "We offer comprehensive IT solutions including:\n\n• Project Design & Implementation\n• IT Consulting & Innovation\n• E-Learning Platform (ThinkForge)\n• E-Commerce & POS Solutions\n• Software Archive & Hosting\n• Internal Collaboration Tools\n\nWhich service interests you most?",
      options: [
        "Project Development",
        "IT Consulting",
        "E-Learning",
        "E-Commerce",
        "More Info",
      ],
    },

    // Shop & Products
    shop: {
      text: "Welcome to ViorMart! We offer:\n\n• Custom Software Development\n• Professional Laptops & Hardware\n• Tech Accessories\n• Digital Services\n• Affiliate Products\n\nWhat are you looking for today?",
      options: ["Custom Software", "Hardware", "Services", "View Catalog"],
    },

    // Student Projects
    student: {
      text: "Our Scholar program helps students with:\n\n• Final Year Project Development\n• Academic Research & Writing\n• Programming Tutoring\n• Project Templates\n• Career Mentorship\n\nStarting from 25,000 TZS. Which service do you need?",
      options: [
        "Final Year Project",
        "Research Help",
        "Tutoring",
        "Templates",
        "Pricing",
      ],
    },

    // General Inquiry
    general: {
      text: "I'm here to help! You can ask me about:\n\n• Our company and mission\n• Pricing and packages\n• Technical support\n• Partnership opportunities\n• Contact information\n\nWhat would you like to know?",
      options: ["About Us", "Pricing", "Contact", "Partnerships"],
    },

    // Detailed responses
    "project development": {
      text: "Our Project Development service includes:\n\n• Complete system analysis & design\n• Full-stack development (React, Node.js)\n• Database design & implementation\n• Testing & quality assurance\n• Documentation & deployment\n• 6 months support\n\nPrice: Starting from 300,000 TZS\n\nWould you like to discuss your project?",
      options: ["Get Quote", "View Portfolio", "Contact Developer"],
    },

    "final year project": {
      text: "Final Year Project Support includes:\n\n• Topic selection & research\n• Complete development\n• Documentation & presentation\n• Guaranteed high grades\n• 3-6 months timeline\n\nPrice: 300,000 TZS\n\nOver 150 students helped with A+ grades!",
      options: ["Start Project", "View Examples", "Payment Plans"],
    },

    pricing: {
      text: "Our competitive pricing:\n\n• Student Projects: 25,000 - 300,000 TZS\n• Custom Software: 500,000 - 2,000,000 TZS\n• Tutoring: 50,000 TZS/month\n• Courses: 85,000 - 200,000 TZS\n\nFlexible payment plans available!",
      options: ["Payment Methods", "Discounts", "Contact Sales"],
    },

    "about us": {
      text: "PritechVior - Empowering Africa Through Technology Innovation\n\n• Leading IT company in Tanzania\n• Expert team of developers\n• Focus on education & innovation\n• 200+ successful projects\n• Serving clients across East Africa\n\nEst. 2020 | Based in Tanzania",
      options: ["Our Team", "Success Stories", "Contact Us"],
    },

    contact: {
      text: "Get in touch with us:\n\n• Email: info@pritechvior.co.tz\n• WhatsApp: +255 XXX XXX XXX\n• Website: pritechvior.co.tz\n• Location: Dar es Salaam, Tanzania\n\n• Mon-Fri: 8AM-6PM EAT\n• Sat: 9AM-3PM EAT",
      options: ["Send Email", "WhatsApp", "Schedule Call"],
    },
  };

  const handleSendMessage = async (messageText = null) => {
    const text = messageText || inputMessage.trim();
    if (!text) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = getBotResponse(text.toLowerCase());
      const botMessage = {
        id: Date.now() + 1,
        text: response.text,
        sender: "bot",
        timestamp: new Date(),
        options: response.options,
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const getBotResponse = (userInput) => {
    // Check for predefined responses
    for (const [key, response] of Object.entries(predefinedResponses)) {
      if (
        userInput.includes(key) ||
        userInput.includes(key.replace(" ", "")) ||
        response.options?.some((option) =>
          userInput.includes(option.toLowerCase())
        )
      ) {
        return response;
      }
    }

    // Handle greetings
    if (
      userInput.includes("hello") ||
      userInput.includes("hi") ||
      userInput.includes("hey")
    ) {
      return {
        text: "Hello! I'm Viora, ready to help with your questions!",
        options: ["Services", "Shop", "Contact"],
      };
    }

    // Handle thanks
    if (userInput.includes("thank") || userInput.includes("thanks")) {
      return {
        text: "You're welcome! Anything else I can help with?",
        options: ["Services", "Shop", "Contact"],
      };
    }

    // Default response with suggestion
    return {
      text: "I'd be happy to help! What can I assist you with?",
      options: ["Services", "Shop", "Contact"],
    };
  };

  const handleOptionClick = (option) => {
    handleSendMessage(option);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest(".viora-chatbot")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <div
          onClick={toggleChat}
          className="fixed bottom-4 right-4 z-50 w-10 h-10 bg-gradient-to-r from-color-1 to-color-2 rounded-full shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
          style={{
            background: "linear-gradient(135deg, #AC6AFF 0%, #FFC876 100%)",
            boxShadow: "0 8px 32px rgba(172, 106, 255, 0.3)",
          }}
        >
          <MessageCircle className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />

          {/* Notification dot */}
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">1</span>
          </div>

          {/* Pulse animation */}
          <div className="absolute inset-0 rounded-full bg-color-1 opacity-20 animate-ping"></div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="viora-chatbot fixed bottom-14 right-4 z-50 w-72 sm:w-72 md:w-80 lg:w-84 xl:w-88 bg-n-8 rounded-xl shadow-2xl border border-n-6 overflow-hidden max-h-[70vh] md:max-h-[75vh] lg:max-h-[80vh]">
          {/* Header */}
          <div className="bg-gradient-to-r from-color-1 to-color-2 p-2.5 md:p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 md:w-8 md:h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium text-sm">Viora</h3>
                <p className="text-white/80 text-xs">AI Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={toggleMinimize}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                {isMinimized ? (
                  <Maximize2 className="w-3 h-3 text-white" />
                ) : (
                  <Minimize2 className="w-3 h-3 text-white" />
                )}
              </button>
              <button
                onClick={toggleChat}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          </div>

          {/* Chat Body */}
          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="h-48 sm:h-48 md:h-56 lg:h-60 xl:h-64 overflow-y-auto p-2.5 md:p-3 space-y-2 bg-n-7">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] ${
                        message.sender === "user" ? "order-2" : "order-1"
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`flex items-center gap-1 mb-1 ${
                          message.sender === "user"
                            ? "flex-row-reverse"
                            : "flex-row"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center ${
                            message.sender === "user"
                              ? "bg-color-1"
                              : "bg-gradient-to-r from-color-1 to-color-2"
                          }`}
                        >
                          {message.sender === "user" ? (
                            <User className="w-2 h-2 md:w-2.5 md:h-2.5 text-white" />
                          ) : (
                            <Bot className="w-2 h-2 md:w-2.5 md:h-2.5 text-white" />
                          )}
                        </div>
                        <span className="text-xs text-n-4">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      {/* Message */}
                      <div
                        className={`p-2 md:p-2.5 rounded-xl ${
                          message.sender === "user"
                            ? "bg-color-1 text-white ml-5 md:ml-6"
                            : "bg-n-6 text-n-1 mr-5 md:mr-6"
                        }`}
                      >
                        {message.sender === "bot" &&
                        message.text.includes("•") ? (
                          <div className="text-xs">
                            {renderMessageWithIcons(message.text)}
                          </div>
                        ) : (
                          <p className="text-xs whitespace-pre-line">
                            {message.text}
                          </p>
                        )}
                      </div>

                      {/* Options */}
                      {message.options && message.sender === "bot" && (
                        <div className="mt-2 mr-5 md:mr-6 space-y-1">
                          {message.options.slice(0, 3).map((option, index) => (
                            <button
                              key={index}
                              onClick={() => handleOptionClick(option)}
                              className="block w-full text-left p-1.5 text-xs text-color-1 bg-n-6 hover:bg-n-5 rounded transition-colors border border-color-1/20 hover:border-color-1/40"
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 md:w-5 md:h-5 bg-gradient-to-r from-color-1 to-color-2 rounded-full flex items-center justify-center">
                        <Bot className="w-2 h-2 md:w-2.5 md:h-2.5 text-white" />
                      </div>
                      <div className="bg-n-6 text-n-1 p-1.5 md:p-2 rounded-xl">
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-n-3 rounded-full animate-bounce"></div>
                          <div
                            className="w-1 h-1 md:w-1.5 md:h-1.5 bg-n-3 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-1 h-1 md:w-1.5 md:h-1.5 bg-n-3 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-2.5 md:p-3 border-t border-n-6 bg-n-8">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ask Viora..."
                    className="flex-1 bg-n-7 border border-n-6 rounded-lg px-2.5 py-1.5 text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none text-xs"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim() || isTyping}
                    className="p-1.5 bg-gradient-to-r from-color-1 to-color-2 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-1 mt-2 flex-wrap">
                  {["Services", "Shop", "Contact"].map((action) => (
                    <button
                      key={action}
                      onClick={() => handleSendMessage(action)}
                      className="px-2 py-1 text-xs text-color-1 bg-color-1/10 hover:bg-color-1/20 rounded-full transition-colors"
                    >
                      {action}
                    </button>
                  ))}
                </div>

                {/* Branding */}
                <div className="text-center mt-2">
                  <p className="text-xs md:text-sm text-n-4">
                    <span className="text-color-1 font-medium">Viora AI</span>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Chatbot;
