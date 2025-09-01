// Blog management API service for admin dashboard with proper file upload support
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const BLOG_API = {
  list: "/blog/api/admin/blog/posts/",
  create: "/blog/api/admin/blog/posts/",
  detail: (slug) => `/blog/api/admin/blog/posts/${slug}/`,
  update: (slug) => `/blog/api/admin/blog/posts/${slug}/`,
  delete: (slug) => `/blog/api/admin/blog/posts/${slug}/`,
  uploadImage: "/blog/api/admin/blog/images/",
  deleteGalleryImage: (slug) => `/blog/api/admin/blog/posts/${slug}/delete_gallery_image/`,
  addGalleryImage: (slug) => `/blog/api/admin/blog/posts/${slug}/add_gallery_image/`,
};

class BlogManagementService {
  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  // Helper method to get auth headers for file upload (no Content-Type)
  getFileUploadHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      ...(token && { 'Authorization': `Bearer ${token}` }),
      // Don't set Content-Type for FormData, let browser set it
    };
  }

  // Helper method to check if a value is a File object
  isFile(value) {
    return value instanceof File || (value && typeof value === 'object' && value.constructor && value.constructor.name === 'File');
  }

  // Helper method to check if a value is a blob URL
  isBlobUrl(value) {
    return typeof value === 'string' && value.startsWith('blob:');
  }

  // Helper method to prepare data for submission - NEVER send blob URLs
  preparePostData(postData, featuredImageFile = null, galleryImageFiles = []) {
    console.log('Preparing post data:', {
      postData: { ...postData, image: postData.image ? 'URL_PROVIDED' : 'NO_URL' },
      featuredImageFile: featuredImageFile ? featuredImageFile.name : 'none',
      galleryImageFiles: galleryImageFiles.length
    });

    // Check if we need to use FormData (if we have files to upload)
    const hasFiles = featuredImageFile || galleryImageFiles.length > 0;

    if (hasFiles) {
      // Use FormData for file uploads
      const formData = new FormData();

      // Add all post data fields (EXCEPT image field when we have a file)
      Object.keys(postData).forEach(key => {
        const value = postData[key];
        
        if (value !== null && value !== undefined) {
          // NEVER send image URL when we have a file - this prevents blob URL issues
          if (key === 'image' && featuredImageFile) {
            console.log('Skipping image URL field because we have a file to upload');
            return;
          }
          
          // Handle different data types
          if (typeof value === 'object' && !this.isFile(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (!this.isFile(value)) {
            formData.append(key, value);
          }
        }
      });

      // Add featured image file
      if (featuredImageFile && this.isFile(featuredImageFile)) {
        formData.append('image_file', featuredImageFile);
        console.log('Added featured image file:', featuredImageFile.name);
      }

      // Add gallery image files
      if (galleryImageFiles.length > 0) {
        galleryImageFiles.forEach((file, index) => {
          if (this.isFile(file)) {
            formData.append('new_gallery_images', file);
            console.log(`Added gallery image ${index + 1}:`, file.name);
          }
        });
      }

      return { data: formData, isFormData: true };
    } else {
      // Use regular JSON for text-only updates
      const cleanedData = { ...postData };
      
      // Clean up blob URLs completely - never send them
      if (cleanedData.image && this.isBlobUrl(cleanedData.image)) {
        console.log('Removing blob URL from image field - no file provided');
        cleanedData.image = '';
      }

      // Remove any file-related fields from JSON data
      delete cleanedData.image_file;

      return { data: cleanedData, isFormData: false };
    }
  }

  // Get all blog posts
  async getPosts() {
    try {
      const response = await fetch(`${API_BASE_URL}${BLOG_API.list}`, {
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) throw new Error(`Failed to fetch blog posts: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Get blog posts error:', error);
      throw error;
    }
  }

  // Get single blog post
  async getPost(id) {
    try {
      const response = await fetch(`${API_BASE_URL}${BLOG_API.detail(id)}`, {
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) throw new Error(`Failed to fetch blog post: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Get blog post error:', error);
      throw error;
    }
  }

  // Create new blog post with optional file uploads
  async createPost(postData, options = {}) {
    try {
      const { featuredImageFile = null, galleryImageFiles = [] } = options;
      
      console.log('Creating blog post with files:', {
        title: postData.title,
        featuredImage: featuredImageFile ? featuredImageFile.name : 'none',
        galleryImages: galleryImageFiles.length,
        hasImageUrl: !!postData.image
      });

      // Prepare data - this will handle blob URLs properly
      const { data, isFormData } = this.preparePostData(postData, featuredImageFile, galleryImageFiles);

      const headers = isFormData ? this.getFileUploadHeaders() : this.getAuthHeaders();

      console.log('Sending request:', {
        method: 'POST',
        isFormData,
        hasFiles: !!(featuredImageFile || galleryImageFiles.length)
      });

      const response = await fetch(`${API_BASE_URL}${BLOG_API.create}`, {
        method: "POST",
        headers: headers,
        body: isFormData ? data : JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Create post error response:', errorText);
        throw new Error(`Failed to create blog post: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Blog post created successfully:', result.title);
      return result;
    } catch (error) {
      console.error('Create blog post error:', error);
      throw error;
    }
  }

  // Update blog post with optional file uploads
  async updatePost(id, postData, options = {}) {
    try {
      const { featuredImageFile = null, galleryImageFiles = [] } = options;
      
      console.log('Updating blog post with files:', {
        id,
        title: postData.title,
        featuredImage: featuredImageFile ? featuredImageFile.name : 'none',
        galleryImages: galleryImageFiles.length,
        hasImageUrl: !!postData.image
      });

      // Prepare data - this will handle blob URLs properly
      const { data, isFormData } = this.preparePostData(postData, featuredImageFile, galleryImageFiles);

      const headers = isFormData ? this.getFileUploadHeaders() : this.getAuthHeaders();

      console.log('Sending update request:', {
        method: 'PATCH',
        isFormData,
        hasFiles: !!(featuredImageFile || galleryImageFiles.length)
      });

      const response = await fetch(`${API_BASE_URL}${BLOG_API.update(id)}`, {
        method: "PATCH",
        headers: headers,
        body: isFormData ? data : JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update post error response:', errorText);
        throw new Error(`Failed to update blog post: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Blog post updated successfully:', result.title);
      return result;
    } catch (error) {
      console.error('Update blog post error:', error);
      throw error;
    }
  }

  // Delete blog post
  async deletePost(id) {
    try {
      const response = await fetch(`${API_BASE_URL}${BLOG_API.delete(id)}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) throw new Error(`Failed to delete blog post: ${response.status}`);
      return true;
    } catch (error) {
      console.error('Delete blog post error:', error);
      throw error;
    }
  }

  // Upload single image (standalone)
  async uploadImage(file) {
    try {
      if (!this.isFile(file)) {
        throw new Error('Invalid file object provided');
      }

      const formData = new FormData();
      formData.append("image_file", file);
      
      const response = await fetch(`${API_BASE_URL}${BLOG_API.uploadImage}`, {
        method: "POST",
        headers: this.getFileUploadHeaders(),
        body: formData,
      });
      
      if (!response.ok) throw new Error(`Failed to upload image: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Upload image error:', error);
      throw error;
    }
  }

  // Delete gallery image from blog post
  async deleteGalleryImage(postSlug, imageId) {
    try {
      console.log(`Deleting gallery image ${imageId} from post ${postSlug}`);
      const response = await fetch(`${API_BASE_URL}${BLOG_API.deleteGalleryImage(postSlug)}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ image_id: imageId }),
      });
      if (!response.ok) throw new Error(`Failed to delete gallery image: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Delete gallery image error:', error);
      throw error;
    }
  }

  // Add single gallery image to blog post
  async addGalleryImage(postSlug, imageFile, caption = '') {
    try {
      console.log(`Adding gallery image to post ${postSlug}`);
      
      if (!this.isFile(imageFile)) {
        throw new Error('Invalid file object provided for gallery image');
      }

      const formData = new FormData();
      formData.append('image_file', imageFile);
      formData.append('caption', caption || imageFile.name || 'Gallery image');
      
      const response = await fetch(`${API_BASE_URL}${BLOG_API.addGalleryImage(postSlug)}`, {
        method: "POST",
        headers: this.getFileUploadHeaders(),
        body: formData,
      });
      
      if (!response.ok) throw new Error(`Failed to add gallery image: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Add gallery image error:', error);
      throw error;
    }
  }

  // Upload multiple gallery images to existing post
  async uploadGalleryImages(postSlug, imageFiles) {
    try {
      console.log(`Uploading ${imageFiles.length} gallery images to post ${postSlug}`);
      
      const validFiles = imageFiles.filter(file => this.isFile(file));
      if (validFiles.length === 0) {
        throw new Error('No valid file objects provided');
      }

      const uploadPromises = validFiles.map(async (file, index) => {
        try {
          return await this.addGalleryImage(postSlug, file, `Gallery image ${index + 1}`);
        } catch (error) {
          console.error(`Failed to upload gallery image ${index + 1}:`, error);
          return { error: error.message, file: file.name };
        }
      });

      const results = await Promise.all(uploadPromises);
      const successful = results.filter(result => !result.error);
      const failed = results.filter(result => result.error);

      console.log(`Gallery upload complete: ${successful.length} successful, ${failed.length} failed`);
      
      return {
        successful,
        failed,
        total: validFiles.length
      };
    } catch (error) {
      console.error('Upload gallery images error:', error);
      throw error;
    }
  }

  // Update gallery image caption
  async updateGalleryImageCaption(imageId, caption) {
    try {
      const response = await fetch(`${API_BASE_URL}/blog/api/admin/blog/images/${imageId}/`, {
        method: "PATCH",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ caption }),
      });
      if (!response.ok) throw new Error(`Failed to update image caption: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Update image caption error:', error);
      throw error;
    }
  }

  // Utility method to validate image files
  validateImageFiles(files) {
    const validFiles = [];
    const errors = [];
    
    files.forEach((file, index) => {
      if (!this.isFile(file)) {
        errors.push(`Item ${index + 1} is not a valid file`);
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        errors.push(`${file.name} is not an image file`);
        return;
      }
      
      // Check file size (e.g., max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        errors.push(`${file.name} is too large (max 10MB)`);
        return;
      }
      
      validFiles.push(file);
    });
    
    return { validFiles, errors };
  }

  // Debug method to log FormData contents
  logFormData(formData) {
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }
  }
}

export default new BlogManagementService();