import React, { useState, useEffect } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Activity, 
  DollarSign,
  Eye,
  Calendar,
  RefreshCw,
  Download,
  Filter,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import DashboardLayout from "../../../../components/dashboard/DashboardLayout";
import Card from "../../../../components/Card";
import dashboardStats from "../../../../services/admin/dashboard/dashboardStats";

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [timeframe, setTimeframe] = useState("month");
  const [error, setError] = useState("");

  useEffect(() => {
    loadAnalytics();
  }, [timeframe]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await dashboardStats.getAnalytics(timeframe);
      setAnalyticsData(data);
    } catch (err) {
      setError("Failed to load analytics data");
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await loadAnalytics();
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num?.toLocaleString() || '0';
  };

  const formatCurrency = (amount) => {
    return `TSH ${amount?.toLocaleString() || '0'}`;
  };

  const getGrowthIcon = (rate) => {
    if (rate > 0) return <ArrowUp size={16} className="text-green-500" />;
    if (rate < 0) return <ArrowDown size={16} className="text-red-500" />;
    return null;
  };

  const getGrowthColor = (rate) => {
    if (rate > 0) return "text-green-500";
    if (rate < 0) return "text-red-500";
    return "text-n-4";
  };

  if (loading) {
    return (
      <DashboardLayout title="Analytics" userRole="admin">
        <div className="text-center py-12">
          <RefreshCw className="animate-spin mx-auto mb-4" size={32} />
          <p className="text-n-3">Loading analytics...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Analytics" userRole="admin">
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={handleRefresh}
            className="bg-gradient-to-r from-color-1 to-color-2 text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Analytics" userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-n-1">Analytics Dashboard</h1>
            <p className="text-n-3 mt-1">Platform performance metrics and insights</p>
          </div>
          <div className="flex gap-3">
            <select 
              value={timeframe} 
              onChange={(e) => setTimeframe(e.target.value)}
              className="bg-n-7 border border-n-6 rounded-lg px-4 py-2 text-n-1 text-sm"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button 
              onClick={handleRefresh}
              disabled={loading}
              className="bg-gradient-to-r from-color-1 to-color-2 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            <button className="bg-n-7 border border-n-6 text-n-1 px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-n-6">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Users size={20} className="text-white" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${getGrowthColor(analyticsData?.users?.growth_rate)}`}>
                {getGrowthIcon(analyticsData?.users?.growth_rate)}
                {Math.abs(analyticsData?.users?.growth_rate || 0)}%
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-n-1 mb-1">
                {formatNumber(analyticsData?.users?.total)}
              </h3>
              <p className="text-n-4 text-sm">Total Users</p>
              <p className="text-n-5 text-xs mt-1">
                +{formatNumber(analyticsData?.users?.new_this_month)} this {timeframe}
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Activity size={20} className="text-white" />
              </div>
              <div className="flex items-center gap-1 text-sm text-green-500">
                <ArrowUp size={16} />
                12.5%
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-n-1 mb-1">
                {formatNumber(analyticsData?.projects?.total)}
              </h3>
              <p className="text-n-4 text-sm">Total Projects</p>
              <p className="text-n-5 text-xs mt-1">
                {analyticsData?.projects?.completed} completed, {analyticsData?.projects?.in_progress} active
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                <DollarSign size={20} className="text-white" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${getGrowthColor(analyticsData?.revenue?.growth_rate)}`}>
                {getGrowthIcon(analyticsData?.revenue?.growth_rate)}
                {Math.abs(analyticsData?.revenue?.growth_rate || 0)}%
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-n-1 mb-1">
                {formatCurrency(analyticsData?.revenue?.total)}
              </h3>
              <p className="text-n-4 text-sm">Total Revenue</p>
              <p className="text-n-5 text-xs mt-1">
                {formatCurrency(analyticsData?.revenue?.this_month)} this {timeframe}
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <Eye size={20} className="text-white" />
              </div>
              <div className="flex items-center gap-1 text-sm text-red-500">
                <ArrowDown size={16} />
                {analyticsData?.traffic?.bounce_rate}%
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-n-1 mb-1">
                {formatNumber(analyticsData?.traffic?.page_views)}
              </h3>
              <p className="text-n-4 text-sm">Page Views</p>
              <p className="text-n-5 text-xs mt-1">
                {formatNumber(analyticsData?.traffic?.unique_visitors)} unique visitors
              </p>
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-n-1">User Growth</h3>
              <div className="flex items-center gap-2 text-sm text-n-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                New Users
              </div>
            </div>
            <div className="h-64 bg-n-7 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 size={48} className="text-n-4 mx-auto mb-2" />
                <p className="text-n-4">User Growth Chart</p>
                <p className="text-n-5 text-sm">Chart visualization would go here</p>
              </div>
            </div>
          </Card>

          {/* Revenue Chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-n-1">Revenue Trends</h3>
              <div className="flex items-center gap-4 text-sm text-n-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  Revenue
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  Target
                </div>
              </div>
            </div>
            <div className="h-64 bg-n-7 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp size={48} className="text-n-4 mx-auto mb-2" />
                <p className="text-n-4">Revenue Chart</p>
                <p className="text-n-5 text-sm">Chart visualization would go here</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Projects */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-n-1 mb-4">Top Projects</h3>
            <div className="space-y-4">
              {[
                { name: "E-commerce Platform", views: 1250, status: "completed" },
                { name: "Mobile App Development", views: 980, status: "in_progress" },
                { name: "Website Redesign", views: 750, status: "completed" },
                { name: "Database Migration", views: 620, status: "in_progress" },
                { name: "API Integration", views: 450, status: "planning" }
              ].map((project, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-n-7 rounded-lg">
                  <div className="flex-1">
                    <p className="text-n-1 text-sm font-medium">{project.name}</p>
                    <p className="text-n-4 text-xs">{project.views} views</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    project.status === 'completed' ? 'bg-green-100 text-green-800' :
                    project.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* User Activity */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-n-1 mb-4">User Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-n-4 text-sm">Active Today</span>
                <span className="text-n-1 font-semibold">{analyticsData?.users?.active_today || 892}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-n-4 text-sm">New Registrations</span>
                <span className="text-n-1 font-semibold">{analyticsData?.users?.new_this_month || 234}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-n-4 text-sm">Session Duration</span>
                <span className="text-n-1 font-semibold">8m 32s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-n-4 text-sm">Bounce Rate</span>
                <span className="text-n-1 font-semibold">{analyticsData?.traffic?.bounce_rate || 32.5}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-n-4 text-sm">Return Visitors</span>
                <span className="text-n-1 font-semibold">67.8%</span>
              </div>
            </div>
          </Card>

          {/* Performance Metrics */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-n-1 mb-4">Performance</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-n-4 text-sm">Server Response</span>
                  <span className="text-n-1 font-semibold">1.2s</span>
                </div>
                <div className="w-full bg-n-7 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-n-4 text-sm">Database Queries</span>
                  <span className="text-n-1 font-semibold">45ms</span>
                </div>
                <div className="w-full bg-n-7 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-n-4 text-sm">API Response</span>
                  <span className="text-n-1 font-semibold">180ms</span>
                </div>
                <div className="w-full bg-n-7 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-n-4 text-sm">Uptime</span>
                  <span className="text-n-1 font-semibold">99.9%</span>
                </div>
                <div className="w-full bg-n-7 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '99.9%' }}></div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-n-1 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: "New project created", user: "John Doe", time: "2 minutes ago", type: "project" },
              { action: "User registered", user: "Jane Smith", time: "5 minutes ago", type: "user" },
              { action: "Payment processed", user: "Mike Johnson", time: "10 minutes ago", type: "payment" },
              { action: "Blog post published", user: "Admin", time: "15 minutes ago", type: "content" },
              { action: "Project completed", user: "Sarah Wilson", time: "20 minutes ago", type: "project" }
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-n-7 rounded-lg">
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
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;