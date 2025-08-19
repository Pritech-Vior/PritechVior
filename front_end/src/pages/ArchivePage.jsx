import {
  Download,
  Star,
  Package,
  Shield,
  Monitor,
  Search,
  Filter,
} from "lucide-react";
import Section from "../components/Section";
import Heading from "../components/Heading";
import Button from "../components/Button";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import archiveService from "../services/archiveService";

const ArchivePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    "All",
    "Productivity",
    "Design",
    "Development",
    "Browser",
    "Utilities",
    "Media",
    "Security",
    "Communication",
    "Remote Access",
  ];

  useEffect(() => {
    fetchArchives();
  }, []);

  const fetchArchives = async () => {
    try {
      setLoading(true);
      const data = await archiveService.getArchives();
      setArchives(data.results || data);
    } catch (err) {
      setError("Failed to load archives");
      console.error("Error fetching archives:", err);
      setArchives([]); // Fallback to empty array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceSearch = setTimeout(() => {
      const performSearch = async () => {
        try {
          setLoading(true);
          let data;
          if (searchTerm || selectedCategory !== "All") {
            data = await archiveService.searchArchives(
              searchTerm,
              selectedCategory
            );
          } else {
            data = await archiveService.getArchives();
          }
          setArchives(data.results || data);
        } catch (err) {
          console.error("Error searching archives:", err);
          setArchives([]);
        } finally {
          setLoading(false);
        }
      };

      performSearch();
    }, 500);

    return () => clearTimeout(debounceSearch);
  }, [searchTerm, selectedCategory]);

  const filteredItems = archives;

  const ArchiveCard = ({ item }) => (
    <div
      className="bg-n-7 rounded-xl p-6 border border-n-6 hover:border-color-1 transition-colors group cursor-pointer"
      onClick={() => navigate(`/archive/${item.id}`)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Package size={32} className="text-color-1" />
          <div>
            <h3 className="text-xl font-semibold text-n-1 group-hover:text-color-1 transition-colors">
              {item.title}
            </h3>
            <p className="text-n-4 text-sm">v{item.version}</p>
          </div>
        </div>
        {item.featured && (
          <div className="bg-color-2 text-white px-2 py-1 rounded text-xs font-semibold">
            Featured
          </div>
        )}
      </div>

      <p className="text-n-3 text-sm mb-4 leading-relaxed">
        {item.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-3 py-1 bg-color-1/20 text-color-1 rounded-full text-xs font-medium">
          {item.category}
        </span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            item.license_type === "Free" || item.license === "Free"
              ? "bg-green-500/20 text-green-400"
              : (item.license_type || item.license || "").includes("Free")
              ? "bg-blue-500/20 text-blue-400"
              : "bg-yellow-500/20 text-yellow-400"
          }`}
        >
          {item.license_type || item.license || "Contact for details"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2 text-n-3">
          <Package size={16} />
          {item.file_size_display ||
            item.file_size_formatted ||
            (item.file_size
              ? `${(item.file_size / 1024 / 1024).toFixed(1)} MB`
              : "N/A")}
        </div>
        <div className="flex items-center gap-2 text-n-3">
          <Download size={16} />
          {(item.download_count || 0).toLocaleString()} downloads
        </div>
        <div className="flex items-center gap-2 text-n-3">
          <Star size={16} />
          {item.average_rating || item.rating || "N/A"} rating
        </div>
        <div className="flex items-center gap-2 text-n-3">
          <Shield size={16} />
          Verified
        </div>
      </div>

      {item.platforms && item.platforms.length > 0 && (
        <div className="mb-4">
          <h4 className="text-n-1 font-medium mb-2">Platforms:</h4>
          <div className="flex flex-wrap gap-2">
            {(typeof item.platforms === "string"
              ? item.platforms.split(",")
              : item.platforms
            ).map((platform, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-n-6 text-n-2 rounded text-xs flex items-center gap-1"
              >
                <Monitor size={12} />
                {platform.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {item.requirements && (
        <div className="mb-4 p-3 bg-n-8 rounded-lg border border-n-6">
          <h4 className="text-n-1 font-medium mb-1 text-xs">
            System Requirements:
          </h4>
          <p className="text-n-4 text-xs">{item.requirements}</p>
        </div>
      )}

      <Button
        className="w-full group-hover:bg-color-1 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/archive/${item.id}`);
        }}
      >
        <Download size={16} className="mr-2" />
        View Details & Download
      </Button>
    </div>
  );

  return (
    <>
      <Header />

      <Section
        className="pt-[12rem] -mt-[5.25rem]"
        crosses
        crossesOffset="lg:translate-y-[5.25rem]"
        customPaddings
        id="archive"
      >
        <div className="container relative z-2">
          <Heading
            tag="Software Archive"
            title="Daily-Use Software Collection"
            text="Download essential software for productivity, creativity, and development. All software is verified and carefully selected for reliability."
          />

          {/* Search and Filter Section */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-n-4"
                />
                <input
                  type="text"
                  placeholder="Search software..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-n-7 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none transition-colors"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-n-4" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 bg-n-7 border border-n-6 rounded-lg text-n-1 focus:border-color-1 focus:outline-none transition-colors"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-center text-n-3">
              {loading ? (
                "Loading archives..."
              ) : error ? (
                <span className="text-red-400">{error}</span>
              ) : (
                `Found ${filteredItems.length} software${
                  filteredItems.length !== 1 ? "s" : ""
                } 
                ${selectedCategory !== "All" ? ` in ${selectedCategory}` : ""}`
              )}
            </div>
          </div>

          {/* Archive Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className="bg-n-7 rounded-xl p-6 border border-n-6 animate-pulse"
                >
                  <div className="h-8 bg-n-6 rounded mb-4"></div>
                  <div className="h-4 bg-n-6 rounded mb-2"></div>
                  <div className="h-4 bg-n-6 rounded mb-4"></div>
                  <div className="h-10 bg-n-6 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredItems.map((item) => (
                <ArchiveCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {!loading && filteredItems.length === 0 && (
            <div className="text-center py-12">
              <Package size={64} className="mx-auto text-n-4 mb-4" />
              <h3 className="text-xl font-semibold text-n-1 mb-2">
                No software found
              </h3>
              <p className="text-n-3">
                {error
                  ? "Unable to load archives. Please try again later."
                  : "Try adjusting your search terms or category filter."}
              </p>
            </div>
          )}

          {/* Download Notice */}
          <div className="bg-n-7/50 border border-n-6 rounded-xl p-8 text-center">
            <Shield size={48} className="mx-auto text-color-1 mb-4" />
            <h3 className="text-xl font-semibold text-n-1 mb-2">
              Download Notice
            </h3>
            <p className="text-n-3 mb-6 max-w-2xl mx-auto">
              All software downloads are verified and safe. To maintain quality
              and support, please contact us to request download links for any
              software in our archive.
            </p>
            <Button href="/contact">Contact for Downloads</Button>
          </div>
        </div>
      </Section>

      <Footer />
    </>
  );
};

export default ArchivePage;
