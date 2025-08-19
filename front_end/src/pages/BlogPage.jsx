import { useState, useEffect } from "react";
import { Calendar, User, Clock, Tag } from "lucide-react";
import Section from "../components/Section";
import Heading from "../components/Heading";
import Button from "../components/Button";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useToast } from "../contexts/ToastContext";
import blogService from "../services/blogService";

const BlogPage = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      console.log(
        "Fetching blog posts from:",
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"
        }/blog/api/posts/`
      );
      const posts = await blogService.getBlogPosts();
      console.log("Received blog posts:", posts);
      setBlogPosts(posts);
    } catch (err) {
      console.error("Error fetching blog posts:", err);
      setError("Failed to load blog posts");
      showError("Failed to load blog posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      showError("Please enter a valid email address.");
      return;
    }

    try {
      setNewsletterLoading(true);
      await blogService.subscribeNewsletter(newsletterEmail.trim());
      showSuccess("Successfully subscribed to newsletter!");
      setNewsletterEmail("");
    } catch (err) {
      console.error("Newsletter subscription error:", err);
      if (err.message.includes("400")) {
        showError("This email is already subscribed to our newsletter.");
      } else {
        showError("Failed to subscribe. Please try again later.");
      }
    } finally {
      setNewsletterLoading(false);
    }
  };
  const BlogCard = ({ post }) => (
    <article className="bg-n-7 rounded-xl overflow-hidden border border-n-6 hover:border-color-1 transition-colors group">
      {post.image && (
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="px-2 py-1 bg-color-1/20 text-color-1 rounded-full text-xs">
            {post.category}
          </span>
          {post.featured && (
            <span className="px-2 py-1 bg-color-2 text-white rounded-full text-xs font-semibold">
              Featured
            </span>
          )}
        </div>

        <h2 className="text-lg font-semibold text-n-1 mb-2 hover:text-color-1 transition-colors cursor-pointer line-clamp-2">
          {post.title}
        </h2>

        <p className="text-n-3 text-sm mb-3 line-clamp-2">{post.excerpt}</p>

        <div className="flex items-center gap-3 text-xs text-n-4 mb-3">
          <div className="flex items-center gap-1">
            <User size={12} />
            <span className="truncate">{post.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            {new Date(
              post.published_at || post.created_at
            ).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1">
            <Clock size={12} />
            {post.read_time || "5 min read"}
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {post.tags &&
            post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-n-6 text-n-2 rounded text-xs flex items-center gap-1"
              >
                <Tag size={8} />
                {tag}
              </span>
            ))}
          {post.tags && post.tags.length > 3 && (
            <span className="px-2 py-1 bg-n-6 text-n-2 rounded text-xs">
              +{post.tags.length - 3}
            </span>
          )}
        </div>

        <Button className="w-full text-sm py-2" href={`/blog/${post.slug}`}>
          Read More
        </Button>
      </div>
    </article>
  );

  return (
    <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
      <Header />

      <Section className="pt-[12rem] -mt-[5.25rem]" id="blog">
        <div className="container relative">
          <Heading
            className="md:max-w-md lg:max-w-2xl text-center mx-auto"
            title="PritechVior Blog"
            text="Stay updated with the latest insights, tutorials, and industry trends in technology, digital transformation, and software development."
          />

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-color-1 mx-auto mb-4"></div>
              <p className="text-n-3">Loading blog posts...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400 mb-4">{error}</p>
              <Button onClick={fetchBlogPosts}>Try Again</Button>
            </div>
          ) : (
            <>
              {/* Featured Posts */}
              {blogPosts.filter((post) => post.featured).length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-semibold text-n-1 mb-6 text-center">
                    Featured Posts
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center max-w-6xl mx-auto">
                    {blogPosts
                      .filter((post) => post.featured)
                      .map((post) => (
                        <BlogCard key={post.id} post={post} />
                      ))}
                  </div>
                </div>
              )}

              {/* All Posts */}
              <div>
                <h2 className="text-2xl font-semibold text-n-1 mb-6 text-center">
                  {blogPosts.filter((post) => post.featured).length > 0
                    ? "All Posts"
                    : "Latest Posts"}
                </h2>
                {blogPosts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center max-w-7xl mx-auto">
                    {blogPosts.map((post) => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-n-3">No blog posts available yet.</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Newsletter Signup */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-color-1/10 to-color-2/10 rounded-2xl p-8 border border-color-1/20">
              <h3 className="text-2xl font-semibold text-n-1 mb-4">
                Stay Updated
              </h3>
              <p className="text-n-3 mb-6 max-w-2xl mx-auto">
                Subscribe to our newsletter to get the latest articles,
                tutorials, and industry insights delivered to your inbox.
              </p>
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={newsletterLoading}
                  className="flex-1 bg-n-7 border border-n-6 rounded-lg px-4 py-3 text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <Button
                  type="submit"
                  disabled={newsletterLoading || !newsletterEmail.trim()}
                  className="whitespace-nowrap"
                >
                  {newsletterLoading ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </Section>

      <Footer />
    </div>
  );
};

export default BlogPage;
