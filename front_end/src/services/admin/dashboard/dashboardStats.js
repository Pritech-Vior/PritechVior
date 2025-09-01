// Dashboard statistics API service for admin dashboard
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const DASHBOARD_API = {
  stats: "/api/admin/dashboard/stats/",
  publicData: "/api/projects/public-data/",
  systemHealth: "/api/admin/system/health/",
  recentActivity: "/api/admin/activity/recent/",
};

class DashboardStatsService {
  // Get access token from localStorage
  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  // Get dashboard statistics
  async getStats() {
    try {
      const token = this.getAccessToken();
      console.log('Access token from localStorage:', token ? 'Token exists' : 'No token found');
      
      const response = await fetch(`${API_BASE_URL}${DASHBOARD_API.stats}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Dashboard stats response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard stats: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Dashboard stats error:', error);
      throw error;
    }
  }

  // Get public data (categories, technologies, etc.)
  async getPublicData() {
    try {
      const response = await fetch(`${API_BASE_URL}${DASHBOARD_API.publicData}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch public data: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Public data error:', error);
      throw error;
    }
  }

  // Get system health status
  async getSystemHealth() {
    try {
      const token = this.getAccessToken();
      const response = await fetch(`${API_BASE_URL}${DASHBOARD_API.systemHealth}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch system health: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('System health error:', error);
      throw error;
    }
  }

  // Get recent activity
  async getRecentActivity() {
    try {
      const token = this.getAccessToken();
      const response = await fetch(`${API_BASE_URL}${DASHBOARD_API.recentActivity}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch recent activity: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Recent activity error:', error);
      throw error;
    }
  }

  // Get analytics data
  async getAnalytics(timeframe = 'month') {
    try {
      const token = this.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/admin/analytics/?timeframe=${timeframe}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch analytics: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Analytics error:', error);
      throw error;
    }
  }
}

export default new DashboardStatsService();