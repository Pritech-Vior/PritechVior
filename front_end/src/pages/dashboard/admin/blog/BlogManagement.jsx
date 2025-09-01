import { useEffect, useState } from "react";
import DashboardLayout from "../../../../components/dashboard/DashboardLayout";
import Card from "../../../../components/Card";
import Table from "../../../../components/Table";
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import {
  Eye,
  Edit,
  Trash2,
  Plus,
  Grid,
  List,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import blogManagement from "../../../../services/admin/blog/blogManagement";

// Mock blog post data
// ...existing code...

const statusOptions = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

const BlogManagement = () => {
  const [viewMode, setViewMode] = useState("cards");
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("published_at");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    blogManagement
      .getPosts()
      .then((data) => {
        setPosts(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch blog posts");
        setLoading(false);
      });
  }, []);

  const handleDelete = async (slug) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await blogManagement.deletePost(slug);
        setPosts((prev) => prev.filter((post) => post.slug !== slug));
      } catch {
        alert("Failed to delete post.");
      }
    }
  };

  const filteredPosts = posts
    .filter(
      (post) =>
        (status === "all" || post.status === status) &&
        (post.title.toLowerCase().includes(search.toLowerCase()) ||
          (post.author &&
            post.author.toLowerCase().includes(search.toLowerCase())))
    )
    .sort((a, b) => {
      if (sortBy === "published_at") {
        return new Date(b.published_at) - new Date(a.published_at);
      }
      if (sortBy === "views") {
        return b.views - a.views;
      }
      if (sortBy === "likes") {
        return b.like_count - a.like_count;
      }
      return 0;
    });

  return (
    <DashboardLayout title="Blog Management" userRole="admin">
      <div className="flex flex-col gap-6">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center bg-n-7 p-4 rounded-xl border border-n-6">
          <Input
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-n-8 text-n-1 border-n-6 rounded px-3 py-2"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-n-8 text-n-1 border-n-6 rounded px-3 py-2"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-n-8 text-n-1 border-n-6 rounded px-3 py-2"
          >
            <option value="published_at">Date</option>
            <option value="views">Views</option>
            <option value="likes">Likes</option>
          </select>
          <div className="flex gap-2 justify-end">
            <span
              className={`cursor-pointer px-3 py-2 rounded-xl flex items-center gap-1 ${
                viewMode === "cards"
                  ? "bg-gradient-to-r from-color-1 to-color-2 text-white"
                  : "bg-n-8 text-n-3 border border-n-6"
              }`}
              onClick={() => setViewMode("cards")}
            >
              <Grid size={16} /> Cards
            </span>
            <span
              className={`cursor-pointer px-3 py-2 rounded-xl flex items-center gap-1 ${
                viewMode === "table"
                  ? "bg-gradient-to-r from-color-1 to-color-2 text-white"
                  : "bg-n-8 text-n-3 border border-n-6"
              }`}
              onClick={() => setViewMode("table")}
            >
              <List size={16} /> Table
            </span>
            <Button
              icon={<Plus size={16} />}
              onClick={() => navigate("/dashboard/admin/blog/createpost")}
            >
              New Post
            </Button>
          </div>
        </div>

        {/* Views */}
        {viewMode === "cards" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">{error}</div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12">No blog posts found.</div>
            ) : (
              filteredPosts.map((post) => (
                <Card key={post.slug} className="p-0 overflow-hidden shadow-lg">
                  {/* Blog images gallery: show all images from post.images, fallback to featured image */}
                  {post.images && post.images.length > 0 ? (
                    <div className="flex overflow-x-auto gap-2 w-full h-40 bg-n-8">
                      {post.images.map((img, idx) => (
                        <img
                          key={img.id || idx}
                          src={img.image_source || img.image_url || img.image}
                          alt={img.caption || post.title}
                          className="h-40 object-cover rounded"
                          style={{ minWidth: "160px", maxWidth: "240px" }}
                        />
                      ))}
                    </div>
                  ) : (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg text-n-1">
                        {post.title}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          post.status === "published"
                            ? "bg-green-100 text-green-600"
                            : post.status === "draft"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {post.status}
                      </span>
                    </div>
                    <span className="text-sm text-n-3">By {post.author}</span>
                    <span className="text-xs text-n-4">
                      {post.published_at}
                    </span>
                    <p className="text-n-4 text-sm line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex gap-2 flex-wrap mt-2">
                      {post.tags &&
                        post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-n-7 text-xs px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                    <div className="flex gap-4 mt-2">
                      <span className="flex items-center gap-1 text-n-3">
                        <Eye size={14} />
                        {post.views}
                      </span>
                      <span className="flex items-center gap-1 text-n-3">
                        <Plus size={14} />
                        {post.like_count}
                      </span>
                      <span className="flex items-center gap-1 text-n-3">
                        <MessageSquare size={14} />
                        {post.comment_count}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        icon={<Edit size={14} />}
                        size="sm"
                        onClick={() =>
                          navigate(`/dashboard/admin/blog/update/${post.slug}`)
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        icon={<Trash2 size={14} />}
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(post.slug)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        ) : (
          <Table
            columns={[
              "Title",
              "Author",
              "Status",
              "Views",
              "Likes",
              "Comments",
              "Date",
              "Actions",
            ]}
            data={filteredPosts.map((post) => [
              post.title,
              post.author,
              post.status,
              post.views,
              post.like_count,
              post.comment_count,
              post.published_at,
              <div className="flex gap-2" key={post.slug}>
                <Button
                  icon={<Edit size={14} />}
                  size="sm"
                  onClick={() =>
                    navigate(`/dashboard/admin/blog/update/${post.slug}`)
                  }
                >
                  Edit
                </Button>
                <Button
                  icon={<Trash2 size={14} />}
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(post.slug)}
                >
                  Delete
                </Button>
              </div>,
            ])}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default BlogManagement;
