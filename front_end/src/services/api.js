import { toast } from "react-hot-toast";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

class ProjectsService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      toast.error(
        error.message || "An error occurred while processing your request"
      );
      throw error;
    }
  }

  // Project Categories
  async getProjectCategories() {
    return this.request("/api/projects/categories/");
  }

  async getProjectCategory(slug) {
    return this.request(`/api/projects/categories/${slug}/`);
  }

  // Technology Stacks
  async getTechnologyStacks() {
    return this.request("/api/projects/technologies/");
  }

  // Service Packages
  async getServicePackages(userType = null) {
    const params = userType ? `?user_type=${userType}` : "";
    return this.request(`/api/projects/service-packages/${params}`);
  }

  // Course Categories
  async getCourseCategories() {
    return this.request("/api/projects/course-categories/");
  }

  // Project Templates
  async getProjectTemplates(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString
      ? `/api/projects/templates/?${queryString}`
      : "/api/projects/templates/";
    return this.request(endpoint);
  }

  async getProjectTemplate(slug) {
    return this.request(`/api/projects/templates/${slug}/`);
  }

  // Projects
  async getProjects(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString
      ? `/api/projects/projects/?${queryString}`
      : "/api/projects/projects/";
    return this.request(endpoint);
  }

  async getProject(slug) {
    return this.request(`/api/projects/projects/${slug}/`);
  }

  // Project Requests
  async createProjectRequest(data) {
    return this.request("/api/projects/requests/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getProjectRequests(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString
      ? `/api/projects/requests/?${queryString}`
      : "/api/projects/requests/";
    return this.request(endpoint);
  }

  async getProjectRequest(id) {
    return this.request(`/api/projects/requests/${id}/`);
  }

  async updateProjectRequest(id, data) {
    return this.request(`/api/projects/requests/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  // Project Request Communications
  async addProjectRequestCommunication(requestId, data) {
    return this.request("/api/projects/communications/", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        request: requestId,
      }),
    });
  }

  async getProjectRequestCommunications(requestId) {
    return this.request(`/api/projects/communications/?request=${requestId}`);
  }

  // Project Milestones
  async getProjectMilestones(projectId) {
    return this.request(`/api/projects/milestones/?project=${projectId}`);
  }

  // Utility methods for form data
  formatProjectRequestData(formData, userType) {
    const baseData = {
      title: formData.title,
      description: formData.description,
      user_type: userType,
      request_type: formData.template ? "template" : "new",
      requirements: formData.requirements || "",
      additional_features: formData.additionalFeatures || "",
      budget_range: formData.budget || "",
      preferred_deadline: formData.deadline || null,
      timeline_flexibility: formData.timelineFlexibility || "flexible",
      contact_phone: formData.phone || "",
      contact_email: formData.email || "",
      technology_notes: formData.technologyNotes || "",
    };

    // Add user type specific fields
    if (userType === "student") {
      baseData.academic_level = formData.academicLevel || "";
      baseData.institution = formData.institution || "";
      if (formData.courseCategory) {
        baseData.course_category = formData.courseCategory;
      }
    }

    // Add template if selected
    if (formData.template) {
      baseData.template = formData.template;
      baseData.customizations = formData.customizations || {};
    }

    // Add service package if selected
    if (formData.servicePackage) {
      baseData.service_package = formData.servicePackage;
    }

    // Add preferred technologies
    if (formData.technologies && formData.technologies.length > 0) {
      baseData.preferred_technologies = formData.technologies;
    }

    // Add features if provided
    if (formData.features && formData.features.length > 0) {
      baseData.features_required = formData.features;
    }

    return baseData;
  }

  // Error handling utility
  handleApiError(error, defaultMessage = "An error occurred") {
    console.error("API Error:", error);
    toast.error(error.message || defaultMessage);
    return null;
  }

  // Success notification utility
  showSuccessMessage(message) {
    toast.success(message);
  }
}

export const projectsService = new ProjectsService();
export default projectsService;
