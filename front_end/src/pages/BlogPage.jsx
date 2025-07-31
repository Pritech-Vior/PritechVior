import { Calendar, User, Clock, Tag } from "lucide-react";
import Section from "../components/Section";
import Heading from "../components/Heading";
import Button from "../components/Button";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { blogPosts } from "../constants";

const BlogPage = () => {
  const BlogCard = ({ post }) => (
    <article className="bg-n-7 rounded-xl p-6 border border-n-6 hover:border-color-1 transition-colors">
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

      <h2 className="text-xl font-semibold text-n-1 mb-3 hover:text-color-1 transition-colors cursor-pointer">
        {post.title}
      </h2>
      
      <p className="text-n-3 text-sm mb-4">{post.excerpt}</p>

      <div className="flex items-center gap-4 text-xs text-n-4 mb-4">
        <div className="flex items-center gap-1">
          <User size={14} />
          {post.author}
        </div>
        <div className="flex items-center gap-1">
          <Calendar size={14} />
          {new Date(post.date).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-1">
          <Clock size={14} />
          {post.readTime}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags.map((tag, index) => (
          <span key={index} className="px-2 py-1 bg-n-6 text-n-2 rounded text-xs">
            #{tag}
          </span>
        ))}
      </div>

      <Button className="w-full" href={`/blog/${post.id}`}>
        Read More
      </Button>
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

          {/* Featured Posts */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-n-1 mb-6">Featured Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogPosts.filter(post => post.featured).map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>

          {/* All Posts */}
          <div>
            <h2 className="text-2xl font-semibold text-n-1 mb-6">All Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-color-1/10 to-color-2/10 rounded-2xl p-8 border border-color-1/20">
              <h3 className="text-2xl font-semibold text-n-1 mb-4">
                Stay Updated
              </h3>
              <p className="text-n-3 mb-6 max-w-2xl mx-auto">
                Subscribe to our newsletter to get the latest articles, tutorials, and industry insights delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-n-7 border border-n-6 rounded-lg px-4 py-3 text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none"
                />
                <Button>Subscribe</Button>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Footer />
    </div>
  );
};

export default BlogPage;
