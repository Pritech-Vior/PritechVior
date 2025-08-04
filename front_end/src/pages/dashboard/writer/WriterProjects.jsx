import React, { useState } from "react";
import { 
  PenTool,
  FileText,
  BookOpen,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  User,
  Calendar,
  Tag,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Share2,
  Download,
  Upload,
  MessageCircle,
  TrendingUp,
  Target,
  Lightbulb
} from "lucide-react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";

const WriterProjects = ({ userRoles = ["writer"] }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [showNewProject, setShowNewProject] = useState(false);

  const [newProject, setNewProject] = useState({
    title: "",
    type: "blog",
    category: "technology",
    deadline: "",
    wordCount: "",
    description: "",
    tags: ""
  });

  const projects = [
    {
      id: 1,
      title: "Complete Hospital Management System Guide",
      type: "documentation",
      category: "healthcare",
      status: "in-progress",
      progress: 65,
      wordCount: 8500,
      targetWords: 12000,
      deadline: "2025-01-20",
      client: "HealthCare Solutions",
      priority: "high",
      created: "2025-01-05",
      lastUpdated: "2025-01-10T16:30:00Z",
      tags: ["documentation", "healthcare", "management", "system"],
      description: "Comprehensive user documentation for hospital management system including setup, configuration, and daily operations.",
      sections: [
        { name: "Introduction", status: "completed", words: 800 },
        { name: "System Overview", status: "completed", words: 1200 },
        { name: "User Guide", status: "in-progress", words: 3500 },
        { name: "Admin Guide", status: "in-progress", words: 2100 },
        { name: "API Documentation", status: "pending", words: 0 },
        { name: "Troubleshooting", status: "pending", words: 0 }
      ],
      feedback: [
        { from: "Client", message: "Great progress on the user guide section!", timestamp: "2025-01-09", rating: 5 },
        { from: "Editor", message: "Please add more screenshots to the admin section", timestamp: "2025-01-08", rating: 4 }
      ]
    },
    {
      id: 2,
      title: "E-Commerce Platform Blog Series",
      type: "blog",
      category: "technology",
      status: "review",
      progress: 90,
      wordCount: 4800,
      targetWords: 5000,
      deadline: "2025-01-15",
      client: "RetailTech Inc",
      priority: "medium",
      created: "2024-12-20",
      lastUpdated: "2025-01-09T14:20:00Z",
      tags: ["blog", "ecommerce", "technology", "trends"],
      description: "Series of 5 blog posts covering e-commerce trends, mobile shopping, and platform optimization strategies.",
      sections: [
        { name: "Mobile Shopping Trends", status: "completed", words: 1000 },
        { name: "Platform Optimization", status: "completed", words: 1200 },
        { name: "User Experience Best Practices", status: "completed", words: 1100 },
        { name: "Payment Integration Guide", status: "completed", words: 900 },
        { name: "Future of E-Commerce", status: "in-progress", words: 600 }
      ],
      feedback: [
        { from: "Marketing Manager", message: "Excellent insights on mobile trends!", timestamp: "2025-01-07", rating: 5 },
        { from: "SEO Specialist", message: "Consider adding more keywords in section 3", timestamp: "2025-01-06", rating: 4 }
      ]
    },
    {
      id: 3,
      title: "Corporate Website Content Strategy",
      type: "content-strategy",
      category: "marketing",
      status: "completed",
      progress: 100,
      wordCount: 15000,
      targetWords: 15000,
      deadline: "2024-12-30",
      client: "TechCorp Solutions",
      priority: "high",
      created: "2024-11-15",
      lastUpdated: "2024-12-28T11:45:00Z",
      tags: ["content-strategy", "corporate", "website", "marketing"],
      description: "Complete content strategy and copywriting for corporate website redesign including all pages and sections.",
      sections: [
        { name: "Homepage Copy", status: "completed", words: 800 },
        { name: "About Us", status: "completed", words: 1200 },
        { name: "Services Pages", status: "completed", words: 4500 },
        { name: "Case Studies", status: "completed", words: 3200 },
        { name: "Blog Content Plan", status: "completed", words: 2800 },
        { name: "SEO Optimization", status: "completed", words: 2500 }
      ],
      feedback: [
        { from: "CEO", message: "Perfect representation of our brand voice!", timestamp: "2024-12-25", rating: 5 },
        { from: "Marketing Director", message: "Outstanding work on the case studies", timestamp: "2024-12-20", rating: 5 }
      ]
    },
    {
      id: 4,
      title: "Educational Platform Course Content",
      type: "course-content",
      category: "education",
      status: "planning",
      progress: 25,
      wordCount: 3200,
      targetWords: 25000,
      deadline: "2025-03-01",
      client: "EduTech Innovations",
      priority: "medium",
      created: "2025-01-08",
      lastUpdated: "2025-01-10T09:15:00Z",
      tags: ["education", "course", "content", "learning"],
      description: "Comprehensive course content creation for online learning platform including modules, assessments, and interactive elements.",
      sections: [
        { name: "Course Outline", status: "completed", words: 1500 },
        { name: "Module 1: Introduction", status: "in-progress", words: 1700 },
        { name: "Module 2: Fundamentals", status: "pending", words: 0 },
        { name: "Module 3: Advanced Topics", status: "pending", words: 0 },
        { name: "Assessments", status: "pending", words: 0 },
        { name: "Resources & References", status: "pending", words: 0 }
      ],
      feedback: []
    },
    {
      id: 5,
      title: "Crypto Trading Bot White Paper",
      type: "whitepaper",
      category: "fintech",
      status: "on-hold",
      progress: 40,
      wordCount: 4500,
      targetWords: 10000,
      deadline: "2025-02-28",
      client: "FinTech Startups",
      priority: "low",
      created: "2024-12-01",
      lastUpdated: "2024-12-20T15:30:00Z",
      tags: ["whitepaper", "crypto", "fintech", "trading"],
      description: "Technical white paper explaining cryptocurrency trading bot algorithms, risk management, and performance optimization.",
      sections: [
        { name: "Executive Summary", status: "completed", words: 800 },
        { name: "Market Analysis", status: "completed", words: 1200 },
        { name: "Technical Architecture", status: "in-progress", words: 1500 },
        { name: "Algorithm Details", status: "in-progress", words: 1000 },
        { name: "Risk Management", status: "pending", words: 0 },
        { name: "Performance Metrics", status: "pending", words: 0 }
      ],
      feedback: [
        { from: "CTO", message: "Technical sections need more depth", timestamp: "2024-12-18", rating: 3 }
      ]
    },
    {
      id: 6,
      title: "Social Media Content Calendar",
      type: "social-media",
      category: "marketing",
      status: "completed",
      progress: 100,
      wordCount: 6000,
      targetWords: 6000,
      deadline: "2024-12-15",
      client: "Marketing Solutions Ltd",
      priority: "medium",
      created: "2024-11-01",
      lastUpdated: "2024-12-12T13:20:00Z",
      tags: ["social-media", "marketing", "content-calendar", "engagement"],
      description: "Monthly social media content calendar with posts, captions, and engagement strategies for multiple platforms.",
      sections: [
        { name: "Content Strategy", status: "completed", words: 1000 },
        { name: "Platform Guidelines", status: "completed", words: 800 },
        { name: "Weekly Themes", status: "completed", words: 1200 },
        { name: "Post Templates", status: "completed", words: 1500 },
        { name: "Hashtag Research", status: "completed", words: 700 },
        { name: "Analytics Plan", status: "completed", words: 800 }
      ],
      feedback: [
        { from: "Social Media Manager", message: "Creative and engaging content ideas!", timestamp: "2024-12-10", rating: 5 }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "planning": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "in-progress": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "review": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "completed": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "on-hold": return "bg-red-500/10 text-red-400 border-red-500/20";
      default: return "bg-n-7 text-n-3 border-n-6";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "planning": return Lightbulb;
      case "in-progress": return Clock;
      case "review": return Eye;
      case "completed": return CheckCircle;
      case "on-hold": return AlertCircle;
      default: return FileText;
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
    switch (type) {
      case "blog": return PenTool;
      case "documentation": return BookOpen;
      case "content-strategy": return Target;
      case "course-content": return User;
      case "whitepaper": return FileText;
      case "social-media": return Share2;
      default: return FileText;
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesTab = activeTab === "all" || project.status === activeTab;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesTab && matchesSearch;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.lastUpdated) - new Date(a.lastUpdated);
      case "deadline":
        return new Date(a.deadline) - new Date(b.deadline);
      case "progress":
        return b.progress - a.progress;
      case "words":
        return b.wordCount - a.wordCount;
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const handleSubmitProject = (e) => {
    e.preventDefault();
    console.log("New project:", newProject);
    setShowNewProject(false);
    setNewProject({
      title: "",
      type: "blog",
      category: "technology",
      deadline: "",
      wordCount: "",
      description: "",
      tags: ""
    });
  };

  const statusCounts = {
    all: projects.length,
    planning: projects.filter(p => p.status === "planning").length,
    "in-progress": projects.filter(p => p.status === "in-progress").length,
    review: projects.filter(p => p.status === "review").length,
    completed: projects.filter(p => p.status === "completed").length,
    "on-hold": projects.filter(p => p.status === "on-hold").length
  };

  return (
    <DashboardLayout title="Writing Projects" userRole="writer" userRoles={userRoles}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-n-1">Writing Projects</h1>
            <p className="text-n-3 mt-1">Manage your writing assignments and content creation</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-n-7 text-n-3 px-4 py-2 rounded-lg hover:bg-n-6 flex items-center gap-2">
              <Upload size={16} />
              Import
            </button>
            <button 
              onClick={() => setShowNewProject(true)}
              className="bg-gradient-to-r from-color-1 to-color-2 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={16} />
              New Project
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-n-8 rounded-xl p-4 border border-n-6">
            <div className="flex items-center justify-between mb-2">
              <PenTool size={20} className="text-blue-400" />
              <span className="text-blue-400 text-sm">+3</span>
            </div>
            <h3 className="text-xl font-bold text-n-1">{projects.length}</h3>
            <p className="text-n-3 text-sm">Total Projects</p>
          </div>
          
          <div className="bg-n-8 rounded-xl p-4 border border-n-6">
            <div className="flex items-center justify-between mb-2">
              <Clock size={20} className="text-yellow-400" />
              <span className="text-yellow-400 text-sm">Active</span>
            </div>
            <h3 className="text-xl font-bold text-n-1">{statusCounts["in-progress"]}</h3>
            <p className="text-n-3 text-sm">In Progress</p>
          </div>
          
          <div className="bg-n-8 rounded-xl p-4 border border-n-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp size={20} className="text-green-400" />
              <span className="text-green-400 text-sm">Words</span>
            </div>
            <h3 className="text-xl font-bold text-n-1">{projects.reduce((sum, p) => sum + p.wordCount, 0).toLocaleString()}</h3>
            <p className="text-n-3 text-sm">Total Words</p>
          </div>
          
          <div className="bg-n-8 rounded-xl p-4 border border-n-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle size={20} className="text-purple-400" />
              <span className="text-purple-400 text-sm">Done</span>
            </div>
            <h3 className="text-xl font-bold text-n-1">{statusCounts.completed}</h3>
            <p className="text-n-3 text-sm">Completed</p>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: `All (${statusCounts.all})` },
              { key: "planning", label: `Planning (${statusCounts.planning})` },
              { key: "in-progress", label: `In Progress (${statusCounts["in-progress"]})` },
              { key: "review", label: `Review (${statusCounts.review})` },
              { key: "completed", label: `Completed (${statusCounts.completed})` },
              { key: "on-hold", label: `On Hold (${statusCounts["on-hold"]})` }
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
          
          <div className="flex gap-3 items-center">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-n-4" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-n-7 border border-n-6 rounded-lg pl-10 pr-4 py-2 text-n-1 text-sm w-48"
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-n-7 border border-n-6 rounded-lg px-3 py-2 text-n-1 text-sm"
            >
              <option value="recent">Recent</option>
              <option value="deadline">Deadline</option>
              <option value="progress">Progress</option>
              <option value="words">Word Count</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-6">
          {sortedProjects.map((project) => {
            const StatusIcon = getStatusIcon(project.status);
            const TypeIcon = getTypeIcon(project.type);
            
            return (
              <div key={project.id} className="bg-n-8 rounded-xl border border-n-6 hover:border-color-1/20 transition-all">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-color-1 to-color-2 rounded-lg flex items-center justify-center">
                        <TypeIcon size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-n-1 font-medium">{project.title}</h3>
                        <p className="text-n-4 text-sm">{project.client} • {project.type.replace('-', ' ')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(project.priority)}`}>
                        {project.priority}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(project.status)}`}>
                        <StatusIcon size={12} className="inline mr-1" />
                        {project.status}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-n-3 text-sm mb-4">{project.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-n-4">Progress</p>
                      <p className="text-n-1 font-semibold">{project.progress}%</p>
                    </div>
                    <div>
                      <p className="text-n-4">Word Count</p>
                      <p className="text-n-1 font-semibold">{project.wordCount.toLocaleString()} / {project.targetWords.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-n-4">Deadline</p>
                      <p className="text-n-1 font-semibold">{new Date(project.deadline).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-n-4">Sections</p>
                      <p className="text-n-1 font-semibold">{project.sections.length}</p>
                    </div>
                    <div>
                      <p className="text-n-4">Last Updated</p>
                      <p className="text-n-1 font-semibold">{new Date(project.lastUpdated).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-n-3 mb-1">
                      <span>Project Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-n-6 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-color-1 to-color-2 h-2 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Sections */}
                  <div className="mb-4">
                    <p className="text-n-3 text-sm mb-2">Sections Progress:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {project.sections.map((section, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-n-7 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              section.status === "completed" ? "bg-green-400" :
                              section.status === "in-progress" ? "bg-yellow-400" : "bg-n-4"
                            }`} />
                            <span className="text-n-1 text-sm">{section.name}</span>
                          </div>
                          <span className="text-n-3 text-xs">{section.words}w</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {project.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-n-7 text-n-3 rounded text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Feedback */}
                  {project.feedback.length > 0 && (
                    <div className="mb-4">
                      <p className="text-n-3 text-sm mb-2">Recent Feedback:</p>
                      <div className="space-y-2">
                        {project.feedback.slice(0, 2).map((feedback, index) => (
                          <div key={index} className="bg-n-7 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-n-1 text-sm font-medium">{feedback.from}</span>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={12} className={i < feedback.rating ? "text-yellow-400 fill-current" : "text-n-4"} />
                                ))}
                              </div>
                            </div>
                            <p className="text-n-3 text-sm">{feedback.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-n-3 text-sm">Category: {project.category}</span>
                      {project.feedback.length > 0 && (
                        <div className="flex items-center gap-1">
                          <MessageCircle size={14} className="text-n-4" />
                          <span className="text-n-3 text-sm">{project.feedback.length} feedback</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors">
                        <Eye size={14} className="text-n-3" />
                      </button>
                      <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors">
                        <Edit size={14} className="text-n-3" />
                      </button>
                      <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors">
                        <Share2 size={14} className="text-n-3" />
                      </button>
                      <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors">
                        <Download size={14} className="text-n-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {sortedProjects.length === 0 && (
          <div className="bg-n-8 rounded-xl p-12 text-center border border-n-6">
            <PenTool size={48} className="text-n-4 mx-auto mb-4" />
            <h3 className="text-n-1 font-medium mb-2">No projects found</h3>
            <p className="text-n-4 text-sm">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* New Project Modal */}
        {showNewProject && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-n-8 rounded-xl border border-n-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-n-1">Create New Writing Project</h2>
                  <button 
                    onClick={() => setShowNewProject(false)}
                    className="p-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors"
                  >
                    <AlertCircle size={16} className="text-n-3" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmitProject} className="space-y-4">
                  <div>
                    <label className="block text-n-3 text-sm mb-2">Project Title *</label>
                    <input
                      type="text"
                      required
                      value={newProject.title}
                      onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                      className="w-full bg-n-7 border border-n-6 rounded-lg px-3 py-2 text-n-1"
                      placeholder="Enter project title"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-n-3 text-sm mb-2">Content Type *</label>
                      <select
                        required
                        value={newProject.type}
                        onChange={(e) => setNewProject({...newProject, type: e.target.value})}
                        className="w-full bg-n-7 border border-n-6 rounded-lg px-3 py-2 text-n-1"
                      >
                        <option value="blog">Blog Post</option>
                        <option value="documentation">Documentation</option>
                        <option value="content-strategy">Content Strategy</option>
                        <option value="course-content">Course Content</option>
                        <option value="whitepaper">White Paper</option>
                        <option value="social-media">Social Media</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-n-3 text-sm mb-2">Category</label>
                      <select
                        value={newProject.category}
                        onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                        className="w-full bg-n-7 border border-n-6 rounded-lg px-3 py-2 text-n-1"
                      >
                        <option value="technology">Technology</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="marketing">Marketing</option>
                        <option value="education">Education</option>
                        <option value="fintech">FinTech</option>
                        <option value="corporate">Corporate</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-n-3 text-sm mb-2">Deadline *</label>
                      <input
                        type="date"
                        required
                        value={newProject.deadline}
                        onChange={(e) => setNewProject({...newProject, deadline: e.target.value})}
                        className="w-full bg-n-7 border border-n-6 rounded-lg px-3 py-2 text-n-1"
                      />
                    </div>
                    <div>
                      <label className="block text-n-3 text-sm mb-2">Target Word Count</label>
                      <input
                        type="number"
                        value={newProject.wordCount}
                        onChange={(e) => setNewProject({...newProject, wordCount: e.target.value})}
                        className="w-full bg-n-7 border border-n-6 rounded-lg px-3 py-2 text-n-1"
                        placeholder="e.g., 5000"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-n-3 text-sm mb-2">Description *</label>
                    <textarea
                      required
                      rows={3}
                      value={newProject.description}
                      onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                      className="w-full bg-n-7 border border-n-6 rounded-lg px-3 py-2 text-n-1"
                      placeholder="Describe the project requirements and objectives"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-n-3 text-sm mb-2">Tags</label>
                    <input
                      type="text"
                      value={newProject.tags}
                      onChange={(e) => setNewProject({...newProject, tags: e.target.value})}
                      className="w-full bg-n-7 border border-n-6 rounded-lg px-3 py-2 text-n-1"
                      placeholder="Enter tags separated by commas"
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-color-1 to-color-2 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Create Project
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewProject(false)}
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

export default WriterProjects;
