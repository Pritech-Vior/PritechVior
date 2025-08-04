import React, { useState } from "react";
import { 
  Monitor,
  Server,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Thermometer,
  Shield,
  Globe,
  Search,
  Filter,
  RefreshCw,
  Settings,
  Play,
  Pause,
  Power,
  RotateCcw
} from "lucide-react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";

const TechnicianMonitoring = ({ userRoles = ["technician"] }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const systems = [
    {
      id: 1,
      name: "Production Web Server",
      type: "web-server",
      status: "healthy",
      uptime: "99.98%",
      lastCheck: "2025-01-10T18:45:00Z",
      location: "AWS US-East-1",
      metrics: {
        cpu: 23,
        memory: 67,
        disk: 45,
        network: 78
      },
      alerts: 0,
      version: "Ubuntu 20.04 LTS",
      services: ["nginx", "pm2", "redis"]
    },
    {
      id: 2,
      name: "Database Primary",
      type: "database",
      status: "warning",
      uptime: "99.95%",
      lastCheck: "2025-01-10T18:44:30Z",
      location: "AWS US-East-1",
      metrics: {
        cpu: 78,
        memory: 89,
        disk: 67,
        network: 45
      },
      alerts: 2,
      version: "PostgreSQL 14.2",
      services: ["postgresql", "pgbouncer"]
    },
    {
      id: 3,
      name: "API Gateway",
      type: "api-gateway",
      status: "healthy",
      uptime: "99.99%",
      lastCheck: "2025-01-10T18:45:15Z",
      location: "AWS US-West-2",
      metrics: {
        cpu: 34,
        memory: 56,
        disk: 23,
        network: 89
      },
      alerts: 0,
      version: "Kong 3.1.1",
      services: ["kong", "cassandra"]
    },
    {
      id: 4,
      name: "Load Balancer",
      type: "load-balancer",
      status: "critical",
      uptime: "98.67%",
      lastCheck: "2025-01-10T18:43:45Z",
      location: "AWS US-East-1",
      metrics: {
        cpu: 95,
        memory: 92,
        disk: 78,
        network: 98
      },
      alerts: 5,
      version: "HAProxy 2.4",
      services: ["haproxy", "keepalived"]
    },
    {
      id: 5,
      name: "Cache Server",
      type: "cache",
      status: "healthy",
      uptime: "99.97%",
      lastCheck: "2025-01-10T18:45:10Z",
      location: "AWS US-East-1",
      metrics: {
        cpu: 12,
        memory: 45,
        disk: 34,
        network: 67
      },
      alerts: 0,
      version: "Redis 7.0.5",
      services: ["redis-server", "redis-sentinel"]
    },
    {
      id: 6,
      name: "Backup Storage",
      type: "storage",
      status: "maintenance",
      uptime: "99.89%",
      lastCheck: "2025-01-10T18:40:00Z",
      location: "AWS US-West-2",
      metrics: {
        cpu: 8,
        memory: 23,
        disk: 89,
        network: 12
      },
      alerts: 1,
      version: "MinIO Server",
      services: ["minio", "etcd"]
    }
  ];

  const alerts = [
    {
      id: 1,
      severity: "critical",
      system: "Load Balancer",
      message: "High CPU usage detected (95%)",
      timestamp: "2025-01-10T18:40:00Z",
      acknowledged: false,
      category: "performance"
    },
    {
      id: 2,
      severity: "warning",
      system: "Database Primary",
      message: "Memory usage approaching threshold (89%)",
      timestamp: "2025-01-10T18:35:00Z",
      acknowledged: false,
      category: "performance"
    },
    {
      id: 3,
      severity: "warning",
      system: "Database Primary",
      message: "Connection pool utilization high",
      timestamp: "2025-01-10T18:30:00Z",
      acknowledged: true,
      category: "connectivity"
    },
    {
      id: 4,
      severity: "info",
      system: "Backup Storage",
      message: "Scheduled maintenance started",
      timestamp: "2025-01-10T18:00:00Z",
      acknowledged: true,
      category: "maintenance"
    },
    {
      id: 5,
      severity: "critical",
      system: "Load Balancer",
      message: "Service response time degraded",
      timestamp: "2025-01-10T17:55:00Z",
      acknowledged: false,
      category: "performance"
    }
  ];

  const metrics = {
    totalSystems: systems.length,
    healthySystems: systems.filter(s => s.status === "healthy").length,
    criticalAlerts: alerts.filter(a => a.severity === "critical" && !a.acknowledged).length,
    averageUptime: "99.91%",
    totalAlerts: alerts.filter(a => !a.acknowledged).length
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "healthy": return CheckCircle;
      case "warning": return AlertTriangle;
      case "critical": return AlertTriangle;
      case "maintenance": return Settings;
      default: return Monitor;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "warning": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "info": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default: return "bg-n-7 text-n-3 border-n-6";
    }
  };

  const getSystemTypeIcon = (type) => {
    switch (type) {
      case "web-server": return Server;
      case "database": return Database;
      case "api-gateway": return Globe;
      case "load-balancer": return Activity;
      case "cache": return Zap;
      case "storage": return HardDrive;
      default: return Monitor;
    }
  };

  const getMetricColor = (value) => {
    if (value >= 90) return "text-red-400";
    if (value >= 70) return "text-yellow-400";
    return "text-green-400";
  };

  const filteredSystems = systems.filter(system => {
    const matchesSearch = system.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      system.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || system.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const filteredAlerts = alerts.filter(alert => 
    alert.system.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout title="System Monitoring" userRole="technician" userRoles={userRoles}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-n-1">System Monitoring</h1>
            <p className="text-n-3 mt-1">Monitor system health, performance, and alerts</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm ${
                autoRefresh 
                  ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                  : "bg-n-7 text-n-3"
              }`}
            >
              <RefreshCw size={16} className={autoRefresh ? "animate-spin" : ""} />
              Auto Refresh
            </button>
            <button className="bg-gradient-to-r from-color-1 to-color-2 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <Settings size={16} />
              Configure
            </button>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-n-8 rounded-xl p-4 border border-n-6">
            <div className="flex items-center justify-between mb-2">
              <Monitor size={20} className="text-blue-400" />
              <span className="text-blue-400 text-sm">Total</span>
            </div>
            <h3 className="text-xl font-bold text-n-1">{metrics.totalSystems}</h3>
            <p className="text-n-3 text-sm">Systems</p>
          </div>
          
          <div className="bg-n-8 rounded-xl p-4 border border-n-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle size={20} className="text-green-400" />
              <span className="text-green-400 text-sm">Healthy</span>
            </div>
            <h3 className="text-xl font-bold text-n-1">{metrics.healthySystems}</h3>
            <p className="text-n-3 text-sm">Systems</p>
          </div>
          
          <div className="bg-n-8 rounded-xl p-4 border border-n-6">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle size={20} className="text-red-400" />
              <span className="text-red-400 text-sm">Critical</span>
            </div>
            <h3 className="text-xl font-bold text-n-1">{metrics.criticalAlerts}</h3>
            <p className="text-n-3 text-sm">Alerts</p>
          </div>
          
          <div className="bg-n-8 rounded-xl p-4 border border-n-6">
            <div className="flex items-center justify-between mb-2">
              <Activity size={20} className="text-purple-400" />
              <span className="text-purple-400 text-sm">Average</span>
            </div>
            <h3 className="text-xl font-bold text-n-1">{metrics.averageUptime}</h3>
            <p className="text-n-3 text-sm">Uptime</p>
          </div>
          
          <div className="bg-n-8 rounded-xl p-4 border border-n-6">
            <div className="flex items-center justify-between mb-2">
              <Clock size={20} className="text-yellow-400" />
              <span className="text-yellow-400 text-sm">Active</span>
            </div>
            <h3 className="text-xl font-bold text-n-1">{metrics.totalAlerts}</h3>
            <p className="text-n-3 text-sm">Alerts</p>
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
            System Overview
          </button>
          <button
            onClick={() => setActiveTab("alerts")}
            className={`px-4 py-2 text-sm transition-colors ${
              activeTab === "alerts"
                ? "text-color-1 border-b-2 border-color-1"
                : "text-n-3 hover:text-n-1"
            }`}
          >
            Active Alerts ({metrics.totalAlerts})
          </button>
          <button
            onClick={() => setActiveTab("performance")}
            className={`px-4 py-2 text-sm transition-colors ${
              activeTab === "performance"
                ? "text-color-1 border-b-2 border-color-1"
                : "text-n-3 hover:text-n-1"
            }`}
          >
            Performance Metrics
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "All Systems" },
              { key: "healthy", label: "Healthy" },
              { key: "warning", label: "Warning" },
              { key: "critical", label: "Critical" },
              { key: "maintenance", label: "Maintenance" }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setFilterStatus(filter.key)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  filterStatus === filter.key
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
              placeholder="Search systems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-n-7 border border-n-6 rounded-lg pl-10 pr-4 py-2 text-n-1 text-sm w-64"
            />
          </div>
        </div>

        {/* System Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSystems.map((system) => {
              const StatusIcon = getStatusIcon(system.status);
              const SystemIcon = getSystemTypeIcon(system.type);
              
              return (
                <div key={system.id} className="bg-n-8 rounded-xl border border-n-6 hover:border-color-1/20 transition-all p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-color-1 to-color-2 rounded-lg flex items-center justify-center">
                        <SystemIcon size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-n-1 font-medium">{system.name}</h3>
                        <p className="text-n-4 text-sm capitalize">{system.type.replace('-', ' ')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(system.status)}`}>
                        <StatusIcon size={12} className="inline mr-1" />
                        {system.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-n-4">CPU Usage</span>
                      <span className={`font-medium ${getMetricColor(system.metrics.cpu)}`}>
                        {system.metrics.cpu}%
                      </span>
                    </div>
                    <div className="w-full bg-n-6 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          system.metrics.cpu >= 90 ? "bg-red-500" :
                          system.metrics.cpu >= 70 ? "bg-yellow-500" : "bg-green-500"
                        }`}
                        style={{ width: `${system.metrics.cpu}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-n-4">Memory Usage</span>
                      <span className={`font-medium ${getMetricColor(system.metrics.memory)}`}>
                        {system.metrics.memory}%
                      </span>
                    </div>
                    <div className="w-full bg-n-6 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          system.metrics.memory >= 90 ? "bg-red-500" :
                          system.metrics.memory >= 70 ? "bg-yellow-500" : "bg-green-500"
                        }`}
                        style={{ width: `${system.metrics.memory}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-n-4">Uptime</p>
                      <p className="text-n-1 font-semibold">{system.uptime}</p>
                    </div>
                    <div>
                      <p className="text-n-4">Alerts</p>
                      <p className={`font-semibold ${system.alerts > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {system.alerts}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-n-4 text-xs">
                      Last check: {new Date(system.lastCheck).toLocaleTimeString()}
                    </span>
                    <div className="flex gap-1">
                      <button className="p-1.5 bg-n-7 rounded hover:bg-n-6">
                        <Play size={12} className="text-n-3" />
                      </button>
                      <button className="p-1.5 bg-n-7 rounded hover:bg-n-6">
                        <Pause size={12} className="text-n-3" />
                      </button>
                      <button className="p-1.5 bg-n-7 rounded hover:bg-n-6">
                        <RotateCcw size={12} className="text-n-3" />
                      </button>
                      <button className="p-1.5 bg-n-7 rounded hover:bg-n-6">
                        <Settings size={12} className="text-n-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === "alerts" && (
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className={`bg-n-8 rounded-xl border p-4 ${
                alert.acknowledged ? "border-n-6 opacity-60" : "border-red-500/20"
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getSeverityColor(alert.severity)}`}>
                      <AlertTriangle size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(alert.severity)}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                        <span className="text-n-1 font-medium">{alert.system}</span>
                        <span className="text-n-4 text-sm">•</span>
                        <span className="text-n-4 text-sm capitalize">{alert.category}</span>
                      </div>
                      <p className="text-n-1 mb-2">{alert.message}</p>
                      <p className="text-n-4 text-sm">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!alert.acknowledged ? (
                      <button className="bg-green-500/10 text-green-400 px-3 py-1 rounded text-sm border border-green-500/20">
                        Acknowledge
                      </button>
                    ) : (
                      <span className="text-green-400 text-sm">Acknowledged</span>
                    )}
                    <button className="bg-n-7 text-n-3 px-3 py-1 rounded text-sm hover:bg-n-6">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredAlerts.length === 0 && (
              <div className="bg-n-8 rounded-xl p-12 text-center border border-n-6">
                <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
                <h3 className="text-n-1 font-medium mb-2">No active alerts</h3>
                <p className="text-n-4 text-sm">All systems are running normally</p>
              </div>
            )}
          </div>
        )}

        {/* Performance Metrics Tab */}
        {activeTab === "performance" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-n-8 rounded-xl border border-n-6 p-6">
              <h3 className="text-n-1 font-medium mb-4">CPU Usage Trends</h3>
              <div className="h-64 bg-n-7 rounded-lg flex items-center justify-center">
                <p className="text-n-4">CPU usage chart would be here</p>
              </div>
            </div>
            
            <div className="bg-n-8 rounded-xl border border-n-6 p-6">
              <h3 className="text-n-1 font-medium mb-4">Memory Usage Trends</h3>
              <div className="h-64 bg-n-7 rounded-lg flex items-center justify-center">
                <p className="text-n-4">Memory usage chart would be here</p>
              </div>
            </div>
            
            <div className="bg-n-8 rounded-xl border border-n-6 p-6">
              <h3 className="text-n-1 font-medium mb-4">Network Traffic</h3>
              <div className="h-64 bg-n-7 rounded-lg flex items-center justify-center">
                <p className="text-n-4">Network traffic chart would be here</p>
              </div>
            </div>
            
            <div className="bg-n-8 rounded-xl border border-n-6 p-6">
              <h3 className="text-n-1 font-medium mb-4">Response Time</h3>
              <div className="h-64 bg-n-7 rounded-lg flex items-center justify-center">
                <p className="text-n-4">Response time chart would be here</p>
              </div>
            </div>
          </div>
        )}

        {filteredSystems.length === 0 && activeTab === "overview" && (
          <div className="bg-n-8 rounded-xl p-12 text-center border border-n-6">
            <Monitor size={48} className="text-n-4 mx-auto mb-4" />
            <h3 className="text-n-1 font-medium mb-2">No systems found</h3>
            <p className="text-n-4 text-sm">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TechnicianMonitoring;
