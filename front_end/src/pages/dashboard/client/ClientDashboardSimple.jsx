import React, { useState } from "react";
import { 
  Briefcase, 
  Clock, 
  DollarSign,
  Users,
  Star,
  Calendar,
  MessageCircle,
  FileText,
  CheckCircle,
  AlertCircle,
  Play,
  Download,
  Upload,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Building2,
  GraduationCap,
  Code,
  Smartphone,
  Globe,
  Database,
  Settings,
  Phone,
  Mail
} from "lucide-react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";

const ClientDashboard = ({ userRoles = ["client"] }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [projectFilter, setProjectFilter] = useState("all");

  const clientStats = [
    {
      title: "Active Projects",
      value: "8",
      change: "+2 this month",
      changeType: "positive",
      icon: Briefcase,
      color: "blue"
    },
    {
      title: "Completed Projects",
      value: "15",
      change: "93% success rate",
      changeType: "positive",
      icon: CheckCircle,
      color: "green"
    },
    {
      title: "Total Investment",
      value: "$125,450",
      change: "+$15,200 this quarter",
      changeType: "positive",
      icon: DollarSign,
      color: "yellow"
    },
    {
      title: "Team Members",
      value: "24",
      change: "Across all projects",
      changeType: "neutral",
      icon: Users,
      color: "purple"
    }
  ];

  const currentProjects = [
    {
      id: 1,
      title: "E-Commerce Mobile App",
      type: "Enterprise",
      client: "TechCorp Ltd",
      status: "In Progress",
      progress: 75,
      budget: "$45,000",
      deadline: "2025-03-15",
      team: ["John D.", "Sarah M.", "Mike R."],
      technology: "React Native",
      category: "mobile",
      priority: "high",
      description: "Cross-platform mobile application for e-commerce with advanced features"
    },
    {
      id: 2,
      title: "University Portal System",
      type: "Final Year Project",
      client: "Student: Alice Johnson",
      status: "Review",
      progress: 90,
      budget: "$8,500",
      deadline: "2025-02-28",
      team: ["Alice J.", "Dr. Smith"],
      technology: "MERN Stack",
      category: "web",
      priority: "medium",
      description: "Comprehensive student management system for university operations"
    },
    {
      id: 3,
      title: "AI Analytics Dashboard",
      type: "Enterprise",
      client: "DataFlow Inc",
      status: "Planning",
      progress: 25,
      budget: "$75,000",
      deadline: "2025-06-30",
      team: ["Emily K.", "David L.", "Tom W."],
      technology: "Python, React",
      category: "ai",
      priority: "high",
      description: "Advanced AI-powered analytics platform for business intelligence"
    },
    {
      id: 4,
      title: "Blockchain Voting App",
      type: "Final Year Project",
      client: "Student: Mark Davis",
      status: "Development",
      progress: 60,
      budget: "$12,000",
      deadline: "2025-04-20",
      team: ["Mark D.", "Prof. Wilson"],
      technology: "Solidity, React",
      category: "blockchain",
      priority: "medium",
      description: "Secure blockchain-based voting system for democratic processes"
    }
  ];

  const recentActivities = [
    { id: 1, action: "Project milestone completed", project: "E-Commerce Mobile App", time: "2 hours ago", type: "milestone" },
    { id: 2, action: "Client feedback received", project: "University Portal", time: "5 hours ago", type: "feedback" },
    { id: 3, action: "Team meeting scheduled", project: "AI Analytics Dashboard", time: "1 day ago", type: "meeting" },
    { id: 4, action: "Payment received", project: "Blockchain Voting App", time: "2 days ago", type: "payment" },
    { id: 5, action: "New project inquiry", project: "IoT Smart Home", time: "3 days ago", type: "inquiry" }
  ];

  const upcomingDeadlines = [
    { id: 1, project: "University Portal System", deadline: "2025-02-28", daysLeft: 23, priority: "high" },
    { id: 2, project: "E-Commerce Mobile App", deadline: "2025-03-15", daysLeft: 38, priority: "medium" },
    { id: 3, project: "Blockchain Voting App", deadline: "2025-04-20", daysLeft: 74, priority: "medium" },
    { id: 4, project: "AI Analytics Dashboard", deadline: "2025-06-30", daysLeft: 145, priority: "low" }
  ];

  const projectRequests = [
    {
      id: 1,
      title: "Hospital Management System",
      type: "Final Year Project",
      client: "Student: Lisa Chen",
      budget: "$10,000",
      deadline: "2025-05-15",
      technology: "Laravel, Vue.js",
      status: "pending",
      submitted: "2 days ago"
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
      submitted: "1 week ago"
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
      default: return Briefcase;
    }
  };

  const getTypeIcon = (type) => {
    return type === "Enterprise" ? Building2 : GraduationCap;
  };

  const filteredProjects = projectFilter === "all" 
    ? currentProjects 
    : currentProjects.filter(project => 
        projectFilter === "enterprise" 
          ? project.type === "Enterprise" 
          : project.type === "Final Year Project"
      );

  return (
    <DashboardLayout title="Client Dashboard" userRole="client" userRoles={userRoles}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-n-1">Client Dashboard</h1>
            <p className="text-n-3 mt-1">Manage your custom projects and track development progress</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-n-4" />
              <input
                type="text"
                placeholder="Search projects..."
                className="bg-n-7 border border-n-6 rounded-lg pl-10 pr-4 py-2 text-n-1 text-sm w-64"
              />
            </div>
            <button className="bg-gradient-to-r from-color-1 to-color-2 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
              <Plus size={16} />
              New Project
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {clientStats.map((stat, index) => (
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
          {["overview", "projects", "requests", "reports"].map((tab) => (
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
                      const CategoryIcon = getCategoryIcon(project.category);
                      const TypeIcon = getTypeIcon(project.type);
                      
                      return (
                        <div key={project.id} className="p-4 bg-n-7/50 rounded-xl border border-n-6/50 hover:border-color-1/20 transition-all">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-color-1 to-color-2 rounded-lg flex items-center justify-center shadow-lg">
                              <CategoryIcon size={20} className="text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="text-n-1 font-medium flex items-center gap-2">
                                    {project.title}
                                    <TypeIcon size={14} className="text-n-4" />
                                  </h3>
                                  <p className="text-n-4 text-sm">{project.client}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(project.status)}`}>
                                  {project.status}
                                </span>
                              </div>
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-4 text-sm text-n-4">
                                  <span>Budget: {project.budget}</span>
                                  <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
                                </div>
                                <span className="text-n-1 font-semibold">{project.progress}%</span>
                              </div>
                              <div className="w-full bg-n-6 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-color-1 to-color-2 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${project.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-n-8 rounded-xl p-6 border border-n-6">
                  <h2 className="text-lg font-semibold text-n-1 mb-4">Recent Activity</h2>
                  <div className="space-y-3">
                    {recentActivities.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 p-3 bg-n-7/50 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-color-1 to-color-2 flex items-center justify-center">
                          <CheckCircle size={14} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-n-1 text-sm">{activity.action}</p>
                          <p className="text-n-4 text-xs">{activity.project} • {activity.time}</p>
                        </div>
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
                    value={projectFilter} 
                    onChange={(e) => setProjectFilter(e.target.value)}
                    className="bg-n-7 border border-n-6 rounded-lg px-4 py-2 text-n-1 text-sm"
                  >
                    <option value="all">All Projects</option>
                    <option value="enterprise">Enterprise Projects</option>
                    <option value="student">Student Projects</option>
                  </select>
                  <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6">
                    <Filter size={16} className="text-n-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredProjects.map((project) => {
                    const CategoryIcon = getCategoryIcon(project.category);
                    const TypeIcon = getTypeIcon(project.type);
                    
                    return (
                      <div key={project.id} className="bg-n-8 rounded-xl p-6 border border-n-6 hover:border-color-1/20 transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-color-1 to-color-2 rounded-lg flex items-center justify-center">
                              <CategoryIcon size={18} className="text-white" />
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
                        
                        <p className="text-n-3 text-sm mb-4">{project.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-n-4 text-xs">Budget</p>
                            <p className="text-n-1 font-semibold">{project.budget}</p>
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
                          <div className="flex items-center gap-2">
                            <Users size={14} className="text-n-4" />
                            <span className="text-n-3 text-sm">{project.team.length} members</span>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6">
                              <Eye size={14} className="text-n-3" />
                            </button>
                            <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6">
                              <MessageCircle size={14} className="text-n-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "requests" && (
              <div className="bg-n-8 rounded-xl p-6 border border-n-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-n-1">Project Requests</h2>
                  <button className="bg-gradient-to-r from-color-1 to-color-2 text-white px-4 py-2 rounded-lg text-sm">
                    Submit New Request
                  </button>
                </div>
                <div className="space-y-4">
                  {projectRequests.map((request) => (
                    <div key={request.id} className="p-4 bg-n-7/50 rounded-lg border border-n-6/50">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-n-1 font-medium flex items-center gap-2">
                            {request.title}
                            {React.createElement(getTypeIcon(request.type), { size: 14, className: "text-n-4" })}
                          </h3>
                          <p className="text-n-4 text-sm">{request.client}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          request.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-blue-500/10 text-blue-400'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
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
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "reports" && (
              <div className="bg-n-8 rounded-xl p-6 border border-n-6">
                <h2 className="text-lg font-semibold text-n-1 mb-4">Project Reports</h2>
                <div className="h-64 bg-n-7/50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <FileText size={48} className="text-n-4 mx-auto mb-2" />
                    <p className="text-n-4">Reports & Analytics</p>
                    <p className="text-n-5 text-sm">Detailed project performance metrics</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Content */}
          <div className="lg:w-80 lg:flex-shrink-0 space-y-6 mt-6 lg:mt-0">
            {/* Upcoming Deadlines */}
            <div className="bg-n-8 rounded-xl p-6 border border-n-6">
              <h2 className="text-lg font-semibold text-n-1 mb-4">Upcoming Deadlines</h2>
              <div className="space-y-3">
                {upcomingDeadlines.map((deadline) => (
                  <div key={deadline.id} className="p-3 bg-n-7/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-n-1 text-sm font-medium truncate">{deadline.project}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(deadline.priority)}`}>
                        {deadline.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-n-4 text-xs">{deadline.daysLeft} days left</span>
                      <span className="text-n-5 text-xs">{deadline.deadline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Categories */}
            <div className="bg-n-8 rounded-xl p-6 border border-n-6">
              <h2 className="text-lg font-semibold text-n-1 mb-4">Project Categories</h2>
              <div className="space-y-3">
                {[
                  { name: "Web Development", count: 8, icon: Globe, color: "blue" },
                  { name: "Mobile Apps", count: 5, icon: Smartphone, color: "green" },
                  { name: "AI/ML Solutions", count: 3, icon: Database, color: "purple" },
                  { name: "Blockchain", count: 2, icon: Code, color: "yellow" }
                ].map((category, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-n-7/50 rounded-lg">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${getStatColor(category.color)} flex items-center justify-center`}>
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
                  { title: "Request Quote", icon: DollarSign },
                  { title: "Schedule Meeting", icon: Calendar },
                  { title: "Contact Support", icon: Phone },
                  { title: "Download Files", icon: Download }
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

export default ClientDashboard;
