import React, { useState } from "react";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Globe,
  Zap,
  Award,
  BookOpen,
  ShoppingBag,
  Activity,
  Eye,
  Settings,
  Download,
  RefreshCw
} from "lucide-react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";

const CEODashboard = () => {
  const [timeframe, setTimeframe] = useState("quarter");
  const [activeView, setActiveView] = useState("overview");

  const kpis = [
    {
      title: "Total Revenue",
      value: "$2,456,789",
      change: "+18.5%",
      changeType: "positive",
      icon: DollarSign,
      color: "green",
      period: "vs last quarter"
    },
    {
      title: "Platform Growth",
      value: "45,672",
      change: "+24.3%",
      changeType: "positive",
      icon: TrendingUp,
      color: "blue",
      period: "total users"
    },
    {
      title: "Market Share",
      value: "12.8%",
      change: "+2.1%",
      changeType: "positive",
      icon: Target,
      color: "purple",
      period: "in e-learning"
    },
    {
      title: "Satisfaction",
      value: "4.8/5",
      change: "+0.3",
      changeType: "positive",
      icon: Award,
      color: "yellow",
      period: "avg rating"
    }
  ];

  const strategicMetrics = [
    { title: "Course Completion Rate", value: "87%", target: "90%", progress: 87 },
    { title: "Customer Retention", value: "92%", target: "95%", progress: 92 },
    { title: "Revenue Growth", value: "18.5%", target: "20%", progress: 85 },
    { title: "Platform Uptime", value: "99.9%", target: "99.9%", progress: 100 }
  ];

  const businessAreas = [
    { 
      name: "E-Learning Platform", 
      revenue: "$1,567,890", 
      growth: "+22%", 
      users: "32,456", 
      courses: "1,234",
      color: "from-blue-500 to-blue-600"
    },
    { 
      name: "Online Shop", 
      revenue: "$567,234", 
      growth: "+15%", 
      orders: "2,847", 
      products: "456",
      color: "from-green-500 to-green-600"
    },
    { 
      name: "Corporate Training", 
      revenue: "$234,567", 
      growth: "+31%", 
      clients: "89", 
      programs: "67",
      color: "from-purple-500 to-purple-600"
    },
    { 
      name: "Consulting Services", 
      revenue: "$87,098", 
      growth: "+8%", 
      projects: "23", 
      consultants: "12",
      color: "from-yellow-500 to-yellow-600"
    }
  ];

  const upcomingMilestones = [
    { title: "Q4 Product Launch", date: "Dec 15, 2024", status: "on-track", priority: "high" },
    { title: "Series B Funding", date: "Jan 30, 2025", status: "planning", priority: "high" },
    { title: "European Expansion", date: "Mar 1, 2025", status: "preparation", priority: "medium" },
    { title: "AI Integration", date: "May 15, 2025", status: "research", priority: "medium" }
  ];

  const competitorAnalysis = [
    { name: "LearnMax Pro", marketShare: "18.5%", trend: "down", change: "-2.1%" },
    { name: "EduGlobal", marketShare: "15.2%", trend: "up", change: "+1.8%" },
    { name: "SkillForge", marketShare: "14.7%", trend: "stable", change: "+0.3%" },
    { name: "PritechVior", marketShare: "12.8%", trend: "up", change: "+2.1%" }
  ];

  const getKpiColor = (color) => {
    const colors = {
      green: "from-green-500 to-green-600",
      blue: "from-blue-500 to-blue-600",
      purple: "from-purple-500 to-purple-600",
      yellow: "from-yellow-500 to-yellow-600"
    };
    return colors[color] || colors.blue;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "on-track": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "planning": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "preparation": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "research": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      default: return "bg-n-7 text-n-3 border-n-6";
    }
  };

  const getTrendIcon = (trend) => {
    if (trend === "up") return <ArrowUpRight size={16} className="text-green-400" />;
    if (trend === "down") return <ArrowDownRight size={16} className="text-red-400" />;
    return <Activity size={16} className="text-n-3" />;
  };

  return (
    <DashboardLayout title="CEO Dashboard" userRole="ceo">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-n-1">Executive Overview</h1>
            <p className="text-n-3 mt-1">Strategic insights and business performance metrics</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select 
              value={timeframe} 
              onChange={(e) => setTimeframe(e.target.value)}
              className="bg-n-7 border border-n-6 rounded-lg px-4 py-2 text-n-1 text-sm"
            >
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button className="bg-gradient-to-r from-color-1 to-color-2 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
              <Download size={16} />
              Export Report
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, index) => (
            <div key={index} className="bg-n-8 rounded-xl p-6 border border-n-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${getKpiColor(kpi.color)} flex items-center justify-center`}>
                  <kpi.icon size={20} className="text-white" />
                </div>
                <div className="text-right">
                  <span className="text-green-400 text-sm flex items-center gap-1">
                    <ArrowUpRight size={12} />
                    {kpi.change}
                  </span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-n-1 mb-1">{kpi.value}</h3>
              <p className="text-n-4 text-sm">{kpi.title}</p>
              <p className="text-n-5 text-xs mt-1">{kpi.period}</p>
            </div>
          ))}
        </div>

        {/* View Tabs */}
        <div className="flex gap-1 bg-n-7 p-1 rounded-lg w-fit">
          {["overview", "business-units", "strategy", "competition"].map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === view 
                  ? "bg-gradient-to-r from-color-1 to-color-2 text-white" 
                  : "text-n-3 hover:text-n-1"
              }`}
            >
              {view.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </button>
          ))}
        </div>

        <div className="lg:flex lg:gap-6">
          {/* Main Content */}
          <div className="lg:flex-1 space-y-6">
            {activeView === "overview" && (
              <>
                <div className="bg-n-8 rounded-xl p-6 border border-n-6">
                  <h2 className="text-lg font-semibold text-n-1 mb-4">Strategic Metrics</h2>
                  <div className="space-y-4">
                    {strategicMetrics.map((metric, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-n-1 text-sm font-medium">{metric.title}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-n-1 font-semibold">{metric.value}</span>
                            <span className="text-n-4 text-sm">/ {metric.target}</span>
                          </div>
                        </div>
                        <div className="w-full bg-n-6 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-color-1 to-color-2 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${metric.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-n-8 rounded-xl p-6 border border-n-6">
                  <h2 className="text-lg font-semibold text-n-1 mb-4">Revenue Breakdown</h2>
                  <div className="h-64 bg-n-7 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <PieChart size={48} className="text-n-4 mx-auto mb-2" />
                      <p className="text-n-4">Revenue Analytics</p>
                      <p className="text-n-5 text-sm">Detailed revenue breakdown by segment</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeView === "business-units" && (
              <div className="space-y-4">
                {businessAreas.map((area, index) => (
                  <div key={index} className="bg-n-8 rounded-xl p-6 border border-n-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${area.color} flex items-center justify-center`}>
                        {area.name.includes('E-Learning') && <BookOpen size={20} className="text-white" />}
                        {area.name.includes('Shop') && <ShoppingBag size={20} className="text-white" />}
                        {area.name.includes('Training') && <Users size={20} className="text-white" />}
                        {area.name.includes('Consulting') && <Target size={20} className="text-white" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-n-1">{area.name}</h3>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-2xl font-bold text-n-1">{area.revenue}</span>
                          <span className="text-green-400 text-sm">{area.growth}</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-n-1 font-semibold">{area.users || area.orders || area.clients || area.projects}</div>
                        <div className="text-n-4 text-sm">{area.users ? 'Users' : area.orders ? 'Orders' : area.clients ? 'Clients' : 'Projects'}</div>
                      </div>
                      <div>
                        <div className="text-n-1 font-semibold">{area.courses || area.products || area.programs || area.consultants}</div>
                        <div className="text-n-4 text-sm">{area.courses ? 'Courses' : area.products ? 'Products' : area.programs ? 'Programs' : 'Consultants'}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeView === "strategy" && (
              <div className="bg-n-8 rounded-xl p-6 border border-n-6">
                <h2 className="text-lg font-semibold text-n-1 mb-4">Strategic Initiatives</h2>
                <div className="space-y-4">
                  {upcomingMilestones.map((milestone, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-n-7 rounded-lg">
                      <div className="flex-1">
                        <h3 className="text-n-1 font-medium">{milestone.title}</h3>
                        <p className="text-n-4 text-sm flex items-center gap-2 mt-1">
                          <Calendar size={14} />
                          {milestone.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(milestone.status)}`}>
                          {milestone.status}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          milestone.priority === 'high' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'
                        }`}>
                          {milestone.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeView === "competition" && (
              <div className="bg-n-8 rounded-xl p-6 border border-n-6">
                <h2 className="text-lg font-semibold text-n-1 mb-4">Market Position</h2>
                <div className="space-y-4">
                  {competitorAnalysis.map((competitor, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-n-7 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          competitor.name === 'PritechVior' ? 'bg-gradient-to-r from-color-1 to-color-2' : 'bg-n-5'
                        }`}></div>
                        <span className={`font-medium ${
                          competitor.name === 'PritechVior' ? 'text-color-1' : 'text-n-1'
                        }`}>
                          {competitor.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-n-1 font-semibold">{competitor.marketShare}</span>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(competitor.trend)}
                          <span className={`text-sm ${
                            competitor.trend === 'up' ? 'text-green-400' : 
                            competitor.trend === 'down' ? 'text-red-400' : 'text-n-3'
                          }`}>
                            {competitor.change}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 lg:flex-shrink-0 space-y-6 mt-6 lg:mt-0">
            {/* Key Insights */}
            <div className="bg-n-8 rounded-xl p-6 border border-n-6">
              <h2 className="text-lg font-semibold text-n-1 mb-4">Key Insights</h2>
              <div className="space-y-4">
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={16} className="text-green-400" />
                    <span className="text-green-400 font-medium text-sm">Growth Opportunity</span>
                  </div>
                  <p className="text-n-3 text-sm">E-learning segment showing 22% growth, exceeding targets</p>
                </div>
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={16} className="text-blue-400" />
                    <span className="text-blue-400 font-medium text-sm">Market Position</span>
                  </div>
                  <p className="text-n-3 text-sm">Gained 2.1% market share in Q3, ranking 4th in sector</p>
                </div>
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap size={16} className="text-yellow-400" />
                    <span className="text-yellow-400 font-medium text-sm">Action Required</span>
                  </div>
                  <p className="text-n-3 text-sm">Customer retention at 92%, focus needed to reach 95% target</p>
                </div>
              </div>
            </div>

            {/* Global Metrics */}
            <div className="bg-n-8 rounded-xl p-6 border border-n-6">
              <h2 className="text-lg font-semibold text-n-1 mb-4">Global Reach</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-n-3">Active Countries</span>
                  <span className="text-n-1 font-semibold">47</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-n-3">Languages</span>
                  <span className="text-n-1 font-semibold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-n-3">Time Zones</span>
                  <span className="text-n-1 font-semibold">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-n-3">Global Users</span>
                  <span className="text-n-1 font-semibold">45.6K</span>
                </div>
              </div>
            </div>

            {/* Executive Actions */}
            <div className="bg-n-8 rounded-xl p-6 border border-n-6">
              <h2 className="text-lg font-semibold text-n-1 mb-4">Executive Actions</h2>
              <div className="space-y-2">
                {[
                  { title: "Board Meeting Prep", icon: Calendar },
                  { title: "Strategic Planning", icon: Target },
                  { title: "Investor Relations", icon: TrendingUp },
                  { title: "Market Analysis", icon: BarChart3 }
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

export default CEODashboard;
