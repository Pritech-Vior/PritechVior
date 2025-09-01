import React, { useState, useRef, useEffect } from 'react';
import blogService from '../../../services/admin/blog/blogManagement.js';

const BlogPostEditor = ({ postId = null, onSave, onCancel }) => {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'other',
    tags: [],
    status: 'draft',
    featured: false,
    meta_description: '',
    video_url: ''
  });

  // File state
  const [featuredImageFile, setFeaturedImageFile] = useState(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState('');
  const [featuredImageUploading, setFeaturedImageUploading] = useState(false);
  
  const [galleryImageFiles, setGalleryImageFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [existingGalleryImages, setExistingGalleryImages] = useState([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [errors, setErrors] = useState({});

  // Refs
  const featuredImageRef = useRef(null);
  const galleryImagesRef = useRef(null);
  const dropZoneRef = useRef(null);

  // Load existing post data
  useEffect(() => {
    if (postId) {
      loadPost(postId);
    }
  }, [postId]);

  const loadPost = async (id) => {
    try {
      setLoading(true);
      const post = await blogService.getPost(id);
      
      setFormData({
        title: post.title || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        category: post.category || 'other',
        tags: post.tags || [],
        status: post.status || 'draft',
        featured: post.featured || false,
        meta_description: post.meta_description || '',
        video_url: post.video_url || ''
      });

      // Set existing featured image
      if (post.image) {
        setFeaturedImagePreview(post.image);
      }

      // Set existing gallery images
      if (post.images && post.images.length > 0) {
        setExistingGalleryImages(post.images);
      }

    } catch (error) {
      console.error('Failed to load post:', error);
      setErrors({ general: 'Failed to load post data' });
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle tags input
  const handleTagsChange = (e) => {
    const value = e.target.value;
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  // Handle featured image selection and immediate upload
  const handleFeaturedImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    const { validFiles, errors: validationErrors } = blogService.validateImageFiles([file]);
    
    if (validationErrors.length > 0) {
      setErrors({ featuredImage: validationErrors[0] });
      return;
    }

    try {
      setFeaturedImageUploading(true);
      setErrors(prev => ({ ...prev, featuredImage: null }));

      // Create preview immediately
      const reader = new FileReader();
      reader.onload = (e) => {
        setFeaturedImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Store the actual file for form submission
      setFeaturedImageFile(file);
      
      console.log('Featured image selected:', file.name);

    } catch (error) {
      console.error('Featured image selection error:', error);
      setErrors({ featuredImage: 'Failed to process image' });
    } finally {
      setFeaturedImageUploading(false);
    }
  };

  // Handle gallery images selection and immediate preview
  const handleGalleryImagesChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate files
    const { validFiles, errors: validationErrors } = blogService.validateImageFiles(files);
    
    if (validationErrors.length > 0) {
      setErrors({ galleryImages: validationErrors.join(', ') });
      return;
    }

    try {
      setGalleryUploading(true);
      setErrors(prev => ({ ...prev, galleryImages: null }));

      // Store files for form submission
      setGalleryImageFiles(validFiles);
      
      // Create previews
      const previews = [];
      const previewPromises = validFiles.map((file, index) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            previews.push({
              id: `new-${index}`,
              file: file,
              preview: e.target.result,
              name: file.name,
              isNew: true
            });
            resolve();
          };
          reader.readAsDataURL(file);
        });
      });

      await Promise.all(previewPromises);
      
      // Sort previews by index to maintain order
      previews.sort((a, b) => {
        const aIndex = parseInt(a.id.split('-')[1]);
        const bIndex = parseInt(b.id.split('-')[1]);
        return aIndex - bIndex;
      });
      
      setGalleryPreviews(previews);
      console.log('Gallery images selected:', validFiles.length);

    } catch (error) {
      console.error('Gallery images selection error:', error);
      setErrors({ galleryImages: 'Failed to process images' });
    } finally {
      setGalleryUploading(false);
    }
  };

  // Remove featured image
  const removeFeaturedImage = () => {
    setFeaturedImageFile(null);
    setFeaturedImagePreview('');
    if (featuredImageRef.current) {
      featuredImageRef.current.value = '';
    }
  };

  // Remove gallery image (new)
  const removeGalleryImage = (index) => {
    const newFiles = galleryImageFiles.filter((_, i) => i !== index);
    const newPreviews = galleryPreviews.filter((_, i) => i !== index);
    setGalleryImageFiles(newFiles);
    setGalleryPreviews(newPreviews);
  };

  // Remove existing gallery image
  const removeExistingGalleryImage = async (imageId) => {
    if (!postId) return;
    
    try {
      await blogService.deleteGalleryImage(postId, imageId);
      setExistingGalleryImages(prev => prev.filter(img => img.id !== imageId));
      console.log('Existing gallery image removed:', imageId);
    } catch (error) {
      console.error('Failed to delete gallery image:', error);
      setErrors({ general: 'Failed to delete gallery image' });
    }
  };

  // Upload single gallery image immediately
  const uploadSingleGalleryImage = async (file) => {
    if (!postId) {
      console.log('No post ID, will upload with form submission');
      return;
    }

    try {
      const result = await blogService.addGalleryImage(postId, file, file.name);
      
      // Add to existing gallery images
      setExistingGalleryImages(prev => [...prev, ...result.images]);
      
      console.log('Gallery image uploaded immediately:', result);
      return result;
    } catch (error) {
      console.error('Failed to upload gallery image:', error);
      throw error;
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add('drag-over');
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('drag-over');
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('drag-over');
    }

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      // Simulate file input change
      await handleGalleryImagesChange({ target: { files: imageFiles } });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      console.log('Submitting form with files:', {
        featuredImageFile: featuredImageFile ? featuredImageFile.name : 'none',
        galleryImageFiles: galleryImageFiles.length
      });

      const options = {
        featuredImageFile,
        galleryImageFiles
      };

      let result;
      if (postId) {
        // Update existing post
        result = await blogService.updatePost(postId, formData, options);
      } else {
        // Create new post
        result = await blogService.createPost(formData, options);
      }

      console.log('Post saved successfully:', result);
      
      // Clear file states after successful submission
      setFeaturedImageFile(null);
      setGalleryImageFiles([]);
      setGalleryPreviews([]);
      
      if (onSave) {
        onSave(result);
      }

    } catch (error) {
      console.error('Failed to save post:', error);
      setErrors({ general: error.message || 'Failed to save post' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="blog-post-editor max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Error */}
        {errors.general && (
          <div className="error-message bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {errors.general}
          </div>
        )}

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter post title..."
          />
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
            rows={10}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Write your post content..."
          />
        </div>

        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Brief description of the post..."
          />
        </div>

        {/* Category and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="web_development">Web Development</option>
              <option value="business">Business</option>
              <option value="fintech">Fintech</option>
              <option value="technology">Technology</option>
              <option value="tutorial">Tutorial</option>
              <option value="case_study">Case Study</option>
              <option value="industry_news">Industry News</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags.join(', ')}
            onChange={handleTagsChange}
            placeholder="tag1, tag2, tag3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Featured Image */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Featured Image
          </label>
          
          <div className="space-y-4">
            {/* File Input */}
            <div>
              <input
                type="file"
                ref={featuredImageRef}
                accept="image/*"
                onChange={handleFeaturedImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
              
              {errors.featuredImage && (
                <p className="mt-2 text-sm text-red-600">{errors.featuredImage}</p>
              )}
            </div>

            {/* Upload Status */}
            {featuredImageUploading && (
              <div className="flex items-center space-x-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm">Processing image...</span>
              </div>
            )}
            
            {/* Preview */}
            {featuredImagePreview && (
              <div className="relative inline-block">
                <img
                  src={featuredImagePreview}
                  alt="Featured image preview"
                  className="max-w-sm max-h-48 rounded-lg shadow-md border"
                />
                <button
                  type="button"
                  onClick={removeFeaturedImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 shadow-md"
                  title="Remove image"
                >
                  ×
                </button>
                {featuredImageFile && (
                  <p className="mt-2 text-xs text-gray-600">
                    Ready to upload: {featuredImageFile.name}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Gallery Images */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Gallery Images
          </label>
          
          <div className="space-y-4">
            {/* File Input */}
            <div>
              <input
                type="file"
                ref={galleryImagesRef}
                accept="image/*"
                multiple
                onChange={handleGalleryImagesChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
              
              {errors.galleryImages && (
                <p className="mt-2 text-sm text-red-600">{errors.galleryImages}</p>
              )}
            </div>

            {/* Drag & Drop Zone */}
            <div
              ref={dropZoneRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => galleryImagesRef.current?.click()}
            >
              <div className="space-y-2">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-gray-500">
                  <span className="font-medium">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>

            {/* Upload Status */}
            {galleryUploading && (
              <div className="flex items-center space-x-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm">Processing images...</span>
              </div>
            )}

            {/* Existing Gallery Images */}
            {existingGalleryImages.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Current Gallery Images:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {existingGalleryImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.image_source}
                        alt={image.caption || 'Gallery image'}
                        className="w-full h-24 object-cover rounded-lg shadow-md border"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingGalleryImage(image.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        ×
                      </button>
                      {image.caption && (
                        <p className="mt-1 text-xs text-gray-600 truncate">{image.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Gallery Image Previews */}
            {galleryPreviews.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">New Gallery Images:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {galleryPreviews.map((preview, index) => (
                    <div key={preview.id} className="relative group">
                      <img
                        src={preview.preview}
                        alt={preview.name}
                        className="w-full h-24 object-cover rounded-lg shadow-md border"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        ×
                      </button>
                      <p className="mt-1 text-xs text-gray-600 truncate">{preview.name}</p>
                      <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                        New
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Featured Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={formData.featured}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
            Featured Post
          </label>
        </div>

        {/* Meta Description */}
        <div>
          <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700 mb-2">
            Meta Description (SEO)
          </label>
          <textarea
            id="meta_description"
            name="meta_description"
            value={formData.meta_description}
            onChange={handleInputChange}
            rows={2}
            maxLength={160}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Brief description for search engines..."
          />
          <p className="mt-1 text-sm text-gray-500">
            {formData.meta_description.length}/160 characters
          </p>
        </div>

        {/* Video URL */}
        <div>
          <label htmlFor="video_url" className="block text-sm font-medium text-gray-700 mb-2">
            Video URL (optional)
          </label>
          <input
            type="url"
            id="video_url"
            name="video_url"
            value={formData.video_url}
            onChange={handleInputChange}
            placeholder="https://youtube.com/watch?v=..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Upload Progress */}
        {uploadProgress && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-800">
                  Uploading... {uploadProgress.completed}/{uploadProgress.total}
                </p>
                {uploadProgress.current && (
                  <p className="text-xs text-blue-600">Current: {uploadProgress.current}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </div>
            ) : (
              postId ? 'Update Post' : 'Create Post'
            )}
          </button>
        </div>
      </form>

      <style jsx>{`
        .drag-over {
          border-color: #3b82f6;
          background-color: #eff6ff;
        }
      `}</style>
    </div>
  );
};

export default BlogPostEditor;