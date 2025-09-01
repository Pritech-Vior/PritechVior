import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Save, 
  X, 
  Eye, 
  Upload, 
  Image, 
  Link, 
  Calendar, 
  Tag, 
  User,
  Globe,
  FileText,
  Settings,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import DashboardLayout from "../../../../components/dashboard/DashboardLayout";
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import Card from "../../../../components/Card";
import blogManagement from "../../../../services/admin/blog/blogManagement";

const UpdatePost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    category: "",
    categories: [],
    tags: "",
    status: "draft",
    featured: false,
    meta_description: "",
    read_time: "",
    published_at: "",
    image: "",
    image_file: null
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("content");
  const [images, setImages] = useState([]);
  const [downloads, setDownloads] = useState([]);

  // Available options
  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
    { value: "archived", label: "Archived" }
  ];

  const categoryOptions = [
    { value: "technology", label: "Technology" },
    { value: "web-development", label: "Web Development" },
    { value: "mobile-development", label: "Mobile Development" },
    { value: "design", label: "Design" },
    { value: "business", label: "Business" },
    { value: "tutorials", label: "Tutorials" }
  ];

  useEffect(() => {
    loadPost();
  }, [slug]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const data = await blogManagement.getPost(slug);
      setFormData({
        ...data,
        tags: Array.isArray(data.tags) ? data.tags.join(", ") : data.tags || "",
        categories: data.categories || [],
        published_at: data.published_at ? new Date(data.published_at).toISOString().slice(0, 16) : ""
      });
      setImages(data.images || []);
      setDownloads(data.downloads || []);
    } catch (err) {
      setError("Failed to fetch post");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image_file: file,
        image: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const submitData = {
        ...formData,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
        published_at: formData.published_at || null
      };

      await blogManagement.updatePost(slug, submitData);
      setSuccess("Post updated successfully!");
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate("/dashboard/admin/blog");
      }, 1500);
    } catch (err) {
      setError("Failed to update post");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAndContinue = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const submitData = {
        ...formData,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
        published_at: formData.published_at || null
      };

      await blogManagement.updatePost(slug, submitData);
      setSuccess("Post saved successfully!");
      await loadPost(); // Reload the post data
    } catch (err) {
      setError("Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  const addImage = () => {
    setImages([...images, { id: Date.now(), image: "", caption: "", order: images.length + 1 }]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const updateImage = (index, field, value) => {
    const updatedImages = [...images];
    updatedImages[index][field] = value;
    setImages(updatedImages);
  };

  if (loading) {
    return (
      <DashboardLayout title="Update Blog Post" userRole="admin">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-color-1 mx-auto mb-4"></div>
            <p className="text-n-3">Loading post...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Update Blog Post" userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-n-1">Edit Blog Post</h1>
            <p className="text-n-3 mt-1">Update post content and settings</p>
          </div>
          <div className="flex gap-3">
            <Button
              icon={<Eye size={16} />}
              variant="secondary"
              onClick={() => window.open(`/blog/${slug}`, '_blank')}
            >
              Preview
            </Button>
            <Button
              icon={<X size={16} />}
              variant="secondary"
              onClick={() => navigate("/dashboard/admin/blog")}
            >
              Cancel
            </Button>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle size={20} className="text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle size={20} className="text-green-400" />
            <span className="text-green-400">{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Tabs */}
              <div className="flex gap-1 bg-n-7 p-1 rounded-lg w-fit">
                {[
                  { key: "content", label: "Content", icon: FileText },
                  { key: "media", label: "Media", icon: Image },
                  { key: "seo", label: "SEO", icon: Globe },
                  { key: "settings", label: "Settings", icon: Settings }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                      activeTab === tab.key 
                        ? "bg-gradient-to-r from-color-1 to-color-2 text-white" 
                        : "text-n-3 hover:text-n-1"
                    }`}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content Tab */}
              {activeTab === "content" && (
                <div className="space-y-6">
                  <Card className="p-6">
                    <div className="space-y-4">
                      <Input
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="text-lg font-semibold"
                        placeholder="Enter post title..."
                      />

                      <Input
                        label="Slug"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        required
                        placeholder="post-url-slug"
                        helperText="URL-friendly version of the title"
                      />

                      <div>
                        <label className="block text-sm font-medium text-n-1 mb-2">
                          Excerpt
                        </label>
                        <textarea
                          name="excerpt"
                          value={formData.excerpt}
                          onChange={handleChange}
                          rows={3}
                          className="w-full bg-n-7 border border-n-6 rounded-lg px-4 py-3 text-n-1 placeholder-n-4 focus:outline-none focus:border-color-1"
                          placeholder="Brief description of the post..."
                        />
                        <p className="text-xs text-n-4 mt-1">
                          Short summary that appears in post listings
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-n-1 mb-2">
                          Content
                        </label>
                        <textarea
                          name="content"
                          value={formData.content}
                          onChange={handleChange}
                          rows={15}
                          className="w-full bg-n-7 border border-n-6 rounded-lg px-4 py-3 text-n-1 placeholder-n-4 focus:outline-none focus:border-color-1 font-mono text-sm"
                          placeholder="Write your post content here..."
                          required
                        />
                        <p className="text-xs text-n-4 mt-1">
                          Supports Markdown formatting
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Media Tab */}
              {activeTab === "media" && (
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-n-1 mb-4">Featured Image</h3>
                    <div className="space-y-4">
                      {formData.image && (
                        <div className="relative">
                          <img 
                            src={formData.image} 
                            alt="Featured" 
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, image: "", image_file: null }))}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                      
                      <div className="border-2 border-dashed border-n-6 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="featured-image"
                        />
                        <label htmlFor="featured-image" className="cursor-pointer">
                          <Upload size={32} className="mx-auto text-n-4 mb-2" />
                          <p className="text-n-3">Click to upload featured image</p>
                          <p className="text-n-5 text-sm">PNG, JPG up to 10MB</p>
                        </label>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-n-1">Gallery Images</h3>
                      <Button
                        type="button"
                        size="sm"
                        icon={<Plus size={16} />}
                        onClick={addImage}
                      >
                        Add Image
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {images.map((image, index) => (
                        <div key={image.id || index} className="border border-n-6 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-n-1">Image {index + 1}</span>
                            <Button
                              type="button"
                              size="sm"
                              variant="danger"
                              icon={<Trash2 size={14} />}
                              onClick={() => removeImage(index)}
                            >
                              Remove
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              label="Image URL"
                              value={image.image || ""}
                              onChange={(e) => updateImage(index, "image", e.target.value)}
                              placeholder="https://example.com/image.jpg"
                            />
                            <Input
                              label="Caption"
                              value={image.caption || ""}
                              onChange={(e) => updateImage(index, "caption", e.target.value)}
                              placeholder="Image description..."
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {/* SEO Tab */}
              {activeTab === "seo" && (
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-n-1 mb-4">SEO Settings</h3>
                    <div className="space-y-4">
                      <Input
                        label="Meta Description"
                        name="meta_description"
                        value={formData.meta_description}
                        onChange={handleChange}
                        placeholder="SEO description for search engines..."
                        helperText="Recommended length: 150-160 characters"
                      />

                      <Input
                        label="Read Time (minutes)"
                        name="read_time"
                        type="number"
                        value={formData.read_time}
                        onChange={handleChange}
                        placeholder="5"
                        helperText="Estimated reading time in minutes"
                      />

                      <div>
                        <label className="block text-sm font-medium text-n-1 mb-2">
                          Search Preview
                        </label>
                        <div className="bg-n-7 border border-n-6 rounded-lg p-4">
                          <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                            {formData.title || "Post Title"}
                          </div>
                          <div className="text-green-700 text-sm">
                            https://pritechvior.com/blog/{formData.slug || "post-slug"}
                          </div>
                          <div className="text-n-3 text-sm mt-1">
                            {formData.meta_description || formData.excerpt || "Post description will appear here..."}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-n-1 mb-4">Post Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-n-1 mb-2">
                          Publish Date
                        </label>
                        <input
                          type="datetime-local"
                          name="published_at"
                          value={formData.published_at}
                          onChange={handleChange}
                          className="w-full bg-n-7 border border-n-6 rounded-lg px-4 py-3 text-n-1 focus:outline-none focus:border-color-1"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="featured"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleChange}
                          className="w-4 h-4 text-color-1 bg-n-7 border-n-6 rounded focus:ring-color-1"
                        />
                        <label htmlFor="featured" className="text-sm font-medium text-n-1">
                          Featured Post
                        </label>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publish Box */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-n-1 mb-4 flex items-center gap-2">
                  <Settings size={20} />
                  Publish
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-n-1 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full bg-n-7 border border-n-6 rounded-lg px-4 py-3 text-n-1 focus:outline-none focus:border-color-1"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      type="submit"
                      disabled={saving}
                      className="w-full"
                      icon={<Save size={16} />}
                    >
                      {saving ? "Saving..." : "Save & Exit"}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="secondary"
                      disabled={saving}
                      className="w-full"
                      onClick={handleSaveAndContinue}
                      icon={<Save size={16} />}
                    >
                      Save & Continue
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Categories */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-n-1 mb-4 flex items-center gap-2">
                  <Tag size={20} />
                  Categories
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-n-1 mb-2">
                    Primary Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-n-7 border border-n-6 rounded-lg px-4 py-3 text-n-1 focus:outline-none focus:border-color-1"
                  >
                    <option value="">Select category...</option>
                    {categoryOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </Card>

              {/* Tags */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-n-1 mb-4 flex items-center gap-2">
                  <Tag size={20} />
                  Tags
                </h3>
                
                <Input
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="tag1, tag2, tag3"
                  helperText="Separate tags with commas"
                />
              </Card>

              {/* Author Info */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-n-1 mb-4 flex items-center gap-2">
                  <User size={20} />
                  Author
                </h3>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-color-1 to-color-2 rounded-full flex items-center justify-center text-white font-semibold">
                    A
                  </div>
                  <div>
                    <p className="text-n-1 font-medium">{formData.author || "Admin"}</p>
                    <p className="text-n-4 text-sm">Administrator</p>
                  </div>
                </div>
              </Card>

              {/* Post Stats */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-n-1 mb-4">Statistics</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-n-4">Views:</span>
                    <span className="text-n-1 font-medium">{formData.views || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-n-4">Likes:</span>
                    <span className="text-n-1 font-medium">{formData.like_count || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-n-4">Comments:</span>
                    <span className="text-n-1 font-medium">{formData.comment_count || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-n-4">Created:</span>
                    <span className="text-n-1 font-medium">
                      {formData.created_at ? new Date(formData.created_at).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default UpdatePost;