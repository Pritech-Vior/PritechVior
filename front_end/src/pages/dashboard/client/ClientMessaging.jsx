import React, { useState } from "react";
import { 
  MessageCircle,
  Send,
  Search,
  Filter,
  Phone,
  Video,
  Paperclip,
  MoreVertical,
  Star,
  Archive,
  Trash2,
  Users,
  Clock,
  CheckCheck,
  Plus,
  Smile,
  Image,
  File
} from "lucide-react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";

const ClientMessaging = ({ userRoles = ["client"] }) => {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const conversations = [
    {
      id: 1,
      type: "project",
      title: "E-Commerce Mobile App",
      participants: ["John Developer", "Sarah Designer", "Mike QA"],
      lastMessage: "The latest UI mockups are ready for review. Please check the attached files.",
      lastMessageTime: "2 hours ago",
      unreadCount: 3,
      status: "active",
      projectId: "PROJ-001",
      avatar: "https://via.placeholder.com/40"
    },
    {
      id: 2,
      type: "support",
      title: "Technical Support",
      participants: ["Support Team"],
      lastMessage: "Your issue has been resolved. The API documentation has been updated.",
      lastMessageTime: "1 day ago",
      unreadCount: 0,
      status: "resolved",
      avatar: "https://via.placeholder.com/40"
    },
    {
      id: 3,
      type: "project",
      title: "University Portal System",
      participants: ["Alice Student", "Dr. Smith"],
      lastMessage: "Can we schedule a review meeting for the database design?",
      lastMessageTime: "2 days ago",
      unreadCount: 1,
      status: "active",
      projectId: "PROJ-002",
      avatar: "https://via.placeholder.com/40"
    },
    {
      id: 4,
      type: "general",
      title: "Project Manager",
      participants: ["Emily Manager"],
      lastMessage: "Welcome to PritechVior! I'll be your main point of contact.",
      lastMessageTime: "1 week ago",
      unreadCount: 0,
      status: "active",
      avatar: "https://via.placeholder.com/40"
    }
  ];

  const messages = [
    {
      id: 1,
      conversationId: 1,
      sender: "John Developer",
      senderRole: "developer",
      content: "Hi! I've completed the initial setup for the mobile app. The React Native environment is configured and ready.",
      timestamp: "2025-02-05 10:30",
      type: "text",
      status: "read"
    },
    {
      id: 2,
      conversationId: 1,
      sender: "You",
      senderRole: "client",
      content: "Great! When can we expect the first prototype?",
      timestamp: "2025-02-05 10:35",
      type: "text",
      status: "read"
    },
    {
      id: 3,
      conversationId: 1,
      sender: "Sarah Designer",
      senderRole: "designer",
      content: "I'm working on the UI mockups. Should have them ready by end of week.",
      timestamp: "2025-02-05 11:00",
      type: "text",
      status: "read"
    },
    {
      id: 4,
      conversationId: 1,
      sender: "Sarah Designer",
      senderRole: "designer",
      content: "Here are the latest design mockups for the app",
      timestamp: "2025-02-05 14:30",
      type: "file",
      status: "delivered",
      attachments: [
        { name: "Mobile_App_Mockups_v2.fig", size: "2.4 MB", type: "figma" }
      ]
    },
    {
      id: 5,
      conversationId: 1,
      sender: "Mike QA",
      senderRole: "qa",
      content: "The latest UI mockups are ready for review. Please check the attached files.",
      timestamp: "2025-02-05 16:45",
      type: "text",
      status: "delivered"
    }
  ];

  const currentMessages = messages.filter(msg => msg.conversationId === selectedConversation);
  const currentConversation = conversations.find(conv => conv.id === selectedConversation);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      // Add message logic here
      setMessageText("");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-green-500/10 text-green-400";
      case "resolved": return "bg-blue-500/10 text-blue-400";
      case "pending": return "bg-yellow-500/10 text-yellow-400";
      default: return "bg-n-7 text-n-3";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "client": return "from-blue-500 to-blue-600";
      case "developer": return "from-green-500 to-green-600";
      case "designer": return "from-purple-500 to-purple-600";
      case "qa": return "from-orange-500 to-orange-600";
      case "manager": return "from-red-500 to-red-600";
      default: return "from-n-6 to-n-7";
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.participants.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <DashboardLayout title="Client Messaging" userRole="client" userRoles={userRoles}>
      <div className="px-4 lg:px-6">
        <div className="h-[calc(100vh-12rem)] flex bg-n-8 rounded-xl border border-n-6 overflow-hidden">
          {/* Conversations Sidebar */}
        <div className="w-80 border-r border-n-6 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-n-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-n-1">Messages</h2>
              <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors">
                <Plus size={16} className="text-n-3" />
              </button>
            </div>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-n-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-n-7 border border-n-6 rounded-lg pl-10 pr-4 py-2 text-n-1 text-sm"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`p-4 border-b border-n-6/50 cursor-pointer transition-colors hover:bg-n-7/50 ${
                  selectedConversation === conversation.id ? 'bg-n-7/50 border-r-2 border-r-color-1' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-r from-color-1 to-color-2 rounded-full flex items-center justify-center">
                      <MessageCircle size={16} className="text-white" />
                    </div>
                    {conversation.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">{conversation.unreadCount}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-n-1 font-medium truncate">{conversation.title}</h3>
                      <span className="text-n-4 text-xs">{conversation.lastMessageTime}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(conversation.status)}`}>
                        {conversation.type}
                      </span>
                      {conversation.projectId && (
                        <span className="text-n-4 text-xs">{conversation.projectId}</span>
                      )}
                    </div>
                    <p className="text-n-4 text-sm truncate">{conversation.lastMessage}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Users size={12} className="text-n-4" />
                      <span className="text-n-4 text-xs">{conversation.participants.length} participants</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-n-6 bg-n-7/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-color-1 to-color-2 rounded-full flex items-center justify-center">
                      <MessageCircle size={16} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-n-1 font-medium">{currentConversation.title}</h3>
                      <p className="text-n-4 text-sm">
                        {currentConversation.participants.join(", ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors">
                      <Phone size={16} className="text-n-3" />
                    </button>
                    <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors">
                      <Video size={16} className="text-n-3" />
                    </button>
                    <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors">
                      <MoreVertical size={16} className="text-n-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.sender === "You" ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getRoleColor(message.senderRole)} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white text-xs font-medium">
                        {message.sender === "You" ? "Y" : message.sender.charAt(0)}
                      </span>
                    </div>
                    <div className={`max-w-xs lg:max-w-md ${message.sender === "You" ? "items-end" : "items-start"} flex flex-col`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-n-4 text-xs">{message.sender}</span>
                        <span className="text-n-5 text-xs">{message.timestamp}</span>
                      </div>
                      <div
                        className={`p-3 rounded-lg ${
                          message.sender === "You"
                            ? "bg-gradient-to-r from-color-1 to-color-2 text-white"
                            : "bg-n-7 text-n-1"
                        }`}
                      >
                        {message.type === "text" ? (
                          <p className="text-sm">{message.content}</p>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-sm">{message.content}</p>
                            {message.attachments?.map((file, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 bg-black/10 rounded border border-white/10">
                                <File size={16} />
                                <div className="flex-1">
                                  <p className="text-xs font-medium">{file.name}</p>
                                  <p className="text-xs opacity-70">{file.size}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <CheckCheck size={12} className={`${message.status === "read" ? "text-blue-400" : "text-n-4"}`} />
                        <span className="text-n-5 text-xs">{message.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-n-6 bg-n-7/30">
                <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <button type="button" className="p-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors">
                        <Paperclip size={16} className="text-n-3" />
                      </button>
                      <button type="button" className="p-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors">
                        <Image size={16} className="text-n-3" />
                      </button>
                      <button type="button" className="p-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors">
                        <Smile size={16} className="text-n-3" />
                      </button>
                    </div>
                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type your message..."
                      className="w-full bg-n-7 border border-n-6 rounded-lg px-4 py-3 text-n-1 text-sm resize-none"
                      rows="3"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!messageText.trim()}
                    className="p-3 bg-gradient-to-r from-color-1 to-color-2 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle size={48} className="text-n-4 mx-auto mb-4" />
                <h3 className="text-n-1 font-medium mb-2">Select a conversation</h3>
                <p className="text-n-4 text-sm">Choose a conversation from the sidebar to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientMessaging;
