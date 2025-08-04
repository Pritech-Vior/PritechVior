import React, { useState } from "react";
import { 
  PenTool, 
  FileText, 
  BookOpen,
  Edit3,
  Save,
  Eye,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Users,
  Star,
  MessageCircle,
  Share2,
  Download,
  Upload,
  Search,
  Filter,
  Plus,
  Copy,
  Trash2,
  Archive,
  Flag,
  Tag,
  Hash,
  Quote,
  List,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  Bookmark,
  Folder,
  Award,
  Zap,
  Globe,
  Smartphone,
  Monitor,
  Coffee,
  Lightbulb,
  Headphones,
  Book,
  Shield
} from "lucide-react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";

const WriterDashboard = ({ userRoles = ["writer"] }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [contentFilter, setContentFilter] = useState("all");

  const writerStats = [
    {
      title: "Articles Published",
      value: "156",
      change: "+12 this month",
      changeType: "positive",
      icon: FileText,
      color: "blue"
    },
    {
      title: "Words Written",
      value: "248K",
      change: "+15K this week",
      changeType: "positive",
      icon: PenTool,
      color: "green"
    },
    {
      title: "Average Rating",
      value: "4.8",
      change: "+0.2 this month",
      changeType: "positive",
      icon: Star,
      color: "yellow"
    },
    {
      title: "Active Projects",
      value: "8",
      change: "2 due this week",
      changeType: "neutral",
      icon: BookOpen,
      color: "purple"
    }
  ];

  const currentProjects = [
    {
      id: 1,
      title: "Complete Guide to Web Development",
      type: "Technical Article",
      client: "TechBlog Inc",
      status: "In Progress",
      progress: 75,
      wordCount: 3200,
      targetWords: 4000,
      deadline: "2025-01-15",
      priority: "high",
      category: "technology",
      lastModified: "2 hours ago"
    },
    {
      id: 2,
      title: "Marketing Campaign Copy",
      type: "Marketing Content",
      client: "StartupXYZ",
      status: "Review",
      progress: 90,
      wordCount: 1800,
      targetWords: 2000,
      deadline: "2025-01-10",
      priority: "medium",
      category: "marketing",
      lastModified: "5 hours ago"
    },
    {
      id: 3,
      title: "Product Documentation",
      type: "Documentation",
      client: "SoftwareCorp",
      status: "Draft",
      progress: 45,
      wordCount: 2100,
      targetWords: 5000,
      deadline: "2025-01-25",
      priority: "low",
      category: "documentation",
      lastModified: "1 day ago"
    },
    {
      id: 4,
      title: "Blog Series: AI in Business",
      type: "Blog Series",
      client: "AI Weekly",
      status: "Planning",
      progress: 20,
      wordCount: 800,
      targetWords: 6000,
      deadline: "2025-01-30",
      priority: "high",
      category: "artificial-intelligence",
      lastModified: "3 hours ago"
    }
  ];

  const recentArticles = [
    {
      id: 1,
      title: "The Future of Remote Work",
      type: "Opinion Piece",
      status: "published",
      publishDate: "2025-01-03",
      views: 2400,
      likes: 156,
      comments: 23
    },
    {
      id: 2,
      title: "Cybersecurity Best Practices",
      type: "How-to Guide",
      status: "pending-review",
      publishDate: "2025-01-02",
      views: 0,
      likes: 0,
      comments: 0
    },
    {
      id: 3,
      title: "Startup Funding Strategies",
      type: "Research Article",
      status: "published",
      publishDate: "2024-12-28",
      views: 3200,
      likes: 284,
      comments: 45
    },
    {
      id: 4,
      title: "Design Thinking Workshop",
      type: "Event Coverage",
      status: "draft",
      publishDate: null,
      views: 0,
      likes: 0,
      comments: 0
    }
  ];

  const writingGoals = [
    {
      id: 1,
      title: "Monthly Word Count",
      current: 48000,
      target: 60000,
      unit: "words",
      deadline: "2025-01-31"
    },
    {
      id: 2,
      title: "Articles Published",
      current: 8,
      target: 12,
      unit: "articles",
      deadline: "2025-01-31"
    },
    {
      id: 3,
      title: "Client Projects",
      current: 6,
      target: 8,
      unit: "projects",
      deadline: "2025-01-31"
    }
  ];

  const contentIdeas = [
    {
      id: 1,
      title: "Machine Learning for Beginners",
      category: "Technology",
      priority: "high",
      estimatedWords: 3000,
      notes: "Include practical examples and code snippets"
    },
    {
      id: 2,
      title: "Sustainable Business Practices",
      category: "Business",
      priority: "medium",
      estimatedWords: 2500,
      notes: "Focus on small business implementations"
    },
    {
      id: 3,
      title: "Digital Nomad Lifestyle",
      category: "Lifestyle",
      priority: "low",
      estimatedWords: 2000,
      notes: "Personal experience and tips"
    }
  ];

  const clientFeedback = [
    {
      id: 1,
      client: "TechBlog Inc",
      project: "Web Development Guide",
      rating: 5,
      comment: "Excellent technical accuracy and clear explanations. Great work!",
      date: "2 days ago"
    },
    {
      id: 2,
      client: "AI Weekly",
      project: "AI in Healthcare Article",
      rating: 4,
      comment: "Well-researched content. Could use more real-world examples.",
      date: "1 week ago"
    }
  ];

  const getStatColor = (color) => {
    const colors = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      yellow: "from-yellow-500 to-yellow-600",
      purple: "from-purple-500 to-purple-600"
    };
    return colors[color] || colors.blue;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Review": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "Draft": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "Planning": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "published": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "pending-review": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "draft": return "bg-gray-500/10 text-gray-400 border-gray-500/20";
      default: return "bg-n-7 text-n-3 border-n-6";
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
      case "Technical Article": return Monitor;
      case "Marketing Content": return TrendingUp;
      case "Documentation": return BookOpen;
      case "Blog Series": return FileText;
      case "Opinion Piece": return Quote;
      case "How-to Guide": return List;
      case "Research Article": return BarChart3;
      case "Event Coverage": return Calendar;
      default: return PenTool;
    }
  };

  const filteredProjects = contentFilter === "all" 
    ? currentProjects 
    : currentProjects.filter(project => 
        contentFilter === "articles" ? project.type.includes("Article") :
        contentFilter === "marketing" ? project.type.includes("Marketing") :
        contentFilter === "documentation" ? project.type.includes("Documentation") :
        project.type.includes("Blog")
      );

  return (
    <DashboardLayout title="Writer Dashboard" userRole="writer" userRoles={userRoles}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-n-1">Writer Dashboard</h1>
            <p className="text-n-3 mt-1">Create compelling content and manage your writing projects</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-n-4" />
              <input
                type="text"
                placeholder="Search content..."
                className="bg-n-7 border border-n-6 rounded-lg pl-10 pr-4 py-2 text-n-1 text-sm w-64"
              />
            </div>
            <button className="bg-gradient-to-r from-color-1 to-color-2 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
              <Plus size={16} />
              New Article
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {writerStats.map((stat, index) => (
            <div key={index} className="bg-n-8 rounded-xl p-6 border border-n-6 hover:border-color-1/20 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${getStatColor(stat.color)} flex items-center justify-center shadow-lg`}>
                  <stat.icon size={20} className="text-white" />
                </div>
                <span className={`text-sm ${stat.changeType === 'positive' ? 'text-green-400' : 'text-n-4'}`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-n-1 mb-1">{stat.value}</h3>
              <p className="text-n-4 text-sm">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-n-7 p-1 rounded-lg w-fit">
          {["overview", "projects", "ideas", "analytics"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab 
                  ? "bg-gradient-to-r from-color-1 to-color-2 text-white" 
                  : "text-n-3 hover:text-n-1"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="lg:flex lg:gap-6">
          {/* Main Content */}
          <div className="lg:flex-1 space-y-6">
            {activeTab === "overview" && (
              <>
                <div className="bg-n-8 rounded-xl p-6 border border-n-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-n-1">Current Projects</h2>
                    <button className="text-color-1 text-sm hover:text-color-2">View All</button>
                  </div>
                  <div className="space-y-4">
                    {currentProjects.slice(0, 3).map((project) => {
                      const TypeIcon = getTypeIcon(project.type);
                      const progressPercentage = Math.round((project.wordCount / project.targetWords) * 100);
                      
                      return (
                        <div key={project.id} className="p-4 bg-n-7/50 rounded-xl border border-n-6/50 hover:border-color-1/20 transition-all">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-color-1 to-color-2 rounded-lg flex items-center justify-center">
                                <TypeIcon size={18} className="text-white" />
                              </div>
                              <div>
                                <h3 className="text-n-1 font-medium">{project.title}</h3>
                                <p className="text-n-4 text-sm">{project.client} • {project.type}</p>
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(project.status)}`}>
                              {project.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-4 mb-3">
                            <div>
                              <p className="text-n-4 text-xs">Word Count</p>
                              <p className="text-n-1 font-semibold">{project.wordCount.toLocaleString()}/{project.targetWords.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-n-4 text-xs">Progress</p>
                              <p className="text-n-1 font-semibold">{project.progress}%</p>
                            </div>
                            <div>
                              <p className="text-n-4 text-xs">Deadline</p>
                              <p className="text-n-1 font-semibold">{new Date(project.deadline).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="w-full bg-n-6 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-color-1 to-color-2 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-n-8 rounded-xl p-6 border border-n-6">
                  <h2 className="text-lg font-semibold text-n-1 mb-4">Recent Articles</h2>
                  <div className="space-y-3">
                    {recentArticles.slice(0, 4).map((article) => (
                      <div key={article.id} className="flex items-center gap-3 p-3 bg-n-7/50 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-color-1 to-color-2 flex items-center justify-center">
                          <FileText size={14} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-n-1 text-sm font-medium">{article.title}</p>
                          <p className="text-n-4 text-xs">{article.type} • {article.publishDate || "Draft"}</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-n-4">
                          {article.views > 0 && (
                            <div className="flex items-center gap-1">
                              <Eye size={12} />
                              <span>{article.views}</span>
                            </div>
                          )}
                          {article.likes > 0 && (
                            <div className="flex items-center gap-1">
                              <Star size={12} />
                              <span>{article.likes}</span>
                            </div>
                          )}
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(article.status)}`}>
                          {article.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === "projects" && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <select 
                    value={contentFilter} 
                    onChange={(e) => setContentFilter(e.target.value)}
                    className="bg-n-7 border border-n-6 rounded-lg px-4 py-2 text-n-1 text-sm"
                  >
                    <option value="all">All Projects</option>
                    <option value="articles">Articles</option>
                    <option value="marketing">Marketing</option>
                    <option value="documentation">Documentation</option>
                    <option value="blog">Blog Posts</option>
                  </select>
                  <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6">
                    <Filter size={16} className="text-n-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredProjects.map((project) => {
                    const TypeIcon = getTypeIcon(project.type);
                    const wordProgress = Math.round((project.wordCount / project.targetWords) * 100);
                    
                    return (
                      <div key={project.id} className="bg-n-8 rounded-xl p-6 border border-n-6 hover:border-color-1/20 transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-color-1 to-color-2 rounded-lg flex items-center justify-center">
                              <TypeIcon size={18} className="text-white" />
                            </div>
                            <div>
                              <h3 className="text-n-1 font-medium">{project.title}</h3>
                              <p className="text-n-4 text-xs">{project.type}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(project.priority)}`}>
                            {project.priority}
                          </span>
                        </div>
                        
                        <p className="text-n-3 text-sm mb-4">{project.client}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-n-4 text-xs">Word Count</p>
                            <p className="text-n-1 font-semibold">{project.wordCount.toLocaleString()}</p>
                            <p className="text-n-5 text-xs">of {project.targetWords.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-n-4 text-xs">Deadline</p>
                            <p className="text-n-1 font-semibold">{new Date(project.deadline).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-n-3 text-sm">Progress</span>
                            <span className="text-n-1 font-semibold">{project.progress}%</span>
                          </div>
                          <div className="w-full bg-n-6 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-color-1 to-color-2 h-2 rounded-full"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                          <div className="flex gap-2">
                            <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6">
                              <Edit3 size={14} className="text-n-3" />
                            </button>
                            <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6">
                              <Eye size={14} className="text-n-3" />
                            </button>
                            <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6">
                              <Share2 size={14} className="text-n-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "ideas" && (
              <div className="bg-n-8 rounded-xl p-6 border border-n-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-n-1">Content Ideas</h2>
                  <button className="bg-gradient-to-r from-color-1 to-color-2 text-white px-4 py-2 rounded-lg text-sm">
                    Add Idea
                  </button>
                </div>
                <div className="space-y-4">
                  {contentIdeas.map((idea) => (
                    <div key={idea.id} className="p-4 bg-n-7/50 rounded-lg border border-n-6/50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Lightbulb size={16} className="text-color-1" />
                          <div>
                            <h3 className="text-n-1 font-medium">{idea.title}</h3>
                            <p className="text-n-4 text-sm">{idea.category} • ~{idea.estimatedWords} words</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs ${getPriorityColor(idea.priority)}`}>
                          {idea.priority}
                        </span>
                      </div>
                      <p className="text-n-3 text-sm mb-3">{idea.notes}</p>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-color-1 text-white rounded text-xs">
                          Start Writing
                        </button>
                        <button className="px-3 py-1 bg-n-7 text-n-3 rounded text-xs">
                          Save for Later
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="space-y-6">
                <div className="bg-n-8 rounded-xl p-6 border border-n-6">
                  <h2 className="text-lg font-semibold text-n-1 mb-4">Writing Goals</h2>
                  <div className="space-y-4">
                    {writingGoals.map((goal) => {
                      const progress = Math.round((goal.current / goal.target) * 100);
                      
                      return (
                        <div key={goal.id} className="p-4 bg-n-7/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-n-1 font-medium">{goal.title}</h3>
                            <span className="text-n-3 text-sm">{goal.current}/{goal.target} {goal.unit}</span>
                          </div>
                          <div className="w-full bg-n-6 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full transition-all duration-300 ${
                                progress >= 100 ? 'bg-green-500' : 
                                progress >= 75 ? 'bg-blue-500' : 
                                progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            ></div>
                          </div>
                          <div className="flex items-center justify-between mt-2 text-xs text-n-4">
                            <span>{progress}% complete</span>
                            <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-n-8 rounded-xl p-6 border border-n-6">
                  <h2 className="text-lg font-semibold text-n-1 mb-4">Performance Metrics</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Total Views", value: "125K", icon: Eye },
                      { label: "Total Likes", value: "8.2K", icon: Star },
                      { label: "Comments", value: "1.3K", icon: MessageCircle },
                      { label: "Shares", value: "642", icon: Share2 }
                    ].map((metric, index) => (
                      <div key={index} className="p-4 bg-n-7/50 rounded-lg text-center">
                        <metric.icon size={24} className="text-color-1 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-n-1">{metric.value}</p>
                        <p className="text-n-4 text-sm">{metric.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Content */}
          <div className="lg:w-80 lg:flex-shrink-0 space-y-6 mt-6 lg:mt-0">
            {/* Writing Schedule */}
            <div className="bg-n-8 rounded-xl p-6 border border-n-6">
              <h2 className="text-lg font-semibold text-n-1 mb-4">Today's Schedule</h2>
              <div className="space-y-3">
                {[
                  { time: "09:00 AM", task: "Research AI trends", type: "research" },
                  { time: "11:00 AM", task: "Write marketing copy", type: "writing" },
                  { time: "02:00 PM", task: "Client feedback review", type: "review" },
                  { time: "04:00 PM", task: "Blog post editing", type: "editing" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-n-7/50 rounded-lg">
                    <div className="w-2 h-2 bg-color-1 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-n-1 text-sm font-medium">{item.task}</p>
                      <p className="text-n-4 text-xs">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Writing Tools */}
            <div className="bg-n-8 rounded-xl p-6 border border-n-6">
              <h2 className="text-lg font-semibold text-n-1 mb-4">Writing Tools</h2>
              <div className="space-y-2">
                {[
                  { title: "Grammar Check", icon: CheckCircle },
                  { title: "Plagiarism Scan", icon: Shield },
                  { title: "Word Counter", icon: Hash },
                  { title: "SEO Optimizer", icon: TrendingUp },
                  { title: "Citation Generator", icon: Quote },
                  { title: "Readability Score", icon: BarChart3 }
                ].map((tool, index) => (
                  <button key={index} className="w-full flex items-center gap-3 p-3 text-left rounded-lg bg-n-7/50 hover:bg-n-6/50 transition-colors">
                    <tool.icon size={16} className="text-color-1" />
                    <span className="text-n-1 text-sm">{tool.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Client Feedback */}
            <div className="bg-n-8 rounded-xl p-6 border border-n-6">
              <h2 className="text-lg font-semibold text-n-1 mb-4">Recent Feedback</h2>
              <div className="space-y-3">
                {clientFeedback.map((feedback) => (
                  <div key={feedback.id} className="p-3 bg-n-7/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-n-1 text-sm font-medium">{feedback.client}</h3>
                      <div className="flex items-center gap-1">
                        {[...Array(feedback.rating)].map((_, i) => (
                          <Star key={i} size={12} className="text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-n-3 text-xs mb-1">{feedback.comment}</p>
                    <span className="text-n-5 text-xs">{feedback.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Word Count Tracker */}
            <div className="bg-n-8 rounded-xl p-6 border border-n-6">
              <h2 className="text-lg font-semibold text-n-1 mb-4">Daily Word Count</h2>
              <div className="text-center">
                <div className="text-3xl font-bold text-color-1 mb-2">2,847</div>
                <p className="text-n-4 text-sm mb-4">words today</p>
                <div className="w-full bg-n-6 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-color-1 to-color-2 h-3 rounded-full"
                    style={{ width: "71%" }}
                  ></div>
                </div>
                <p className="text-n-5 text-xs mt-2">Goal: 4,000 words</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WriterDashboard;
