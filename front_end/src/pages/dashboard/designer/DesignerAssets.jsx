import React, { useState } from "react";
import { 
  Image,
  Folder,
  Download,
  Upload,
  Share2,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
  Clock,
  Tag,
  Eye,
  Heart,
  MessageCircle,
  Calendar,
  FileImage,
  FileText,
  Video,
  Archive,
  Layers,
  Palette,
  Move
} from "lucide-react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";

const DesignerAssets = ({ userRoles = ["designer"] }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedAssets, setSelectedAssets] = useState([]);

  const assets = [
    {
      id: 1,
      name: "Hospital Dashboard Mockup",
      type: "image",
      format: "figma",
      size: "2.4 MB",
      dimensions: "1920x1080",
      project: "Hospital Management UI/UX",
      tags: ["dashboard", "healthcare", "mockup"],
      category: "UI Design",
      uploaded: "2025-01-10T14:30:00Z",
      lastModified: "2025-01-10T16:45:00Z",
      views: 24,
      likes: 8,
      comments: 3,
      isShared: true,
      sharedWith: ["client", "team"],
      thumbnail: "/api/placeholder/300/200",
      description: "Complete dashboard mockup for hospital management system showing patient data, analytics, and navigation.",
      version: "v2.1",
      status: "approved"
    },
    {
      id: 2,
      name: "Mobile App Wireframes",
      type: "document",
      format: "sketch",
      size: "1.8 MB",
      dimensions: "375x812",
      project: "E-Commerce Mobile App Design",
      tags: ["wireframe", "mobile", "ecommerce"],
      category: "Wireframes",
      uploaded: "2025-01-09T11:20:00Z",
      lastModified: "2025-01-09T15:30:00Z",
      views: 18,
      likes: 5,
      comments: 7,
      isShared: false,
      sharedWith: [],
      thumbnail: "/api/placeholder/300/200",
      description: "Low-fidelity wireframes for mobile e-commerce application including product browsing and checkout flow.",
      version: "v1.3",
      status: "in-review"
    },
    {
      id: 3,
      name: "Brand Identity Package",
      type: "archive",
      format: "zip",
      size: "15.2 MB",
      dimensions: "various",
      project: "Corporate Website Redesign",
      tags: ["branding", "logo", "identity"],
      category: "Branding",
      uploaded: "2025-01-08T09:15:00Z",
      lastModified: "2025-01-08T12:45:00Z",
      views: 32,
      likes: 12,
      comments: 2,
      isShared: true,
      sharedWith: ["client"],
      thumbnail: "/api/placeholder/300/200",
      description: "Complete brand identity package including logo variations, color palette, typography, and usage guidelines.",
      version: "v3.0",
      status: "final"
    },
    {
      id: 4,
      name: "User Journey Animation",
      type: "video",
      format: "mp4",
      size: "8.7 MB",
      dimensions: "1280x720",
      project: "Educational Platform Interface",
      tags: ["animation", "user-journey", "prototype"],
      category: "Prototypes",
      uploaded: "2025-01-07T16:30:00Z",
      lastModified: "2025-01-07T18:15:00Z",
      views: 15,
      likes: 6,
      comments: 4,
      isShared: true,
      sharedWith: ["team", "stakeholders"],
      thumbnail: "/api/placeholder/300/200",
      description: "Animated prototype showing user journey through the educational platform from login to course completion.",
      version: "v1.2",
      status: "draft"
    },
    {
      id: 5,
      name: "Design System Components",
      type: "document",
      format: "figma",
      size: "3.6 MB",
      dimensions: "various",
      project: "SaaS Dashboard Design",
      tags: ["design-system", "components", "ui"],
      category: "Design System",
      uploaded: "2025-01-06T13:45:00Z",
      lastModified: "2025-01-10T10:20:00Z",
      views: 28,
      likes: 10,
      comments: 8,
      isShared: true,
      sharedWith: ["team", "developers"],
      thumbnail: "/api/placeholder/300/200",
      description: "Comprehensive design system with reusable components, tokens, and documentation for SaaS platform.",
      version: "v2.4",
      status: "approved"
    },
    {
      id: 6,
      name: "Icon Library Set",
      type: "image",
      format: "svg",
      size: "0.8 MB",
      dimensions: "24x24",
      project: "Crypto Trading App UI",
      tags: ["icons", "crypto", "interface"],
      category: "Icons",
      uploaded: "2025-01-05T10:30:00Z",
      lastModified: "2025-01-05T14:20:00Z",
      views: 41,
      likes: 15,
      comments: 1,
      isShared: true,
      sharedWith: ["team", "client", "developers"],
      thumbnail: "/api/placeholder/300/200",
      description: "Custom icon set designed specifically for cryptocurrency trading interface including charts, currencies, and actions.",
      version: "v1.8",
      status: "final"
    },
    {
      id: 7,
      name: "Color Palette Guide",
      type: "document",
      format: "pdf",
      size: "1.2 MB",
      dimensions: "A4",
      project: "Corporate Website Redesign",
      tags: ["colors", "palette", "guide"],
      category: "Style Guide",
      uploaded: "2025-01-04T15:20:00Z",
      lastModified: "2025-01-04T16:30:00Z",
      views: 22,
      likes: 7,
      comments: 2,
      isShared: true,
      sharedWith: ["client", "developers"],
      thumbnail: "/api/placeholder/300/200",
      description: "Detailed color palette documentation including primary, secondary, and accent colors with usage examples.",
      version: "v1.1",
      status: "approved"
    },
    {
      id: 8,
      name: "Typography Specimens",
      type: "image",
      format: "png",
      size: "2.1 MB",
      dimensions: "1600x1200",
      project: "Educational Platform Interface",
      tags: ["typography", "fonts", "specimens"],
      category: "Typography",
      uploaded: "2025-01-03T12:10:00Z",
      lastModified: "2025-01-03T14:45:00Z",
      views: 19,
      likes: 4,
      comments: 5,
      isShared: false,
      sharedWith: [],
      thumbnail: "/api/placeholder/300/200",
      description: "Typography specimens showing font families, weights, and sizes used throughout the educational platform.",
      version: "v1.0",
      status: "draft"
    }
  ];

  const getFileTypeIcon = (type, format) => {
    if (type === "image") return FileImage;
    if (type === "video") return Video;
    if (type === "archive") return Archive;
    if (format === "figma" || format === "sketch") return Layers;
    return FileText;
  };

  const getFileTypeColor = (type, format) => {
    if (type === "image") return "text-blue-400 bg-blue-500/10";
    if (type === "video") return "text-purple-400 bg-purple-500/10";
    if (type === "archive") return "text-yellow-400 bg-yellow-500/10";
    if (format === "figma") return "text-pink-400 bg-pink-500/10";
    if (format === "sketch") return "text-orange-400 bg-orange-500/10";
    return "text-green-400 bg-green-500/10";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "draft": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "in-review": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "approved": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "final": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      default: return "bg-n-7 text-n-3 border-n-6";
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesTab = activeTab === "all" || asset.category.toLowerCase().replace(/\s+/g, '-') === activeTab;
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      asset.project.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.lastModified) - new Date(a.lastModified);
      case "name":
        return a.name.localeCompare(b.name);
      case "size":
        return parseFloat(b.size.replace(/[^\d.]/g, '')) - parseFloat(a.size.replace(/[^\d.]/g, ''));
      case "popular":
        return (b.views + b.likes) - (a.views + a.likes);
      default:
        return 0;
    }
  });

  const toggleAssetSelection = (assetId) => {
    setSelectedAssets(prev => 
      prev.includes(assetId) 
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const selectAllAssets = () => {
    if (selectedAssets.length === sortedAssets.length) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets(sortedAssets.map(asset => asset.id));
    }
  };

  const categories = [
    { key: "all", label: "All Assets" },
    { key: "ui-design", label: "UI Design" },
    { key: "wireframes", label: "Wireframes" },
    { key: "branding", label: "Branding" },
    { key: "prototypes", label: "Prototypes" },
    { key: "design-system", label: "Design System" },
    { key: "icons", label: "Icons" },
    { key: "style-guide", label: "Style Guide" },
    { key: "typography", label: "Typography" }
  ];

  return (
    <DashboardLayout title="Design Assets" userRole="designer" userRoles={userRoles}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-n-1">Design Assets</h1>
            <p className="text-n-3 mt-1">Manage your design files, resources, and creative assets</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-n-7 text-n-3 px-4 py-2 rounded-lg hover:bg-n-6 flex items-center gap-2">
              <Folder size={16} />
              New Folder
            </button>
            <button className="bg-gradient-to-r from-color-1 to-color-2 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <Upload size={16} />
              Upload Assets
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-n-8 rounded-xl p-4 border border-n-6">
            <div className="flex items-center justify-between mb-2">
              <Image size={20} className="text-blue-400" />
              <span className="text-blue-400 text-sm">+8</span>
            </div>
            <h3 className="text-xl font-bold text-n-1">{assets.length}</h3>
            <p className="text-n-3 text-sm">Total Assets</p>
          </div>
          
          <div className="bg-n-8 rounded-xl p-4 border border-n-6">
            <div className="flex items-center justify-between mb-2">
              <Share2 size={20} className="text-green-400" />
              <span className="text-green-400 text-sm">Active</span>
            </div>
            <h3 className="text-xl font-bold text-n-1">{assets.filter(a => a.isShared).length}</h3>
            <p className="text-n-3 text-sm">Shared Assets</p>
          </div>
          
          <div className="bg-n-8 rounded-xl p-4 border border-n-6">
            <div className="flex items-center justify-between mb-2">
              <Heart size={20} className="text-red-400" />
              <span className="text-red-400 text-sm">Trending</span>
            </div>
            <h3 className="text-xl font-bold text-n-1">{assets.reduce((sum, a) => sum + a.likes, 0)}</h3>
            <p className="text-n-3 text-sm">Total Likes</p>
          </div>
          
          <div className="bg-n-8 rounded-xl p-4 border border-n-6">
            <div className="flex items-center justify-between mb-2">
              <Archive size={20} className="text-purple-400" />
              <span className="text-purple-400 text-sm">Storage</span>
            </div>
            <h3 className="text-xl font-bold text-n-1">125 GB</h3>
            <p className="text-n-3 text-sm">Used Space</p>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setActiveTab(category.key)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  activeTab === category.key
                    ? "bg-gradient-to-r from-color-1 to-color-2 text-white"
                    : "bg-n-7 text-n-3 hover:text-n-1"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
          
          <div className="flex gap-3 items-center">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-n-4" />
              <input
                type="text"
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-n-7 border border-n-6 rounded-lg pl-10 pr-4 py-2 text-n-1 text-sm w-48"
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-n-7 border border-n-6 rounded-lg px-3 py-2 text-n-1 text-sm"
            >
              <option value="recent">Recent</option>
              <option value="name">Name</option>
              <option value="size">Size</option>
              <option value="popular">Popular</option>
            </select>
            
            <div className="flex border border-n-6 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-color-1 text-white" : "bg-n-7 text-n-3"}`}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-color-1 text-white" : "bg-n-7 text-n-3"}`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedAssets.length > 0 && (
          <div className="bg-n-8 rounded-xl p-4 border border-n-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-n-1 font-medium">{selectedAssets.length} selected</span>
              <button
                onClick={selectAllAssets}
                className="text-color-1 text-sm hover:text-color-2"
              >
                {selectedAssets.length === sortedAssets.length ? "Deselect All" : "Select All"}
              </button>
            </div>
            <div className="flex gap-2">
              <button className="bg-n-7 text-n-3 px-3 py-1 rounded text-sm hover:bg-n-6 flex items-center gap-1">
                <Download size={14} />
                Download
              </button>
              <button className="bg-n-7 text-n-3 px-3 py-1 rounded text-sm hover:bg-n-6 flex items-center gap-1">
                <Move size={14} />
                Move
              </button>
              <button className="bg-n-7 text-n-3 px-3 py-1 rounded text-sm hover:bg-n-6 flex items-center gap-1">
                <Share2 size={14} />
                Share
              </button>
              <button className="bg-red-500/10 text-red-400 px-3 py-1 rounded text-sm hover:bg-red-500/20 flex items-center gap-1">
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Assets Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedAssets.map((asset) => {
              const FileIcon = getFileTypeIcon(asset.type, asset.format);
              
              return (
                <div key={asset.id} className="bg-n-8 rounded-xl border border-n-6 hover:border-color-1/20 transition-all overflow-hidden">
                  <div className="aspect-video bg-n-7 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-color-1/20 to-color-2/20 flex items-center justify-center">
                      <FileIcon size={32} className="text-n-4" />
                    </div>
                    <div className="absolute top-2 left-2">
                      <input
                        type="checkbox"
                        checked={selectedAssets.includes(asset.id)}
                        onChange={() => toggleAssetSelection(asset.id)}
                        className="w-4 h-4 rounded"
                      />
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1">
                      <span className={`px-2 py-1 rounded text-xs ${getFileTypeColor(asset.type, asset.format)}`}>
                        {asset.format.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs border ${getStatusColor(asset.status)}`}>
                        {asset.status}
                      </span>
                    </div>
                    {asset.isShared && (
                      <div className="absolute bottom-2 left-2">
                        <Share2 size={14} className="text-green-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3">
                    <h3 className="text-n-1 font-medium text-sm mb-1 line-clamp-2">{asset.name}</h3>
                    <p className="text-n-4 text-xs mb-2">{asset.size} • {asset.version}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      {asset.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="px-1.5 py-0.5 bg-n-7 text-n-3 rounded text-xs">
                          #{tag}
                        </span>
                      ))}
                      {asset.tags.length > 2 && (
                        <span className="px-1.5 py-0.5 bg-n-7 text-n-3 rounded text-xs">
                          +{asset.tags.length - 2}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-n-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Eye size={12} />
                          <span>{asset.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart size={12} />
                          <span>{asset.likes}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button className="p-1 bg-n-7 rounded hover:bg-n-6">
                          <Download size={10} className="text-n-3" />
                        </button>
                        <button className="p-1 bg-n-7 rounded hover:bg-n-6">
                          <Share2 size={10} className="text-n-3" />
                        </button>
                        <button className="p-1 bg-n-7 rounded hover:bg-n-6">
                          <Edit size={10} className="text-n-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {sortedAssets.map((asset) => {
              const FileIcon = getFileTypeIcon(asset.type, asset.format);
              
              return (
                <div key={asset.id} className="bg-n-8 rounded-xl border border-n-6 hover:border-color-1/20 transition-all p-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectedAssets.includes(asset.id)}
                      onChange={() => toggleAssetSelection(asset.id)}
                      className="w-4 h-4 rounded"
                    />
                    
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getFileTypeColor(asset.type, asset.format)}`}>
                      <FileIcon size={16} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-n-1 font-medium truncate">{asset.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs border ${getStatusColor(asset.status)}`}>
                            {asset.status}
                          </span>
                          {asset.isShared && (
                            <Share2 size={14} className="text-green-400" />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-n-4">
                        <span>{asset.project}</span>
                        <span>{asset.size}</span>
                        <span>{asset.format.toUpperCase()}</span>
                        <span>{asset.version}</span>
                        <span>{new Date(asset.lastModified).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-2 text-xs text-n-4">
                        <div className="flex items-center gap-1">
                          <Eye size={12} />
                          <span>{asset.views} views</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart size={12} />
                          <span>{asset.likes} likes</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle size={12} />
                          <span>{asset.comments} comments</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors">
                        <Eye size={14} className="text-n-3" />
                      </button>
                      <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors">
                        <Download size={14} className="text-n-3" />
                      </button>
                      <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors">
                        <Edit size={14} className="text-n-3" />
                      </button>
                      <button className="p-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors">
                        <Share2 size={14} className="text-n-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {sortedAssets.length === 0 && (
          <div className="bg-n-8 rounded-xl p-12 text-center border border-n-6">
            <Image size={48} className="text-n-4 mx-auto mb-4" />
            <h3 className="text-n-1 font-medium mb-2">No assets found</h3>
            <p className="text-n-4 text-sm">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DesignerAssets;
