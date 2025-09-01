// Projects management API service for admin dashboard
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const PROJECTS_API = {
  list: "/api/projects/projects/",
  detail: (slug) => `/api/projects/projects/${slug}/`,
  create: "/api/projects/projects/",
  update: (slug) => `/api/projects/projects/${slug}/`,
  delete: (slug) => `/api/projects/projects/${slug}/`,
  updateStatus: (slug) => `/api/projects/projects/${slug}/update_status/`,
  addMilestone: (slug) => `/api/projects/projects/${slug}/add_milestone/`,
  requests: "/api/projects/requests/",
  requestDetail: (id) => `/api/projects/requests/${id}/`,
  convertRequest: (id) => `/api/projects/requests/${id}/convert_to_project/`,
  categories: "/api/projects/categories/",
  technologies: "/api/projects/technologies/",
  servicePackages: "/api/projects/service-packages/",
  courseCategories: "/api/projects/course-categories/",
  templates: "/api/projects/templates/",
};

class ProjectsManagementService {
  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('access_token'); // Fixed: use access_token
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  // Projects CRUD operations
  async getProjects(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}${PROJECTS_API.list}${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) throw new Error(`Failed to fetch projects: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Get projects error:', error);
      throw error;
    }
  }

  async getProject(slug) {
    try {
      const response = await fetch(`${API_BASE_URL}${PROJECTS_API.detail(slug)}`, {
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) throw new Error(`Failed to fetch project: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Get project error:', error);
      throw error;
    }
  }

  async createProject(projectData) {
    try {
      const response = await fetch(`${API_BASE_URL}${PROJECTS_API.create}`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(projectData),
      });
      if (!response.ok) throw new Error(`Failed to create project: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Create project error:', error);
      throw error;
    }
  }

  async updateProject(slug, projectData) {
    try {
      const response = await fetch(`${API_BASE_URL}${PROJECTS_API.update(slug)}`, {
        method: "PATCH",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(projectData),
      });
      if (!response.ok) throw new Error(`Failed to update project: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Update project error:', error);
      throw error;
    }
  }

  async deleteProject(slug) {
    try {
      const response = await fetch(`${API_BASE_URL}${PROJECTS_API.delete(slug)}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) throw new Error(`Failed to delete project: ${response.status}`);
      return true;
    } catch (error) {
      console.error('Delete project error:', error);
      throw error;
    }
  }

  async updateProjectStatus(slug, status) {
    try {
      const response = await fetch(`${API_BASE_URL}${PROJECTS_API.updateStatus(slug)}`, {
        method: "PATCH",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error(`Failed to update project status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Update project status error:', error);
      throw error;
    }
  }

  // Project Requests
  async getProjectRequests(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}${PROJECTS_API.requests}${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) throw new Error(`Failed to fetch project requests: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Get project requests error:', error);
      throw error;
    }
  }

  async getProjectRequest(id) {
    try {
      const response = await fetch(`${API_BASE_URL}${PROJECTS_API.requestDetail(id)}`, {
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) throw new Error(`Failed to fetch project request: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Get project request error:', error);
      throw error;
    }
  }

  async updateProjectRequest(id, requestData) {
    try {
      const response = await fetch(`${API_BASE_URL}${PROJECTS_API.requestDetail(id)}`, {
        method: "PATCH",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(requestData),
      });
      if (!response.ok) throw new Error(`Failed to update project request: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Update project request error:', error);
      throw error;
    }
  }

  async convertRequestToProject(id) {
    try {
      const response = await fetch(`${API_BASE_URL}${PROJECTS_API.convertRequest(id)}`, {
        method: "POST",
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) throw new Error(`Failed to convert request to project: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Convert request error:', error);
      throw error;
    }
  }

  // Reference data
  async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}${PROJECTS_API.categories}`);
      if (!response.ok) throw new Error(`Failed to fetch categories: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  }

  async getTechnologies() {
    try {
      const response = await fetch(`${API_BASE_URL}${PROJECTS_API.technologies}`);
      if (!response.ok) throw new Error(`Failed to fetch technologies: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Get technologies error:', error);
      throw error;
    }
  }

  async getServicePackages() {
    try {
      const response = await fetch(`${API_BASE_URL}${PROJECTS_API.servicePackages}`);
      if (!response.ok) throw new Error(`Failed to fetch service packages: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Get service packages error:', error);
      throw error;
    }
  }

  async getCourseCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}${PROJECTS_API.courseCategories}`);
      if (!response.ok) throw new Error(`Failed to fetch course categories: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Get course categories error:', error);
      throw error;
    }
  }

  async getTemplates() {
    try {
      const response = await fetch(`${API_BASE_URL}${PROJECTS_API.templates}`);
      if (!response.ok) throw new Error(`Failed to fetch templates: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Get templates error:', error);
      throw error;
    }
  }

  // Milestones
  async addMilestone(projectSlug, milestoneData) {
    try {
      const response = await fetch(`${API_BASE_URL}${PROJECTS_API.addMilestone(projectSlug)}`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(milestoneData),
      });
      if (!response.ok) throw new Error(`Failed to add milestone: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Add milestone error:', error);
      throw error;
    }
  }

  // Bulk operations
  async bulkUpdateProjects(projectIds, updateData) {
    try {
      const promises = projectIds.map(id => 
        this.updateProject(id, updateData)
      );
      return await Promise.all(promises);
    } catch (error) {
      console.error('Bulk update error:', error);
      throw error;
    }
  }

  async bulkDeleteProjects(projectIds) {
    try {
      const promises = projectIds.map(id => 
        this.deleteProject(id)
      );
      return await Promise.all(promises);
    } catch (error) {
      console.error('Bulk delete error:', error);
      throw error;
    }
  }
}

export default new ProjectsManagementService();