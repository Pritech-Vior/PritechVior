import React, { useState } from "react";
import { 
  Users,
  UserCheck,
  UserPlus,
  UserX,
  Crown,
  Shield,
  Settings,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Clock,
  Award,
  TrendingUp,
  Activity,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  MessageCircle,
  Star,
  CheckCircle,
  AlertCircle,
  Briefcase
} from "lucide-react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";

const MultiRoleTeamManagement = ({ userRoles = ["client", "designer", "technician"] }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const teamMembers = [
    {
      id: 1,
      name: "Sarah Chen",
      email: "sarah.chen@pritechvior.com",
      phone: "+1 (555) 123-4567",
      role: "designer",
      department: "Design Team",
      status: "active",
      location: "San Francisco, CA",
      joinDate: "2023-05-15",
      lastActive: "2025-01-10T18:30:00Z",
      projects: 8,
      completedProjects: 15,
      rating: 4.8,
      skills: ["UI/UX Design", "Figma", "Adobe Creative Suite", "Prototyping"],
      currentProjects: [
        { name: "Hospital Management UI", progress: 75, role: "Lead Designer" },
        { name: "E-Commerce Mobile App", progress: 90, role: "Senior Designer" }
      ],
      performance: {
        efficiency: 92,
        quality: 88,
        collaboration: 95,
        innovation: 87
      },
      avatar: "/api/placeholder/64/64"
    },
    {
      id: 2,
      name: "Mike Johnson",
      email: "mike.johnson@pritechvior.com",
      phone: "+1 (555) 234-5678",
      role: "technician",
      department: "Infrastructure Team",
      status: "active",
      location: "Austin, TX",
      joinDate: "2022-11-20",
      lastActive: "2025-01-10T19:15:00Z",
      projects: 12,
      completedProjects: 28,
      rating: 4.9,
      skills: ["System Administration", "AWS", "Docker", "Kubernetes", "Monitoring"],
      currentProjects: [
        { name: "Production Infrastructure", progress: 100, role: "DevOps Lead" },
        { name: "Security Audit", progress: 60, role: "Security Specialist" }
      ],
      performance: {
        efficiency: 96,
        quality: 94,
        collaboration: 91,
        innovation: 89
      },
      avatar: "/api/placeholder/64/64"
    },
    {
      id: 3,
      name: "Emma Thompson",
      email: "emma.thompson@pritechvior.com",
      phone: "+1 (555) 345-6789",
      role: "writer",
      department: "Content Team",
      status: "active",
      location: "New York, NY",
      joinDate: "2023-08-10",
      lastActive: "2025-01-10T17:45:00Z",
      projects: 6,
      completedProjects: 12,
      rating: 4.7,
      skills: ["Technical Writing", "Content Strategy", "SEO", "Documentation"],
      currentProjects: [
        { name: "Hospital System Documentation", progress: 65, role: "Technical Writer" },
        { name: "E-Commerce Blog Series", progress: 90, role: "Content Creator" }
      ],
      performance: {
        efficiency: 88,
        quality: 93,
        collaboration: 92,
        innovation: 85
      },
      avatar: "/api/placeholder/64/64"
    },
    {
      id: 4,
      name: "Alex Rivera",
      email: "alex.rivera@pritechvior.com",
      phone: "+1 (555) 456-7890",
      role: "designer",
      department: "Design Team",
      status: "active",
      location: "Los Angeles, CA",
      joinDate: "2023-02-28",
      lastActive: "2025-01-10T16:20:00Z",
      projects: 5,
      completedProjects: 9,
      rating: 4.6,
      skills: ["Mobile Design", "Interaction Design", "Animation", "User Research"],
      currentProjects: [
        { name: "E-Commerce Mobile App", progress: 90, role: "Mobile Designer" },
        { name: "Educational Platform Interface", progress: 25, role: "UX Researcher" }
      ],
      performance: {
        efficiency: 85,
        quality: 90,
        collaboration: 88,
        innovation: 93
      },
      avatar: "/api/placeholder/64/64"
    },
    {
      id: 5,
      name: "David Lee",
      email: "david.lee@pritechvior.com",
      phone: "+1 (555) 567-8901",
      role: "technician",
      department: "Infrastructure Team",
      status: "inactive",
      location: "Seattle, WA",
      joinDate: "2023-01-15",
      lastActive: "2025-01-08T14:30:00Z",
      projects: 3,
      completedProjects: 8,
      rating: 4.4,
      skills: ["Database Administration", "PostgreSQL", "Performance Tuning", "Backup Systems"],
      currentProjects: [
        { name: "Database Optimization", progress: 40, role: "Database Administrator" }
      ],
      performance: {
        efficiency: 82,
        quality: 86,
        collaboration: 84,
        innovation: 79
      },
      avatar: "/api/placeholder/64/64"
    },
    {
      id: 6,
      name: "Lisa Wang",
      email: "lisa.wang@pritechvior.com",
      phone: "+1 (555) 678-9012",
      role: "designer",
      department: "Design Team",
      status: "active",
      location: "Miami, FL",
      joinDate: "2022-09-05",
      lastActive: "2025-01-10T18:00:00Z",
      projects: 4,
      completedProjects: 22,
      rating: 4.9,
      skills: ["Brand Design", "Web Design", "Typography", "Print Design"],
      currentProjects: [
        { name: "Corporate Website Redesign", progress: 100, role: "Brand Designer" },
        { name: "Marketing Materials", progress: 80, role: "Graphic Designer" }
      ],
      performance: {
        efficiency: 94,
        quality: 96,
        collaboration: 93,
        innovation: 88
      },
      avatar: "/api/placeholder/64/64"
    }
  ];

  const departments = [
    {
      name: "Design Team",
      members: teamMembers.filter(m => m.role === "designer").length,
      activeProjects: 12,
      efficiency: 89,
      lead: "Sarah Chen"
    },
    {
      name: "Infrastructure Team", 
      members: teamMembers.filter(m => m.role === "technician").length,
      activeProjects: 8,
      efficiency: 93,
      lead: "Mike Johnson"
    },
    {
      name: "Content Team",
      members: teamMembers.filter(m => m.role === "writer").length,
      activeProjects: 6,
      efficiency: 88,
      lead: "Emma Thompson"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "inactive": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "busy": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      default: return "bg-n-7 text-n-3 border-n-6";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active": return UserCheck;
      case "inactive": return UserX;
      case "busy": return Clock;
      default: return Users;
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "designer": return Award;
      case "technician": return Settings;
      case "writer": return Edit;
      default: return Users;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "designer": return "text-purple-400 bg-purple-500/10";
      case "technician": return "text-blue-400 bg-blue-500/10";
      case "writer": return "text-green-400 bg-green-500/10";
      default: return "text-n-3 bg-n-7";
    }
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || member.role === filterRole;
    const matchesStatus = filterStatus === "all" || member.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const teamStats = {
    totalMembers: teamMembers.length,
    activeMembers: teamMembers.filter(m => m.status === "active").length,
    totalProjects: teamMembers.reduce((sum, m) => sum + m.projects, 0),
    avgRating: (teamMembers.reduce((sum, m) => sum + m.rating, 0) / teamMembers.length).toFixed(1),
    avgEfficiency: Math.round(teamMembers.reduce((sum, m) => sum + m.performance.efficiency, 0) / teamMembers.length)
  };

  return (
    <DashboardLayout title="Team Management" userRole="multi-role" userRoles={userRoles}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-n-1">Team Management</h1>
            <p className="text-n-3 mt-1">Manage staff members, roles, and team performance</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-n-7 text-n-3 px-4 py-2 rounded-lg hover:bg-n-6 flex items-center gap-2">
              <Settings size={16} />
              Team Settings
            </button>
            <button className="bg-gradient-to-r from-color-1 to-color-2 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <UserPlus size={16} />
              Add Member
            </button>
          </div>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-n-8 rounded-xl p-4 border border-n-6">
            <div className="flex items-center justify-between mb-2">
              <Users size={20} className="text-blue-400" />
              <span className="text-blue-400 text-sm">Total</span>
            </div>
            <h3 className="text-xl font-bold text-n-1">{teamStats.totalMembers}</h3>
            <p className="text-n-3 text-sm">Team Members</p>
          </div>
          
          <div className="bg-n-8 rounded-xl p-4 border border-n-6">
            <div className="flex items-center justify-between mb-2">
              <UserCheck size={20} className="text-green-400" />
              <span className="text-green-400 text-sm">Active</span>
            </div>
            <h3 className="text-xl font-bold text-n-1">{teamStats.activeMembers}</h3>
            <p className="text-n-3 text-sm">Active Members</p>
          </div>
          
          <div className="bg-n-8 rounded-xl p-4 border border-n-6">
            <div className="flex items-center justify-between mb-2">
              <Briefcase size={20} className="text-purple-400" />
              <span className="text-purple-400 text-sm">Active</span>
            </div>
            <h3 className="text-xl font-bold text-n-1">{teamStats.totalProjects}</h3>
            <p className="text-n-3 text-sm">Projects</p>
          </div>
          
          <div className="bg-n-8 rounded-xl p-4 border border-n-6">
            <div className="flex items-center justify-between mb-2">
              <Star size={20} className="text-yellow-400" />
              <span className="text-yellow-400 text-sm">Average</span>
            </div>
            <h3 className="text-xl font-bold text-n-1">{teamStats.avgRating}</h3>
            <p className="text-n-3 text-sm">Rating</p>
          </div>
          
          <div className="bg-n-8 rounded-xl p-4 border border-n-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp size={20} className="text-orange-400" />
              <span className="text-orange-400 text-sm">Team</span>
            </div>
            <h3 className="text-xl font-bold text-n-1">{teamStats.avgEfficiency}%</h3>
            <p className="text-n-3 text-sm">Efficiency</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-n-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 text-sm transition-colors ${
              activeTab === "overview"
                ? "text-color-1 border-b-2 border-color-1"
                : "text-n-3 hover:text-n-1"
            }`}
          >
            Team Overview
          </button>
          <button
            onClick={() => setActiveTab("departments")}
            className={`px-4 py-2 text-sm transition-colors ${
              activeTab === "departments"
                ? "text-color-1 border-b-2 border-color-1"
                : "text-n-3 hover:text-n-1"
            }`}
          >
            Departments
          </button>
          <button
            onClick={() => setActiveTab("performance")}
            className={`px-4 py-2 text-sm transition-colors ${
              activeTab === "performance"
                ? "text-color-1 border-b-2 border-color-1"
                : "text-n-3 hover:text-n-1"
            }`}
          >
            Performance Analytics
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "All Roles" },
              { key: "designer", label: "Designers" },
              { key: "technician", label: "Technicians" },
              { key: "writer", label: "Writers" }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setFilterRole(filter.key)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  filterRole === filter.key
                    ? "bg-gradient-to-r from-color-1 to-color-2 text-white"
                    : "bg-n-7 text-n-3 hover:text-n-1"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
          
          <div className="flex gap-3 items-center">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-n-7 border border-n-6 rounded-lg px-3 py-2 text-n-1 text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="busy">Busy</option>
            </select>
            
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-n-4" />
              <input
                type="text"
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-n-7 border border-n-6 rounded-lg pl-10 pr-4 py-2 text-n-1 text-sm w-64"
              />
            </div>
          </div>
        </div>

        {/* Team Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => {
              const StatusIcon = getStatusIcon(member.status);
              const RoleIcon = getRoleIcon(member.role);
              
              return (
                <div key={member.id} className="bg-n-8 rounded-xl border border-n-6 hover:border-color-1/20 transition-all p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-color-1 to-color-2 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-n-1 font-medium">{member.name}</h3>
                        <p className="text-n-4 text-sm">{member.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs ${getRoleColor(member.role)}`}>
                        <RoleIcon size={12} className="inline mr-1" />
                        {member.role}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(member.status)}`}>
                      <StatusIcon size={12} className="inline mr-1" />
                      {member.status}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-400 fill-current" />
                      <span className="text-n-1 text-sm font-medium">{member.rating}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-n-4">Active Projects</span>
                      <span className="text-n-1 font-medium">{member.projects}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-n-4">Completed</span>
                      <span className="text-n-1 font-medium">{member.completedProjects}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-n-4">Efficiency</span>
                      <span className="text-n-1 font-medium">{member.performance.efficiency}%</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-n-4 text-xs mb-2">Current Projects:</p>
                    <div className="space-y-1">
                      {member.currentProjects.slice(0, 2).map((project, index) => (
                        <div key={index} className="bg-n-7 rounded p-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-n-1 text-xs font-medium">{project.name}</span>
                            <span className="text-n-3 text-xs">{project.progress}%</span>
                          </div>
                          <div className="w-full bg-n-6 rounded-full h-1">
                            <div 
                              className="bg-gradient-to-r from-color-1 to-color-2 h-1 rounded-full"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-n-4 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin size={10} />
                      <span>{member.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={10} />
                      <span>Joined {new Date(member.joinDate).getFullYear()}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="flex-1 p-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors text-center">
                      <Eye size={14} className="text-n-3 mx-auto" />
                    </button>
                    <button className="flex-1 p-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors text-center">
                      <MessageCircle size={14} className="text-n-3 mx-auto" />
                    </button>
                    <button className="flex-1 p-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors text-center">
                      <Edit size={14} className="text-n-3 mx-auto" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Departments Tab */}
        {activeTab === "departments" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {departments.map((dept, index) => (
              <div key={index} className="bg-n-8 rounded-xl border border-n-6 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-n-1 font-medium">{dept.name}</h3>
                  <Crown size={16} className="text-yellow-400" />
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-n-4">Team Lead</span>
                    <span className="text-n-1 font-medium">{dept.lead}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-n-4">Members</span>
                    <span className="text-n-1 font-medium">{dept.members}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-n-4">Active Projects</span>
                    <span className="text-n-1 font-medium">{dept.activeProjects}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-n-4">Efficiency</span>
                    <span className="text-n-1 font-medium">{dept.efficiency}%</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-n-3 mb-1">
                    <span>Department Efficiency</span>
                    <span>{dept.efficiency}%</span>
                  </div>
                  <div className="w-full bg-n-6 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        dept.efficiency >= 90 ? "bg-green-500" :
                        dept.efficiency >= 80 ? "bg-yellow-500" : "bg-red-500"
                      }`}
                      style={{ width: `${dept.efficiency}%` }}
                    />
                  </div>
                </div>
                
                <button className="w-full bg-gradient-to-r from-color-1 to-color-2 text-white py-2 rounded-lg text-sm">
                  View Team Details
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Performance Analytics Tab */}
        {activeTab === "performance" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-n-8 rounded-xl border border-n-6 p-6">
              <h3 className="text-n-1 font-medium mb-4">Team Performance Metrics</h3>
              <div className="h-64 bg-n-7 rounded-lg flex items-center justify-center">
                <p className="text-n-4">Performance chart would be here</p>
              </div>
            </div>
            
            <div className="bg-n-8 rounded-xl border border-n-6 p-6">
              <h3 className="text-n-1 font-medium mb-4">Project Completion Trends</h3>
              <div className="h-64 bg-n-7 rounded-lg flex items-center justify-center">
                <p className="text-n-4">Completion trends chart would be here</p>
              </div>
            </div>
            
            <div className="bg-n-8 rounded-xl border border-n-6 p-6">
              <h3 className="text-n-1 font-medium mb-4">Skill Distribution</h3>
              <div className="h-64 bg-n-7 rounded-lg flex items-center justify-center">
                <p className="text-n-4">Skill distribution chart would be here</p>
              </div>
            </div>
            
            <div className="bg-n-8 rounded-xl border border-n-6 p-6">
              <h3 className="text-n-1 font-medium mb-4">Workload Distribution</h3>
              <div className="h-64 bg-n-7 rounded-lg flex items-center justify-center">
                <p className="text-n-4">Workload chart would be here</p>
              </div>
            </div>
          </div>
        )}

        {filteredMembers.length === 0 && activeTab === "overview" && (
          <div className="bg-n-8 rounded-xl p-12 text-center border border-n-6">
            <Users size={48} className="text-n-4 mx-auto mb-4" />
            <h3 className="text-n-1 font-medium mb-2">No team members found</h3>
            <p className="text-n-4 text-sm">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MultiRoleTeamManagement;
