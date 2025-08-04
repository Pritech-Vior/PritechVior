import React, { useState } from "react";
import { 
  FileText,
  Download,
  Eye,
  Share2,
  Filter,
  Search,
  Calendar,
  Clock,
  User,
  Folder,
  File,
  Image,
  Video,
  Archive,
  BarChart3,
  PieChart,
  TrendingUp,
  Activity
} from "lucide-react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";

const ClientReports = ({ userRoles = ["client"] }) => {
  const [activeTab, setActiveTab] = useState("documents");
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const documents = [
    {
      id: 1,
      name: "Project Requirements Document",
      type: "document",
      fileType: "PDF",
      size: "2.4 MB",
      project: "E-Commerce Mobile App",
      uploadDate: "2025-01-15",
      lastModified: "2025-01-20",
      status: "final",
      category: "requirements",
      downloadCount: 15,
      sharedWith: ["team@pritechvior.com", "client@techcorp.com"]
    },
    {
      id: 2,
      name: "UI/UX Design Mockups",
      type: "design",
      fileType: "Figma",
      size: "15.8 MB",
      project: "E-Commerce Mobile App",
      uploadDate: "2025-01-22",
      lastModified: "2025-02-01",
      status: "review",
      category: "design",
      downloadCount: 8,
      sharedWith: ["design@pritechvior.com", "client@techcorp.com"]
    },
    {
      id: 3,
      name: "Database Schema Documentation",
      type: "technical",
      fileType: "PDF",
      size: "1.2 MB",
      project: "University Portal System",
      uploadDate: "2025-01-28",
      lastModified: "2025-01-28",
      status: "draft",
      category: "technical",
      downloadCount: 3,
      sharedWith: ["dev@pritechvior.com"]
    },
    {
      id: 4,
      name: "API Documentation",
      type: "technical",
      fileType: "HTML",
      size: "0.8 MB",
      project: "AI Analytics Dashboard",
      uploadDate: "2025-02-02",
      lastModified: "2025-02-03",
      status: "final",
      category: "technical",
      downloadCount: 12,
      sharedWith: ["api@pritechvior.com", "client@dataflow.com"]
    },
    {
      id: 5,
      name: "Testing Report - Phase 1",
      type: "report",
      fileType: "PDF",
      size: "3.1 MB",
      project: "Blockchain Voting App",
      uploadDate: "2025-01-30",
      lastModified: "2025-01-30",
      status: "final",
      category: "testing",
      downloadCount: 7,
      sharedWith: ["qa@pritechvior.com", "student@university.edu"]
    },
    {
      id: 6,
      name: "Project Progress Video",
      type: "media",
      fileType: "MP4",
      size: "45.2 MB",
      project: "E-Commerce Mobile App",
      uploadDate: "2025-02-01",
      lastModified: "2025-02-01",
      status: "final",
      category: "demo",
      downloadCount: 22,
      sharedWith: ["all@pritechvior.com", "client@techcorp.com"]
    }
  ];

  const reports = [
    {
      id: 1,
      title: "Monthly Progress Report - January 2025",
      type: "progress",
      generatedDate: "2025-02-01",
      period: "January 2025",
      projects: ["E-Commerce Mobile App", "University Portal System"],
      metrics: {
        tasksCompleted: 45,
        milestonesAchieved: 3,
        budgetUtilized: "68%",
        timelineStatus: "on-track"
      }
    },
    {
      id: 2,
      title: "Budget Utilization Report - Q1 2025",
      type: "financial",
      generatedDate: "2025-01-31",
      period: "Q1 2025",
      projects: ["AI Analytics Dashboard", "Blockchain Voting App"],
      metrics: {
        totalBudget: "$87,000",
        utilized: "$52,200",
        remaining: "$34,800",
        efficiency: "92%"
      }
    },
    {
      id: 3,
      title: "Team Performance Analytics",
      type: "performance",
      generatedDate: "2025-01-28",
      period: "Last 30 days",
      projects: ["All Active Projects"],
      metrics: {
        productivity: "94%",
        qualityScore: "4.8/5",
        deliveryRate: "96%",
        clientSatisfaction: "4.9/5"
      }
    }
  ];

  const getFileIcon = (fileType) => {
    switch (fileType.toLowerCase()) {
      case "pdf": return FileText;
      case "figma": return Image;
      case "html": return File;
      case "mp4": return Video;
      default: return File;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "final": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "review": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "draft": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default: return "bg-n-7 text-n-3 border-n-6";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "requirements": return "bg-purple-500/10 text-purple-400";
      case "design": return "bg-pink-500/10 text-pink-400";
      case "technical": return "bg-blue-500/10 text-blue-400";
      case "testing": return "bg-orange-500/10 text-orange-400";
      case "demo": return "bg-green-500/10 text-green-400";
      default: return "bg-n-7 text-n-3";
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesType = filterType === "all" || doc.category === filterType;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.project.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <DashboardLayout title="Client Reports" userRole="client" userRoles={userRoles}>
      <div className="space-y-6 px-4 lg:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-n-1">Project Reports & Documents</h1>
            <p className="text-n-3 mt-1">Access project documentation, reports, and deliverables</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-n-7 text-n-1 px-4 py-2 rounded-lg flex items-center gap-2 text-sm border border-n-6 hover:bg-n-6">
              <Download size={16} />
              Bulk Download
            </button>
            <button className="bg-gradient-to-r from-color-1 to-color-2 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
              <Share2 size={16} />
              Share Folder
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-n-8 rounded-xl p-6 border border-n-6 hover:border-color-1/20 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <FileText size={20} className="text-white" />
              </div>
              <span className="text-sm text-green-400">+3 this week</span>
            </div>
            <h3 className="text-2xl font-bold text-n-1 mb-1">{documents.length}</h3>
            <p className="text-n-4 text-sm">Total Documents</p>
          </div>
          
          <div className="bg-n-8 rounded-xl p-6 border border-n-6 hover:border-color-1/20 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                <BarChart3 size={20} className="text-white" />
              </div>
              <span className="text-sm text-green-400">+1 this month</span>
            </div>
            <h3 className="text-2xl font-bold text-n-1 mb-1">{reports.length}</h3>
            <p className="text-n-4 text-sm">Generated Reports</p>
          </div>
          
          <div className="bg-n-8 rounded-xl p-6 border border-n-6 hover:border-color-1/20 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Download size={20} className="text-white" />
              </div>
              <span className="text-sm text-blue-400">67 this month</span>
            </div>
            <h3 className="text-2xl font-bold text-n-1 mb-1">142</h3>
            <p className="text-n-4 text-sm">Total Downloads</p>
          </div>
          
          <div className="bg-n-8 rounded-xl p-6 border border-n-6 hover:border-color-1/20 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg">
                <Archive size={20} className="text-white" />
              </div>
              <span className="text-sm text-n-4">65.2 MB total</span>
            </div>
            <h3 className="text-2xl font-bold text-n-1 mb-1">4</h3>
            <p className="text-n-4 text-sm">Active Projects</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-n-7 p-1 rounded-lg w-fit">
          {[
            { key: "documents", label: "Documents" },
            { key: "reports", label: "Reports" },
            { key: "analytics", label: "Analytics" }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key 
                  ? "bg-gradient-to-r from-color-1 to-color-2 text-white" 
                  : "text-n-3 hover:text-n-1"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "All Types" },
              { key: "requirements", label: "Requirements" },
              { key: "design", label: "Design" },
              { key: "technical", label: "Technical" },
              { key: "testing", label: "Testing" },
              { key: "demo", label: "Demo" }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setFilterType(filter.key)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  filterType === filter.key
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
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-n-7 border border-n-6 rounded-lg pl-10 pr-4 py-2 text-n-1 text-sm w-64"
            />
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "documents" && (
          <div className="bg-n-8 rounded-xl border border-n-6 overflow-hidden">
            <div className="p-6 border-b border-n-6">
              <h2 className="text-lg font-semibold text-n-1">Project Documents</h2>
              <p className="text-n-4 text-sm">All project-related documents and deliverables</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-n-7/50">
                  <tr>
                    <th className="text-left p-4 text-n-3 text-sm font-medium">Document</th>
                    <th className="text-left p-4 text-n-3 text-sm font-medium">Project</th>
                    <th className="text-left p-4 text-n-3 text-sm font-medium">Type</th>
                    <th className="text-left p-4 text-n-3 text-sm font-medium">Size</th>
                    <th className="text-left p-4 text-n-3 text-sm font-medium">Status</th>
                    <th className="text-left p-4 text-n-3 text-sm font-medium">Modified</th>
                    <th className="text-left p-4 text-n-3 text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((doc) => {
                    const FileIcon = getFileIcon(doc.fileType);
                    
                    return (
                      <tr key={doc.id} className="border-b border-n-6/50 hover:bg-n-7/30">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-n-7 rounded-lg flex items-center justify-center">
                              <FileIcon size={14} className="text-n-3" />
                            </div>
                            <div>
                              <p className="text-n-1 font-medium">{doc.name}</p>
                              <p className="text-n-4 text-xs">{doc.fileType} • {doc.downloadCount} downloads</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-n-1">{doc.project}</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(doc.category)}`}>
                            {doc.category}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-n-3 text-sm">{doc.size}</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(doc.status)}`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Clock size={12} className="text-n-4" />
                            <span className="text-n-3 text-sm">{new Date(doc.lastModified).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors">
                              <Eye size={14} className="text-n-3" />
                            </button>
                            <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors">
                              <Download size={14} className="text-n-3" />
                            </button>
                            <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors">
                              <Share2 size={14} className="text-n-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {reports.map((report) => (
              <div key={report.id} className="bg-n-8 rounded-xl p-6 border border-n-6 hover:border-color-1/20 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-color-1 to-color-2 rounded-lg flex items-center justify-center">
                      <BarChart3 size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-n-1 font-medium">{report.title}</h3>
                      <p className="text-n-4 text-xs">{report.period}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(report.type)}`}>
                    {report.type}
                  </span>
                </div>
                
                <div className="space-y-3 mb-4">
                  {Object.entries(report.metrics).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-n-4 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="text-n-1 font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-n-4">
                    <Calendar size={12} />
                    <span>{new Date(report.generatedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors">
                      <Eye size={14} className="text-n-3" />
                    </button>
                    <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors">
                      <Download size={14} className="text-n-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-n-8 rounded-xl p-6 border border-n-6">
              <div className="flex items-center gap-3 mb-4">
                <PieChart size={20} className="text-color-1" />
                <h3 className="text-lg font-semibold text-n-1">Document Categories</h3>
              </div>
              <div className="h-64 bg-n-7/50 rounded-lg flex items-center justify-center">
                <p className="text-n-4">Document category distribution chart</p>
              </div>
            </div>
            
            <div className="bg-n-8 rounded-xl p-6 border border-n-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp size={20} className="text-color-1" />
                <h3 className="text-lg font-semibold text-n-1">Download Trends</h3>
              </div>
              <div className="h-64 bg-n-7/50 rounded-lg flex items-center justify-center">
                <p className="text-n-4">Download activity trends chart</p>
              </div>
            </div>
            
            <div className="lg:col-span-2 bg-n-8 rounded-xl p-6 border border-n-6">
              <div className="flex items-center gap-3 mb-4">
                <Activity size={20} className="text-color-1" />
                <h3 className="text-lg font-semibold text-n-1">Document Activity Overview</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-n-7/50 rounded-lg">
                  <p className="text-n-4 text-sm">Most Downloaded</p>
                  <p className="text-lg font-bold text-n-1">Progress Video</p>
                  <p className="text-n-4 text-xs">22 downloads</p>
                </div>
                <div className="p-4 bg-n-7/50 rounded-lg">
                  <p className="text-n-4 text-sm">Latest Upload</p>
                  <p className="text-lg font-bold text-n-1">API Documentation</p>
                  <p className="text-n-4 text-xs">2 days ago</p>
                </div>
                <div className="p-4 bg-n-7/50 rounded-lg">
                  <p className="text-n-4 text-sm">Total Storage</p>
                  <p className="text-lg font-bold text-n-1">65.2 MB</p>
                  <p className="text-n-4 text-xs">6 files</p>
                </div>
                <div className="p-4 bg-n-7/50 rounded-lg">
                  <p className="text-n-4 text-sm">Shared Documents</p>
                  <p className="text-lg font-bold text-n-1">4</p>
                  <p className="text-n-4 text-xs">67% of total</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClientReports;
