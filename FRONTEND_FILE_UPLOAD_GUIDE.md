# 🖼️ Frontend File Upload Integration Guide

## 🚨 **Current Issue:**
The frontend is sending blob URLs (`blob:http://localhost:5173/...`) and empty objects (`'{}'`) instead of actual File objects for image uploads.

## ✅ **Backend Fixed:**
- ✅ **Blob URL detection** - automatically clears blob URLs
- ✅ **Empty object handling** - handles `'{}'`, `'null'`, empty strings
- ✅ **File validation** - properly validates actual File objects
- ✅ **Gallery image support** - supports multiple file uploads

## 🔧 **Frontend Integration Required:**

### **1. Featured Image Upload:**

#### **❌ Current (Not Working):**
```javascript
// Frontend sends blob URL and empty object
const postData = {
  image: 'blob:http://localhost:5173/502f6bb2-34db-4520-a4e7-0bd6ab70f039',
  image_file: '{}' // Empty object string
};
```

#### **✅ Correct Implementation:**
```javascript
// Method 1: Use FormData for file uploads
const formData = new FormData();
formData.append('title', 'My Post Title');
formData.append('content', 'Post content...');
formData.append('category', 'web_development');
formData.append('image_file', fileInput.files[0]); // Actual File object
// Don't send image URL when uploading file

// Method 2: Send file through service
const fileInput = document.getElementById('featuredImage');
const file = fileInput.files[0];
await blogService.updatePost(postSlug, postData, [], file); // Pass file separately
```

### **2. Gallery Image Upload:**

#### **✅ Multiple Gallery Images:**
```javascript
// Upload multiple gallery images
const galleryInput = document.getElementById('galleryImages');
const galleryFiles = Array.from(galleryInput.files);

// Method 1: Create post with gallery
await blogService.createPost(postData, galleryFiles);

// Method 2: Add to existing post
await blogService.uploadGalleryImages(postSlug, galleryFiles);

// Method 3: Update post with new gallery images
await blogService.updatePost(postSlug, postData, galleryFiles);
```

### **3. HTML File Input Examples:**

```html
<!-- Featured Image Upload -->
<div>
  <label for="featuredImage">Featured Image:</label>
  <input type="file" id="featuredImage" accept="image/*" />
  <img id="featuredPreview" style="max-width: 200px; display: none;" />
</div>

<!-- Gallery Images Upload -->
<div>
  <label for="galleryImages">Gallery Images:</label>
  <input type="file" id="galleryImages" accept="image/*" multiple />
  <div id="galleryPreview"></div>
</div>

<!-- Drag & Drop Gallery -->
<div id="dropZone" style="border: 2px dashed #ccc; padding: 20px; text-align: center;">
  Drop gallery images here or click to select
  <input type="file" id="dropInput" accept="image/*" multiple style="display: none;" />
</div>
```

### **4. JavaScript Implementation:**

```javascript
class BlogImageUploader {
  constructor() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Featured image upload
    const featuredInput = document.getElementById('featuredImage');
    if (featuredInput) {
      featuredInput.addEventListener('change', this.handleFeaturedImageChange.bind(this));
    }

    // Gallery images upload
    const galleryInput = document.getElementById('galleryImages');
    if (galleryInput) {
      galleryInput.addEventListener('change', this.handleGalleryImagesChange.bind(this));
    }

    // Drag & drop
    const dropZone = document.getElementById('dropZone');
    if (dropZone) {
      this.setupDragAndDrop(dropZone);
    }
  }

  handleFeaturedImageChange(event) {
    const file = event.target.files[0];
    if (file) {
      // Show preview
      this.showImagePreview(file, 'featuredPreview');
      
      // Store file for upload
      this.featuredImageFile = file;
    }
  }

  handleGalleryImagesChange(event) {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      // Show previews
      this.showGalleryPreviews(files);
      
      // Store files for upload
      this.galleryImageFiles = files;
    }
  }

  showImagePreview(file, previewId) {
    const preview = document.getElementById(previewId);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      preview.src = e.target.result;
      preview.style.display = 'block';
    };
    
    reader.readAsDataURL(file);
  }

  showGalleryPreviews(files) {
    const container = document.getElementById('galleryPreview');
    container.innerHTML = '';
    
    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.maxWidth = '150px';
        img.style.margin = '5px';
        container.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  }

  setupDragAndDrop(dropZone) {
    const input = document.getElementById('dropInput');
    
    dropZone.addEventListener('click', () => input.click());
    
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.style.backgroundColor = '#f0f0f0';
    });
    
    dropZone.addEventListener('dragleave', () => {
      dropZone.style.backgroundColor = '';
    });
    
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.style.backgroundColor = '';
      
      const files = Array.from(e.dataTransfer.files);
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      
      if (imageFiles.length > 0) {
        this.handleGalleryImagesChange({ target: { files: imageFiles } });
      }
    });
  }

  async createPostWithImages(postData) {
    try {
      // Create FormData
      const formData = new FormData();
      
      // Add post data
      Object.keys(postData).forEach(key => {
        if (postData[key] !== null && postData[key] !== undefined) {
          if (typeof postData[key] === 'object') {
            formData.append(key, JSON.stringify(postData[key]));
          } else {
            formData.append(key, postData[key]);
          }
        }
      });
      
      // Add featured image
      if (this.featuredImageFile) {
        formData.append('image_file', this.featuredImageFile);
      }
      
      // Add gallery images
      if (this.galleryImageFiles) {
        this.galleryImageFiles.forEach(file => {
          formData.append('new_gallery_images', file);
        });
      }
      
      // Send to backend
      const response = await fetch('/blog/api/admin/blog/posts/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          // Don't set Content-Type for FormData
        },
        body: formData
      });
      
      if (!response.ok) throw new Error(`Upload failed: ${response.status}`);
      
      const result = await response.json();
      console.log('Post created successfully:', result);
      return result;
      
    } catch (error) {
      console.error('Create post error:', error);
      throw error;
    }
  }

  async updatePostWithImages(postSlug, postData) {
    try {
      // If we have new images, use FormData
      if (this.featuredImageFile || (this.galleryImageFiles && this.galleryImageFiles.length > 0)) {
        const formData = new FormData();
        
        // Add post data
        Object.keys(postData).forEach(key => {
          if (postData[key] !== null && postData[key] !== undefined) {
            if (typeof postData[key] === 'object') {
              formData.append(key, JSON.stringify(postData[key]));
            } else {
              formData.append(key, postData[key]);
            }
          }
        });
        
        // Add featured image
        if (this.featuredImageFile) {
          formData.append('image_file', this.featuredImageFile);
        }
        
        // Add gallery images
        if (this.galleryImageFiles) {
          this.galleryImageFiles.forEach(file => {
            formData.append('new_gallery_images', file);
          });
        }
        
        // Send to backend
        const response = await fetch(`/blog/api/admin/blog/posts/${postSlug}/`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            // Don't set Content-Type for FormData
          },
          body: formData
        });
        
        if (!response.ok) throw new Error(`Update failed: ${response.status}`);
        return await response.json();
        
      } else {
        // No new images, use regular JSON update
        const response = await fetch(`/blog/api/admin/blog/posts/${postSlug}/`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData)
        });
        
        if (!response.ok) throw new Error(`Update failed: ${response.status}`);
        return await response.json();
      }
      
    } catch (error) {
      console.error('Update post error:', error);
      throw error;
    }
  }
}

// Initialize uploader
const blogUploader = new BlogImageUploader();
```

## 🎯 **Key Points:**

### **✅ Do:**
- ✅ **Use actual File objects** from input.files
- ✅ **Use FormData** for file uploads
- ✅ **Don't set Content-Type** when using FormData
- ✅ **Send files separately** from JSON data
- ✅ **Handle multiple files** for gallery

### **❌ Don't:**
- ❌ **Send blob URLs** as image field values
- ❌ **Send empty objects** as image_file
- ❌ **Mix blob URLs with file uploads**
- ❌ **Set Content-Type** when using FormData

## 🧪 **Testing:**

1. **Select featured image** → Should upload to Cloudinary
2. **Select gallery images** → Should upload multiple files
3. **Update post** → Should handle both text and file updates
4. **Check server logs** → Should see successful uploads

The backend is now ready to handle proper file uploads! 🎉