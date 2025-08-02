import { useState } from "react";
import { Plus, Edit, Trash2, Save, X, Upload, Image as ImageIcon } from "lucide-react";
import Section from "../components/Section";
import Heading from "../components/Heading";
import Button from "../components/Button";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { blogPosts as initialBlogPosts } from "../constants";

const BlogManagePage = () => {
  const [blogPosts, setBlogPosts] = useState(initialBlogPosts);
  const [isCreating, setIsCreating] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "PritechVior Team",
    category: "Technology",
    tags: "",
    featured: false,
    image: null,
    imagePreview: null
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      author: "PritechVior Team",
      category: "Technology",
      tags: "",
      featured: false,
      image: null,
      imagePreview: null
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newPost = {
      id: editingPost ? editingPost.id : Date.now().toString(),
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      author: formData.author,
      date: editingPost ? editingPost.date : new Date().toISOString().split('T')[0],
      category: formData.category,
      readTime: `${Math.ceil(formData.content.split(' ').length / 200)} min read`,
      featured: formData.featured,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      image: formData.imagePreview || (editingPost ? editingPost.image : null)
    };

    if (editingPost) {
      setBlogPosts(prev => prev.map(post => 
        post.id === editingPost.id ? newPost : post
      ));
      setEditingPost(null);
    } else {
      setBlogPosts(prev => [newPost, ...prev]);
      setIsCreating(false);
    }

    resetForm();
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content || "",
      author: post.author,
      category: post.category,
      tags: post.tags.join(", "),
      featured: post.featured,
      image: null,
      imagePreview: post.image || null
    });
  };

  const handleDelete = (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setBlogPosts(prev => prev.filter(post => post.id !== postId));
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingPost(null);
    resetForm();
  };

  const BlogForm = () => (
    <div className="bg-n-7 rounded-xl p-6 border border-n-6 mb-8">
      <h3 className="text-xl font-semibold text-n-1 mb-6">
        {editingPost ? "Edit Blog Post" : "Create New Blog Post"}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-n-2 text-sm font-medium mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full bg-n-8 border border-n-6 rounded-lg px-4 py-3 text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none"
              placeholder="Enter blog post title"
            />
          </div>
          
          <div>
            <label className="block text-n-2 text-sm font-medium mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full bg-n-8 border border-n-6 rounded-lg px-4 py-3 text-n-1 focus:border-color-1 focus:outline-none"
            >
              <option value="Technology">Technology</option>
              <option value="Web Development">Web Development</option>
              <option value="Business">Business</option>
              <option value="Fintech">Fintech</option>
              <option value="Tutorial">Tutorial</option>
              <option value="News">News</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-n-2 text-sm font-medium mb-2">
              Author *
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              required
              className="w-full bg-n-8 border border-n-6 rounded-lg px-4 py-3 text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none"
              placeholder="Enter author name"
            />
          </div>
          
          <div>
            <label className="block text-n-2 text-sm font-medium mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="w-full bg-n-8 border border-n-6 rounded-lg px-4 py-3 text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none"
              placeholder="React, JavaScript, Tutorial"
            />
          </div>
        </div>

        <div>
          <label className="block text-n-2 text-sm font-medium mb-2">
            Excerpt *
          </label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleInputChange}
            required
            rows={3}
            className="w-full bg-n-8 border border-n-6 rounded-lg px-4 py-3 text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none resize-none"
            placeholder="Enter a brief excerpt of the blog post"
          />
        </div>

        <div>
          <label className="block text-n-2 text-sm font-medium mb-2">
            Content *
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
            rows={8}
            className="w-full bg-n-8 border border-n-6 rounded-lg px-4 py-3 text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none resize-none"
            placeholder="Write your blog post content here..."
          />
        </div>

        <div>
          <label className="block text-n-2 text-sm font-medium mb-2">
            Featured Image
          </label>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 bg-n-8 border border-n-6 rounded-lg px-4 py-3 cursor-pointer hover:border-color-1 transition-colors">
                <Upload size={20} className="text-color-1" />
                <span className="text-n-2">Choose Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            
            {formData.imagePreview && (
              <div className="relative inline-block">
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border border-n-6"
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, image: null, imagePreview: null }))}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={formData.featured}
            onChange={handleInputChange}
            className="w-4 h-4 text-color-1 bg-n-8 border-n-6 rounded focus:ring-color-1"
          />
          <label htmlFor="featured" className="text-n-2 text-sm font-medium">
            Mark as Featured Post
          </label>
        </div>

        <div className="flex gap-4">
          <Button type="submit" className="flex items-center gap-2">
            <Save size={16} />
            {editingPost ? "Update Post" : "Create Post"}
          </Button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center gap-2 px-6 py-3 border border-n-6 rounded-lg text-n-2 hover:border-color-1 hover:text-color-1 transition-colors"
          >
            <X size={16} />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  const BlogPostCard = ({ post }) => (
    <div className="bg-n-7 rounded-xl p-6 border border-n-6">
      {post.image && (
        <div className="mb-4">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-3 py-1 bg-color-1/20 text-color-1 rounded-full text-xs">
          {post.category}
        </span>
        {post.featured && (
          <span className="px-3 py-1 bg-color-2 text-white rounded-full text-xs font-semibold">
            Featured
          </span>
        )}
      </div>

      <h3 className="text-lg font-semibold text-n-1 mb-2">{post.title}</h3>
      <p className="text-n-3 text-sm mb-4">{post.excerpt}</p>
      
      <div className="flex items-center justify-between">
        <div className="text-xs text-n-4">
          By {post.author} • {new Date(post.date).toLocaleDateString()}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(post)}
            className="p-2 text-color-1 hover:bg-color-1/10 rounded-lg transition-colors"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDelete(post.id)}
            className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
      <Header />
      
      <Section className="pt-[12rem] -mt-[5.25rem]" id="blog-manage">
        <div className="container relative">
          <Heading
            className="md:max-w-md lg:max-w-2xl text-center mx-auto"
            title="Blog Management"
            text="Create, edit, and manage your blog posts with ease. Add images and rich content to engage your audience."
          />

          <div className="mb-8">
            {!isCreating && !editingPost && (
              <Button
                onClick={() => setIsCreating(true)}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Create New Post
              </Button>
            )}
          </div>

          {(isCreating || editingPost) && <BlogForm />}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>

          {blogPosts.length === 0 && (
            <div className="text-center py-12">
              <ImageIcon size={48} className="mx-auto text-n-4 mb-4" />
              <h3 className="text-xl font-semibold text-n-2 mb-2">No blog posts yet</h3>
              <p className="text-n-4 mb-6">Create your first blog post to get started.</p>
              <Button onClick={() => setIsCreating(true)}>
                Create First Post
              </Button>
            </div>
          )}
        </div>
      </Section>

      <Footer />
    </div>
  );
};

export default BlogManagePage;
