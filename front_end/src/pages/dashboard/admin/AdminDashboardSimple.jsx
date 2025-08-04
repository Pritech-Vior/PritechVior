import React, { useState } from "react";
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  DollarSign,
  ShoppingBag,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Settings,
  BarChart3,
  Eye,
  Plus,
  RefreshCw,
  Search,
  Filter,
  Download
} from "lucide-react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeframe, setTimeframe] = useState("month");

  const stats = [
    {
      title: "Total Users",
      value: "45,672",
      change: "+12.5%",
      changeType: "positive",
      icon: Users,
      color: "blue"
    },
    {
      title: "Active Courses",
      value: "1,234",
      change: "+8.3%",
      changeType: "positive",
      icon: BookOpen,
      color: "green"
    },
    {
      title: "Revenue",
      value: "$245,670",
      change: "+15.7%",
      changeType: "positive",
      icon: DollarSign,
      color: "yellow"
    },
    {
      title: "Orders",
      value: "2,847",
      change: "+5.2%",
      changeType: "positive",
      icon: ShoppingBag,
      color: "purple"
    }
  ];

  const recentActivities = [
    { id: 1, action: "New user registered", user: "John Doe", time: "2 minutes ago", type: "user" },
    { id: 2, action: "Course published", user: "Dr. Smith", time: "15 minutes ago", type: "course" },
    { id: 3, action: "Order completed", user: "Jane Wilson", time: "1 hour ago", type: "order" },
    { id: 4, action: "Blog post published", user: "Admin", time: "2 hours ago", type: "content" },
    { id: 5, action: "Payment processed", user: "Mike Johnson", time: "3 hours ago", type: "payment" }
  ];

  const pendingTasks = [
    { id: 1, title: "Review course submissions", count: 12, priority: "high", due: "Today" },
    { id: 2, title: "Approve blog posts", count: 5, priority: "medium", due: "Tomorrow" },
    { id: 3, title: "Process refunds", count: 3, priority: "high", due: "Today" },
    { id: 4, title: "Update user permissions", count: 8, priority: "low", due: "This week" }
  ];

  const systemAlerts = [
    { id: 1, type: "warning", message: "Server load is high", time: "5 min ago" },
    { id: 2, type: "info", message: "Backup completed successfully", time: "1 hour ago" },
    { id: 3, type: "error", message: "Payment gateway timeout", time: "2 hours ago" }
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "text-red-400 bg-red-400/10";
      case "medium": return "text-yellow-400 bg-yellow-400/10";
      case "low": return "text-green-400 bg-green-400/10";
      default: return "text-n-3 bg-n-7";
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case "error": return "bg-red-500/10 border-red-500/20 text-red-400";
      case "warning": return "bg-yellow-500/10 border-yellow-500/20 text-yellow-400";
      case "info": return "bg-blue-500/10 border-blue-500/20 text-blue-400";
      default: return "bg-n-7 border-n-6 text-n-3";
    }
  };

  return (
    <DashboardLayout title="Admin Dashboard" userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-n-1">Platform Administration</h1>
            <p className="text-n-3 mt-1">Manage all platform operations and monitor performance</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select 
              value={timeframe} 
              onChange={(e) => setTimeframe(e.target.value)}
              className="bg-n-7 border border-n-6 rounded-lg px-4 py-2 text-n-1 text-sm"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
            <button className="bg-gradient-to-r from-color-1 to-color-2 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-n-8 rounded-xl p-6 border border-n-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${getStatColor(stat.color)} flex items-center justify-center`}>
                  <stat.icon size={20} className="text-white" />
                </div>
                <span className="text-green-400 text-sm">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-n-1 mb-1">{stat.value}</h3>
              <p className="text-n-4 text-sm">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-n-7 p-1 rounded-lg w-fit">
          {["overview", "users", "content", "analytics"].map((tab) => (
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

        {/* Tab Content */}
        <div className="lg:flex lg:gap-6">
          {/* Main Content */}
          <div className="lg:flex-1 space-y-6">
            {activeTab === "overview" && (
              <>
                <div className="bg-n-8 rounded-xl p-6 border border-n-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-n-1">Recent Activities</h2>
                    <button className="text-color-1 text-sm hover:text-color-2">View All</button>
                  </div>
                  <div className="space-y-3">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 p-3 bg-n-7 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-color-1 to-color-2 flex items-center justify-center">
                          <Activity size={14} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-n-1 text-sm">{activity.action}</p>
                          <p className="text-n-4 text-xs">by {activity.user} • {activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-n-8 rounded-xl p-6 border border-n-6">
                  <h2 className="text-lg font-semibold text-n-1 mb-4">System Performance</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-n-7 rounded-lg">
                      <div className="text-2xl font-bold text-green-400">99.9%</div>
                      <div className="text-n-3 text-sm">Uptime</div>
                    </div>
                    <div className="text-center p-4 bg-n-7 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">1.2s</div>
                      <div className="text-n-3 text-sm">Response Time</div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "users" && (
              <div className="bg-n-8 rounded-xl p-6 border border-n-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-n-1">User Management</h2>
                  <div className="flex gap-2">
                    <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6">
                      <Search size={16} className="text-n-3" />
                    </button>
                    <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6">
                      <Filter size={16} className="text-n-3" />
                    </button>
                    <button className="bg-gradient-to-r from-color-1 to-color-2 text-white px-4 py-2 rounded-lg text-sm">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  {["Admin Users", "Trainers", "Students", "Parents"].map((userType, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-n-7 rounded-lg">
                      <div>
                        <h3 className="text-n-1 font-medium">{userType}</h3>
                        <p className="text-n-4 text-sm">{Math.floor(Math.random() * 1000)} active users</p>
                      </div>
                      <button className="text-color-1 hover:text-color-2">
                        <Eye size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "content" && (
              <div className="bg-n-8 rounded-xl p-6 border border-n-6">
                <h2 className="text-lg font-semibold text-n-1 mb-4">Content Management</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: "Courses", count: "1,234", icon: BookOpen },
                    { title: "Blog Posts", count: "456", icon: FileText },
                    { title: "Projects", count: "89", icon: Activity },
                    { title: "Products", count: "567", icon: ShoppingBag }
                  ].map((item, index) => (
                    <div key={index} className="p-4 bg-n-7 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <item.icon size={20} className="text-color-1" />
                        <h3 className="text-n-1 font-medium">{item.title}</h3>
                      </div>
                      <p className="text-2xl font-bold text-n-1">{item.count}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="bg-n-8 rounded-xl p-6 border border-n-6">
                <h2 className="text-lg font-semibold text-n-1 mb-4">Analytics Overview</h2>
                <div className="h-64 bg-n-7 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 size={48} className="text-n-4 mx-auto mb-2" />
                    <p className="text-n-4">Analytics Dashboard</p>
                    <p className="text-n-5 text-sm">Detailed metrics and reports</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Content */}
          <div className="lg:w-80 lg:flex-shrink-0 space-y-6 mt-6 lg:mt-0">
            {/* Pending Tasks */}
            <div className="bg-n-8 rounded-xl p-6 border border-n-6">
              <h2 className="text-lg font-semibold text-n-1 mb-4">Pending Tasks</h2>
              <div className="space-y-3">
                {pendingTasks.map((task) => (
                  <div key={task.id} className="p-3 bg-n-7 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-n-1 text-sm font-medium">{task.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-n-4 text-xs">{task.count} items</span>
                      <span className="text-n-5 text-xs">{task.due}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Alerts */}
            <div className="bg-n-8 rounded-xl p-6 border border-n-6">
              <h2 className="text-lg font-semibold text-n-1 mb-4">System Alerts</h2>
              <div className="space-y-3">
                {systemAlerts.map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}>
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs opacity-60 mt-1">{alert.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-n-8 rounded-xl p-6 border border-n-6">
              <h2 className="text-lg font-semibold text-n-1 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                {[
                  { title: "Export Users", icon: Download },
                  { title: "System Settings", icon: Settings },
                  { title: "Backup Data", icon: CheckCircle },
                  { title: "View Reports", icon: BarChart3 }
                ].map((action, index) => (
                  <button key={index} className="w-full flex items-center gap-3 p-3 text-left rounded-lg bg-n-7 hover:bg-n-6 transition-colors">
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

export default AdminDashboard;
