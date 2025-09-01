// Users management API service for admin dashboard
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const USERS_API = {
  list: "/api/admin/users/",
  detail: (id) => `/api/admin/users/${id}/`,
  create: "/api/admin/users/",
  update: (id) => `/api/admin/users/${id}/`,
  delete: (id) => `/api/admin/users/${id}/`,
  activate: (id) => `/api/admin/users/${id}/activate/`,
  deactivate: (id) => `/api/admin/users/${id}/deactivate/`,
  changeRole: (id) => `/api/admin/users/${id}/change_role/`,
  resetPassword: (id) => `/api/admin/users/${id}/reset_password/`,
  stats: "/api/admin/users/stats/",
};

class UsersManagementService {
  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('access_token'); // Fixed: use access_token
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  // Users CRUD operations
  async getUsers(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}${USERS_API.list}${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  }

  async getUser(id) {
    try {
      const response = await fetch(`${API_BASE_URL}${USERS_API.detail(id)}`, {
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  }

  async createUser(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}${USERS_API.create}`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error(`Failed to create user: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  }

  async updateUser(id, userData) {
    try {
      const response = await fetch(`${API_BASE_URL}${USERS_API.update(id)}`, {
        method: "PATCH",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error(`Failed to update user: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      const response = await fetch(`${API_BASE_URL}${USERS_API.delete(id)}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  }

  // User management actions
  async activateUser(id) {
    try {
      const response = await fetch(`${API_BASE_URL}${USERS_API.activate(id)}`, {
        method: "POST",
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error(`Failed to activate user: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Activate user error:', error);
      throw error;
    }
  }

  async deactivateUser(id) {
    try {
      const response = await fetch(`${API_BASE_URL}${USERS_API.deactivate(id)}`, {
        method: "POST",
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error(`Failed to deactivate user: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Deactivate user error:', error);
      throw error;
    }
  }

  async changeUserRole(id, role) {
    try {
      const response = await fetch(`${API_BASE_URL}${USERS_API.changeRole(id)}`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ role }),
      });
      if (!response.ok) {
        throw new Error(`Failed to change user role: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Change user role error:', error);
      throw error;
    }
  }

  async resetUserPassword(id) {
    try {
      const response = await fetch(`${API_BASE_URL}${USERS_API.resetPassword(id)}`, {
        method: "POST",
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error(`Failed to reset user password: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  // Statistics
  async getUserStats() {
    try {
      const response = await fetch(`${API_BASE_URL}${USERS_API.stats}`, {
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch user stats: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Get user stats error:', error);
      throw error;
    }
  }

  // Bulk operations
  async bulkUpdateUsers(userIds, updateData) {
    try {
      const promises = userIds.map(id => 
        this.updateUser(id, updateData)
      );
      return await Promise.all(promises);
    } catch (error) {
      console.error('Bulk update error:', error);
      throw error;
    }
  }

  async bulkDeleteUsers(userIds) {
    try {
      const promises = userIds.map(id => 
        this.deleteUser(id)
      );
      return await Promise.all(promises);
    } catch (error) {
      console.error('Bulk delete error:', error);
      throw error;
    }
  }

  async bulkActivateUsers(userIds) {
    try {
      const promises = userIds.map(id => 
        this.activateUser(id)
      );
      return await Promise.all(promises);
    } catch (error) {
      console.error('Bulk activate error:', error);
      throw error;
    }
  }

  async bulkDeactivateUsers(userIds) {
    try {
      const promises = userIds.map(id => 
        this.deactivateUser(id)
      );
      return await Promise.all(promises);
    } catch (error) {
      console.error('Bulk deactivate error:', error);
      throw error;
    }
  }
}

export default new UsersManagementService();