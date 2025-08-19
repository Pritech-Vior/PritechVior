// Blog API service
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

class BlogService {
  // Get all blog posts with optional filters
  async getBlogPosts(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}/blog/api/posts/${
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
      // Return just the results array from the paginated response
      return data.results || data;
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      throw error;
    }
  }

  // Get a specific blog post by slug
  async getBlogPostBySlug(slug) {
    try {
      const response = await fetch(`${API_BASE_URL}/blog/api/posts/${slug}/`, {
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
      console.error("Error fetching blog post:", error);
      throw error;
    }
  }

  // Get featured blog posts
  async getFeaturedPosts() {
    try {
      const response = await fetch(`${API_BASE_URL}/blog/api/posts/featured/`, {
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
      console.error("Error fetching featured posts:", error);
      throw error;
    }
  }

  // Get recent blog posts
  async getRecentPosts() {
    try {
      const response = await fetch(`${API_BASE_URL}/blog/api/posts/recent/`, {
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
      console.error("Error fetching recent posts:", error);
      throw error;
    }
  }

  // Like or unlike a blog post
  async toggleLike(slug, token) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/blog/api/posts/${slug}/like/`,
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
      console.error("Error toggling like:", error);
      throw error;
    }
  }

  // Add comment to a blog post
  async addComment(slug, content, parentId = null, token) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/blog/api/posts/${slug}/add_comment/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content,
            parent: parentId,
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

  // Get comments for a blog post
  async getComments(slug) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/blog/api/posts/${slug}/comments/`,
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

  // Get images for a blog post
  async getPostImages(slug) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/blog/api/posts/${slug}/images/`,
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
      console.error("Error fetching post images:", error);
      throw error;
    }
  }

  // Get downloads for a blog post
  async getPostDownloads(slug) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/blog/api/posts/${slug}/downloads/`,
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
      console.error("Error fetching post downloads:", error);
      throw error;
    }
  }

  // Download a file
  async downloadFile(slug, downloadId, token = null) {
    try {
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${API_BASE_URL}/blog/api/posts/${slug}/download_file/`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            download_id: downloadId,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error downloading file:", error);
      throw error;
    }
  }

  // Request premium download
  async requestDownload(slug, downloadId, email, message, token) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/blog/api/posts/${slug}/request_download/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            download_id: downloadId,
            email,
            message,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        // Handle conflict (409) - existing request
        if (response.status === 409) {
          const error = new Error(errorData.error || "Request already exists");
          error.status = response.status;
          error.data = errorData;
          throw error;
        }

        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error requesting download:", error);
      throw error;
    }
  }

  // Subscribe to newsletter
  async subscribeNewsletter(email, name = "") {
    try {
      const response = await fetch(`${API_BASE_URL}/blog/api/newsletter/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      throw error;
    }
  }

  // Get blog categories
  async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/blog/api/categories/`, {
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
      console.error("Error fetching categories:", error);
      throw error;
    }
  }
}

export default new BlogService();
