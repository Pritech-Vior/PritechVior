import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Download,
  Star,
  Package,
  Shield,
  Calendar,
  User,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Section from "../components/Section";
import Button from "../components/Button";
import archiveService from "../services/archiveService";

const ArchiveDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [archive, setArchive] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadRequesting, setDownloadRequesting] = useState(false);
  const [downloadEmail, setDownloadEmail] = useState("");
  const [downloadMessage, setDownloadMessage] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState(5);

  useEffect(() => {
    const fetchArchiveDetails = async () => {
      try {
        setLoading(true);
        const data = await archiveService.getArchiveById(id);
        setArchive(data);
      } catch (err) {
        setError("Failed to load archive details");
        console.error("Error fetching archive:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const data = await archiveService.getArchiveComments(id);
        setComments(data.results || data);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    fetchArchiveDetails();
    fetchComments();
  }, [id]);

  const handleDownloadRequest = async (e) => {
    e.preventDefault();
    if (!downloadEmail.trim()) return;

    try {
      setDownloadRequesting(true);
      await archiveService.requestDownload(id, downloadEmail, downloadMessage);
      alert(
        "Download request submitted successfully! We will contact you soon."
      );
      setDownloadEmail("");
      setDownloadMessage("");
    } catch (err) {
      alert("Failed to submit download request. Please try again.");
      console.error("Error requesting download:", err);
    } finally {
      setDownloadRequesting(false);
    }
  };

  const handleDirectDownload = async () => {
    try {
      setDownloadRequesting(true);

      // If there's a download URL, open it directly
      if (archive.download_url) {
        window.open(archive.download_url, "_blank");
        // Increment download count
        archive.download_count = (archive.download_count || 0) + 1;
        return;
      }

      // Otherwise, get download from API
      const downloadData = await archiveService.getDirectDownload(id);

      if (downloadData instanceof Blob) {
        // Handle file blob download
        const url = window.URL.createObjectURL(downloadData);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${archive.title}-v${archive.version}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else if (downloadData.download_url) {
        // Handle external URL
        window.open(downloadData.download_url, "_blank");
      } else {
        throw new Error("No download available");
      }

      // Increment download count
      archive.download_count = (archive.download_count || 0) + 1;
    } catch (err) {
      alert(
        "Failed to start download. Please try the request download option."
      );
      console.error("Error downloading:", err);
    } finally {
      setDownloadRequesting(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      // This would need authentication token in real implementation
      await archiveService.addComment(
        id,
        commentText,
        commentRating,
        "dummy-token"
      );
      setCommentText("");
      setCommentRating(5);

      // Refresh comments
      try {
        const data = await archiveService.getArchiveComments(id);
        setComments(data.results || data);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    } catch (err) {
      alert("Failed to add comment. Please log in and try again.");
      console.error("Error adding comment:", err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? "text-yellow-400 fill-current" : "text-n-4"}
      />
    ));
  };

  if (loading) {
    return (
      <>
        <Header />
        <Section className="pt-[12rem] -mt-[5.25rem]">
          <div className="container">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <Package
                  size={64}
                  className="mx-auto text-n-4 mb-4 animate-pulse"
                />
                <p className="text-n-3">Loading archive details...</p>
              </div>
            </div>
          </div>
        </Section>
        <Footer />
      </>
    );
  }

  if (error || !archive) {
    return (
      <>
        <Header />
        <Section className="pt-[12rem] -mt-[5.25rem]">
          <div className="container">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <Package size={64} className="mx-auto text-n-4 mb-4" />
                <h3 className="text-xl font-semibold text-n-1 mb-2">
                  Archive Not Found
                </h3>
                <p className="text-n-3 mb-6">
                  {error || "The requested archive could not be found."}
                </p>
                <Button onClick={() => navigate("/archive")}>
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Archive
                </Button>
              </div>
            </div>
          </div>
        </Section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <Section className="pt-[12rem] -mt-[5.25rem]">
        <div className="container">
          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => navigate("/archive")}
            className="mb-8"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Archive
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Archive Header */}
              <div className="bg-n-7 rounded-xl p-8 border border-n-6 mb-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <Package size={48} className="text-color-1" />
                    <div>
                      <h1 className="text-3xl font-bold text-n-1 mb-2">
                        {archive.title}
                      </h1>
                      <div className="flex items-center gap-4 text-n-3">
                        <span>v{archive.version}</span>
                        <span className="flex items-center gap-1">
                          <Calendar size={16} />
                          {formatDate(archive.created_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <User size={16} />
                          {archive.author || "Pritech Vior"}
                        </span>
                      </div>
                    </div>
                  </div>
                  {archive.featured && (
                    <div className="bg-color-2 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </div>
                  )}
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-n-8 rounded-lg">
                    <Download size={24} className="mx-auto text-color-1 mb-2" />
                    <div className="text-lg font-semibold text-n-1">
                      {archive.download_count || 0}
                    </div>
                    <div className="text-xs text-n-4">Downloads</div>
                  </div>
                  <div className="text-center p-4 bg-n-8 rounded-lg">
                    <Star size={24} className="mx-auto text-yellow-400 mb-2" />
                    <div className="text-lg font-semibold text-n-1">
                      {archive.average_rating || "N/A"}
                    </div>
                    <div className="text-xs text-n-4">Rating</div>
                  </div>
                  <div className="text-center p-4 bg-n-8 rounded-lg">
                    <Package
                      size={24}
                      className="mx-auto text-green-400 mb-2"
                    />
                    <div className="text-lg font-semibold text-n-1">
                      {archive.file_size_display ||
                        archive.file_size_formatted ||
                        (archive.file_size
                          ? `${(archive.file_size / 1024 / 1024).toFixed(1)} MB`
                          : "N/A")}
                    </div>
                    <div className="text-xs text-n-4">Size</div>
                  </div>
                  <div className="text-center p-4 bg-n-8 rounded-lg">
                    <Shield size={24} className="mx-auto text-blue-400 mb-2" />
                    <div className="text-lg font-semibold text-n-1">
                      Verified
                    </div>
                    <div className="text-xs text-n-4">Status</div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-color-1/20 text-color-1 rounded-full text-sm font-medium">
                    {archive.category}
                  </span>
                  {archive.tags &&
                    archive.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-n-6 text-n-2 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                </div>

                {/* Description */}
                <div className="prose prose-invert max-w-none">
                  <h3 className="text-lg font-semibold text-n-1 mb-3">
                    Description
                  </h3>
                  <p className="text-n-3 leading-relaxed">
                    {archive.description}
                  </p>
                </div>
              </div>

              {/* System Requirements */}
              {archive.requirements && (
                <div className="bg-n-7 rounded-xl p-6 border border-n-6 mb-8">
                  <h3 className="text-lg font-semibold text-n-1 mb-4">
                    System Requirements
                  </h3>
                  <div className="bg-n-8 rounded-lg p-4">
                    <pre className="text-n-3 text-sm whitespace-pre-wrap">
                      {archive.requirements}
                    </pre>
                  </div>
                </div>
              )}

              {/* Comments Section */}
              <div className="bg-n-7 rounded-xl p-6 border border-n-6">
                <h3 className="text-lg font-semibold text-n-1 mb-6 flex items-center gap-2">
                  <MessageCircle size={20} />
                  Comments ({comments.length})
                </h3>

                {/* Add Comment Form */}
                <form
                  onSubmit={handleAddComment}
                  className="mb-6 p-4 bg-n-8 rounded-lg"
                >
                  <div className="mb-4">
                    <label className="block text-n-2 text-sm font-medium mb-2">
                      Rating
                    </label>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setCommentRating(i + 1)}
                          className="p-1"
                        >
                          <Star
                            size={20}
                            className={
                              i < commentRating
                                ? "text-yellow-400 fill-current"
                                : "text-n-4"
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts about this software..."
                    rows={3}
                    className="w-full p-3 bg-n-7 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none resize-none"
                  />
                  <Button
                    type="submit"
                    className="mt-3"
                    disabled={!commentText.trim()}
                  >
                    Add Comment
                  </Button>
                </form>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.length > 0 ? (
                    comments.map((comment, index) => (
                      <div key={index} className="p-4 bg-n-8 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <User size={16} className="text-n-4" />
                            <span className="text-n-2 font-medium">
                              {comment.user || "Anonymous"}
                            </span>
                            <div className="flex">
                              {renderStars(comment.rating || 5)}
                            </div>
                          </div>
                          <span className="text-n-4 text-sm">
                            {formatDate(comment.created_at || new Date())}
                          </span>
                        </div>
                        <p className="text-n-3">
                          {comment.comment || comment.text}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-n-4 text-center py-8">
                      No comments yet. Be the first to share your thoughts!
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Download Section */}
              <div className="bg-n-7 rounded-xl p-6 border border-n-6 mb-6">
                {archive.request_only ? (
                  <>
                    <h3 className="text-lg font-semibold text-n-1 mb-4">
                      Request Download
                    </h3>
                    <p className="text-n-3 text-sm mb-4">
                      This software requires approval for download. Please fill
                      out the form below.
                    </p>
                    <form onSubmit={handleDownloadRequest}>
                      <div className="mb-4">
                        <label className="block text-n-2 text-sm font-medium mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={downloadEmail}
                          onChange={(e) => setDownloadEmail(e.target.value)}
                          required
                          className="w-full p-3 bg-n-8 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none"
                          placeholder="your@email.com"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-n-2 text-sm font-medium mb-2">
                          Message (Optional)
                        </label>
                        <textarea
                          value={downloadMessage}
                          onChange={(e) => setDownloadMessage(e.target.value)}
                          rows={3}
                          className="w-full p-3 bg-n-8 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none resize-none"
                          placeholder="Let us know how you plan to use this software..."
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={downloadRequesting || !downloadEmail.trim()}
                      >
                        <Download size={16} className="mr-2" />
                        {downloadRequesting
                          ? "Requesting..."
                          : "Request Download"}
                      </Button>
                    </form>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-n-1 mb-4">
                      Download Software
                    </h3>
                    <p className="text-n-3 text-sm mb-4">
                      This software is available for immediate download.
                    </p>
                    <Button
                      onClick={handleDirectDownload}
                      className="w-full mb-4"
                      disabled={downloadRequesting}
                    >
                      <Download size={16} className="mr-2" />
                      {downloadRequesting ? "Downloading..." : "Download Now"}
                    </Button>

                    {/* Alternative: Request Download */}
                    <div className="border-t border-n-6 pt-4">
                      <p className="text-n-4 text-xs mb-3">
                        Or request download assistance:
                      </p>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          // Toggle to show request form
                          setDownloadEmail("");
                          setDownloadMessage("");
                        }}
                      >
                        Request Download Assistance
                      </Button>
                    </div>
                  </>
                )}
              </div>

              {/* Archive Info */}
              <div className="bg-n-7 rounded-xl p-6 border border-n-6">
                <h3 className="text-lg font-semibold text-n-1 mb-4">
                  Archive Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-n-4">Category:</span>
                    <span className="text-n-2">{archive.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-n-4">Version:</span>
                    <span className="text-n-2">{archive.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-n-4">License:</span>
                    <span className="text-n-2">
                      {archive.license || "Contact for details"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-n-4">File Size:</span>
                    <span className="text-n-2">
                      {archive.file_size_display ||
                        archive.file_size_formatted ||
                        (archive.file_size
                          ? `${(archive.file_size / 1024 / 1024).toFixed(1)} MB`
                          : "N/A")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-n-4">Added:</span>
                    <span className="text-n-2">
                      {formatDate(archive.created_at)}
                    </span>
                  </div>
                  {archive.updated_at && (
                    <div className="flex justify-between">
                      <span className="text-n-4">Updated:</span>
                      <span className="text-n-2">
                        {formatDate(archive.updated_at)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Footer />
    </>
  );
};

export default ArchiveDetailPage;
