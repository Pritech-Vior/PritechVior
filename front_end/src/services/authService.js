// Authentication API service
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

class AuthService {
  // Get stored tokens
  getTokens() {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    return { accessToken, refreshToken };
  }

  // Store tokens
  setTokens(accessToken, refreshToken) {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
  }

  // Remove tokens
  clearTokens() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  }

  // Get stored user
  getUser() {
    const userJson = localStorage.getItem("user");
    return userJson ? JSON.parse(userJson) : null;
  }

  // Store user
  setUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  // Check if user is authenticated
  isAuthenticated() {
    const { accessToken } = this.getTokens();
    return !!accessToken;
  }

  // Get auth headers
  getAuthHeaders() {
    const { accessToken } = this.getTokens();
    return {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    };
  }

  // Refresh access token
  async refreshToken() {
    const { refreshToken } = this.getTokens();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/token/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh: refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();
      this.setTokens(data.access, refreshToken);
      return data.access;
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  // Make authenticated API request
  async apiRequest(endpoint, options = {}) {
    const { accessToken } = this.getTokens();

    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      let response = await fetch(`${API_BASE_URL}${endpoint}`, config);

      // If token expired, try to refresh
      if (response.status === 401 && accessToken) {
        try {
          await this.refreshToken();
          config.headers = this.getAuthHeaders();
          response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          this.clearTokens();
          window.location.href = "/auth/login";
          throw refreshError;
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Register user
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/auth/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Use the improved error message from backend
        const errorMessage =
          errorData.message || errorData.error || "Registration failed";
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Store tokens and user data
      this.setTokens(data.tokens.access, data.tokens.refresh);
      this.setUser(data.user);

      return data;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  }

  // Login user
  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
      }

      const data = await response.json();

      // Store tokens and user data
      this.setTokens(data.access, data.refresh);
      this.setUser(data.user);

      return data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  // Google OAuth login
  async googleLogin(googleToken, role = "guest") {
    try {
      const response = await fetch(`${API_BASE_URL}/users/auth/google/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          google_token: googleToken,
          role: role,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Google login failed");
      }

      const data = await response.json();

      // Store tokens and user data
      this.setTokens(data.tokens.access, data.tokens.refresh);
      this.setUser(data.user);

      return data;
    } catch (error) {
      console.error("Google login failed:", error);
      throw error;
    }
  }

  // Logout user
  async logout() {
    const { refreshToken } = this.getTokens();

    try {
      if (refreshToken) {
        await fetch(`${API_BASE_URL}/users/auth/logout/`, {
          method: "POST",
          headers: this.getAuthHeaders(),
          body: JSON.stringify({
            refresh_token: refreshToken,
          }),
        });
      }
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      this.clearTokens();
    }
  }

  // Get available roles
  async getRoles() {
    try {
      const response = await fetch(`${API_BASE_URL}/users/auth/roles/`);
      if (!response.ok) {
        throw new Error("Failed to fetch roles");
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      throw error;
    }
  }

  // Get current user profile
  async getProfile() {
    return this.apiRequest("/users/api/profiles/me/");
  }

  // Update user profile
  async updateProfile(profileData) {
    return this.apiRequest("/users/api/profiles/me/", {
      method: "PATCH",
      body: JSON.stringify(profileData),
    });
  }

  // Change password
  async changePassword(passwordData) {
    return this.apiRequest("/users/auth/password-change/", {
      method: "POST",
      body: JSON.stringify(passwordData),
    });
  }

  // Request password reset
  async requestPasswordReset(email) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/users/auth/password-reset/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Password reset request failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Password reset request failed:", error);
      throw error;
    }
  }

  // Verify email
  async verifyEmail(token) {
    return this.apiRequest("/users/auth/verify-email/", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  }
}

export default new AuthService();
