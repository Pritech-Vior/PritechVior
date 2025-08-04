import React, { useState } from "react";
import { 
  DollarSign,
  Download,
  Eye,
  Calendar,
  CreditCard,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Filter,
  Search,
  Receipt,
  TrendingUp,
  PieChart,
  BarChart3
} from "lucide-react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";

const ClientBilling = ({ userRoles = ["client"] }) => {
  const [activeTab, setActiveTab] = useState("invoices");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const invoices = [
    {
      id: "INV-2025-001",
      projectTitle: "E-Commerce Mobile App",
      amount: 15000,
      dueDate: "2025-02-15",
      issueDate: "2025-01-15",
      status: "paid",
      paymentDate: "2025-01-20",
      milestone: "Phase 2 - Backend Development",
      paymentMethod: "Bank Transfer"
    },
    {
      id: "INV-2025-002",
      projectTitle: "University Portal System",
      amount: 4250,
      dueDate: "2025-02-28",
      issueDate: "2025-02-01",
      status: "pending",
      milestone: "Phase 3 - Testing & Deployment",
      paymentMethod: "Credit Card"
    },
    {
      id: "INV-2024-089",
      projectTitle: "AI Analytics Dashboard",
      amount: 25000,
      dueDate: "2025-01-30",
      issueDate: "2024-12-30",
      status: "overdue",
      milestone: "Phase 1 - Planning & Design",
      paymentMethod: "Wire Transfer"
    },
    {
      id: "INV-2024-078",
      projectTitle: "Blockchain Voting App",
      amount: 6000,
      dueDate: "2024-12-15",
      issueDate: "2024-11-15",
      status: "paid",
      paymentDate: "2024-12-10",
      milestone: "Phase 2 - Smart Contract Development",
      paymentMethod: "PayPal"
    }
  ];

  const paymentHistory = [
    {
      id: "PAY-2025-001",
      invoiceId: "INV-2025-001",
      projectTitle: "E-Commerce Mobile App",
      amount: 15000,
      paymentDate: "2025-01-20",
      method: "Bank Transfer",
      status: "completed",
      reference: "TXN789456123"
    },
    {
      id: "PAY-2024-089",
      invoiceId: "INV-2024-078",
      projectTitle: "Blockchain Voting App",
      amount: 6000,
      paymentDate: "2024-12-10",
      method: "PayPal",
      status: "completed",
      reference: "PP-987654321"
    },
    {
      id: "PAY-2024-067",
      invoiceId: "INV-2024-045",
      projectTitle: "IoT Smart Home System",
      amount: 12000,
      paymentDate: "2024-11-28",
      method: "Credit Card",
      status: "completed",
      reference: "CC-456789123"
    }
  ];

  const billingStats = [
    {
      title: "Total Paid",
      value: "$78,450",
      change: "+$21,000 this quarter",
      changeType: "positive",
      icon: CheckCircle,
      color: "green"
    },
    {
      title: "Outstanding",
      value: "$29,250",
      change: "2 pending invoices",
      changeType: "warning",
      icon: Clock,
      color: "yellow"
    },
    {
      title: "Overdue",
      value: "$25,000",
      change: "1 overdue invoice",
      changeType: "negative",
      icon: AlertTriangle,
      color: "red"
    },
    {
      title: "This Month",
      value: "$15,000",
      change: "1 invoice paid",
      changeType: "positive",
      icon: TrendingUp,
      color: "blue"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "paid": 
      case "completed": 
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "pending": 
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "overdue": 
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default: 
        return "bg-n-7 text-n-3 border-n-6";
    }
  };

  const getStatColor = (color) => {
    const colors = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      yellow: "from-yellow-500 to-yellow-600",
      red: "from-red-500 to-red-600"
    };
    return colors[color] || colors.blue;
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesStatus = filterStatus === "all" || invoice.status === filterStatus;
    const matchesSearch = invoice.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredPayments = paymentHistory.filter(payment => {
    return payment.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
           payment.id.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <DashboardLayout title="Client Billing" userRole="client" userRoles={userRoles}>
      <div className="space-y-6 px-4 lg:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-n-1">Billing & Payments</h1>
            <p className="text-n-3 mt-1">Manage invoices, payments, and billing history</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-n-7 text-n-1 px-4 py-2 rounded-lg flex items-center gap-2 text-sm border border-n-6 hover:bg-n-6">
              <Download size={16} />
              Export Report
            </button>
            <button className="bg-gradient-to-r from-color-1 to-color-2 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
              <CreditCard size={16} />
              Make Payment
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {billingStats.map((stat, index) => (
            <div key={index} className="bg-n-8 rounded-xl p-6 border border-n-6 hover:border-color-1/20 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${getStatColor(stat.color)} flex items-center justify-center shadow-lg`}>
                  <stat.icon size={20} className="text-white" />
                </div>
                <span className={`text-sm ${
                  stat.changeType === 'positive' ? 'text-green-400' : 
                  stat.changeType === 'warning' ? 'text-yellow-400' : 
                  stat.changeType === 'negative' ? 'text-red-400' : 'text-n-4'
                }`}>
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
          {[
            { key: "invoices", label: "Invoices" },
            { key: "payments", label: "Payment History" },
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
              { key: "all", label: "All" },
              { key: "paid", label: "Paid" },
              { key: "pending", label: "Pending" },
              { key: "overdue", label: "Overdue" }
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
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-n-7 border border-n-6 rounded-lg pl-10 pr-4 py-2 text-n-1 text-sm w-64"
            />
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "invoices" && (
          <div className="bg-n-8 rounded-xl border border-n-6 overflow-hidden">
            <div className="p-6 border-b border-n-6">
              <h2 className="text-lg font-semibold text-n-1">Invoices</h2>
              <p className="text-n-4 text-sm">Track all project invoices and payment status</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-n-7/50">
                  <tr>
                    <th className="text-left p-4 text-n-3 text-sm font-medium">Invoice ID</th>
                    <th className="text-left p-4 text-n-3 text-sm font-medium">Project</th>
                    <th className="text-left p-4 text-n-3 text-sm font-medium">Amount</th>
                    <th className="text-left p-4 text-n-3 text-sm font-medium">Due Date</th>
                    <th className="text-left p-4 text-n-3 text-sm font-medium">Status</th>
                    <th className="text-left p-4 text-n-3 text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-n-6/50 hover:bg-n-7/30">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Receipt size={16} className="text-n-4" />
                          <span className="text-n-1 font-medium">{invoice.id}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-n-1 font-medium">{invoice.projectTitle}</p>
                          <p className="text-n-4 text-xs">{invoice.milestone}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-n-1 font-semibold">${invoice.amount.toLocaleString()}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-n-4" />
                          <span className="text-n-3 text-sm">{new Date(invoice.dueDate).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(invoice.status)}`}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors">
                            <Eye size={14} className="text-n-3" />
                          </button>
                          <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors">
                            <Download size={14} className="text-n-3" />
                          </button>
                          {invoice.status === "pending" && (
                            <button className="p-2 bg-gradient-to-r from-color-1 to-color-2 rounded-lg">
                              <CreditCard size={14} className="text-white" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "payments" && (
          <div className="bg-n-8 rounded-xl border border-n-6 overflow-hidden">
            <div className="p-6 border-b border-n-6">
              <h2 className="text-lg font-semibold text-n-1">Payment History</h2>
              <p className="text-n-4 text-sm">Complete record of all payments made</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-n-7/50">
                  <tr>
                    <th className="text-left p-4 text-n-3 text-sm font-medium">Payment ID</th>
                    <th className="text-left p-4 text-n-3 text-sm font-medium">Project</th>
                    <th className="text-left p-4 text-n-3 text-sm font-medium">Amount</th>
                    <th className="text-left p-4 text-n-3 text-sm font-medium">Date</th>
                    <th className="text-left p-4 text-n-3 text-sm font-medium">Method</th>
                    <th className="text-left p-4 text-n-3 text-sm font-medium">Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="border-b border-n-6/50 hover:bg-n-7/30">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-green-400" />
                          <span className="text-n-1 font-medium">{payment.id}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-n-1 font-medium">{payment.projectTitle}</p>
                        <p className="text-n-4 text-xs">Invoice: {payment.invoiceId}</p>
                      </td>
                      <td className="p-4">
                        <span className="text-n-1 font-semibold">${payment.amount.toLocaleString()}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-n-3 text-sm">{new Date(payment.paymentDate).toLocaleDateString()}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-n-3 text-sm">{payment.method}</span>
                      </td>
                      <td className="p-4">
                        <code className="text-n-4 text-xs bg-n-7 px-2 py-1 rounded">{payment.reference}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-n-8 rounded-xl p-6 border border-n-6">
              <div className="flex items-center gap-3 mb-4">
                <PieChart size={20} className="text-color-1" />
                <h3 className="text-lg font-semibold text-n-1">Payment Distribution</h3>
              </div>
              <div className="h-64 bg-n-7/50 rounded-lg flex items-center justify-center">
                <p className="text-n-4">Payment distribution chart would be displayed here</p>
              </div>
            </div>
            
            <div className="bg-n-8 rounded-xl p-6 border border-n-6">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 size={20} className="text-color-1" />
                <h3 className="text-lg font-semibold text-n-1">Monthly Payments</h3>
              </div>
              <div className="h-64 bg-n-7/50 rounded-lg flex items-center justify-center">
                <p className="text-n-4">Monthly payment trends chart would be displayed here</p>
              </div>
            </div>
            
            <div className="lg:col-span-2 bg-n-8 rounded-xl p-6 border border-n-6">
              <h3 className="text-lg font-semibold text-n-1 mb-4">Payment Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-n-7/50 rounded-lg">
                  <p className="text-n-4 text-sm">Average Payment</p>
                  <p className="text-2xl font-bold text-n-1">$11,150</p>
                </div>
                <div className="p-4 bg-n-7/50 rounded-lg">
                  <p className="text-n-4 text-sm">Payment Frequency</p>
                  <p className="text-2xl font-bold text-n-1">2.1/month</p>
                </div>
                <div className="p-4 bg-n-7/50 rounded-lg">
                  <p className="text-n-4 text-sm">On-time Rate</p>
                  <p className="text-2xl font-bold text-n-1">87%</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClientBilling;
