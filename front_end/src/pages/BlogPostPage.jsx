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
  Download,
  Eye,
  Send,
  MoreHorizontal,
  Image as ImageIcon,
  FileText,
} from "lucide-react";
import Section from "../components/Section";
import Button from "../components/Button";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import authService from "../services/authService";
import blogService from "../services/blogService";

const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  console.log("BlogPostPage rendered with slug:", slug);

  // Post data
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Interactive features
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [images, setImages] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // UI states
  const [showComments, setShowComments] = useState(true);
  const [commenting, setCommenting] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        console.log("Fetching blog post with slug:", slug);
        console.log(
          "API URL:",
          `${
            import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"
          }/blog/api/posts/${slug}/`
        );

        // First, fetch the main post data
        const postData = await blogService.getBlogPostBySlug(slug);
        console.log("Received post data:", postData);

        setPost(postData);
        setLiked(postData.user_has_liked || false);

        // Then fetch additional data (but don't fail if these endpoints don't exist)
        try {
          const commentsData = await blogService.getComments(slug);
          setComments(commentsData);
          console.log("Received comments:", commentsData);
        } catch (err) {
          console.log("Comments endpoint not available:", err.message);
          setComments([]);
        }

        try {
          const imagesData = await blogService.getPostImages(slug);
          setImages(imagesData);
          console.log("Received images:", imagesData);
        } catch (err) {
          console.log("Images endpoint not available:", err.message);
          setImages([]);
        }

        try {
          const downloadsData = await blogService.getPostDownloads(slug);
          setDownloads(downloadsData);
          console.log("Received downloads:", downloadsData);
        } catch (err) {
          console.log("Downloads endpoint not available:", err.message);
          setDownloads([]);
        }
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError("Failed to load blog post");
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      showWarning("Please log in to like posts.");
      return;
    }

    try {
      const { accessToken } = authService.getTokens();
      console.log(
        "Access token for like:",
        accessToken ? "Token exists" : "No token"
      );
      console.log(
        "Token preview:",
        accessToken ? `${accessToken.substring(0, 20)}...` : "null"
      );

      const result = await blogService.toggleLike(slug, accessToken);

      setLiked(result.liked);
      setPost((prev) => ({
        ...prev,
        like_count: result.like_count,
        user_has_liked: result.liked,
      }));

      showSuccess(result.liked ? "Post liked!" : "Post unliked!");
    } catch (err) {
      showError("Failed to toggle like. Please try again.");
      console.error("Error toggling like:", err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    if (!isAuthenticated) {
      showWarning("Please log in to comment.");
      return;
    }

    try {
      setCommenting(true);
      const { accessToken } = authService.getTokens();
      const newComment = await blogService.addComment(
        slug,
        comment,
        null,
        accessToken
      );

      setComments((prev) => [...prev, newComment]);
      setComment("");
      setPost((prev) => ({
        ...prev,
        comment_count: prev.comment_count + 1,
      }));

      showSuccess("Comment added successfully!");
    } catch (err) {
      showError("Failed to add comment. Please try again.");
      console.error("Error adding comment:", err);
    } finally {
      setCommenting(false);
    }
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
      try {
        await navigator.clipboard.writeText(window.location.href);
        showSuccess("Link copied to clipboard!");
      } catch (err) {
        showError("Failed to copy URL");
      }
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!isAuthenticated) {
      showWarning("Please log in to comment.");
      return;
    }

    try {
      setIsAddingComment(true);
      const { accessToken } = authService.getTokens();
      console.log(
        "Access token for comment:",
        accessToken ? "Token exists" : "No token"
      );
      console.log(
        "Token preview:",
        accessToken ? `${accessToken.substring(0, 20)}...` : "null"
      );

      const comment = await blogService.addComment(
        slug,
        newComment,
        null,
        accessToken
      );

      setComments((prev) => [...prev, comment]);
      setNewComment("");
      setPost((prev) => ({
        ...prev,
        comment_count: prev.comment_count + 1,
      }));

      showSuccess("Comment added successfully!");
    } catch (err) {
      showError("Failed to add comment. Please try again.");
      console.error("Error adding comment:", err);
    } finally {
      setIsAddingComment(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownload = async (downloadItem) => {
    try {
      setDownloading(true);
      const { accessToken } = authService.getTokens();

      if (downloadItem.is_premium && !isAuthenticated) {
        showWarning("Please log in to download premium content.");
        return;
      }

      const downloadData = await blogService.downloadFile(
        slug,
        downloadItem.id,
        isAuthenticated ? accessToken : null
      );

      // Open download URL
      window.open(downloadData.download_url, "_blank");
      showSuccess(`Downloading ${downloadData.title}...`);
    } catch (err) {
      if (err.message.includes("Authentication required")) {
        showWarning("Please log in to download this file.");
      } else {
        showError("Failed to download file. Please try again.");
      }
      console.error("Error downloading file:", err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Section className="pt-[12rem] -mt-[5.25rem]">
          <div className="container relative">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-color-1 mx-auto mb-4"></div>
              <p className="text-n-3">Loading blog post...</p>
            </div>
          </div>
        </Section>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Section className="pt-[12rem] -mt-[5.25rem]">
          <div className="container relative">
            <div className="text-center py-12">
              <h1 className="text-2xl font-semibold text-n-1 mb-4">
                {error || "Post not found"}
              </h1>
              <p className="text-n-3 mb-6">
                {error
                  ? "There was an error loading the blog post."
                  : "The blog post you're looking for doesn't exist."}
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
                    {formatDate(post.published_at || post.created_at)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{post.read_time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye size={16} />
                  <span>{post.views} views</span>
                </div>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
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
              )}
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

            {/* Additional Images Gallery (Instagram-like) */}
            {images && images.length > 0 && (
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.image_source}
                        alt={image.caption || `Image ${index + 1}`}
                        className="w-full h-48 object-cover rounded-xl border border-n-6 cursor-pointer
                                 group-hover:opacity-90 transition-opacity"
                        onClick={() => setCurrentImageIndex(index)}
                      />
                      {image.caption && (
                        <div
                          className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 
                                      text-sm rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {image.caption}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instagram-like Interaction Bar */}
            <div className="mb-8 p-4 bg-n-8 rounded-xl border border-n-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 transition-colors ${
                      liked ? "text-red-500" : "text-n-3 hover:text-red-500"
                    }`}
                  >
                    <Heart size={20} fill={liked ? "currentColor" : "none"} />
                    <span>{post.like_count || 0}</span>
                  </button>

                  <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center gap-2 text-n-3 hover:text-color-1 transition-colors"
                  >
                    <MessageCircle size={20} />
                    <span>{post.comment_count || 0}</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 text-n-3 hover:text-color-1 transition-colors"
                  >
                    <Share2 size={20} />
                    <span>Share</span>
                  </button>
                </div>

                {downloads && downloads.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Download size={16} className="text-n-4" />
                    <span className="text-sm text-n-4">
                      {downloads.length} downloads
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <article className="prose prose-lg max-w-none prose-headings:text-n-1 prose-p:text-n-3 prose-strong:text-n-1 prose-a:text-color-1 prose-blockquote:text-n-3 prose-blockquote:border-color-1 prose-code:text-color-1 prose-code:bg-n-7 mb-8">
              <div className="text-lg text-n-2 mb-8 leading-relaxed">
                {post.excerpt}
              </div>

              <div className="text-n-3 leading-relaxed space-y-6">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
            </article>

            {/* Downloads Section */}
            {downloads && downloads.length > 0 && (
              <div className="mb-8 p-6 bg-n-8 rounded-xl border border-n-6">
                <h3 className="text-xl font-semibold text-n-1 mb-4 flex items-center gap-2">
                  <Download size={20} />
                  Downloads
                </h3>
                <div className="grid gap-4">
                  {downloads.map((download) => (
                    <div
                      key={download.id}
                      className="flex items-center justify-between p-4 bg-n-7 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText size={20} className="text-color-1" />
                        <div>
                          <h4 className="text-n-1 font-medium">
                            {download.title}
                          </h4>
                          <p className="text-n-4 text-sm">
                            {download.description}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownload(download)}
                        disabled={downloading}
                        className="px-4 py-2 bg-color-1 text-n-8 rounded-lg hover:bg-color-2 
                                 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {downloading ? "Downloading..." : "Download"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            {showComments && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-n-1 mb-4 flex items-center gap-2">
                  <MessageCircle size={20} />
                  Comments ({comments.length})
                </h3>

                {/* Add Comment Form */}
                {user && (
                  <form
                    onSubmit={handleAddComment}
                    className="mb-6 p-4 bg-n-8 rounded-xl border border-n-6"
                  >
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="w-full p-3 bg-n-7 border border-n-6 rounded-lg text-n-1 placeholder-n-4 
                               focus:border-color-1 focus:outline-none resize-none"
                      rows="3"
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        type="submit"
                        disabled={!newComment.trim() || isAddingComment}
                        className="px-4 py-2 bg-color-1 text-n-8 rounded-lg hover:bg-color-2 
                                 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isAddingComment ? "Posting..." : "Post Comment"}
                      </button>
                    </div>
                  </form>
                )}

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.length > 0 ? (
                    comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="p-4 bg-n-8 rounded-xl border border-n-6"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-color-1 rounded-full flex items-center justify-center text-n-8 text-sm font-medium">
                            {comment.author_name
                              ? comment.author_name.charAt(0).toUpperCase()
                              : "A"}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-n-1">
                                {comment.author_name || "Anonymous"}
                              </span>
                              <span className="text-n-4 text-sm">
                                {formatDate(comment.created_at)}
                              </span>
                            </div>
                            <p className="text-n-3">{comment.content}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-n-4">
                      <MessageCircle
                        size={48}
                        className="mx-auto mb-2 opacity-50"
                      />
                      <p>No comments yet. Be the first to comment!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </article>
        </div>
      </Section>

      <Footer />
    </div>
  );
};

export default BlogPostPage;
