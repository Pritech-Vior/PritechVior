// Archive API service
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

class ArchiveService {
  // Get all archives with optional filters
  async getArchives(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}/archive/api/archives/${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching archives:", error);
      throw error;
    }
  }

  // Get a specific archive by ID
  async getArchiveById(id) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/archive/api/archives/${id}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching archive:", error);
      throw error;
    }
  }

  // Get comments for an archive
  async getArchiveComments(archiveId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/archive/api/archives/${archiveId}/comments/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  }

  // Request download for an archive
  async requestDownload(archiveId, email, message, token = null) {
    try {
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${API_BASE_URL}/archive/api/archives/${archiveId}/request_download/`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            email,
            message,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error requesting download:", error);
      throw error;
    }
  }

  // Add comment to an archive
  async addComment(archiveId, comment, rating, token) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/archive/api/archives/${archiveId}/add_comment/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            comment,
            rating,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  }

  // Get download info (with authentication)
  async getDownloadInfo(archiveId, token) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/archive/api/archives/${archiveId}/download/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting download info:", error);
      throw error;
    }
  }

  // Get direct download link (without authentication)
  async getDirectDownload(archiveId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/archive/api/archives/${archiveId}/download/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // If it's a direct file download, return the blob
      if (response.headers.get("content-type")?.includes("application/")) {
        return await response.blob();
      }

      // Otherwise return JSON (might be external URL or error)
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting direct download:", error);
      throw error;
    }
  }

  // Search archives
  async searchArchives(searchTerm, category = null) {
    const params = { search: searchTerm };
    if (category && category !== "All") {
      params.category = category.toLowerCase();
    }
    return this.getArchives(params);
  }

  // Get featured archives
  async getFeaturedArchives() {
    return this.getArchives({ featured: true });
  }

  // Track platform download
  async trackPlatformDownload(platformDownloadId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/archive/api/platform-downloads/${platformDownloadId}/download/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error tracking platform download:", error);
      throw error;
    }
  }
}

export const archiveService = new ArchiveService();
export default archiveService;
