import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  User,
  Clock,
  Tag,
  ArrowLeft,
  Share2,
  Heart,
  MessageCircle,
} from "lucide-react";
import Section from "../components/Section";
import Button from "../components/Button";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useToast } from "../contexts/ToastContext";
import { blogPosts } from "../constants";

const BlogPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const foundPost = blogPosts.find((p) => p.id === id);
    if (foundPost) {
      setPost(foundPost);
      setLikes(Math.floor(Math.random() * 100) + 10); // Simulate likes
      // Simulate some comments
      setComments([
        {
          id: 1,
          author: "John Doe",
          date: "2025-07-31",
          content: "Great article! Very informative and well-written.",
          avatar: "JD",
        },
        {
          id: 2,
          author: "Jane Smith",
          date: "2025-07-30",
          content:
            "Thanks for sharing this. It helped me understand the concepts better.",
          avatar: "JS",
        },
      ]);
    }
  }, [id]);

  const handleLike = () => {
    setLiked(!liked);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      showSuccess("Link copied to clipboard!");
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      const newComment = {
        id: comments.length + 1,
        author: "Anonymous User",
        date: new Date().toISOString().split("T")[0],
        content: comment,
        avatar: "AU",
      };
      setComments((prev) => [newComment, ...prev]);
      setComment("");
    }
  };

  if (!post) {
    return (
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Section className="pt-[12rem] -mt-[5.25rem]">
          <div className="container relative">
            <div className="text-center py-12">
              <h1 className="text-2xl font-semibold text-n-1 mb-4">
                Post not found
              </h1>
              <p className="text-n-3 mb-6">
                The blog post you're looking for doesn't exist.
              </p>
              <Button onClick={() => navigate("/blog")}>Back to Blog</Button>
            </div>
          </div>
        </Section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
      <Header />

      <Section className="pt-[12rem] -mt-[5.25rem]" id="blog-post">
        <div className="container relative">
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

          {/* Article Header */}
          <article className="max-w-4xl mx-auto">
            <header className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-color-1/20 text-color-1 rounded-full text-sm">
                  {post.category}
                </span>
                {post.featured && (
                  <span className="px-3 py-1 bg-color-2 text-white rounded-full text-sm font-semibold">
                    Featured
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-n-1 mb-6 leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-sm text-n-4 mb-6">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{post.readTime}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-n-7 text-n-2 rounded-full text-sm flex items-center gap-1"
                  >
                    <Tag size={12} />
                    {tag}
                  </span>
                ))}
              </div>
            </header>

            {/* Featured Image */}
            {post.image && (
              <div className="mb-8">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-64 md:h-96 object-cover rounded-xl border border-n-6"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-invert max-w-none mb-12">
              <div className="text-lg text-n-2 mb-8 leading-relaxed">
                {post.excerpt}
              </div>

              <div className="text-n-3 leading-relaxed space-y-6">
                {post.content ? (
                  post.content.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <div className="space-y-6">
                    <p>
                      This is the main content of the blog post. In a real
                      implementation, this would be the full article content
                      stored in your database or CMS.
                    </p>
                    <p>
                      You can format this content with markdown, HTML, or any
                      other rich text format that suits your needs. The content
                      can include code snippets, images, lists, and other
                      formatting elements.
                    </p>
                    <p>
                      For now, this is placeholder content to demonstrate the
                      blog post layout and functionality.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Social Actions */}
            <div className="flex items-center gap-4 py-6 border-y border-n-6 mb-8">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  liked
                    ? "bg-red-500/20 text-red-400"
                    : "bg-n-7 text-n-3 hover:bg-n-6"
                }`}
              >
                <Heart size={16} fill={liked ? "currentColor" : "none"} />
                <span>{likes}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-n-7 text-n-3 rounded-lg hover:bg-n-6 transition-colors"
              >
                <Share2 size={16} />
                Share
              </button>

              <div className="flex items-center gap-2 text-n-4">
                <MessageCircle size={16} />
                <span>{comments.length} comments</span>
              </div>
            </div>

            {/* Comments Section */}
            <div className="space-y-8">
              <h3 className="text-2xl font-semibold text-n-1">Comments</h3>

              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={4}
                  className="w-full bg-n-7 border border-n-6 rounded-lg px-4 py-3 text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none resize-none"
                />
                <Button type="submit" disabled={!comment.trim()}>
                  Post Comment
                </Button>
              </form>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-n-7 rounded-lg p-6 border border-n-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-color-1 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {comment.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-n-1">
                            {comment.author}
                          </span>
                          <span className="text-n-4 text-sm">
                            {new Date(comment.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-n-3">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {comments.length === 0 && (
                  <div className="text-center py-8 text-n-4">
                    No comments yet. Be the first to share your thoughts!
                  </div>
                )}
              </div>
            </div>
          </article>
        </div>
      </Section>

      <Footer />
    </div>
  );
};

export default BlogPostPage;
