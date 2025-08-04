import React, { useState } from "react";
import { 
  Wrench, 
  Monitor, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Cpu,
  HardDrive,
  Wifi,
  Battery,
  Thermometer,
  Activity,
  Bug,
  Zap,
  Shield,
  RefreshCw,
  Play,
  Pause,
  Square,
  Calendar,
  MessageCircle,
  FileText,
  Users,
  BarChart3,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  Eye,
  Edit
} from "lucide-react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";

const TechnicianDashboard = ({ userRoles = ["technician"] }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [systemFilter, setSystemFilter] = useState("all");

  const techStats = [
    {
      title: "Active Systems",
      value: "127",
      change: "+5 this week",
      changeType: "positive",
      icon: Monitor,
      color: "blue"
    },
    {
      title: "Critical Issues",
      value: "3",
      change: "-2 resolved today",
      changeType: "positive",
      icon: AlertTriangle,
      color: "red"
    },
    {
      title: "Maintenance Tasks",
      value: "12",
      change: "8 pending",
      changeType: "neutral",
      icon: Wrench,
      color: "yellow"
    },
    {
      title: "System Uptime",
      value: "99.7%",
      change: "+0.2% this month",
      changeType: "positive",
      icon: Activity,
      color: "green"
    }
  ];

  const systemAlerts = [
    {
      id: 1,
      system: "Production Server #3",
      type: "Critical",
      issue: "High CPU Usage",
      severity: "high",
      time: "5 minutes ago",
      status: "investigating"
    },
    {
      id: 2,
      system: "Database Cluster",
      type: "Warning",
      issue: "Memory Usage Above 85%",
      severity: "medium",
      time: "15 minutes ago",
      status: "monitoring"
    },
    {
      id: 3,
      system: "Backup System",
      type: "Info",
      issue: "Scheduled Maintenance",
      severity: "low",
      time: "1 hour ago",
      status: "scheduled"
    },
    {
      id: 4,
      system: "Network Infrastructure",
      type: "Warning",
      issue: "Latency Spike Detected",
      severity: "medium",
      time: "2 hours ago",
      status: "resolved"
    }
  ];

  const monitoredSystems = [
    {
      id: 1,
      name: "Production Web Server",
      type: "Web Server",
      status: "healthy",
      cpu: 45,
      memory: 62,
      disk: 78,
      uptime: "15 days",
      lastCheck: "2 min ago",
      location: "Data Center A"
    },
    {
      id: 2,
      name: "Database Primary",
      type: "Database",
      status: "warning",
      cpu: 78,
      memory: 89,
      disk: 45,
      uptime: "8 days",
      lastCheck: "1 min ago",
      location: "Data Center A"
    },
    {
      id: 3,
      name: "Load Balancer",
      type: "Network",
      status: "healthy",
      cpu: 23,
      memory: 34,
      disk: 12,
      uptime: "45 days",
      lastCheck: "30 sec ago",
      location: "Data Center B"
    },
    {
      id: 4,
      name: "Backup Server",
      type: "Storage",
      status: "maintenance",
      cpu: 15,
      memory: 25,
      disk: 95,
      uptime: "2 days",
      lastCheck: "5 min ago",
      location: "Data Center C"
    }
  ];

  const maintenanceTasks = [
    {
      id: 1,
      title: "Update Security Patches",
      system: "All Production Servers",
      priority: "high",
      dueDate: "2025-01-08",
      estimatedTime: "4 hours",
      status: "pending",
      assignee: "Current User"
    },
    {
      id: 2,
      title: "Database Index Optimization",
      system: "Database Cluster",
      priority: "medium",
      dueDate: "2025-01-10",
      estimatedTime: "2 hours",
      status: "in-progress",
      assignee: "John Tech"
    },
    {
      id: 3,
      title: "Network Cable Inspection",
      system: "Data Center A",
      priority: "low",
      dueDate: "2025-01-15",
      estimatedTime: "6 hours",
      status: "scheduled",
      assignee: "Sarah Network"
    }
  ];

  const recentActivities = [
    { id: 1, action: "Resolved critical alert", system: "Production Server #1", time: "30 minutes ago", type: "fix" },
    { id: 2, action: "Completed backup verification", system: "Backup System", time: "1 hour ago", type: "maintenance" },
    { id: 3, action: "Updated system monitoring", system: "Network Infrastructure", time: "2 hours ago", type: "update" },
    { id: 4, action: "Installed security patch", system: "Web Server Cluster", time: "3 hours ago", type: "security" },
    { id: 5, action: "Performance optimization", system: "Database Primary", time: "5 hours ago", type: "optimization" }
  ];

  const getStatColor = (color) => {
    const colors = {
      blue: "from-blue-500 to-blue-600",
      red: "from-red-500 to-red-600",
      yellow: "from-yellow-500 to-yellow-600",
      green: "from-green-500 to-green-600"
    };
    return colors[color] || colors.blue;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "healthy": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "warning": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "critical": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "maintenance": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default: return "bg-n-7 text-n-3 border-n-6";
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high": return "text-red-400 bg-red-500/10";
      case "medium": return "text-yellow-400 bg-yellow-500/10";
      case "low": return "text-green-400 bg-green-500/10";
      default: return "text-n-3 bg-n-7";
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

  const getSystemTypeIcon = (type) => {
    switch (type) {
      case "Web Server": return Monitor;
      case "Database": return HardDrive;
      case "Network": return Wifi;
      case "Storage": return HardDrive;
      default: return Cpu;
    }
  };

  const filteredSystems = systemFilter === "all" 
    ? monitoredSystems 
    : monitoredSystems.filter(system => system.status === systemFilter);

  return (
    <DashboardLayout title="Technician Dashboard" userRole="technician" userRoles={userRoles}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-n-1">Technician Dashboard</h1>
            <p className="text-n-3 mt-1">Monitor systems, manage infrastructure, and resolve technical issues</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-n-4" />
              <input
                type="text"
                placeholder="Search systems..."
                className="bg-n-7 border border-n-6 rounded-lg pl-10 pr-4 py-2 text-n-1 text-sm w-64"
              />
            </div>
            <button className="bg-gradient-to-r from-color-1 to-color-2 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
              <Plus size={16} />
              Add System
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {techStats.map((stat, index) => (
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
          {["overview", "systems", "alerts", "maintenance"].map((tab) => (
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
                    <h2 className="text-lg font-semibold text-n-1">System Alerts</h2>
                    <button className="text-color-1 text-sm hover:text-color-2">View All</button>
                  </div>
                  <div className="space-y-3">
                    {systemAlerts.slice(0, 4).map((alert) => (
                      <div key={alert.id} className="p-4 bg-n-7/50 rounded-xl border border-n-6/50 hover:border-color-1/20 transition-all">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              alert.severity === 'high' ? 'bg-red-500' : 
                              alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                            }`}></div>
                            <div>
                              <h3 className="text-n-1 font-medium">{alert.system}</h3>
                              <p className="text-n-4 text-sm">{alert.issue}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs ${getSeverityColor(alert.severity)}`}>
                            {alert.type}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-n-5 text-xs">{alert.time}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            alert.status === 'resolved' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'
                          }`}>
                            {alert.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-n-8 rounded-xl p-6 border border-n-6">
                  <h2 className="text-lg font-semibold text-n-1 mb-4">Recent Activity</h2>
                  <div className="space-y-3">
                    {recentActivities.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 p-3 bg-n-7/50 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-color-1 to-color-2 flex items-center justify-center">
                          <Wrench size={14} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-n-1 text-sm">{activity.action}</p>
                          <p className="text-n-4 text-xs">{activity.system} • {activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === "systems" && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <select 
                    value={systemFilter} 
                    onChange={(e) => setSystemFilter(e.target.value)}
                    className="bg-n-7 border border-n-6 rounded-lg px-4 py-2 text-n-1 text-sm"
                  >
                    <option value="all">All Systems</option>
                    <option value="healthy">Healthy</option>
                    <option value="warning">Warning</option>
                    <option value="critical">Critical</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                  <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6">
                    <RefreshCw size={16} className="text-n-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredSystems.map((system) => {
                    const SystemIcon = getSystemTypeIcon(system.type);
                    
                    return (
                      <div key={system.id} className="bg-n-8 rounded-xl p-6 border border-n-6 hover:border-color-1/20 transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-color-1 to-color-2 rounded-lg flex items-center justify-center">
                              <SystemIcon size={18} className="text-white" />
                            </div>
                            <div>
                              <h3 className="text-n-1 font-medium">{system.name}</h3>
                              <p className="text-n-4 text-xs">{system.type} • {system.location}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(system.status)}`}>
                            {system.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Cpu size={12} className="text-n-4" />
                              <span className="text-n-4 text-xs">CPU</span>
                            </div>
                            <div className="w-full bg-n-6 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${system.cpu > 80 ? 'bg-red-500' : system.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                style={{ width: `${system.cpu}%` }}
                              ></div>
                            </div>
                            <span className="text-n-1 text-xs font-semibold">{system.cpu}%</span>
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Activity size={12} className="text-n-4" />
                              <span className="text-n-4 text-xs">Memory</span>
                            </div>
                            <div className="w-full bg-n-6 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${system.memory > 80 ? 'bg-red-500' : system.memory > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                style={{ width: `${system.memory}%` }}
                              ></div>
                            </div>
                            <span className="text-n-1 text-xs font-semibold">{system.memory}%</span>
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <HardDrive size={12} className="text-n-4" />
                              <span className="text-n-4 text-xs">Disk</span>
                            </div>
                            <div className="w-full bg-n-6 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${system.disk > 80 ? 'bg-red-500' : system.disk > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                style={{ width: `${system.disk}%` }}
                              ></div>
                            </div>
                            <span className="text-n-1 text-xs font-semibold">{system.disk}%</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-n-4">
                            <span>Uptime: {system.uptime}</span>
                            <span className="mx-2">•</span>
                            <span>Last check: {system.lastCheck}</span>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6">
                              <Eye size={14} className="text-n-3" />
                            </button>
                            <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6">
                              <Settings size={14} className="text-n-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "alerts" && (
              <div className="bg-n-8 rounded-xl p-6 border border-n-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-n-1">System Alerts</h2>
                  <button className="bg-gradient-to-r from-color-1 to-color-2 text-white px-4 py-2 rounded-lg text-sm">
                    Clear All
                  </button>
                </div>
                <div className="space-y-4">
                  {systemAlerts.map((alert) => (
                    <div key={alert.id} className="p-4 bg-n-7/50 rounded-lg border border-n-6/50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${
                            alert.severity === 'high' ? 'bg-red-500' : 
                            alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}></div>
                          <div>
                            <h3 className="text-n-1 font-medium">{alert.system}</h3>
                            <p className="text-n-3 text-sm">{alert.issue}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs ${getSeverityColor(alert.severity)}`}>
                            {alert.type}
                          </span>
                          <button className="p-1 bg-n-6 rounded hover:bg-n-5">
                            <Eye size={14} className="text-n-3" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-n-5 text-xs">{alert.time}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          alert.status === 'resolved' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'
                        }`}>
                          {alert.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "maintenance" && (
              <div className="bg-n-8 rounded-xl p-6 border border-n-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-n-1">Maintenance Tasks</h2>
                  <button className="bg-gradient-to-r from-color-1 to-color-2 text-white px-4 py-2 rounded-lg text-sm">
                    Schedule Task
                  </button>
                </div>
                <div className="space-y-4">
                  {maintenanceTasks.map((task) => (
                    <div key={task.id} className="p-4 bg-n-7/50 rounded-lg border border-n-6/50">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-n-1 font-medium">{task.title}</h3>
                          <p className="text-n-4 text-sm">{task.system}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                          {task.priority} priority
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-n-4">Due Date</p>
                          <p className="text-n-1 font-semibold">{new Date(task.dueDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-n-4">Estimated Time</p>
                          <p className="text-n-1 font-semibold">{task.estimatedTime}</p>
                        </div>
                        <div>
                          <p className="text-n-4">Assignee</p>
                          <p className="text-n-1 font-semibold">{task.assignee}</p>
                        </div>
                        <div>
                          <p className="text-n-4">Status</p>
                          <span className={`px-2 py-1 rounded text-xs ${
                            task.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                            task.status === 'in-progress' ? 'bg-blue-500/10 text-blue-400' :
                            'bg-yellow-500/10 text-yellow-400'
                          }`}>
                            {task.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Content */}
          <div className="lg:w-80 lg:flex-shrink-0 space-y-6 mt-6 lg:mt-0">
            {/* System Health Overview */}
            <div className="bg-n-8 rounded-xl p-6 border border-n-6">
              <h2 className="text-lg font-semibold text-n-1 mb-4">System Health</h2>
              <div className="space-y-4">
                {[
                  { name: "CPU Load", value: 65, status: "normal" },
                  { name: "Memory Usage", value: 78, status: "warning" },
                  { name: "Disk Space", value: 45, status: "normal" },
                  { name: "Network Traffic", value: 82, status: "high" }
                ].map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-n-1 text-sm">{metric.name}</span>
                      <span className="text-n-3 text-sm">{metric.value}%</span>
                    </div>
                    <div className="w-full bg-n-6 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          metric.status === 'high' ? 'bg-red-500' : 
                          metric.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${metric.value}%` }}
                      ></div>
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
                  { title: "System Restart", icon: RefreshCw },
                  { title: "Run Diagnostics", icon: Bug },
                  { title: "Update Systems", icon: Download },
                  { title: "Backup Data", icon: HardDrive },
                  { title: "Monitor Logs", icon: FileText },
                  { title: "Performance Check", icon: BarChart3 }
                ].map((action, index) => (
                  <button key={index} className="w-full flex items-center gap-3 p-3 text-left rounded-lg bg-n-7/50 hover:bg-n-6/50 transition-colors">
                    <action.icon size={16} className="text-color-1" />
                    <span className="text-n-1 text-sm">{action.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* System Uptime */}
            <div className="bg-n-8 rounded-xl p-6 border border-n-6">
              <h2 className="text-lg font-semibold text-n-1 mb-4">System Uptime</h2>
              <div className="space-y-3">
                {[
                  { system: "Web Servers", uptime: "99.9%", days: "45 days" },
                  { system: "Database", uptime: "99.7%", days: "32 days" },
                  { system: "Load Balancer", uptime: "100%", days: "78 days" },
                  { system: "Backup System", uptime: "98.5%", days: "12 days" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-n-7/50 rounded-lg">
                    <div>
                      <h3 className="text-n-1 text-sm font-medium">{item.system}</h3>
                      <p className="text-n-4 text-xs">{item.days}</p>
                    </div>
                    <span className="text-color-1 font-semibold">{item.uptime}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TechnicianDashboard;
