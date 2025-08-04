import React, { useState } from "react";
import { 
  HeadphonesIcon,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  Plus,
  Search,
  Filter,
  Star,
  FileText,
  Paperclip,
  Send,
  Video,
  Calendar,
  Tag
} from "lucide-react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";

const ClientSupport = ({ userRoles = ["client"] }) => {
  const [activeTab, setActiveTab] = useState("tickets");
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  const [newTicket, setNewTicket] = useState({
    subject: "",
    category: "general",
    priority: "medium",
    description: "",
    attachments: []
  });

  const supportTickets = [
    {
      id: 1,
      subject: "Database Connection Issues",
      category: "technical",
      priority: "high",
      status: "open",
      created: "2025-01-10T09:30:00Z",
      updated: "2025-01-10T14:45:00Z",
      assignedTo: "Tech Support Team",
      description: "Experiencing intermittent database connection issues with the hospital management system. Users are getting timeout errors during peak hours.",
      messages: [
        {
          id: 1,
          from: "You",
          message: "We're experiencing database connection issues. Users are getting timeout errors.",
          timestamp: "2025-01-10T09:30:00Z",
          type: "client",
          attachments: ["error_logs.txt"]
        },
        {
          id: 2,
          from: "Sarah (Technical Support)",
          message: "Thank you for reporting this. I've reviewed the error logs. It appears to be related to connection pooling. We'll investigate and implement a fix.",
          timestamp: "2025-01-10T11:15:00Z",
          type: "support"
        },
        {
          id: 3,
          from: "Sarah (Technical Support)",
          message: "We've identified the issue and deployed a fix. The connection pooling configuration has been optimized. Please test and let us know if you're still experiencing issues.",
          timestamp: "2025-01-10T14:45:00Z",
          type: "support"
        }
      ]
    },
    {
      id: 2,
      subject: "Feature Request: Advanced Reporting",
      category: "feature",
      priority: "medium",
      status: "in-progress",
      created: "2025-01-08T16:20:00Z",
      updated: "2025-01-09T10:30:00Z",
      assignedTo: "Product Team",
      description: "Request for advanced reporting features including custom filters, export options, and scheduled reports for the inventory management system.",
      messages: [
        {
          id: 1,
          from: "You",
          message: "We need advanced reporting capabilities with custom filters and export options.",
          timestamp: "2025-01-08T16:20:00Z",
          type: "client"
        },
        {
          id: 2,
          from: "Mike (Product Manager)",
          message: "Great suggestion! This aligns with our roadmap. I'll add this to our next sprint planning. Can you provide more details about the specific filters you need?",
          timestamp: "2025-01-09T10:30:00Z",
          type: "support"
        }
      ]
    },
    {
      id: 3,
      subject: "Login Authentication Problem",
      category: "account",
      priority: "high",
      status: "resolved",
      created: "2025-01-07T11:00:00Z",
      updated: "2025-01-07T15:30:00Z",
      assignedTo: "Security Team",
      description: "Unable to log in to the system. Getting 'Invalid credentials' error even with correct username and password.",
      messages: [
        {
          id: 1,
          from: "You",
          message: "Cannot log in to the system. Getting invalid credentials error.",
          timestamp: "2025-01-07T11:00:00Z",
          type: "client"
        },
        {
          id: 2,
          from: "Alex (Security Team)",
          message: "I've reset your account password and cleared any locked sessions. You should be able to log in now. Please try again.",
          timestamp: "2025-01-07T15:30:00Z",
          type: "support"
        }
      ]
    },
    {
      id: 4,
      subject: "Training Session Request",
      category: "training",
      priority: "low",
      status: "scheduled",
      created: "2025-01-06T14:15:00Z",
      updated: "2025-01-06T16:45:00Z",
      assignedTo: "Training Team",
      description: "Request for additional training session for new team members on using the e-learning platform administration features.",
      messages: [
        {
          id: 1,
          from: "You",
          message: "We need a training session for our new administrators on the e-learning platform.",
          timestamp: "2025-01-06T14:15:00Z",
          type: "client"
        },
        {
          id: 2,
          from: "Lisa (Training Coordinator)",
          message: "I've scheduled a training session for January 15th at 2 PM. I'll send you the meeting details shortly.",
          timestamp: "2025-01-06T16:45:00Z",
          type: "support"
        }
      ]
    },
    {
      id: 5,
      subject: "Performance Optimization Question",
      category: "general",
      priority: "medium",
      status: "waiting",
      created: "2025-01-05T13:45:00Z",
      updated: "2025-01-05T13:45:00Z",
      assignedTo: "Performance Team",
      description: "Inquiry about best practices for optimizing system performance during high traffic periods.",
      messages: [
        {
          id: 1,
          from: "You",
          message: "What are the best practices for handling high traffic periods? Our system slows down during peak hours.",
          timestamp: "2025-01-05T13:45:00Z",
          type: "client"
        }
      ]
    }
  ];

  const knowledgeBase = [
    {
      id: 1,
      title: "Getting Started Guide",
      category: "basics",
      views: 1250,
      helpful: 45,
      description: "Complete guide to getting started with your new project",
      content: "This comprehensive guide will walk you through the initial setup and basic usage of your project..."
    },
    {
      id: 2,
      title: "Database Configuration",
      category: "technical",
      views: 890,
      helpful: 32,
      description: "How to configure and optimize database settings",
      content: "Learn how to properly configure your database for optimal performance..."
    },
    {
      id: 3,
      title: "User Management",
      category: "administration",
      views: 756,
      helpful: 28,
      description: "Managing users, roles, and permissions",
      content: "This article covers user management including creating accounts, assigning roles..."
    },
    {
      id: 4,
      title: "API Integration Guide",
      category: "development",
      views: 643,
      helpful: 22,
      description: "How to integrate with third-party APIs",
      content: "Step-by-step guide for integrating external APIs into your application..."
    },
    {
      id: 5,
      title: "Troubleshooting Common Issues",
      category: "troubleshooting",
      views: 1100,
      helpful: 38,
      description: "Solutions to frequently encountered problems",
      content: "Find solutions to the most common issues users encounter..."
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "open": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "in-progress": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "resolved": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "closed": return "bg-n-7 text-n-3 border-n-6";
      case "waiting": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "scheduled": return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      default: return "bg-n-7 text-n-3 border-n-6";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "open": return AlertCircle;
      case "in-progress": return Clock;
      case "resolved": return CheckCircle;
      case "closed": return CheckCircle;
      case "waiting": return Clock;
      case "scheduled": return Calendar;
      default: return MessageCircle;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "text-red-400 bg-red-500/10";
      case "medium": return "text-yellow-400 bg-yellow-500/10";
      case "low": return "text-green-400 bg-green-500/10";
      default: return "text-n-3 bg-n-7";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "technical": return AlertCircle;
      case "feature": return Plus;
      case "account": return User;
      case "training": return Video;
      case "general": return MessageCircle;
      default: return MessageCircle;
    }
  };

  const filteredTickets = supportTickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const filteredKnowledge = knowledgeBase.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    console.log("New ticket submitted:", newTicket);
    setShowNewTicket(false);
    setNewTicket({
      subject: "",
      category: "general",
      priority: "medium",
      description: "",
      attachments: []
    });
  };

  const statusCounts = {
    all: supportTickets.length,
    open: supportTickets.filter(t => t.status === "open").length,
    "in-progress": supportTickets.filter(t => t.status === "in-progress").length,
    waiting: supportTickets.filter(t => t.status === "waiting").length,
    resolved: supportTickets.filter(t => t.status === "resolved").length
  };

  return (
    <DashboardLayout title="Support Center" userRole="client" userRoles={userRoles}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-n-1">Support Center</h1>
            <p className="text-n-3 mt-1">Get help, submit tickets, and access knowledge base</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-n-7 text-n-3 px-4 py-2 rounded-lg hover:bg-n-6 flex items-center gap-2">
              <Phone size={16} />
              Call Support
            </button>
            <button 
              onClick={() => setShowNewTicket(true)}
              className="bg-gradient-to-r from-color-1 to-color-2 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={16} />
              New Ticket
            </button>
          </div>
        </div>

        {/* Quick Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-n-8 rounded-xl p-4 border border-n-6 text-center">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Phone size={20} className="text-blue-400" />
            </div>
            <h3 className="text-n-1 font-medium mb-1">Phone Support</h3>
            <p className="text-n-3 text-sm mb-2">+1 (555) 123-4567</p>
            <p className="text-n-4 text-xs">Mon-Fri 9 AM - 6 PM EST</p>
          </div>

          <div className="bg-n-8 rounded-xl p-4 border border-n-6 text-center">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <MessageCircle size={20} className="text-green-400" />
            </div>
            <h3 className="text-n-1 font-medium mb-1">Live Chat</h3>
            <p className="text-n-3 text-sm mb-2">Chat with our team</p>
            <p className="text-n-4 text-xs">Available 24/7</p>
          </div>

          <div className="bg-n-8 rounded-xl p-4 border border-n-6 text-center">
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Mail size={20} className="text-purple-400" />
            </div>
            <h3 className="text-n-1 font-medium mb-1">Email Support</h3>
            <p className="text-n-3 text-sm mb-2">support@pritechvior.com</p>
            <p className="text-n-4 text-xs">Response within 4 hours</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-n-6">
          <button
            onClick={() => setActiveTab("tickets")}
            className={`px-4 py-2 text-sm transition-colors ${
              activeTab === "tickets"
                ? "text-color-1 border-b-2 border-color-1"
                : "text-n-3 hover:text-n-1"
            }`}
          >
            Support Tickets
          </button>
          <button
            onClick={() => setActiveTab("knowledge")}
            className={`px-4 py-2 text-sm transition-colors ${
              activeTab === "knowledge"
                ? "text-color-1 border-b-2 border-color-1"
                : "text-n-3 hover:text-n-1"
            }`}
          >
            Knowledge Base
          </button>
        </div>

        {/* Support Tickets Tab */}
        {activeTab === "tickets" && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "all", label: `All (${statusCounts.all})` },
                  { key: "open", label: `Open (${statusCounts.open})` },
                  { key: "in-progress", label: `In Progress (${statusCounts["in-progress"]})` },
                  { key: "waiting", label: `Waiting (${statusCounts.waiting})` },
                  { key: "resolved", label: `Resolved (${statusCounts.resolved})` }
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setFilterStatus(filter.key)}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      filterStatus === filter.key
                        ? "bg-gradient-to-r from-color-1 to-color-2 text-white"
                        : "bg-n-7 text-n-3 hover:text-n-1"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-n-4" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-n-7 border border-n-6 rounded-lg pl-10 pr-4 py-2 text-n-1 text-sm w-64"
                />
              </div>
            </div>

            {/* Tickets List */}
            <div className="space-y-4">
              {filteredTickets.map((ticket) => {
                const StatusIcon = getStatusIcon(ticket.status);
                const CategoryIcon = getCategoryIcon(ticket.category);
                
                return (
                  <div key={ticket.id} className="bg-n-8 rounded-xl border border-n-6 hover:border-color-1/20 transition-all">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-color-1 to-color-2 rounded-lg flex items-center justify-center">
                            <StatusIcon size={20} className="text-white" />
                          </div>
                          <div>
                            <h3 className="text-n-1 font-medium flex items-center gap-2">
                              #{ticket.id} - {ticket.subject}
                              <CategoryIcon size={14} className="text-n-4" />
                            </h3>
                            <p className="text-n-4 text-sm">Assigned to: {ticket.assignedTo}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-n-3 text-sm mb-4">{ticket.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                        <div>
                          <p className="text-n-4">Created</p>
                          <p className="text-n-1 font-semibold">{new Date(ticket.created).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-n-4">Last Updated</p>
                          <p className="text-n-1 font-semibold">{new Date(ticket.updated).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-n-4">Category</p>
                          <p className="text-n-1 font-semibold capitalize">{ticket.category}</p>
                        </div>
                        <div>
                          <p className="text-n-4">Messages</p>
                          <p className="text-n-1 font-semibold">{ticket.messages.length}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageCircle size={14} className="text-n-4" />
                          <span className="text-n-3 text-sm">
                            Last message: {new Date(ticket.messages[ticket.messages.length - 1].timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors">
                            <MessageCircle size={14} className="text-n-3" />
                          </button>
                          <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors">
                            <FileText size={14} className="text-n-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredTickets.length === 0 && (
              <div className="bg-n-8 rounded-xl p-12 text-center border border-n-6">
                <HeadphonesIcon size={48} className="text-n-4 mx-auto mb-4" />
                <h3 className="text-n-1 font-medium mb-2">No tickets found</h3>
                <p className="text-n-4 text-sm">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        )}

        {/* Knowledge Base Tab */}
        {activeTab === "knowledge" && (
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-n-4" />
              <input
                type="text"
                placeholder="Search knowledge base..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-n-7 border border-n-6 rounded-lg pl-10 pr-4 py-3 text-n-1"
              />
            </div>

            {/* Knowledge Base Articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredKnowledge.map((article) => (
                <div key={article.id} className="bg-n-8 rounded-xl border border-n-6 hover:border-color-1/20 transition-all p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-color-1 to-color-2 rounded-lg flex items-center justify-center">
                      <FileText size={16} className="text-white" />
                    </div>
                    <span className="px-2 py-1 bg-n-7 text-n-3 rounded text-xs capitalize">
                      {article.category}
                    </span>
                  </div>
                  
                  <h3 className="text-n-1 font-medium mb-2">{article.title}</h3>
                  <p className="text-n-3 text-sm mb-4">{article.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="text-n-4">{article.views} views</span>
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-yellow-400" />
                        <span className="text-n-4">{article.helpful}</span>
                      </div>
                    </div>
                    <button className="text-color-1 hover:text-color-2 text-sm">
                      Read more
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredKnowledge.length === 0 && (
              <div className="bg-n-8 rounded-xl p-12 text-center border border-n-6">
                <FileText size={48} className="text-n-4 mx-auto mb-4" />
                <h3 className="text-n-1 font-medium mb-2">No articles found</h3>
                <p className="text-n-4 text-sm">Try adjusting your search terms</p>
              </div>
            )}
          </div>
        )}

        {/* New Ticket Modal */}
        {showNewTicket && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-n-8 rounded-xl border border-n-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-n-1">Submit Support Ticket</h2>
                  <button 
                    onClick={() => setShowNewTicket(false)}
                    className="p-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors"
                  >
                    <AlertCircle size={16} className="text-n-3" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmitTicket} className="space-y-4">
                  <div>
                    <label className="block text-n-3 text-sm mb-2">Subject *</label>
                    <input
                      type="text"
                      required
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                      className="w-full bg-n-7 border border-n-6 rounded-lg px-3 py-2 text-n-1"
                      placeholder="Brief description of your issue"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-n-3 text-sm mb-2">Category *</label>
                      <select
                        required
                        value={newTicket.category}
                        onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                        className="w-full bg-n-7 border border-n-6 rounded-lg px-3 py-2 text-n-1"
                      >
                        <option value="general">General Support</option>
                        <option value="technical">Technical Issue</option>
                        <option value="feature">Feature Request</option>
                        <option value="account">Account Issue</option>
                        <option value="training">Training Request</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-n-3 text-sm mb-2">Priority</label>
                      <select
                        value={newTicket.priority}
                        onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                        className="w-full bg-n-7 border border-n-6 rounded-lg px-3 py-2 text-n-1"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-n-3 text-sm mb-2">Description *</label>
                    <textarea
                      required
                      rows={5}
                      value={newTicket.description}
                      onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                      className="w-full bg-n-7 border border-n-6 rounded-lg px-3 py-2 text-n-1"
                      placeholder="Detailed description of your issue or request"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-n-3 text-sm mb-2">Attachments</label>
                    <div className="border-2 border-dashed border-n-6 rounded-lg p-4 text-center">
                      <Paperclip size={24} className="text-n-4 mx-auto mb-2" />
                      <p className="text-n-3 text-sm">Drag & drop files here or click to browse</p>
                      <p className="text-n-4 text-xs mt-1">Max file size: 10MB</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-color-1 to-color-2 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                    >
                      <Send size={16} />
                      Submit Ticket
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewTicket(false)}
                      className="bg-n-7 text-n-3 px-6 py-2 rounded-lg hover:bg-n-6"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClientSupport;
