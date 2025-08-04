import React, { useState } from "react";
import { 
  Users, 
  ChevronRight,
  Monitor,
  PenTool,
  Wrench,
  Briefcase,
  Star,
  BarChart3,
  Calendar,
  MessageCircle,
  FileText,
  Settings,
  ArrowRight,
  Activity,
  Target,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { Link } from "react-router-dom";

const MultiRoleDashboard = ({ userRoles = ["client", "designer", "technician", "writer"] }) => {
  const [selectedRole, setSelectedRole] = useState(userRoles[0]);

  // Role configurations - Staff-focused data
  const roleConfigs = {
    client: {
      title: "Client Relations Manager",
      color: "from-blue-500 to-blue-600",
      icon: Briefcase,
      description: "Oversee client projects and manage customer relationships",
      stats: { clients: 24, projects: 18, revenue: "$287.5K", satisfaction: "97%" },
      quickActions: [
        { title: "Client Portfolio", path: "/client/portfolio", icon: FileText },
        { title: "Project Pipeline", path: "/client/pipeline", icon: BarChart3 },
        { title: "Client Meetings", path: "/client/meetings", icon: Calendar },
        { title: "Revenue Reports", path: "/client/revenue", icon: TrendingUp }
      ]
    },
    designer: {
      title: "Creative Design Lead",
      color: "from-purple-500 to-purple-600",
      icon: PenTool,
      description: "Lead design initiatives and manage creative workflows",
      stats: { projects: 14, assets: 342, teams: 6, efficiency: "94%" },
      quickActions: [
        { title: "Design Pipeline", path: "/designer/pipeline", icon: Monitor },
        { title: "Team Assets", path: "/designer/assets", icon: FileText },
        { title: "Quality Reviews", path: "/designer/reviews", icon: Star },
        { title: "Creative Analytics", path: "/designer/analytics", icon: BarChart3 }
      ]
    },
    technician: {
      title: "Technical Operations Manager",
      color: "from-green-500 to-green-600",
      icon: Wrench,
      description: "Oversee system operations and technical infrastructure",
      stats: { systems: 127, uptime: "99.7%", incidents: 3, efficiency: "96%" },
      quickActions: [
        { title: "System Overview", path: "/technician/overview", icon: Monitor },
        { title: "Incident Management", path: "/technician/incidents", icon: AlertCircle },
        { title: "Team Operations", path: "/technician/operations", icon: Settings },
        { title: "Performance Metrics", path: "/technician/metrics", icon: Activity }
      ]
    },
    writer: {
      title: "Content Strategy Manager",
      color: "from-yellow-500 to-yellow-600",
      icon: PenTool,
      description: "Manage content creation and publication workflows",
      stats: { publications: 89, writers: 12, quality: "4.9★", reach: "156K" },
      quickActions: [
        { title: "Content Pipeline", path: "/writer/pipeline", icon: FileText },
        { title: "Editorial Calendar", path: "/writer/calendar", icon: Calendar },
        { title: "Publication Metrics", path: "/writer/metrics", icon: BarChart3 },
        { title: "Team Coordination", path: "/writer/team", icon: Users }
      ]
    }
  };

  // Combined staff activities from all roles
  const recentActivities = [
    { id: 1, role: "client", action: "Client portfolio review completed", time: "2 hours ago", type: "management" },
    { id: 2, role: "designer", action: "Design team sprint planning", time: "3 hours ago", type: "planning" },
    { id: 3, role: "technician", action: "Infrastructure upgrade deployment", time: "5 hours ago", type: "deployment" },
    { id: 4, role: "writer", action: "Content strategy meeting with team", time: "1 day ago", type: "strategy" },
    { id: 5, role: "client", action: "Revenue target exceeded this quarter", time: "1 day ago", type: "milestone" },
    { id: 6, role: "designer", action: "Creative workflow optimization", time: "2 days ago", type: "optimization" },
    { id: 7, role: "technician", action: "Security protocol implementation", time: "2 days ago", type: "security" },
    { id: 8, role: "writer", action: "Editorial guidelines updated", time: "3 days ago", type: "guidelines" }
  ];

  // Upcoming staff responsibilities across all roles
  const upcomingDeadlines = [
    { id: 1, role: "client", task: "Quarterly Client Review", deadline: "2025-01-10", priority: "high" },
    { id: 2, role: "designer", task: "Design Team Performance Review", deadline: "2025-01-12", priority: "medium" },
    { id: 3, role: "technician", task: "System Maintenance Window", deadline: "2025-01-15", priority: "high" },
    { id: 4, role: "writer", task: "Content Strategy Presentation", deadline: "2025-01-18", priority: "medium" },
    { id: 5, role: "client", task: "New Client Onboarding", deadline: "2025-01-20", priority: "low" }
  ];

  const getRoleIcon = (role) => {
    return roleConfigs[role]?.icon || Users;
  };

  const getRoleColor = (role) => {
    return roleConfigs[role]?.color || "from-gray-500 to-gray-600";
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "management": return Users;
      case "planning": return Calendar;
      case "deployment": return Wrench;
      case "strategy": return Target;
      case "milestone": return CheckCircle;
      case "optimization": return TrendingUp;
      case "security": return AlertCircle;
      case "guidelines": return FileText;
      default: return Activity;
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

  return (
    <DashboardLayout title="Multi-Role Dashboard" userRole={selectedRole}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-n-1">Multi-Role Dashboard</h1>
            <p className="text-n-3 mt-1">Managing {userRoles.length} professional roles across the platform</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-n-4 text-sm">Active Roles:</span>
            <div className="flex gap-2">
              {userRoles.map((role) => {
                const RoleIcon = getRoleIcon(role);
                return (
                  <div key={role} className={`w-8 h-8 rounded-lg bg-gradient-to-r ${getRoleColor(role)} flex items-center justify-center`}>
                    <RoleIcon size={16} className="text-white" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Role Selector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {userRoles.map((role) => {
            const config = roleConfigs[role];
            const RoleIcon = config.icon;
            const isSelected = selectedRole === role;
            
            return (
              <div 
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`p-6 rounded-xl border cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-n-8 border-color-1/50 shadow-lg' 
                    : 'bg-n-8/50 border-n-6 hover:border-color-1/30'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${config.color} flex items-center justify-center shadow-lg`}>
                    <RoleIcon size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-n-1 font-semibold">{config.title}</h3>
                    <p className="text-n-4 text-xs">{role.toUpperCase()}</p>
                  </div>
                </div>
                <p className="text-n-3 text-sm mb-4">{config.description}</p>
                <Link 
                  to={`/${role}`}
                  className="inline-flex items-center gap-2 text-color-1 text-sm hover:text-color-2 transition-colors"
                >
                  Open Dashboard
                  <ArrowRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Selected Role Overview */}
        {selectedRole && (
          <div className="bg-n-8 rounded-xl p-6 border border-n-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${getRoleColor(selectedRole)} flex items-center justify-center`}>
                  {React.createElement(getRoleIcon(selectedRole), { size: 18, className: "text-white" })}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-n-1">{roleConfigs[selectedRole].title} Overview</h2>
                  <p className="text-n-4 text-sm">{roleConfigs[selectedRole].description}</p>
                </div>
              </div>
              <Link 
                to={`/${selectedRole}`}
                className="bg-gradient-to-r from-color-1 to-color-2 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
              >
                View Full Dashboard
                <ChevronRight size={16} />
              </Link>
            </div>

            {/* Role Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {Object.entries(roleConfigs[selectedRole].stats).map(([key, value]) => (
                <div key={key} className="p-4 bg-n-7/50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-n-1">{value}</p>
                  <p className="text-n-4 text-sm capitalize">{key}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {roleConfigs[selectedRole].quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.path}
                  className="flex items-center gap-3 p-3 bg-n-7/50 rounded-lg hover:bg-n-6/50 transition-colors"
                >
                  <action.icon size={16} className="text-color-1" />
                  <span className="text-n-1 text-sm">{action.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="lg:flex lg:gap-6">
          {/* Recent Activities */}
          <div className="lg:flex-1 space-y-6">
            <div className="bg-n-8 rounded-xl p-6 border border-n-6">
              <h2 className="text-lg font-semibold text-n-1 mb-4">Recent Activities (All Roles)</h2>
              <div className="space-y-3">
                {recentActivities.slice(0, 8).map((activity) => {
                  const ActivityIcon = getActivityIcon(activity.type);
                  const RoleIcon = getRoleIcon(activity.role);
                  
                  return (
                    <div key={activity.id} className="flex items-center gap-3 p-3 bg-n-7/50 rounded-lg">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getRoleColor(activity.role)} flex items-center justify-center`}>
                        <ActivityIcon size={14} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-n-1 text-sm">{activity.action}</p>
                        <div className="flex items-center gap-2 text-xs text-n-4">
                          <RoleIcon size={12} />
                          <span className="capitalize">{activity.role}</span>
                          <span>•</span>
                          <span>{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 lg:flex-shrink-0 space-y-6 mt-6 lg:mt-0">
            {/* Role Navigation */}
            <div className="bg-n-8 rounded-xl p-6 border border-n-6">
              <h2 className="text-lg font-semibold text-n-1 mb-4">Quick Role Access</h2>
              <div className="space-y-2">
                {userRoles.map((role) => {
                  const config = roleConfigs[role];
                  const RoleIcon = config.icon;
                  
                  return (
                    <Link
                      key={role}
                      to={`/${role}`}
                      className="flex items-center gap-3 p-3 rounded-lg bg-n-7/50 hover:bg-n-6/50 transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${config.color} flex items-center justify-center`}>
                        <RoleIcon size={14} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-n-1 text-sm font-medium">{config.title}</p>
                        <p className="text-n-4 text-xs capitalize">{role} Dashboard</p>
                      </div>
                      <ChevronRight size={14} className="text-n-4" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-n-8 rounded-xl p-6 border border-n-6">
              <h2 className="text-lg font-semibold text-n-1 mb-4">Upcoming Deadlines</h2>
              <div className="space-y-3">
                {upcomingDeadlines.map((deadline) => {
                  const RoleIcon = getRoleIcon(deadline.role);
                  
                  return (
                    <div key={deadline.id} className="p-3 bg-n-7/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-n-1 text-sm font-medium">{deadline.task}</h3>
                        <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(deadline.priority)}`}>
                          {deadline.priority}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-n-4">
                          <RoleIcon size={12} />
                          <span className="capitalize">{deadline.role}</span>
                        </div>
                        <span className="text-n-5 text-xs">{deadline.deadline}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-n-8 rounded-xl p-6 border border-n-6">
              <h2 className="text-lg font-semibold text-n-1 mb-4">Performance Summary</h2>
              <div className="space-y-4">
                {userRoles.map((role) => {
                  const config = roleConfigs[role];
                  const RoleIcon = config.icon;
                  
                  return (
                    <div key={role} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${config.color} flex items-center justify-center`}>
                        <RoleIcon size={14} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-n-1 text-sm font-medium capitalize">{role}</h3>
                        <div className="w-full bg-n-6 rounded-full h-2 mt-1">
                          <div 
                            className={`bg-gradient-to-r ${config.color} h-2 rounded-full`}
                            style={{ width: `${Math.floor(Math.random() * 40 + 60)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MultiRoleDashboard;
