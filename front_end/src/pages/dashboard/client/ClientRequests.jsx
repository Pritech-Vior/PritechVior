import React, { useState } from "react";
import { 
  MessageCircle,
  Send,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  DollarSign,
  Calendar,
  User,
  Building2,
  GraduationCap,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";

const ClientRequests = ({ userRoles = ["client"] }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [newRequest, setNewRequest] = useState({
    title: "",
    type: "Enterprise",
    description: "",
    budget: "",
    deadline: "",
    technology: "",
    priority: "medium",
    requirements: ""
  });

  const requests = [
    {
      id: 1,
      title: "Hospital Management System",
      type: "Final Year Project",
      client: "Student: Lisa Chen",
      budget: "$10,000",
      deadline: "2025-05-15",
      technology: "Laravel, Vue.js",
      status: "pending",
      priority: "medium",
      submitted: "2025-01-03",
      description: "Comprehensive hospital management system with patient records, appointment scheduling, inventory management, and billing system.",
      requirements: "Patient registration, appointment booking, medical records, billing integration, inventory tracking, staff management",
      responses: [
        {
          id: 1,
          from: "Project Manager",
          message: "Thank you for your request. We'll review the requirements and get back to you within 24 hours.",
          timestamp: "2025-01-03 14:30",
          type: "system"
        }
      ]
    },
    {
      id: 2,
      title: "Inventory Management Platform",
      type: "Enterprise",
      client: "Retail Solutions Inc",
      budget: "$35,000",
      deadline: "2025-07-30",
      technology: "Node.js, React",
      status: "reviewing",
      priority: "high",
      submitted: "2024-12-28",
      description: "Advanced inventory management platform with real-time tracking, automated reordering, and analytics dashboard.",
      requirements: "Real-time inventory tracking, barcode scanning, automated alerts, supplier integration, analytics dashboard, mobile app",
      responses: [
        {
          id: 1,
          from: "Technical Lead",
          message: "We've reviewed your requirements. The project scope looks comprehensive. Let's schedule a detailed discussion.",
          timestamp: "2024-12-29 10:15",
          type: "staff"
        },
        {
          id: 2,
          from: "You",
          message: "That sounds great! I'm available for a meeting next week. When would be convenient?",
          timestamp: "2024-12-29 16:45",
          type: "client"
        },
        {
          id: 3,
          from: "Project Manager",
          message: "How about Tuesday, Jan 7th at 2 PM? We can discuss the technical approach and timeline.",
          timestamp: "2024-12-30 09:20",
          type: "staff"
        }
      ]
    },
    {
      id: 3,
      title: "E-Learning Platform",
      type: "Enterprise",
      client: "EduTech Innovations",
      budget: "$65,000",
      deadline: "2025-09-15",
      technology: "Django, React Native",
      status: "quoted",
      priority: "high",
      submitted: "2024-12-20",
      description: "Comprehensive e-learning platform with video streaming, interactive quizzes, progress tracking, and certification system.",
      requirements: "Video streaming, quiz system, progress tracking, user management, payment integration, mobile app, certification",
      responses: [
        {
          id: 1,
          from: "Business Analyst",
          message: "We've prepared a detailed quote based on your requirements. Please review the attached proposal.",
          timestamp: "2024-12-22 11:30",
          type: "staff"
        },
        {
          id: 2,
          from: "You",
          message: "The proposal looks good. Can we discuss the timeline in more detail?",
          timestamp: "2024-12-23 14:20",
          type: "client"
        }
      ]
    },
    {
      id: 4,
      title: "Crypto Trading Bot",
      type: "Final Year Project",
      client: "Student: Alex Rodriguez",
      budget: "$7,500",
      deadline: "2025-04-30",
      technology: "Python, FastAPI",
      status: "in-progress",
      priority: "medium",
      submitted: "2024-11-15",
      description: "Automated cryptocurrency trading bot with multiple strategies, risk management, and real-time monitoring.",
      requirements: "Trading algorithms, risk management, real-time data, backtesting, portfolio management, notifications",
      responses: [
        {
          id: 1,
          from: "Development Team",
          message: "Project has been approved and development is now in progress. You'll receive weekly updates.",
          timestamp: "2024-11-18 09:00",
          type: "staff"
        },
        {
          id: 2,
          from: "You",
          message: "Excellent! Looking forward to the weekly updates. When can I expect the first milestone demo?",
          timestamp: "2024-11-18 15:30",
          type: "client"
        },
        {
          id: 3,
          from: "Project Manager",
          message: "First milestone demo is scheduled for December 15th. We'll showcase the core trading algorithm.",
          timestamp: "2024-11-19 10:45",
          type: "staff"
        }
      ]
    },
    {
      id: 5,
      title: "Social Media Analytics Tool",
      type: "Enterprise",
      client: "Marketing Solutions Ltd",
      budget: "$28,000",
      deadline: "2025-06-20",
      technology: "React, Node.js, MongoDB",
      status: "rejected",
      priority: "low",
      submitted: "2024-12-10",
      description: "Social media analytics tool for tracking engagement, sentiment analysis, and competitor monitoring.",
      requirements: "Multi-platform integration, sentiment analysis, competitor tracking, custom reports, API access",
      responses: [
        {
          id: 1,
          from: "Business Development",
          message: "Unfortunately, we cannot take on this project due to current capacity constraints. We appreciate your interest.",
          timestamp: "2024-12-12 16:20",
          type: "staff"
        },
        {
          id: 2,
          from: "You",
          message: "I understand. Would it be possible to revisit this project in Q2 2025?",
          timestamp: "2024-12-13 09:15",
          type: "client"
        },
        {
          id: 3,
          from: "Business Development",
          message: "Absolutely! Please reach out to us in March 2025 and we'll be happy to discuss this further.",
          timestamp: "2024-12-13 14:30",
          type: "staff"
        }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "reviewing": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "quoted": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "in-progress": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "rejected": return "bg-red-500/10 text-red-400 border-red-500/20";
      default: return "bg-n-7 text-n-3 border-n-6";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return Clock;
      case "reviewing": return Eye;
      case "quoted": return DollarSign;
      case "in-progress": return CheckCircle;
      case "rejected": return AlertCircle;
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

  const getTypeIcon = (type) => {
    return type === "Enterprise" ? Building2 : GraduationCap;
  };

  const filteredRequests = requests.filter(request => {
    const matchesTab = activeTab === "all" || request.status === activeTab;
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.technology.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    // Here you would typically send the request to your API
    console.log("New request submitted:", newRequest);
    setShowNewRequest(false);
    setNewRequest({
      title: "",
      type: "Enterprise",
      description: "",
      budget: "",
      deadline: "",
      technology: "",
      priority: "medium",
      requirements: ""
    });
  };

  const statusCounts = {
    all: requests.length,
    pending: requests.filter(r => r.status === "pending").length,
    reviewing: requests.filter(r => r.status === "reviewing").length,
    quoted: requests.filter(r => r.status === "quoted").length,
    "in-progress": requests.filter(r => r.status === "in-progress").length,
    rejected: requests.filter(r => r.status === "rejected").length
  };

  return (
    <DashboardLayout title="Project Requests" userRole="client" userRoles={userRoles}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-n-1">Project Requests</h1>
            <p className="text-n-3 mt-1">Submit and track your project requests</p>
          </div>
          <button 
            onClick={() => setShowNewRequest(true)}
            className="bg-gradient-to-r from-color-1 to-color-2 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
          >
            <Plus size={16} />
            New Request
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: `All (${statusCounts.all})` },
              { key: "pending", label: `Pending (${statusCounts.pending})` },
              { key: "reviewing", label: `Reviewing (${statusCounts.reviewing})` },
              { key: "quoted", label: `Quoted (${statusCounts.quoted})` },
              { key: "in-progress", label: `In Progress (${statusCounts["in-progress"]})` },
              { key: "rejected", label: `Rejected (${statusCounts.rejected})` }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  activeTab === tab.key
                    ? "bg-gradient-to-r from-color-1 to-color-2 text-white"
                    : "bg-n-7 text-n-3 hover:text-n-1"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-n-4" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-n-7 border border-n-6 rounded-lg pl-10 pr-4 py-2 text-n-1 text-sm w-64"
            />
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.map((request) => {
            const StatusIcon = getStatusIcon(request.status);
            const TypeIcon = getTypeIcon(request.type);
            
            return (
              <div key={request.id} className="bg-n-8 rounded-xl border border-n-6 hover:border-color-1/20 transition-all">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-color-1 to-color-2 rounded-lg flex items-center justify-center">
                        <StatusIcon size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-n-1 font-medium flex items-center gap-2">
                          {request.title}
                          <TypeIcon size={14} className="text-n-4" />
                        </h3>
                        <p className="text-n-4 text-sm">{request.client}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(request.priority)}`}>
                        {request.priority}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-n-3 text-sm mb-4">{request.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-n-4">Budget</p>
                      <p className="text-n-1 font-semibold">{request.budget}</p>
                    </div>
                    <div>
                      <p className="text-n-4">Deadline</p>
                      <p className="text-n-1 font-semibold">{new Date(request.deadline).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-n-4">Technology</p>
                      <p className="text-n-1 font-semibold">{request.technology}</p>
                    </div>
                    <div>
                      <p className="text-n-4">Submitted</p>
                      <p className="text-n-1 font-semibold">{new Date(request.submitted).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageCircle size={14} className="text-n-4" />
                      <span className="text-n-3 text-sm">{request.responses.length} responses</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors">
                        <Eye size={14} className="text-n-3" />
                      </button>
                      <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors">
                        <MessageCircle size={14} className="text-n-3" />
                      </button>
                      {request.status === "pending" && (
                        <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors">
                          <Edit size={14} className="text-n-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredRequests.length === 0 && (
          <div className="bg-n-8 rounded-xl p-12 text-center border border-n-6">
            <MessageCircle size={48} className="text-n-4 mx-auto mb-4" />
            <h3 className="text-n-1 font-medium mb-2">No requests found</h3>
            <p className="text-n-4 text-sm">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* New Request Modal */}
        {showNewRequest && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-n-8 rounded-xl border border-n-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-n-1">Submit New Project Request</h2>
                  <button 
                    onClick={() => setShowNewRequest(false)}
                    className="p-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors"
                  >
                    <AlertCircle size={16} className="text-n-3" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmitRequest} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-n-3 text-sm mb-2">Project Title *</label>
                      <input
                        type="text"
                        required
                        value={newRequest.title}
                        onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
                        className="w-full bg-n-7 border border-n-6 rounded-lg px-3 py-2 text-n-1"
                        placeholder="Enter project title"
                      />
                    </div>
                    <div>
                      <label className="block text-n-3 text-sm mb-2">Project Type *</label>
                      <select
                        required
                        value={newRequest.type}
                        onChange={(e) => setNewRequest({...newRequest, type: e.target.value})}
                        className="w-full bg-n-7 border border-n-6 rounded-lg px-3 py-2 text-n-1"
                      >
                        <option value="Enterprise">Enterprise Project</option>
                        <option value="Final Year Project">Final Year Project</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-n-3 text-sm mb-2">Description *</label>
                    <textarea
                      required
                      rows={3}
                      value={newRequest.description}
                      onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                      className="w-full bg-n-7 border border-n-6 rounded-lg px-3 py-2 text-n-1"
                      placeholder="Describe your project requirements"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-n-3 text-sm mb-2">Budget Range *</label>
                      <input
                        type="text"
                        required
                        value={newRequest.budget}
                        onChange={(e) => setNewRequest({...newRequest, budget: e.target.value})}
                        className="w-full bg-n-7 border border-n-6 rounded-lg px-3 py-2 text-n-1"
                        placeholder="e.g., $10,000 - $15,000"
                      />
                    </div>
                    <div>
                      <label className="block text-n-3 text-sm mb-2">Deadline *</label>
                      <input
                        type="date"
                        required
                        value={newRequest.deadline}
                        onChange={(e) => setNewRequest({...newRequest, deadline: e.target.value})}
                        className="w-full bg-n-7 border border-n-6 rounded-lg px-3 py-2 text-n-1"
                      />
                    </div>
                    <div>
                      <label className="block text-n-3 text-sm mb-2">Priority</label>
                      <select
                        value={newRequest.priority}
                        onChange={(e) => setNewRequest({...newRequest, priority: e.target.value})}
                        className="w-full bg-n-7 border border-n-6 rounded-lg px-3 py-2 text-n-1"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-n-3 text-sm mb-2">Technology Preferences</label>
                    <input
                      type="text"
                      value={newRequest.technology}
                      onChange={(e) => setNewRequest({...newRequest, technology: e.target.value})}
                      className="w-full bg-n-7 border border-n-6 rounded-lg px-3 py-2 text-n-1"
                      placeholder="e.g., React, Node.js, Python"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-n-3 text-sm mb-2">Detailed Requirements</label>
                    <textarea
                      rows={4}
                      value={newRequest.requirements}
                      onChange={(e) => setNewRequest({...newRequest, requirements: e.target.value})}
                      className="w-full bg-n-7 border border-n-6 rounded-lg px-3 py-2 text-n-1"
                      placeholder="List specific features, functionalities, and requirements"
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-color-1 to-color-2 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                    >
                      <Send size={16} />
                      Submit Request
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewRequest(false)}
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

export default ClientRequests;
