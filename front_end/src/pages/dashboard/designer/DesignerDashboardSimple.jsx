import React, { useState } from "react";
import { 
  Palette, 
  Layers, 
  Image,
  PenTool,
  Paintbrush,
  Move,
  RotateCcw,
  Square,
  Circle,
  Triangle,
  Type,
  Pipette,
  Box,
  PaintBucket,
  Monitor,
  Smartphone,
  Tablet,
  Eye,
  Download,
  Upload,
  Share2,
  MessageCircle,
  Calendar,
  Clock,
  Star,
  Bookmark,
  Folder,
  Search,
  Filter,
  Plus,
  Edit,
  Copy,
  Trash2,
  Grid,
  List,
  ZoomIn,
  ZoomOut,
  Play,
  Users,
  Award,
  TrendingUp
} from "lucide-react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";

const DesignerDashboard = ({ userRoles = ["designer"] }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [projectFilter, setProjectFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  const designStats = [
    {
      title: "Active Projects",
      value: "14",
      change: "+3 this week",
      changeType: "positive",
      icon: Layers,
      color: "purple"
    },
    {
      title: "Completed Designs",
      value: "127",
      change: "+12 this month",
      changeType: "positive",
      icon: PenTool,
      color: "blue"
    },
    {
      title: "Client Reviews",
      value: "4.9",
      change: "95% satisfaction",
      changeType: "positive",
      icon: Star,
      color: "yellow"
    },
    {
      title: "Assets Created",
      value: "2,456",
      change: "+234 this week",
      changeType: "positive",
      icon: Image,
      color: "green"
    }
  ];

  const currentProjects = [
    {
      id: 1,
      title: "E-Commerce Website Redesign",
      client: "TechCorp Ltd",
      type: "Web Design",
      status: "In Progress",
      progress: 75,
      deadline: "2025-01-15",
      thumbnail: "/api/placeholder/300/200",
      tags: ["UI/UX", "Responsive", "E-commerce"],
      priority: "high",
      lastModified: "2 hours ago"
    },
    {
      id: 2,
      title: "Mobile App Interface",
      client: "StartupXYZ",
      type: "Mobile Design",
      status: "Review",
      progress: 90,
      deadline: "2025-01-10",
      thumbnail: "/api/placeholder/300/200",
      tags: ["Mobile", "iOS", "Android"],
      priority: "medium",
      lastModified: "5 hours ago"
    },
    {
      id: 3,
      title: "Brand Identity Package",
      client: "Creative Agency",
      type: "Branding",
      status: "Concept",
      progress: 30,
      deadline: "2025-01-25",
      thumbnail: "/api/placeholder/300/200",
      tags: ["Branding", "Logo", "Guidelines"],
      priority: "low",
      lastModified: "1 day ago"
    },
    {
      id: 4,
      title: "Dashboard UI Design",
      client: "DataFlow Inc",
      type: "UI Design",
      status: "Development",
      progress: 85,
      deadline: "2025-01-12",
      thumbnail: "/api/placeholder/300/200",
      tags: ["Dashboard", "Charts", "Analytics"],
      priority: "high",
      lastModified: "3 hours ago"
    }
  ];

  const recentDesigns = [
    { id: 1, name: "Login Screen Mockup", type: "UI Design", modified: "2 hours ago", status: "completed" },
    { id: 2, name: "Product Card Component", type: "Component", modified: "4 hours ago", status: "in-review" },
    { id: 3, name: "Color Palette v2", type: "Style Guide", modified: "6 hours ago", status: "approved" },
    { id: 4, name: "Hero Section Banner", type: "Web Design", modified: "1 day ago", status: "completed" },
    { id: 5, name: "Icon Set - Finance", type: "Icons", modified: "2 days ago", status: "delivered" }
  ];

  const designAssets = [
    {
      id: 1,
      name: "Brand Color Palette",
      type: "Colors",
      category: "branding",
      downloads: 45,
      likes: 12,
      thumbnail: "/api/placeholder/150/150"
    },
    {
      id: 2,
      name: "UI Components Library",
      type: "Components",
      category: "ui-kit",
      downloads: 128,
      likes: 34,
      thumbnail: "/api/placeholder/150/150"
    },
    {
      id: 3,
      name: "Icon Set - Technology",
      type: "Icons",
      category: "icons",
      downloads: 89,
      likes: 23,
      thumbnail: "/api/placeholder/150/150"
    },
    {
      id: 4,
      name: "Typography System",
      type: "Typography",
      category: "typography",
      downloads: 67,
      likes: 18,
      thumbnail: "/api/placeholder/150/150"
    }
  ];

  const designTools = [
    { name: "Figma", icon: Box, usage: 85, projects: 12 },
    { name: "Sketch", icon: PaintBucket, usage: 65, projects: 8 },
    { name: "Adobe XD", icon: PenTool, usage: 45, projects: 5 },
    { name: "Illustrator", icon: Paintbrush, usage: 78, projects: 15 }
  ];

  const clientFeedback = [
    {
      id: 1,
      client: "TechCorp Ltd",
      project: "E-Commerce Redesign",
      rating: 5,
      comment: "Outstanding work on the user interface! The design is modern and user-friendly.",
      date: "2 days ago"
    },
    {
      id: 2,
      client: "StartupXYZ",
      project: "Mobile App Interface",
      rating: 4,
      comment: "Great attention to detail. Minor revisions needed on the color scheme.",
      date: "1 week ago"
    }
  ];

  const getStatColor = (color) => {
    const colors = {
      purple: "from-purple-500 to-purple-600",
      blue: "from-blue-500 to-blue-600",
      yellow: "from-yellow-500 to-yellow-600",
      green: "from-green-500 to-green-600"
    };
    return colors[color] || colors.purple;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Completed": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "Review": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "Concept": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "Development": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
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
      case "Web Design": return Monitor;
      case "Mobile Design": return Smartphone;
      case "Branding": return Palette;
      case "UI Design": return Layers;
      default: return PenTool;
    }
  };

  const filteredProjects = projectFilter === "all" 
    ? currentProjects 
    : currentProjects.filter(project => 
        projectFilter === "web" ? project.type === "Web Design" :
        projectFilter === "mobile" ? project.type === "Mobile Design" :
        projectFilter === "branding" ? project.type === "Branding" :
        project.type === "UI Design"
      );

  return (
    <DashboardLayout title="Designer Dashboard" userRole="designer" userRoles={userRoles}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-n-1">Designer Dashboard</h1>
            <p className="text-n-3 mt-1">Create stunning designs and manage your creative projects</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-n-4" />
              <input
                type="text"
                placeholder="Search designs..."
                className="bg-n-7 border border-n-6 rounded-lg pl-10 pr-4 py-2 text-n-1 text-sm w-64"
              />
            </div>
            <button className="bg-gradient-to-r from-color-1 to-color-2 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
              <Plus size={16} />
              New Design
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {designStats.map((stat, index) => (
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
          {["overview", "projects", "assets", "reviews"].map((tab) => (
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentProjects.slice(0, 4).map((project) => {
                      const TypeIcon = getTypeIcon(project.type);
                      
                      return (
                        <div key={project.id} className="p-4 bg-n-7/50 rounded-xl border border-n-6/50 hover:border-color-1/20 transition-all">
                          <div className="aspect-video bg-n-6 rounded-lg mb-3 flex items-center justify-center">
                            <Image size={32} className="text-n-4" />
                          </div>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <TypeIcon size={14} className="text-color-1" />
                              <h3 className="text-n-1 font-medium text-sm">{project.title}</h3>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(project.priority)}`}>
                              {project.priority}
                            </span>
                          </div>
                          <p className="text-n-4 text-xs mb-3">{project.client}</p>
                          <div className="flex items-center justify-between mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(project.status)}`}>
                              {project.status}
                            </span>
                            <span className="text-n-1 font-semibold text-sm">{project.progress}%</span>
                          </div>
                          <div className="w-full bg-n-6 rounded-full h-2 mb-3">
                            <div 
                              className="bg-gradient-to-r from-color-1 to-color-2 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-n-4">
                            <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
                            <span>{project.lastModified}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-n-8 rounded-xl p-6 border border-n-6">
                  <h2 className="text-lg font-semibold text-n-1 mb-4">Recent Designs</h2>
                  <div className="space-y-3">
                    {recentDesigns.map((design) => (
                      <div key={design.id} className="flex items-center gap-3 p-3 bg-n-7/50 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-r from-color-1 to-color-2 rounded-lg flex items-center justify-center">
                          <PenTool size={16} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-n-1 text-sm font-medium">{design.name}</p>
                          <p className="text-n-4 text-xs">{design.type} • {design.modified}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          design.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                          design.status === 'approved' ? 'bg-blue-500/10 text-blue-400' :
                          'bg-yellow-500/10 text-yellow-400'
                        }`}>
                          {design.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === "projects" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <select 
                      value={projectFilter} 
                      onChange={(e) => setProjectFilter(e.target.value)}
                      className="bg-n-7 border border-n-6 rounded-lg px-4 py-2 text-n-1 text-sm"
                    >
                      <option value="all">All Projects</option>
                      <option value="web">Web Design</option>
                      <option value="mobile">Mobile Design</option>
                      <option value="branding">Branding</option>
                      <option value="ui">UI Design</option>
                    </select>
                    <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6">
                      <Filter size={16} className="text-n-3" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-color-1 text-white" : "bg-n-7 text-n-3"}`}
                    >
                      <Grid size={16} />
                    </button>
                    <button 
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg ${viewMode === "list" ? "bg-color-1 text-white" : "bg-n-7 text-n-3"}`}
                    >
                      <List size={16} />
                    </button>
                  </div>
                </div>

                <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                  {filteredProjects.map((project) => {
                    const TypeIcon = getTypeIcon(project.type);
                    
                    if (viewMode === "list") {
                      return (
                        <div key={project.id} className="bg-n-8 rounded-xl p-4 border border-n-6 hover:border-color-1/20 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-12 bg-n-6 rounded-lg flex items-center justify-center">
                              <Image size={20} className="text-n-4" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <TypeIcon size={14} className="text-color-1" />
                                <h3 className="text-n-1 font-medium">{project.title}</h3>
                              </div>
                              <p className="text-n-4 text-sm">{project.client} • {project.type}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(project.status)}`}>
                                {project.status}
                              </span>
                              <span className="text-n-1 font-semibold">{project.progress}%</span>
                              <div className="flex gap-2">
                                <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6">
                                  <Eye size={14} className="text-n-3" />
                                </button>
                                <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6">
                                  <Edit size={14} className="text-n-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={project.id} className="bg-n-8 rounded-xl p-6 border border-n-6 hover:border-color-1/20 transition-all">
                        <div className="aspect-video bg-n-6 rounded-lg mb-4 flex items-center justify-center">
                          <Image size={32} className="text-n-4" />
                        </div>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <TypeIcon size={16} className="text-color-1" />
                            <h3 className="text-n-1 font-medium">{project.title}</h3>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(project.priority)}`}>
                            {project.priority}
                          </span>
                        </div>
                        <p className="text-n-4 text-sm mb-3">{project.client}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {project.tags.map((tag, tagIndex) => (
                            <span key={tagIndex} className="px-2 py-1 bg-n-7 text-n-3 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                          <span className="text-n-1 font-semibold">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-n-6 rounded-full h-2 mb-4">
                          <div 
                            className="bg-gradient-to-r from-color-1 to-color-2 h-2 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-n-4 text-xs">Due: {new Date(project.deadline).toLocaleDateString()}</span>
                          <div className="flex gap-2">
                            <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6">
                              <Eye size={14} className="text-n-3" />
                            </button>
                            <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6">
                              <Edit size={14} className="text-n-3" />
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

            {activeTab === "assets" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-n-1">Design Assets</h2>
                  <button className="bg-gradient-to-r from-color-1 to-color-2 text-white px-4 py-2 rounded-lg text-sm">
                    Upload Asset
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {designAssets.map((asset) => (
                    <div key={asset.id} className="bg-n-8 rounded-xl p-4 border border-n-6 hover:border-color-1/20 transition-all">
                      <div className="aspect-square bg-n-6 rounded-lg mb-3 flex items-center justify-center">
                        <Palette size={24} className="text-n-4" />
                      </div>
                      <h3 className="text-n-1 font-medium text-sm mb-1">{asset.name}</h3>
                      <p className="text-n-4 text-xs mb-2">{asset.type}</p>
                      <div className="flex items-center justify-between text-xs text-n-4">
                        <div className="flex items-center gap-2">
                          <Download size={12} />
                          <span>{asset.downloads}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star size={12} />
                          <span>{asset.likes}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="bg-n-8 rounded-xl p-6 border border-n-6">
                <h2 className="text-lg font-semibold text-n-1 mb-6">Client Reviews</h2>
                <div className="space-y-4">
                  {clientFeedback.map((feedback) => (
                    <div key={feedback.id} className="p-4 bg-n-7/50 rounded-lg border border-n-6/50">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-n-1 font-medium">{feedback.client}</h3>
                          <p className="text-n-4 text-sm">{feedback.project}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(feedback.rating)].map((_, i) => (
                            <Star key={i} size={14} className="text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-n-3 text-sm mb-2">{feedback.comment}</p>
                      <span className="text-n-5 text-xs">{feedback.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Content */}
          <div className="lg:w-80 lg:flex-shrink-0 space-y-6 mt-6 lg:mt-0">
            {/* Design Tools Usage */}
            <div className="bg-n-8 rounded-xl p-6 border border-n-6">
              <h2 className="text-lg font-semibold text-n-1 mb-4">Design Tools</h2>
              <div className="space-y-4">
                {designTools.map((tool, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <tool.icon size={16} className="text-color-1" />
                        <span className="text-n-1 text-sm">{tool.name}</span>
                      </div>
                      <span className="text-n-3 text-sm">{tool.usage}%</span>
                    </div>
                    <div className="w-full bg-n-6 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-color-1 to-color-2 h-2 rounded-full"
                        style={{ width: `${tool.usage}%` }}
                      ></div>
                    </div>
                    <p className="text-n-4 text-xs">{tool.projects} active projects</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Color Palette */}
            <div className="bg-n-8 rounded-xl p-6 border border-n-6">
              <h2 className="text-lg font-semibold text-n-1 mb-4">Recent Colors</h2>
              <div className="grid grid-cols-5 gap-2">
                {[
                  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FECA57",
                  "#FF9FF3", "#54A0FF", "#5F27CD", "#00D2D3", "#FF9F43",
                  "#686DE0", "#4834D4", "#130F40", "#30336B", "#06FFA5"
                ].map((color, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg cursor-pointer hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  ></div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-n-8 rounded-xl p-6 border border-n-6">
              <h2 className="text-lg font-semibold text-n-1 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                {[
                  { title: "New Design", icon: Plus },
                  { title: "Browse Templates", icon: Grid },
                  { title: "Color Generator", icon: Palette },
                  { title: "Font Library", icon: Type },
                  { title: "Export Assets", icon: Download },
                  { title: "Share Portfolio", icon: Share2 }
                ].map((action, index) => (
                  <button key={index} className="w-full flex items-center gap-3 p-3 text-left rounded-lg bg-n-7/50 hover:bg-n-6/50 transition-colors">
                    <action.icon size={16} className="text-color-1" />
                    <span className="text-n-1 text-sm">{action.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Inspiration Board */}
            <div className="bg-n-8 rounded-xl p-6 border border-n-6">
              <h2 className="text-lg font-semibold text-n-1 mb-4">Inspiration</h2>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="aspect-square bg-n-6 rounded-lg flex items-center justify-center">
                    <Image size={20} className="text-n-4" />
                  </div>
                ))}
              </div>
              <button className="w-full mt-3 p-2 text-color-1 text-sm hover:bg-n-7 rounded-lg transition-colors">
                Browse More
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DesignerDashboard;
