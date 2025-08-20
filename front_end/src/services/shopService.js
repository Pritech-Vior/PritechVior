// Shop API Service for connecting to Django backend
const BASE_URL = `${
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"
}/api/shop`;

class ShopService {
  // Generic fetch method with error handling (for authenticated requests)
  async fetchWithAuth(url, options = {}) {
    try {
      const token = localStorage.getItem("access_token");
      const defaultHeaders = {
        "Content-Type": "application/json",
      };

      if (token) {
        defaultHeaders["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Generic fetch method for public endpoints (no authentication required)
  async fetchPublic(url, options = {}) {
    try {
      const defaultHeaders = {
        "Content-Type": "application/json",
      };

      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Public API request failed:", error);
      throw error;
    }
  }

  // Categories
  async getCategories() {
    return this.fetchWithAuth(`${BASE_URL}/categories/`);
  }

  async getCategory(id) {
    return this.fetchWithAuth(`${BASE_URL}/categories/${id}/`);
  }

  // Brands
  async getBrands() {
    return this.fetchWithAuth(`${BASE_URL}/brands/`);
  }

  async getBrand(id) {
    return this.fetchWithAuth(`${BASE_URL}/brands/${id}/`);
  }

  // Product Types
  async getProductTypes() {
    return this.fetchWithAuth(`${BASE_URL}/product-types/`);
  }

  // Platforms (public endpoint - no auth required)
  async getPlatforms() {
    return this.fetchPublic(`${BASE_URL}/platforms/`);
  }

  // Products
  async getProducts(params = {}) {
    const searchParams = new URLSearchParams();

    // Add filtering parameters
    if (params.category) searchParams.append("category", params.category);
    if (params.brand) searchParams.append("brand", params.brand);
    if (params.product_type)
      searchParams.append("product_type", params.product_type);
    if (params.search) searchParams.append("search", params.search);
    if (params.min_price) searchParams.append("min_price", params.min_price);
    if (params.max_price) searchParams.append("max_price", params.max_price);
    if (params.featured !== undefined)
      searchParams.append("featured", params.featured);
    if (params.trending !== undefined)
      searchParams.append("trending", params.trending);
    if (params.new_arrival !== undefined)
      searchParams.append("new_arrival", params.new_arrival);
    if (params.availability)
      searchParams.append("availability", params.availability);
    if (params.ordering) searchParams.append("ordering", params.ordering);
    if (params.page) searchParams.append("page", params.page);
    if (params.page_size) searchParams.append("page_size", params.page_size);

    const queryString = searchParams.toString();
    const url = queryString
      ? `${BASE_URL}/products/?${queryString}`
      : `${BASE_URL}/products/`;

    return this.fetchWithAuth(url);
  }

  async getProduct(id) {
    return this.fetchWithAuth(`${BASE_URL}/products/${id}/`);
  }

  // Get product by ID (for cart functionality)
  async getProductById(id) {
    return this.fetchWithAuth(`${BASE_URL}/products/${id}/`);
  }

  // Alias for getting product by slug (since ProductViewSet now uses slug as lookup_field)
  async getProductBySlug(slug) {
    return this.getProduct(slug);
  }

  async getFeaturedProducts() {
    return this.getProducts({ featured: true, page_size: 8 });
  }

  async getTrendingProducts() {
    return this.getProducts({ trending: true, page_size: 8 });
  }

  async getNewArrivals() {
    return this.getProducts({ new_arrival: true, page_size: 8 });
  }

  // Product Reviews
  async getProductReviews(productSlug) {
    return this.fetchWithAuth(`${BASE_URL}/products/${productSlug}/reviews/`);
  }

  async addProductReview(productSlug, reviewData) {
    return this.fetchWithAuth(`${BASE_URL}/products/${productSlug}/reviews/`, {
      method: "POST",
      body: JSON.stringify(reviewData),
    });
  }

  // Cart Management
  async getCart() {
    return this.fetchWithAuth(`${BASE_URL}/cart/`);
  }

  async addToCart(productId, quantity = 1, customSpecs = {}) {
    return this.fetchWithAuth(`${BASE_URL}/cart/add_item/`, {
      method: "POST",
      body: JSON.stringify({
        product_id: productId,
        quantity,
        custom_specifications: customSpecs,
      }),
    });
  }

  async updateCartItem(itemId, quantity) {
    return this.fetchWithAuth(`${BASE_URL}/cart/items/${itemId}/`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(itemId) {
    return this.fetchWithAuth(`${BASE_URL}/cart/items/${itemId}/`, {
      method: "DELETE",
    });
  }

  async clearCart() {
    return this.fetchWithAuth(`${BASE_URL}/cart/clear/`, {
      method: "DELETE",
    });
  }

  // Wishlist Management
  async getWishlist() {
    return this.fetchWithAuth(`${BASE_URL}/wishlist/`);
  }

  async addToWishlist(productId) {
    return this.fetchWithAuth(`${BASE_URL}/wishlist/add/`, {
      method: "POST",
      body: JSON.stringify({ product_id: productId }),
    });
  }

  async removeFromWishlist(productId) {
    return this.fetchWithAuth(`${BASE_URL}/wishlist/remove/`, {
      method: "POST",
      body: JSON.stringify({ product_id: productId }),
    });
  }

  // Orders
  async getOrders() {
    return this.fetchWithAuth(`${BASE_URL}/orders/`);
  }

  async getOrder(id) {
    return this.fetchWithAuth(`${BASE_URL}/orders/${id}/`);
  }

  async createOrder(orderData) {
    return this.fetchWithAuth(`${BASE_URL}/orders/`, {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  // Product Requests
  async getProductRequests() {
    return this.fetchWithAuth(`${BASE_URL}/product-requests/`);
  }

  async createProductRequest(requestData) {
    return this.fetchWithAuth(`${BASE_URL}/product-requests/`, {
      method: "POST",
      body: JSON.stringify(requestData),
    });
  }

  async getProductRequest(id) {
    return this.fetchWithAuth(`${BASE_URL}/product-requests/${id}/`);
  }

  // Custom Order Requests
  async createCustomOrderRequest(requestData) {
    return this.fetchWithAuth(`${BASE_URL}/custom-orders/`, {
      method: "POST",
      body: JSON.stringify(requestData),
    });
  }

  async getCustomOrderRequests() {
    return this.fetchWithAuth(`${BASE_URL}/custom-orders/`);
  }

  // Shipping Methods
  async getShippingMethods() {
    return this.fetchWithAuth(`${BASE_URL}/shipping-methods/`);
  }

  // Search functionality
  async searchProducts(query, filters = {}) {
    return this.getProducts({ search: query, ...filters });
  }

  // Price range for filtering
  async getProductPriceRange() {
    return this.fetchWithAuth(`${BASE_URL}/products/price-range/`);
  }
}

export default new ShopService();
