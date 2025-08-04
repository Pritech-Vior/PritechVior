import React, { useState, useEffect } from "react";
import { 
  DollarSign,
  CreditCard,
  Calendar,
  Receipt,
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  Search,
  TrendingUp,
  TrendingDown,
  FileText,
  Building2,
  GraduationCap,
  User,
  Mail,
  Phone
} from "lucide-react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";

const ClientPayments = ({ userRoles = ["client"] }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  const payments = [
    {
      id: 1,
      invoiceNumber: "INV-2025-001",
      projectTitle: "Hospital Management System",
      projectType: "Final Year Project",
      amount: 10000,
      paid: 3000,
      due: 7000,
      status: "partial",
      dueDate: "2025-02-15",
      paymentDate: "2025-01-05",
      method: "bank_transfer",
      description: "Initial payment for hospital management system development",
      milestones: [
        { name: "Project Initiation", amount: 3000, status: "paid", date: "2025-01-05" },
        { name: "Database Design", amount: 2500, status: "pending", date: "2025-02-15" },
        { name: "Frontend Development", amount: 2500, status: "pending", date: "2025-03-15" },
        { name: "Testing & Deployment", amount: 2000, status: "pending", date: "2025-04-15" }
      ]
    },
    {
      id: 2,
      invoiceNumber: "INV-2024-089",
      projectTitle: "Inventory Management Platform",
      projectType: "Enterprise",
      amount: 35000,
      paid: 35000,
      due: 0,
      status: "paid",
      dueDate: "2024-12-30",
      paymentDate: "2024-12-28",
      method: "credit_card",
      description: "Full payment for inventory management platform development",
      milestones: [
        { name: "Project Setup", amount: 10000, status: "paid", date: "2024-11-15" },
        { name: "Core Development", amount: 15000, status: "paid", date: "2024-12-01" },
        { name: "Integration & Testing", amount: 7000, status: "paid", date: "2024-12-15" },
        { name: "Deployment & Support", amount: 3000, status: "paid", date: "2024-12-28" }
      ]
    },
    {
      id: 3,
      invoiceNumber: "INV-2025-002",
      projectTitle: "E-Learning Platform",
      projectType: "Enterprise",
      amount: 65000,
      paid: 0,
      due: 65000,
      status: "overdue",
      dueDate: "2025-01-01",
      paymentDate: null,
      method: null,
      description: "Payment for comprehensive e-learning platform development",
      milestones: [
        { name: "Project Planning", amount: 15000, status: "overdue", date: "2025-01-01" },
        { name: "Platform Development", amount: 25000, status: "pending", date: "2025-02-15" },
        { name: "Content Management", amount: 15000, status: "pending", date: "2025-03-15" },
        { name: "Launch & Training", amount: 10000, status: "pending", date: "2025-04-01" }
      ]
    },
    {
      id: 4,
      invoiceNumber: "INV-2024-076",
      projectTitle: "Crypto Trading Bot",
      projectType: "Final Year Project",
      amount: 7500,
      paid: 7500,
      due: 0,
      status: "paid",
      dueDate: "2024-12-15",
      paymentDate: "2024-12-10",
      method: "paypal",
      description: "Complete payment for automated cryptocurrency trading bot",
      milestones: [
        { name: "Algorithm Development", amount: 3000, status: "paid", date: "2024-11-20" },
        { name: "Bot Implementation", amount: 2500, status: "paid", date: "2024-12-05" },
        { name: "Testing & Optimization", amount: 1500, status: "paid", date: "2024-12-10" },
        { name: "Documentation", amount: 500, status: "paid", date: "2024-12-10" }
      ]
    },
    {
      id: 5,
      invoiceNumber: "INV-2025-003",
      projectTitle: "Social Media Analytics Tool",
      projectType: "Enterprise",
      amount: 28000,
      paid: 14000,
      due: 14000,
      status: "partial",
      dueDate: "2025-01-30",
      paymentDate: "2024-12-20",
      method: "bank_transfer",
      description: "50% advance payment for social media analytics development",
      milestones: [
        { name: "Initial Setup", amount: 7000, status: "paid", date: "2024-12-20" },
        { name: "Data Collection Module", amount: 7000, status: "paid", date: "2024-12-20" },
        { name: "Analytics Engine", amount: 8000, status: "pending", date: "2025-01-30" },
        { name: "Dashboard & Reports", amount: 6000, status: "pending", date: "2025-02-15" }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "paid": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "partial": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "pending": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "overdue": return "bg-red-500/10 text-red-400 border-red-500/20";
      default: return "bg-n-7 text-n-3 border-n-6";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid": return CheckCircle;
      case "partial": return Clock;
      case "pending": return Calendar;
      case "overdue": return AlertCircle;
      default: return Receipt;
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "credit_card": return CreditCard;
      case "bank_transfer": return Building2;
      case "paypal": return DollarSign;
      default: return Receipt;
    }
  };

  const getPaymentMethodName = (method) => {
    switch (method) {
      case "credit_card": return "Credit Card";
      case "bank_transfer": return "Bank Transfer";
      case "paypal": return "PayPal";
      default: return "Not Specified";
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesTab = activeTab === "all" || payment.status === activeTab;
    const matchesSearch = payment.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesDate = true;
    if (dateFilter !== "all") {
      const paymentDate = new Date(payment.paymentDate || payment.dueDate);
      const now = new Date();
      const monthsAgo = new Date(now.getFullYear(), now.getMonth() - parseInt(dateFilter), now.getDate());
      matchesDate = paymentDate >= monthsAgo;
    }
    
    return matchesTab && matchesSearch && matchesDate;
  });

  // Calculate summary statistics
  const totalPaid = payments.reduce((sum, payment) => sum + payment.paid, 0);
  const totalDue = payments.reduce((sum, payment) => sum + payment.due, 0);
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const overdueAmount = payments.filter(p => p.status === "overdue").reduce((sum, payment) => sum + payment.due, 0);

  const statusCounts = {
    all: payments.length,
    paid: payments.filter(p => p.status === "paid").length,
    partial: payments.filter(p => p.status === "partial").length,
    pending: payments.filter(p => p.status === "pending").length,
    overdue: payments.filter(p => p.status === "overdue").length
  };

  return (
    <DashboardLayout title="Payments & Billing" userRole="client" userRoles={userRoles}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-n-1">Payments & Billing</h1>
            <p className="text-n-3 mt-1">Track your payments, invoices, and billing history</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-n-8 rounded-xl p-6 border border-n-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle size={24} className="text-green-400" />
              </div>
              <TrendingUp size={16} className="text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-n-1 mb-1">${totalPaid.toLocaleString()}</h3>
            <p className="text-n-3 text-sm">Total Paid</p>
          </div>

          <div className="bg-n-8 rounded-xl p-6 border border-n-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <Clock size={24} className="text-yellow-400" />
              </div>
              <Calendar size={16} className="text-yellow-400" />
            </div>
            <h3 className="text-2xl font-bold text-n-1 mb-1">${totalDue.toLocaleString()}</h3>
            <p className="text-n-3 text-sm">Amount Due</p>
          </div>

          <div className="bg-n-8 rounded-xl p-6 border border-n-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                <AlertCircle size={24} className="text-red-400" />
              </div>
              <TrendingDown size={16} className="text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-n-1 mb-1">${overdueAmount.toLocaleString()}</h3>
            <p className="text-n-3 text-sm">Overdue</p>
          </div>

          <div className="bg-n-8 rounded-xl p-6 border border-n-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <DollarSign size={24} className="text-blue-400" />
              </div>
              <Receipt size={16} className="text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-n-1 mb-1">${totalAmount.toLocaleString()}</h3>
            <p className="text-n-3 text-sm">Total Contracted</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: `All (${statusCounts.all})` },
              { key: "paid", label: `Paid (${statusCounts.paid})` },
              { key: "partial", label: `Partial (${statusCounts.partial})` },
              { key: "pending", label: `Pending (${statusCounts.pending})` },
              { key: "overdue", label: `Overdue (${statusCounts.overdue})` }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  activeTab === tab.key
                    ? "bg-gradient-to-r from-color-1 to-color-2 text-white"
                    : "bg-n-7 text-n-3 hover:text-n-1"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="flex gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-n-4" />
              <input
                type="text"
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-n-7 border border-n-6 rounded-lg pl-10 pr-4 py-2 text-n-1 text-sm w-48"
              />
            </div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-n-7 border border-n-6 rounded-lg px-3 py-2 text-n-1 text-sm"
            >
              <option value="all">All Time</option>
              <option value="1">Last Month</option>
              <option value="3">Last 3 Months</option>
              <option value="6">Last 6 Months</option>
              <option value="12">Last Year</option>
            </select>
          </div>
        </div>

        {/* Payments List */}
        <div className="space-y-4">
          {filteredPayments.map((payment) => {
            const StatusIcon = getStatusIcon(payment.status);
            const PaymentMethodIcon = getPaymentMethodIcon(payment.method);
            const projectTypeIcon = payment.projectType === "Enterprise" ? Building2 : GraduationCap;
            const ProjectTypeIcon = projectTypeIcon;
            
            return (
              <div key={payment.id} className="bg-n-8 rounded-xl border border-n-6 hover:border-color-1/20 transition-all">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-color-1 to-color-2 rounded-lg flex items-center justify-center">
                        <StatusIcon size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-n-1 font-medium flex items-center gap-2">
                          {payment.projectTitle}
                          <ProjectTypeIcon size={14} className="text-n-4" />
                        </h3>
                        <p className="text-n-4 text-sm">{payment.invoiceNumber}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                      <p className="text-n-3 text-sm mt-1">{payment.projectType}</p>
                    </div>
                  </div>
                  
                  <p className="text-n-3 text-sm mb-4">{payment.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-n-4">Total Amount</p>
                      <p className="text-n-1 font-semibold">${payment.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-n-4">Paid</p>
                      <p className="text-green-400 font-semibold">${payment.paid.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-n-4">Due</p>
                      <p className={`font-semibold ${payment.due > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                        ${payment.due.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-n-4">Due Date</p>
                      <p className="text-n-1 font-semibold">{new Date(payment.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Payment Method */}
                  {payment.method && (
                    <div className="flex items-center gap-2 mb-4">
                      <PaymentMethodIcon size={14} className="text-n-4" />
                      <span className="text-n-3 text-sm">Paid via {getPaymentMethodName(payment.method)}</span>
                      {payment.paymentDate && (
                        <span className="text-n-4 text-sm">on {new Date(payment.paymentDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  )}

                  {/* Milestones */}
                  <div className="mb-4">
                    <p className="text-n-3 text-sm mb-2">Payment Milestones:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {payment.milestones.map((milestone, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-n-7 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              milestone.status === "paid" ? "bg-green-400" :
                              milestone.status === "overdue" ? "bg-red-400" : "bg-yellow-400"
                            }`} />
                            <span className="text-n-1 text-sm">{milestone.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-n-1 text-sm font-medium">${milestone.amount.toLocaleString()}</p>
                            <p className="text-n-4 text-xs">{new Date(milestone.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-full bg-n-6 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-color-1 to-color-2 h-2 rounded-full transition-all"
                          style={{ width: `${(payment.paid / payment.amount) * 100}%` }}
                        />
                      </div>
                      <span className="text-n-3 text-sm whitespace-nowrap">
                        {Math.round((payment.paid / payment.amount) * 100)}% paid
                      </span>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors">
                        <Download size={14} className="text-n-3" />
                      </button>
                      <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors">
                        <FileText size={14} className="text-n-3" />
                      </button>
                      {payment.status !== "paid" && (
                        <button className="px-3 py-1 bg-gradient-to-r from-color-1 to-color-2 text-white rounded-lg text-xs">
                          Pay Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPayments.length === 0 && (
          <div className="bg-n-8 rounded-xl p-12 text-center border border-n-6">
            <Receipt size={48} className="text-n-4 mx-auto mb-4" />
            <h3 className="text-n-1 font-medium mb-2">No payments found</h3>
            <p className="text-n-4 text-sm">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClientPayments;
