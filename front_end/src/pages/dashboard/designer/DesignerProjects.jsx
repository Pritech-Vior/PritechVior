import React, { useState } from "react";
import { 
  Palette,
  Image,
  Layout,
  FolderOpen,
  Download,
  Upload,
  Share2,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
  Clock,
  User,
  Tag,
  Eye,
  Heart,
  MessageCircle,
  Calendar,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";

const DesignerProjects = ({ userRoles = ["designer"] }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const projects = [
    {
      id: 1,
      title: "Hospital Management UI/UX",
      client: "HealthCare Solutions",
      type: "Web Application",
      status: "in-progress",
      progress: 75,
      startDate: "2025-01-05",
      deadline: "2025-02-15",
      budget: "$8,000",
      category: "Healthcare",
      description: "Complete UI/UX design for hospital management system including patient portal, staff dashboard, and admin interface.",
      assets: 24,
      revisions: 3,
      approvals: 8,
      team: ["Sarah Chen", "Mike Johnson"],
      tags: ["UI/UX", "Healthcare", "Dashboard", "Mobile"],
      priority: "high",
      thumbnail: "/api/placeholder/300/200",
      lastUpdate: "2025-01-10T14:30:00Z",
      milestones: [
        { name: "Wireframes", status: "completed", date: "2025-01-08" },
        { name: "Visual Design", status: "in-progress", date: "2025-01-15" },
        { name: "Prototyping", status: "pending", date: "2025-01-25" },
        { name: "Final Review", status: "pending", date: "2025-02-10" }
      ]
    },
    {
      id: 2,
      title: "E-Commerce Mobile App Design",
      client: "RetailTech Inc",
      type: "Mobile Application",
      status: "review",
      progress: 90,
      startDate: "2024-12-01",
      deadline: "2025-01-30",
      budget: "$12,000",
      category: "E-Commerce",
      description: "Modern mobile app design for fashion e-commerce platform with AR try-on features and social shopping integration.",
      assets: 45,
      revisions: 5,
      approvals: 12,
      team: ["Alex Rivera", "Emma Thompson", "David Lee"],
      tags: ["Mobile", "E-Commerce", "AR", "Social"],
      priority: "high",
      thumbnail: "/api/placeholder/300/200",
      lastUpdate: "2025-01-09T16:45:00Z",
      milestones: [
        { name: "User Research", status: "completed", date: "2024-12-05" },
        { name: "Design System", status: "completed", date: "2024-12-15" },
        { name: "App Screens", status: "completed", date: "2025-01-05" },
        { name: "Client Review", status: "in-progress", date: "2025-01-15" }
      ]
    },
    {
      id: 3,
      title: "Corporate Website Redesign",
      client: "TechCorp Solutions",
      type: "Website",
      status: "completed",
      progress: 100,
      startDate: "2024-11-15",
      deadline: "2024-12-30",
      budget: "$6,500",
      category: "Corporate",
      description: "Complete redesign of corporate website with modern aesthetics, improved UX, and mobile optimization.",
      assets: 32,
      revisions: 4,
      approvals: 15,
      team: ["Lisa Wang", "Tom Brown"],
      tags: ["Website", "Corporate", "Responsive", "SEO"],
      priority: "medium",
      thumbnail: "/api/placeholder/300/200",
      lastUpdate: "2024-12-28T10:20:00Z",
      milestones: [
        { name: "Discovery", status: "completed", date: "2024-11-20" },
        { name: "Design Concepts", status: "completed", date: "2024-12-01" },
        { name: "Development Handoff", status: "completed", date: "2024-12-15" },
        { name: "Launch", status: "completed", date: "2024-12-28" }
      ]
    },
    {
      id: 4,
      title: "Educational Platform Interface",
      client: "EduTech Innovations",
      type: "Web Application",
      status: "planning",
      progress: 15,
      startDate: "2025-01-08",
      deadline: "2025-03-15",
      budget: "$15,000",
      category: "Education",
      description: "Comprehensive design for online learning platform including student dashboard, course creation tools, and assessment interfaces.",
      assets: 8,
      revisions: 1,
      approvals: 2,
      team: ["Rachel Green", "James Wilson", "Maria Garcia"],
      tags: ["Education", "LMS", "Dashboard", "Gamification"],
      priority: "medium",
      thumbnail: "/api/placeholder/300/200",
      lastUpdate: "2025-01-10T09:15:00Z",
      milestones: [
        { name: "Requirements Analysis", status: "in-progress", date: "2025-01-12" },
        { name: "Information Architecture", status: "pending", date: "2025-01-25" },
        { name: "Visual Design", status: "pending", date: "2025-02-15" },
        { name: "Prototyping", status: "pending", date: "2025-03-01" }
      ]
    },
    {
      id: 5,
      title: "SaaS Dashboard Design",
      client: "CloudTech Systems",
      type: "Web Application",
      status: "on-hold",
      progress: 40,
      startDate: "2024-12-10",
      deadline: "2025-02-28",
      budget: "$9,500",
      category: "SaaS",
      description: "Analytics dashboard design for SaaS platform with data visualization, reporting tools, and user management interfaces.",
      assets: 18,
      revisions: 2,
      approvals: 5,
      team: ["Kevin Liu", "Sophie Turner"],
      tags: ["SaaS", "Analytics", "Dashboard", "Data Viz"],
      priority: "low",
      thumbnail: "/api/placeholder/300/200",
      lastUpdate: "2024-12-22T11:30:00Z",
      milestones: [
        { name: "Research & Analysis", status: "completed", date: "2024-12-15" },
        { name: "Wireframing", status: "completed", date: "2024-12-22" },
        { name: "Visual Design", status: "on-hold", date: "2025-01-15" },
        { name: "Prototype Testing", status: "pending", date: "2025-02-15" }
      ]
    },
    {
      id: 6,
      title: "Crypto Trading App UI",
      client: "FinTech Startups",
      type: "Mobile Application",
      status: "completed",
      progress: 100,
      startDate: "2024-10-01",
      deadline: "2024-11-30",
      budget: "$11,000",
      category: "FinTech",
      description: "Sleek and secure mobile interface for cryptocurrency trading app with real-time charts and portfolio management.",
      assets: 38,
      revisions: 6,
      approvals: 18,
      team: ["Daniel Kim", "Anna Petrov", "Carlos Rodriguez"],
      tags: ["FinTech", "Crypto", "Trading", "Mobile"],
      priority: "high",
      thumbnail: "/api/placeholder/300/200",
      lastUpdate: "2024-11-28T15:45:00Z",
      milestones: [
        { name: "Market Research", status: "completed", date: "2024-10-05" },
        { name: "User Journey Mapping", status: "completed", date: "2024-10-15" },
        { name: "Interface Design", status: "completed", date: "2024-11-10" },
        { name: "Final Delivery", status: "completed", date: "2024-11-28" }
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
      case "planning": return Layout;
      case "in-progress": return Clock;
      case "review": return Eye;
      case "completed": return CheckCircle;
      case "on-hold": return AlertCircle;
      default: return FolderOpen;
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

  const filteredProjects = projects.filter(project => {
    const matchesTab = activeTab === "all" || project.status === activeTab;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.lastUpdate) - new Date(a.lastUpdate);
      case "deadline":
        return new Date(a.deadline) - new Date(b.deadline);
      case "progress":
        return b.progress - a.progress;
      case "budget":
        return parseFloat(b.budget.replace(/[$,]/g, '')) - parseFloat(a.budget.replace(/[$,]/g, ''));
      case "name":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const statusCounts = {
    all: projects.length,
    planning: projects.filter(p => p.status === "planning").length,
    "in-progress": projects.filter(p => p.status === "in-progress").length,
    review: projects.filter(p => p.status === "review").length,
    completed: projects.filter(p => p.status === "completed").length,
    "on-hold": projects.filter(p => p.status === "on-hold").length
  };

  return (
    <DashboardLayout title="Design Projects" userRole="designer" userRoles={userRoles}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-n-1">Design Projects</h1>
            <p className="text-n-3 mt-1">Manage your design projects and creative workflows</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-n-7 text-n-3 px-4 py-2 rounded-lg hover:bg-n-6 flex items-center gap-2">
              <Upload size={16} />
              Import
            </button>
            <button className="bg-gradient-to-r from-color-1 to-color-2 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <Plus size={16} />
              New Project
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-n-8 rounded-xl p-4 border border-n-6">
            <div className="flex items-center justify-between mb-2">
              <Palette size={20} className="text-blue-400" />
              <span className="text-blue-400 text-sm">+12%</span>
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
              <Eye size={20} className="text-purple-400" />
              <span className="text-purple-400 text-sm">Pending</span>
            </div>
            <h3 className="text-xl font-bold text-n-1">{statusCounts.review}</h3>
            <p className="text-n-3 text-sm">In Review</p>
          </div>
          
          <div className="bg-n-8 rounded-xl p-4 border border-n-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle size={20} className="text-green-400" />
              <span className="text-green-400 text-sm">+5</span>
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
              <option value="budget">Budget</option>
              <option value="name">Name</option>
            </select>
            
            <div className="flex border border-n-6 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-color-1 text-white" : "bg-n-7 text-n-3"}`}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-color-1 text-white" : "bg-n-7 text-n-3"}`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Projects Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProjects.map((project) => {
              const StatusIcon = getStatusIcon(project.status);
              
              return (
                <div key={project.id} className="bg-n-8 rounded-xl border border-n-6 hover:border-color-1/20 transition-all overflow-hidden">
                  <div className="aspect-video bg-n-7 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-color-1/20 to-color-2/20 flex items-center justify-center">
                      <Image size={32} className="text-n-4" />
                    </div>
                    <div className="absolute top-3 right-3 flex gap-2">
                      <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(project.priority)}`}>
                        {project.priority}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-n-1 font-medium line-clamp-2">{project.title}</h3>
                      <div className="w-8 h-8 bg-gradient-to-r from-color-1 to-color-2 rounded-lg flex items-center justify-center ml-2">
                        <StatusIcon size={14} className="text-white" />
                      </div>
                    </div>
                    
                    <p className="text-n-4 text-sm mb-2">{project.client}</p>
                    <p className="text-n-3 text-xs mb-3 line-clamp-2">{project.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-n-4 mb-3">
                      <span>{project.type}</span>
                      <span>{project.category}</span>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-n-3 mb-1">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-n-6 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-color-1 to-color-2 h-2 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-xs text-n-3 mb-3">
                      <div className="text-center">
                        <p className="text-n-1 font-medium">{project.assets}</p>
                        <p>Assets</p>
                      </div>
                      <div className="text-center">
                        <p className="text-n-1 font-medium">{project.revisions}</p>
                        <p>Revisions</p>
                      </div>
                      <div className="text-center">
                        <p className="text-n-1 font-medium">{project.approvals}</p>
                        <p>Approvals</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <User size={12} className="text-n-4" />
                        <span className="text-n-3 text-xs">{project.team.length} members</span>
                      </div>
                      <div className="flex gap-1">
                        <button className="p-1.5 bg-n-7 rounded hover:bg-n-6">
                          <Eye size={12} className="text-n-3" />
                        </button>
                        <button className="p-1.5 bg-n-7 rounded hover:bg-n-6">
                          <Edit size={12} className="text-n-3" />
                        </button>
                        <button className="p-1.5 bg-n-7 rounded hover:bg-n-6">
                          <Share2 size={12} className="text-n-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedProjects.map((project) => {
              const StatusIcon = getStatusIcon(project.status);
              
              return (
                <div key={project.id} className="bg-n-8 rounded-xl border border-n-6 hover:border-color-1/20 transition-all p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-color-1 to-color-2 rounded-lg flex items-center justify-center">
                        <StatusIcon size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-n-1 font-medium">{project.title}</h3>
                        <p className="text-n-4 text-sm">{project.client} • {project.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(project.priority)}`}>
                        {project.priority}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-n-3 text-sm mb-4">{project.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-n-4">Budget</p>
                      <p className="text-n-1 font-semibold">{project.budget}</p>
                    </div>
                    <div>
                      <p className="text-n-4">Progress</p>
                      <p className="text-n-1 font-semibold">{project.progress}%</p>
                    </div>
                    <div>
                      <p className="text-n-4">Assets</p>
                      <p className="text-n-1 font-semibold">{project.assets}</p>
                    </div>
                    <div>
                      <p className="text-n-4">Team</p>
                      <p className="text-n-1 font-semibold">{project.team.length} members</p>
                    </div>
                    <div>
                      <p className="text-n-4">Deadline</p>
                      <p className="text-n-1 font-semibold">{new Date(project.deadline).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-32 bg-n-6 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-color-1 to-color-2 h-2 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {project.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-n-7 text-n-3 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="px-2 py-1 bg-n-7 text-n-3 rounded text-xs">
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>
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
              );
            })}
          </div>
        )}

        {sortedProjects.length === 0 && (
          <div className="bg-n-8 rounded-xl p-12 text-center border border-n-6">
            <Palette size={48} className="text-n-4 mx-auto mb-4" />
            <h3 className="text-n-1 font-medium mb-2">No projects found</h3>
            <p className="text-n-4 text-sm">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DesignerProjects;
