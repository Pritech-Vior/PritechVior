import React, { useState } from "react";
import { 
  Briefcase, 
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  MessageCircle,
  Calendar,
  Users,
  Star,
  Clock,
  Building2,
  GraduationCap,
  Code,
  Smartphone,
  Globe,
  Database,
  Download,
  FileText,
  CheckCircle,
  AlertCircle,
  DollarSign,
  BarChart3
} from "lucide-react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";

const ClientProjects = ({ userRoles = ["client"] }) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("deadline");

  const projects = [
    {
      id: 1,
      title: "E-Commerce Mobile App",
      type: "Enterprise",
      client: "TechCorp Ltd",
      status: "In Progress",
      progress: 75,
      budget: "$45,000",
      spent: "$33,750",
      deadline: "2025-03-15",
      startDate: "2024-11-01",
      team: ["John D.", "Sarah M.", "Mike R."],
      technology: "React Native",
      category: "mobile",
      priority: "high",
      description: "Cross-platform mobile application for e-commerce with advanced features including payment integration, real-time chat, and AI recommendations.",
      milestones: [
        { name: "UI/UX Design", status: "completed", date: "2024-11-15" },
        { name: "Backend API", status: "completed", date: "2024-12-20" },
        { name: "Frontend Development", status: "in-progress", date: "2025-02-15" },
        { name: "Testing & QA", status: "pending", date: "2025-03-01" },
        { name: "Deployment", status: "pending", date: "2025-03-15" }
      ]
    },
    {
      id: 2,
      title: "University Portal System",
      type: "Final Year Project",
      client: "Student: Alice Johnson",
      status: "Review",
      progress: 90,
      budget: "$8,500",
      spent: "$7,650",
      deadline: "2025-02-28",
      startDate: "2024-09-01",
      team: ["Alice J.", "Dr. Smith"],
      technology: "MERN Stack",
      category: "web",
      priority: "medium",
      description: "Comprehensive student management system for university operations including course management, grading, and student portal.",
      milestones: [
        { name: "Database Design", status: "completed", date: "2024-09-15" },
        { name: "Backend Development", status: "completed", date: "2024-11-30" },
        { name: "Frontend Development", status: "completed", date: "2025-01-15" },
        { name: "Testing & Documentation", status: "in-progress", date: "2025-02-20" },
        { name: "Final Presentation", status: "pending", date: "2025-02-28" }
      ]
    },
    {
      id: 3,
      title: "AI Analytics Dashboard",
      type: "Enterprise",
      client: "DataFlow Inc",
      status: "Planning",
      progress: 25,
      budget: "$75,000",
      spent: "$18,750",
      deadline: "2025-06-30",
      startDate: "2024-12-01",
      team: ["Emily K.", "David L.", "Tom W."],
      technology: "Python, React",
      category: "ai",
      priority: "high",
      description: "Advanced AI-powered analytics platform for business intelligence with machine learning capabilities and real-time data processing.",
      milestones: [
        { name: "Requirements Analysis", status: "completed", date: "2024-12-15" },
        { name: "Architecture Design", status: "in-progress", date: "2025-01-30" },
        { name: "ML Model Development", status: "pending", date: "2025-03-15" },
        { name: "Dashboard Development", status: "pending", date: "2025-05-15" },
        { name: "Integration & Testing", status: "pending", date: "2025-06-30" }
      ]
    },
    {
      id: 4,
      title: "Blockchain Voting App",
      type: "Final Year Project",
      client: "Student: Mark Davis",
      status: "Development",
      progress: 60,
      budget: "$12,000",
      spent: "$7,200",
      deadline: "2025-04-20",
      startDate: "2024-10-01",
      team: ["Mark D.", "Prof. Wilson"],
      technology: "Solidity, React",
      category: "blockchain",
      priority: "medium",
      description: "Secure blockchain-based voting system for democratic processes with smart contracts and decentralized architecture.",
      milestones: [
        { name: "Smart Contract Development", status: "completed", date: "2024-11-30" },
        { name: "Web3 Integration", status: "completed", date: "2024-12-31" },
        { name: "Frontend Development", status: "in-progress", date: "2025-03-15" },
        { name: "Security Audit", status: "pending", date: "2025-04-01" },
        { name: "Final Testing", status: "pending", date: "2025-04-20" }
      ]
    },
    {
      id: 5,
      title: "IoT Smart Home System",
      type: "Enterprise",
      client: "SmartTech Solutions",
      status: "Completed",
      progress: 100,
      budget: "$35,000",
      spent: "$34,200",
      deadline: "2024-12-15",
      startDate: "2024-08-01",
      team: ["Alex P.", "Lisa K.", "Ben R."],
      technology: "Node.js, IoT",
      category: "iot",
      priority: "low",
      description: "Complete IoT ecosystem for smart home automation with mobile app control and AI-powered energy optimization.",
      milestones: [
        { name: "Hardware Integration", status: "completed", date: "2024-09-15" },
        { name: "Backend API", status: "completed", date: "2024-10-30" },
        { name: "Mobile App", status: "completed", date: "2024-11-30" },
        { name: "Testing & Optimization", status: "completed", date: "2024-12-10" },
        { name: "Deployment", status: "completed", date: "2024-12-15" }
      ]
    },
    {
      id: 6,
      title: "Healthcare Management Platform",
      type: "Final Year Project",
      client: "Student: Sarah Lee",
      status: "Planning",
      progress: 15,
      budget: "$9,500",
      spent: "$1,425",
      deadline: "2025-05-30",
      startDate: "2025-01-01",
      team: ["Sarah L.", "Dr. Brown"],
      technology: "Django, Vue.js",
      category: "web",
      priority: "medium",
      description: "Comprehensive healthcare management system for clinics with patient records, appointment scheduling, and billing.",
      milestones: [
        { name: "Requirements Gathering", status: "in-progress", date: "2025-01-31" },
        { name: "Database Design", status: "pending", date: "2025-02-28" },
        { name: "Backend Development", status: "pending", date: "2025-04-15" },
        { name: "Frontend Development", status: "pending", date: "2025-05-15" },
        { name: "Testing & Documentation", status: "pending", date: "2025-05-30" }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Completed": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "Planning": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "Review": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
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

  const getCategoryIcon = (category) => {
    switch (category) {
      case "mobile": return Smartphone;
      case "web": return Globe;
      case "ai": return Database;
      case "blockchain": return Code;
      case "iot": return MessageCircle;
      default: return Briefcase;
    }
  };

  const getTypeIcon = (type) => {
    return type === "Enterprise" ? Building2 : GraduationCap;
  };

  const filteredProjects = projects.filter(project => {
    const matchesFilter = activeFilter === "all" || 
      (activeFilter === "enterprise" && project.type === "Enterprise") ||
      (activeFilter === "student" && project.type === "Final Year Project") ||
      (activeFilter === "active" && ["In Progress", "Development", "Planning"].includes(project.status)) ||
      (activeFilter === "completed" && project.status === "Completed");
    
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.technology.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case "deadline":
        return new Date(a.deadline) - new Date(b.deadline);
      case "progress":
        return b.progress - a.progress;
      case "budget":
        return parseFloat(b.budget.replace(/[$,]/g, "")) - parseFloat(a.budget.replace(/[$,]/g, ""));
      case "name":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return (
    <DashboardLayout title="Client Projects" userRole="client" userRoles={userRoles}>
      <div className="space-y-6 w-full max-w-none px-4 lg:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-n-1">Project Portfolio</h1>
            <p className="text-n-3 mt-1">Manage and track all your development projects</p>
          </div>
          <button className="bg-gradient-to-r from-color-1 to-color-2 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
            <Plus size={16} />
            New Project Request
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "All Projects" },
              { key: "active", label: "Active" },
              { key: "completed", label: "Completed" },
              { key: "enterprise", label: "Enterprise" },
              { key: "student", label: "Student Projects" }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  activeFilter === filter.key
                    ? "bg-gradient-to-r from-color-1 to-color-2 text-white"
                    : "bg-n-7 text-n-3 hover:text-n-1"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
          
          <div className="flex gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-n-4" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-n-7 border border-n-6 rounded-lg pl-10 pr-4 py-2 text-n-1 text-sm w-64"
              />
            </div>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-n-7 border border-n-6 rounded-lg px-4 py-2 text-n-1 text-sm"
            >
              <option value="deadline">Sort by Deadline</option>
              <option value="progress">Sort by Progress</option>
              <option value="budget">Sort by Budget</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-n-8 rounded-xl p-4 border border-n-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Briefcase size={18} className="text-white" />
              </div>
              <div>
                <p className="text-n-4 text-xs">Total Projects</p>
                <p className="text-n-1 font-semibold text-lg">{projects.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-n-8 rounded-xl p-4 border border-n-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Clock size={18} className="text-white" />
              </div>
              <div>
                <p className="text-n-4 text-xs">Active Projects</p>
                <p className="text-n-1 font-semibold text-lg">
                  {projects.filter(p => ["In Progress", "Development", "Planning"].includes(p.status)).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-n-8 rounded-xl p-4 border border-n-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <CheckCircle size={18} className="text-white" />
              </div>
              <div>
                <p className="text-n-4 text-xs">Completed</p>
                <p className="text-n-1 font-semibold text-lg">
                  {projects.filter(p => p.status === "Completed").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-n-8 rounded-xl p-4 border border-n-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <DollarSign size={18} className="text-white" />
              </div>
              <div>
                <p className="text-n-4 text-xs">Total Investment</p>
                <p className="text-n-1 font-semibold text-lg">
                  ${projects.reduce((sum, p) => sum + parseFloat(p.budget.replace(/[$,]/g, "")), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="lg:flex lg:gap-6">
          {/* Main Content */}
          <div className="lg:flex-1 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sortedProjects.map((project) => {
                const CategoryIcon = getCategoryIcon(project.category);
                const TypeIcon = getTypeIcon(project.type);
                
                return (
                  <div key={project.id} className="bg-n-8 rounded-xl p-6 border border-n-6 hover:border-color-1/20 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-color-1 to-color-2 rounded-lg flex items-center justify-center">
                          <CategoryIcon size={20} className="text-white" />
                        </div>
                        <div>
                          <h3 className="text-n-1 font-medium flex items-center gap-2">
                            {project.title}
                            <TypeIcon size={12} className="text-n-4" />
                          </h3>
                          <p className="text-n-4 text-xs">{project.technology}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(project.priority)}`}>
                        {project.priority}
                      </span>
                    </div>
                    
                    <p className="text-n-3 text-sm mb-4 line-clamp-2">{project.description}</p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                        <span className="text-n-1 font-semibold">{project.progress}%</span>
                      </div>
                      
                      <div className="w-full bg-n-6 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-color-1 to-color-2 h-2 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-n-4">Budget</p>
                        <p className="text-n-1 font-semibold">{project.budget}</p>
                      </div>
                      <div>
                        <p className="text-n-4">Deadline</p>
                        <p className="text-n-1 font-semibold">{new Date(project.deadline).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-n-4" />
                        <span className="text-n-3 text-sm">{project.team.length} members</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors">
                          <Eye size={14} className="text-n-3" />
                        </button>
                        <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors">
                          <MessageCircle size={14} className="text-n-3" />
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

            {sortedProjects.length === 0 && (
              <div className="bg-n-8 rounded-xl p-12 text-center border border-n-6">
                <Briefcase size={48} className="text-n-4 mx-auto mb-4" />
                <h3 className="text-n-1 font-medium mb-2">No projects found</h3>
                <p className="text-n-4 text-sm">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>

          {/* Sidebar Content */}
          <div className="lg:w-80 lg:flex-shrink-0 space-y-6 mt-6 lg:mt-0">
            {/* Project Statistics */}
            <div className="bg-n-8 rounded-xl p-6 border border-n-6">
              <h2 className="text-lg font-semibold text-n-1 mb-4">Project Overview</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-n-4">Total Budget</span>
                  <span className="text-n-1 font-semibold">
                    ${projects.reduce((sum, p) => sum + parseFloat(p.budget.replace(/[$,]/g, "")), 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-n-4">Total Spent</span>
                  <span className="text-n-1 font-semibold">
                    ${projects.reduce((sum, p) => sum + parseFloat(p.spent?.replace(/[$,]/g, "") || 0), 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-n-4">Average Progress</span>
                  <span className="text-n-1 font-semibold">
                    {Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Project Categories */}
            <div className="bg-n-8 rounded-xl p-6 border border-n-6">
              <h2 className="text-lg font-semibold text-n-1 mb-4">Project Categories</h2>
              <div className="space-y-3">
                {[
                  { name: "Web Development", count: projects.filter(p => p.category === "web").length, icon: Globe, color: "blue" },
                  { name: "Mobile Apps", count: projects.filter(p => p.category === "mobile").length, icon: Smartphone, color: "green" },
                  { name: "AI/ML Solutions", count: projects.filter(p => p.category === "ai").length, icon: Database, color: "purple" },
                  { name: "Blockchain", count: projects.filter(p => p.category === "blockchain").length, icon: Code, color: "yellow" },
                  { name: "IoT Systems", count: projects.filter(p => p.category === "iot").length, icon: MessageCircle, color: "red" }
                ].map((category, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-n-7/50 rounded-lg">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${
                      category.color === "blue" ? "from-blue-500 to-blue-600" :
                      category.color === "green" ? "from-green-500 to-green-600" :
                      category.color === "purple" ? "from-purple-500 to-purple-600" :
                      category.color === "yellow" ? "from-yellow-500 to-yellow-600" :
                      "from-red-500 to-red-600"
                    } flex items-center justify-center`}>
                      <category.icon size={14} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-n-1 text-sm font-medium">{category.name}</h3>
                      <p className="text-n-4 text-xs">{category.count} projects</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-n-8 rounded-xl p-6 border border-n-6">
              <h2 className="text-lg font-semibold text-n-1 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                {[
                  { title: "New Project", icon: Plus },
                  { title: "Export Report", icon: Download },
                  { title: "Team Meeting", icon: Calendar },
                  { title: "View Analytics", icon: BarChart3 }
                ].map((action, index) => (
                  <button key={index} className="w-full flex items-center gap-3 p-3 text-left rounded-lg bg-n-7/50 hover:bg-n-6/50 transition-colors">
                    <action.icon size={16} className="text-color-1" />
                    <span className="text-n-1 text-sm">{action.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientProjects;
