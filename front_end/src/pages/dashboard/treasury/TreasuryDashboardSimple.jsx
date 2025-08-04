import React, { useState } from "react";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  CreditCard,
  PieChart,
  BarChart3,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Receipt,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  RefreshCw,
  Filter,
  Eye,
  Settings
} from "lucide-react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";

const TreasuryDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeframe, setTimeframe] = useState("month");

  const financialStats = [
    {
      title: "Total Revenue",
      value: "$2,456,789",
      change: "+18.5%",
      changeType: "positive",
      icon: DollarSign,
      color: "green",
      period: "This Month"
    },
    {
      title: "Operating Expenses",
      value: "$1,234,567",
      change: "-5.2%",
      changeType: "positive",
      icon: Receipt,
      color: "blue",
      period: "This Month"
    },
    {
      title: "Net Profit",
      value: "$1,222,222",
      change: "+22.3%",
      changeType: "positive",
      icon: TrendingUp,
      color: "purple",
      period: "This Month"
    },
    {
      title: "Cash Flow",
      value: "$3,456,789",
      change: "+12.8%",
      changeType: "positive",
      icon: Wallet,
      color: "yellow",
      period: "Available"
    }
  ];

  const revenueStreams = [
    { name: "Course Sales", amount: "$1,567,890", percentage: 64, trend: "up", change: "+15%" },
    { name: "Shop Revenue", amount: "$567,234", percentage: 23, trend: "up", change: "+8%" },
    { name: "Subscriptions", amount: "$234,567", percentage: 9, trend: "up", change: "+22%" },
    { name: "Consulting", amount: "$87,098", percentage: 4, trend: "stable", change: "+2%" }
  ];

  const recentTransactions = [
    { id: 1, type: "income", description: "Course enrollment payment", amount: "+$4,567", time: "2 hours ago", status: "completed" },
    { id: 2, type: "expense", description: "Server hosting fees", amount: "-$1,234", time: "4 hours ago", status: "completed" },
    { id: 3, type: "income", description: "Product sale", amount: "+$567", time: "6 hours ago", status: "completed" },
    { id: 4, type: "expense", description: "Marketing campaign", amount: "-$2,890", time: "1 day ago", status: "pending" },
    { id: 5, type: "income", description: "Subscription renewal", amount: "+$1,200", time: "1 day ago", status: "completed" }
  ];

  const budgetAllocation = [
    { category: "Technology", allocated: "$250,000", spent: "$198,750", percentage: 79, status: "on-track" },
    { category: "Marketing", allocated: "$150,000", spent: "$142,500", percentage: 95, status: "warning" },
    { category: "Operations", allocated: "$300,000", spent: "$234,000", percentage: 78, status: "on-track" },
    { category: "R&D", allocated: "$200,000", spent: "$156,000", percentage: 78, status: "on-track" }
  ];

  const upcomingPayments = [
    { id: 1, vendor: "AWS Cloud Services", amount: "$12,567", due: "Dec 8, 2024", priority: "high" },
    { id: 2, vendor: "Marketing Agency", amount: "$45,000", due: "Dec 10, 2024", priority: "medium" },
    { id: 3, vendor: "Software Licenses", amount: "$8,900", due: "Dec 15, 2024", priority: "low" },
    { id: 4, vendor: "Consultant Fees", amount: "$25,000", due: "Dec 20, 2024", priority: "medium" }
  ];

  const getStatColor = (color) => {
    const colors = {
      green: "from-green-500 to-green-600",
      blue: "from-blue-500 to-blue-600",
      purple: "from-purple-500 to-purple-600",
      yellow: "from-yellow-500 to-yellow-600"
    };
    return colors[color] || colors.green;
  };

  const getTrendIcon = (trend) => {
    if (trend === "up") return <ArrowUpRight size={16} className="text-green-400" />;
    if (trend === "down") return <ArrowDownRight size={16} className="text-red-400" />;
    return <div className="w-4 h-0.5 bg-n-4"></div>;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-500/10 text-green-400";
      case "pending": return "bg-yellow-500/10 text-yellow-400";
      case "failed": return "bg-red-500/10 text-red-400";
      default: return "bg-n-7 text-n-3";
    }
  };

  const getBudgetStatus = (status) => {
    switch (status) {
      case "on-track": return "text-green-400";
      case "warning": return "text-yellow-400";
      case "over-budget": return "text-red-400";
      default: return "text-n-3";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "medium": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "low": return "bg-green-500/10 text-green-400 border-green-500/20";
      default: return "bg-n-7 text-n-3 border-n-6";
    }
  };

  return (
    <DashboardLayout title="Treasury Dashboard" userRole="treasury">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-n-1">Financial Management</h1>
            <p className="text-n-3 mt-1">Monitor revenue, expenses, and financial performance</p>
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
              <option value="year">This Year</option>
            </select>
            <button className="bg-gradient-to-r from-color-1 to-color-2 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
              <Download size={16} />
              Export Report
            </button>
          </div>
        </div>

        {/* Financial Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {financialStats.map((stat, index) => (
            <div key={index} className="bg-n-8 rounded-xl p-6 border border-n-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${getStatColor(stat.color)} flex items-center justify-center`}>
                  <stat.icon size={20} className="text-white" />
                </div>
                <div className="text-right">
                  <span className={`text-sm flex items-center gap-1 ${
                    stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stat.changeType === 'positive' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {stat.change}
                  </span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-n-1 mb-1">{stat.value}</h3>
              <p className="text-n-4 text-sm">{stat.title}</p>
              <p className="text-n-5 text-xs mt-1">{stat.period}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-n-7 p-1 rounded-lg w-fit">
          {["overview", "revenue", "expenses", "budget"].map((tab) => (
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
                  <h2 className="text-lg font-semibold text-n-1 mb-4">Revenue Streams</h2>
                  <div className="space-y-4">
                    {revenueStreams.map((stream, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <span className="text-n-1 font-medium">{stream.name}</span>
                            <div className="flex items-center gap-1">
                              {getTrendIcon(stream.trend)}
                              <span className={`text-sm ${
                                stream.trend === 'up' ? 'text-green-400' : 
                                stream.trend === 'down' ? 'text-red-400' : 'text-n-3'
                              }`}>
                                {stream.change}
                              </span>
                            </div>
                          </div>
                          <span className="text-n-1 font-semibold">{stream.amount}</span>
                        </div>
                        <div className="w-full bg-n-6 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-color-1 to-color-2 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${stream.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-n-8 rounded-xl p-6 border border-n-6">
                  <h2 className="text-lg font-semibold text-n-1 mb-4">Financial Trends</h2>
                  <div className="h-64 bg-n-7 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 size={48} className="text-n-4 mx-auto mb-2" />
                      <p className="text-n-4">Financial Analytics</p>
                      <p className="text-n-5 text-sm">Revenue and expense trends over time</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "revenue" && (
              <div className="bg-n-8 rounded-xl p-6 border border-n-6">
                <h2 className="text-lg font-semibold text-n-1 mb-4">Revenue Analysis</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div className="text-center p-4 bg-n-7 rounded-lg">
                    <div className="text-3xl font-bold text-green-400 mb-2">$2.46M</div>
                    <div className="text-n-3 text-sm">Total Revenue</div>
                  </div>
                  <div className="text-center p-4 bg-n-7 rounded-lg">
                    <div className="text-3xl font-bold text-blue-400 mb-2">+18.5%</div>
                    <div className="text-n-3 text-sm">Growth Rate</div>
                  </div>
                </div>
                <div className="h-64 bg-n-7 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <PieChart size={48} className="text-n-4 mx-auto mb-2" />
                    <p className="text-n-4">Revenue Breakdown</p>
                    <p className="text-n-5 text-sm">Revenue distribution by source</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "expenses" && (
              <div className="bg-n-8 rounded-xl p-6 border border-n-6">
                <h2 className="text-lg font-semibold text-n-1 mb-4">Recent Transactions</h2>
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-n-7 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'income' ? 'bg-green-500/10' : 'bg-red-500/10'
                        }`}>
                          {transaction.type === 'income' ? 
                            <ArrowUpRight size={16} className="text-green-400" /> : 
                            <ArrowDownRight size={16} className="text-red-400" />
                          }
                        </div>
                        <div>
                          <h3 className="text-n-1 font-medium">{transaction.description}</h3>
                          <p className="text-n-4 text-sm">{transaction.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${
                          transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.amount}
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "budget" && (
              <div className="bg-n-8 rounded-xl p-6 border border-n-6">
                <h2 className="text-lg font-semibold text-n-1 mb-4">Budget Allocation</h2>
                <div className="space-y-4">
                  {budgetAllocation.map((budget, index) => (
                    <div key={index} className="p-4 bg-n-7 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-n-1 font-medium">{budget.category}</h3>
                        <span className={`text-sm ${getBudgetStatus(budget.status)}`}>
                          {budget.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-n-3 text-sm">Spent: {budget.spent}</span>
                        <span className="text-n-3 text-sm">Budget: {budget.allocated}</span>
                      </div>
                      <div className="w-full bg-n-6 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            budget.percentage > 90 ? 'bg-red-500' : 
                            budget.percentage > 75 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${budget.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-right mt-1">
                        <span className="text-n-4 text-sm">{budget.percentage}% utilized</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 lg:flex-shrink-0 space-y-6 mt-6 lg:mt-0">
            {/* Upcoming Payments */}
            <div className="bg-n-8 rounded-xl p-6 border border-n-6">
              <h2 className="text-lg font-semibold text-n-1 mb-4">Upcoming Payments</h2>
              <div className="space-y-3">
                {upcomingPayments.map((payment) => (
                  <div key={payment.id} className="p-3 bg-n-7 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-n-1 text-sm font-medium">{payment.vendor}</h3>
                      <span className={`px-2 py-1 rounded text-xs border ${getPriorityColor(payment.priority)}`}>
                        {payment.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-n-1 font-semibold">{payment.amount}</span>
                      <span className="text-n-4 text-xs">{payment.due}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Health */}
            <div className="bg-n-8 rounded-xl p-6 border border-n-6">
              <h2 className="text-lg font-semibold text-n-1 mb-4">Financial Health</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-n-3">Profit Margin</span>
                  <span className="text-n-1 font-semibold">49.8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-n-3">Cash Ratio</span>
                  <span className="text-n-1 font-semibold">2.8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-n-3">Burn Rate</span>
                  <span className="text-n-1 font-semibold">$234K/month</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-n-3">Runway</span>
                  <span className="text-n-1 font-semibold">14.8 months</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-n-8 rounded-xl p-6 border border-n-6">
              <h2 className="text-lg font-semibold text-n-1 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                {[
                  { title: "Process Payments", icon: CreditCard },
                  { title: "Generate Invoice", icon: Receipt },
                  { title: "Budget Planning", icon: Target },
                  { title: "Financial Reports", icon: BarChart3 }
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

export default TreasuryDashboard;
