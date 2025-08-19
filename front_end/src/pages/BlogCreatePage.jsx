import { useState } from "react";
import { Save, X, Upload, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Section from "../components/Section";
import Heading from "../components/Heading";
import Button from "../components/Button";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useToast } from "../contexts/ToastContext";

const BlogCreatePage = () => {
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "PritechVior Team",
    category: "Technology",
    tags: "",
    featured: false,
    image: null,
    imagePreview: null,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          image: file,
          imagePreview: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // In a real application, you would send this data to your backend
    console.log("Blog post created:", formData);

    // Show success message and redirect
    showSuccess("Blog post created successfully!");
    navigate("/blog");
  };

  return (
    <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
      <Header />

      <Section className="pt-[12rem] -mt-[5.25rem]" id="blog-create">
        <div className="container relative max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <Button
              onClick={() => navigate("/blog")}
              className="flex items-center gap-2 text-sm"
              variant="secondary"
            >
              <ArrowLeft size={16} />
              Back to Blog
            </Button>
          </div>

          <Heading
            className="md:max-w-md lg:max-w-2xl text-center mx-auto"
            title="Create New Blog Post"
            text="Share your knowledge and insights with the community by creating a new blog post."
          />

          <div className="bg-n-7 rounded-xl p-8 border border-n-6">
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
                    placeholder="Enter an engaging title"
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
                  placeholder="Write a compelling excerpt that summarizes your post"
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
                  rows={12}
                  className="w-full bg-n-8 border border-n-6 rounded-lg px-4 py-3 text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none resize-none"
                  placeholder="Write your blog post content here. You can use line breaks to separate paragraphs."
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
                    {formData.image && (
                      <span className="text-n-3 text-sm">
                        {formData.image.name}
                      </span>
                    )}
                  </div>

                  {formData.imagePreview && (
                    <div className="relative inline-block">
                      <img
                        src={formData.imagePreview}
                        alt="Preview"
                        className="w-48 h-32 object-cover rounded-lg border border-n-6"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            image: null,
                            imagePreview: null,
                          }))
                        }
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
                <label
                  htmlFor="featured"
                  className="text-n-2 text-sm font-medium"
                >
                  Mark as Featured Post
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="submit"
                  className="flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  Publish Post
                </Button>
                <button
                  type="button"
                  onClick={() => navigate("/blog")}
                  className="flex items-center justify-center gap-2 px-6 py-3 border border-n-6 rounded-lg text-n-2 hover:border-color-1 hover:text-color-1 transition-colors"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </Section>

      <Footer />
    </div>
  );
};

export default BlogCreatePage;
