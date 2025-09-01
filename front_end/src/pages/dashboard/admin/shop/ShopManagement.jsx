import React, { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Package, 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  RefreshCw,
  Download,
  Grid,
  List,
  AlertCircle,
  CheckCircle,
  Clock,
  Star
} from "lucide-react";
import DashboardLayout from "../../../../components/dashboard/DashboardLayout";
import Card from "../../../../components/Card";
import Table from "../../../../components/Table";
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import shopManagement from "../../../../services/admin/shop/shopManagement";

const ShopManagement = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [viewMode, setViewMode] = useState("cards");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Data states
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  
  // Filter states
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === "products") {
        const [productsData, categoriesData] = await Promise.all([
          shopManagement.getProducts(),
          shopManagement.getCategories()
        ]);
        setProducts(Array.isArray(productsData) ? productsData : productsData.results || []);
        setCategories(categoriesData);
      } else if (activeTab === "orders") {
        const ordersData = await shopManagement.getOrders();
        setOrders(Array.isArray(ordersData) ? ordersData : ordersData.results || []);
      } else if (activeTab === "analytics") {
        const analyticsData = await shopManagement.getShopAnalytics();
        setAnalytics(analyticsData);
      }
    } catch (err) {
      setError("Failed to load shop data");
      console.error('Load shop data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await loadData();
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await shopManagement.deleteProduct(productId);
        setProducts(prev => prev.filter(product => product.id !== productId));
      } catch (err) {
        alert("Failed to delete product.");
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await shopManagement.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      alert("Failed to update order status.");
    }
  };

  // Filter functions
  const getFilteredProducts = () => {
    return products.filter(product => {
      const matchesSearch = search === "" || 
        product.name?.toLowerCase().includes(search.toLowerCase()) ||
        product.description?.toLowerCase().includes(search.toLowerCase());
      
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || product.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  };

  const getFilteredOrders = () => {
    return orders.filter(order => {
      const matchesSearch = search === "" || 
        order.order_number?.toLowerCase().includes(search.toLowerCase()) ||
        order.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
        order.customer?.email?.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      out_of_stock: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status?.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return `TSH ${amount?.toLocaleString() || '0'}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <DashboardLayout title="Shop Management" userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-n-1">Shop Management</h1>
            <p className="text-n-3 mt-1">Manage products, orders, and shop analytics</p>
          </div>
          <div className="flex gap-3">
            <Button
              icon={<RefreshCw size={16} className={loading ? "animate-spin" : ""} />}
              onClick={handleRefresh}
              disabled={loading}
              variant="secondary"
            >
              Refresh
            </Button>
            <Button
              icon={<Plus size={16} />}
              onClick={() => {/* Navigate to create product */}}
            >
              {activeTab === "products" ? "New Product" : "New Order"}
            </Button>
          </div>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-n-4 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-n-1">{formatCurrency(analytics.total_revenue)}</p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <DollarSign size={20} className="text-white" />
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-n-4 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold text-n-1">{analytics.total_orders}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <ShoppingCart size={20} className="text-white" />
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-n-4 text-sm">Total Products</p>
                  <p className="text-2xl font-bold text-n-1">{analytics.total_products}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Package size={20} className="text-white" />
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-n-4 text-sm">Conversion Rate</p>
                  <p className="text-2xl font-bold text-n-1">{analytics.conversion_rate}%</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <TrendingUp size={20} className="text-white" />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-n-7 p-1 rounded-lg w-fit">
          {[
            { key: "products", label: "Products", count: products.length },
            { key: "orders", label: "Orders", count: orders.length },
            { key: "analytics", label: "Analytics" }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === tab.key 
                  ? "bg-gradient-to-r from-color-1 to-color-2 text-white" 
                  : "text-n-3 hover:text-n-1"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="bg-n-6 text-n-2 px-2 py-0.5 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Filters */}
        {(activeTab === "products" || activeTab === "orders") && (
          <div className="bg-n-8 rounded-xl p-4 border border-n-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              <div className="md:col-span-2">
                <Input
                  placeholder={`Search ${activeTab}...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full"
                  icon={<Search size={16} />}
                />
              </div>
              
              {activeTab === "products" && (
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-n-7 border border-n-6 rounded-lg px-3 py-2 text-n-1 text-sm"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-n-7 border border-n-6 rounded-lg px-3 py-2 text-n-1 text-sm"
              >
                <option value="all">All Status</option>
                {activeTab === "products" ? (
                  <>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </>
                ) : (
                  <>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </>
                )}
              </select>

              <div className="flex gap-2">
                {activeTab === "products" && (
                  <button
                    onClick={() => setViewMode(viewMode === "table" ? "cards" : "table")}
                    className="p-2 bg-n-7 rounded-lg hover:bg-n-6 border border-n-6"
                  >
                    {viewMode === "table" ? <Grid size={16} className="text-n-3" /> : <List size={16} className="text-n-3" />}
                  </button>
                )}
                <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6 border border-n-6">
                  <Download size={16} className="text-n-3" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="animate-spin mx-auto mb-4" size={32} />
            <p className="text-n-3">Loading...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto mb-4 text-red-400" size={32} />
            <p className="text-red-400">{error}</p>
            <Button onClick={handleRefresh} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : (
          <>
            {/* Products Tab */}
            {activeTab === "products" && (
              <>
                {viewMode === "cards" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getFilteredProducts().map((product) => (
                      <Card key={product.id} className="p-6">
                        <div className="mb-4">
                          <img 
                            src={product.image || "/api/placeholder/300/200"} 
                            alt={product.name}
                            className="w-full h-40 object-cover rounded-lg mb-3"
                          />
                          <h3 className="text-lg font-semibold text-n-1 mb-2">
                            {product.name}
                          </h3>
                          <p className="text-n-4 text-sm mb-3 line-clamp-2">
                            {product.description}
                          </p>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-n-1">
                              {formatCurrency(product.price)}
                            </span>
                            {getStatusBadge(product.status)}
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-n-4">
                            <span>Stock: {product.stock}</span>
                            <span>Sales: {product.sales_count || 0}</span>
                          </div>
                          
                          <div className="text-sm text-n-4">
                            Category: {product.category}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" icon={<Eye size={14} />}>
                            View
                          </Button>
                          <Button size="sm" icon={<Edit size={14} />} variant="secondary">
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            icon={<Trash2 size={14} />} 
                            variant="danger"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="bg-n-8 rounded-xl border border-n-6 overflow-hidden">
                    <Table
                      columns={[
                        { key: "product", label: "Product" },
                        { key: "category", label: "Category" },
                        { key: "price", label: "Price" },
                        { key: "stock", label: "Stock" },
                        { key: "sales", label: "Sales" },
                        { key: "status", label: "Status" },
                        { key: "actions", label: "Actions" }
                      ]}
                      data={getFilteredProducts().map((product) => ({
                        product: (
                          <div className="flex items-center gap-3">
                            <img 
                              src={product.image || "/api/placeholder/60/60"} 
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div>
                              <div className="font-medium text-n-1">{product.name}</div>
                              <div className="text-sm text-n-4 truncate max-w-xs">
                                {product.description}
                              </div>
                            </div>
                          </div>
                        ),
                        category: product.category,
                        price: formatCurrency(product.price),
                        stock: product.stock,
                        sales: product.sales_count || 0,
                        status: getStatusBadge(product.status),
                        actions: (
                          <div className="flex gap-1">
                            <Button size="sm" icon={<Eye size={14} />} />
                            <Button size="sm" icon={<Edit size={14} />} variant="secondary" />
                            <Button 
                              size="sm" 
                              icon={<Trash2 size={14} />} 
                              variant="danger"
                              onClick={() => handleDeleteProduct(product.id)}
                            />
                          </div>
                        )
                      }))}
                    />
                  </div>
                )}
              </>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="bg-n-8 rounded-xl border border-n-6 overflow-hidden">
                <Table
                  columns={[
                    { key: "order", label: "Order" },
                    { key: "customer", label: "Customer" },
                    { key: "total", label: "Total" },
                    { key: "status", label: "Status" },
                    { key: "date", label: "Date" },
                    { key: "actions", label: "Actions" }
                  ]}
                  data={getFilteredOrders().map((order) => ({
                    order: (
                      <div>
                        <div className="font-medium text-n-1">{order.order_number}</div>
                        <div className="text-sm text-n-4">
                          {order.items?.length || 0} items
                        </div>
                      </div>
                    ),
                    customer: (
                      <div>
                        <div className="font-medium text-n-1">{order.customer?.name}</div>
                        <div className="text-sm text-n-4">{order.customer?.email}</div>
                      </div>
                    ),
                    total: formatCurrency(order.total_amount),
                    status: getStatusBadge(order.status),
                    date: formatDate(order.created_at),
                    actions: (
                      <div className="flex gap-1">
                        <Button size="sm" icon={<Eye size={14} />} />
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="bg-n-7 border border-n-6 rounded px-2 py-1 text-xs text-n-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    )
                  }))}
                />
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && analytics && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-n-1 mb-4">Top Products</h3>
                  <div className="space-y-4">
                    {analytics.top_products?.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-n-7 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-color-1 to-color-2 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-n-1 font-medium">{product.name}</p>
                            <p className="text-n-4 text-sm">{product.sales} sales</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-n-1 font-semibold">{formatCurrency(product.revenue)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Sales Chart */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-n-1 mb-4">Monthly Sales</h3>
                  <div className="h-64 bg-n-7 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp size={48} className="text-n-4 mx-auto mb-2" />
                      <p className="text-n-4">Sales Chart</p>
                      <p className="text-n-5 text-sm">Chart visualization would go here</p>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && !error && (
          ((activeTab === "products" && getFilteredProducts().length === 0) ||
           (activeTab === "orders" && getFilteredOrders().length === 0))
        ) && (
          <div className="text-center py-12">
            <div className="text-n-4 mb-4">
              {activeTab === "products" ? "No products found" : "No orders found"}
            </div>
            <Button icon={<Plus size={16} />}>
              {activeTab === "products" ? "Create Product" : "View All Orders"}
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ShopManagement;