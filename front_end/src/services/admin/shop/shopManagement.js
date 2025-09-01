// Shop management API service for admin dashboard
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const SHOP_API = {
  products: "/api/shop/products/",
  productDetail: (id) => `/api/shop/products/${id}/`,
  categories: "/api/shop/categories/",
  orders: "/api/shop/orders/",
  orderDetail: (id) => `/api/shop/orders/${id}/`,
  customers: "/api/shop/customers/",
  inventory: "/api/shop/inventory/",
  analytics: "/api/shop/analytics/",
};

class ShopManagementService {
  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('access_token'); // Fixed: use access_token
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  // Products
  async getProducts(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}${SHOP_API.products}${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  }

  async getProduct(id) {
    try {
      const response = await fetch(`${API_BASE_URL}${SHOP_API.productDetail(id)}`, {
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Get product error:', error);
      throw error;
    }
  }

  async createProduct(productData) {
    try {
      const response = await fetch(`${API_BASE_URL}${SHOP_API.products}`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(productData),
      });
      if (!response.ok) {
        throw new Error(`Failed to create product: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Create product error:', error);
      throw error;
    }
  }

  async updateProduct(id, productData) {
    try {
      const response = await fetch(`${API_BASE_URL}${SHOP_API.productDetail(id)}`, {
        method: "PATCH",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(productData),
      });
      if (!response.ok) {
        throw new Error(`Failed to update product: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Update product error:', error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const response = await fetch(`${API_BASE_URL}${SHOP_API.productDetail(id)}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error(`Failed to delete product: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error('Delete product error:', error);
      throw error;
    }
  }

  // Orders
  async getOrders(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}${SHOP_API.orders}${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Get orders error:', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      const response = await fetch(`${API_BASE_URL}${SHOP_API.orderDetail(orderId)}`, {
        method: "PATCH",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error(`Failed to update order status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Update order status error:', error);
      throw error;
    }
  }

  // Categories
  async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}${SHOP_API.categories}`, {
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  }

  // Analytics
  async getShopAnalytics() {
    try {
      const response = await fetch(`${API_BASE_URL}${SHOP_API.analytics}`, {
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch shop analytics: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Get shop analytics error:', error);
      throw error;
    }
  }
}

export default new ShopManagementService();