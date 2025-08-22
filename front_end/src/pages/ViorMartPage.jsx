import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Heart,
  Filter,
  Star,
  Grid,
  List,
  RefreshCw,
  Eye,
  Wifi,
  WifiOff,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Section from "../components/Section";
import Heading from "../components/Heading";
import shopService from "../services/shopService";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";
import { useOnlineStatus, useOfflineData } from "../hooks/useOfflineData";

const ViorMartPage = () => {
  // Navigation and context
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { showError, showSuccess } = useToast();

  // State management
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("-created_at");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [wishlist, setWishlist] = useState([]);

  // Offline support
  const isOnline = useOnlineStatus();
  const {
    data: cachedProducts,
    loading: offlineLoading,
    refreshData,
  } = useOfflineData(
    `${
      import.meta.env.VITE_API_URL || "http://localhost:8000"
    }/api/shop/products/`,
    "viormart-products"
  );

  // Fetch initial data
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch categories and brands (public endpoints)
      const [categoriesData, brandsData] = await Promise.all([
        shopService.getCategories(),
        shopService.getBrands(),
      ]);

      setCategories(
        Array.isArray(categoriesData)
          ? categoriesData
          : categoriesData.results || []
      );
      setBrands(
        Array.isArray(brandsData) ? brandsData : brandsData.results || []
      );

      // Only fetch cart and wishlist if user is authenticated
      if (isAuthenticated) {
        try {
          const wishlistData = await shopService
            .getWishlist()
            .catch(() => ({ products: [] }));
          setWishlist(wishlistData.products || []);
        } catch (err) {
          console.log("Wishlist requires authentication");
        }
      }
    } catch (err) {
      setError("Failed to load initial data");
      console.error("Error fetching initial data:", err);
      showError("Failed to load store data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, showError]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Fetch products when filters change
  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          page: currentPage,
          page_size: 12,
          ordering: sortBy,
        };

        if (searchTerm) params.search = searchTerm;
        if (selectedCategory) params.category = selectedCategory;
        if (selectedBrand) params.brand = selectedBrand;
        if (priceRange.min) params.min_price = priceRange.min;
        if (priceRange.max) params.max_price = priceRange.max;

        const data = await shopService.getProducts(params);
        setProducts(data.results || data);
        setTotalPages(Math.ceil((data.count || data.length) / 12));
      } catch (err) {
        setError("Failed to load products");
        console.error("Error fetching products:", err);
      }
    };

    fetchData();
  }, [
    searchTerm,
    selectedCategory,
    selectedBrand,
    priceRange,
    sortBy,
    currentPage,
  ]);

  const handleAddToCart = async (productId, quantity = 1) => {
    try {
      // Find the product data to pass to the cart
      const product = products.find((p) => p.id === productId);
      if (!product) {
        showError("Product not found");
        return;
      }

      await addToCart(productId, quantity, {}, product);
      showSuccess("Item added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      showError("Failed to add item to cart. Please try again.");
    }
  };

  const handleAddToWishlist = async (productId) => {
    if (!isAuthenticated) {
      showError("Please log in to add items to your wishlist");
      return;
    }

    try {
      await shopService.addToWishlist(productId);
      const updatedWishlist = await shopService.getWishlist();
      setWishlist(updatedWishlist.products || []);
      showSuccess("Item added to wishlist!");
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      showError("Failed to add item to wishlist. Please try again.");
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const formatPrice = (price, currency = "TZS") => {
    return new Intl.NumberFormat("sw-TZ", {
      style: "currency",
      currency: currency === "TZS" ? "TZS" : "USD",
    }).format(price);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedBrand("");
    setPriceRange({ min: "", max: "" });
    setSortBy("-created_at");
    setCurrentPage(1);
  };

  // Filter sidebar component
  const FilterSidebar = () => (
    <div className="bg-n-7 p-6 rounded-lg border border-n-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-n-1">Filters</h3>
        <button
          onClick={resetFilters}
          className="text-sm text-color-1 hover:text-color-2 flex items-center gap-1"
        >
          <RefreshCw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-n-2 mb-2">
          Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 bg-n-6 border border-n-5 rounded-md text-n-1 focus:ring-2 focus:ring-color-1 focus:border-transparent"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Brands */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-n-2 mb-2">Brand</label>
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="w-full p-2 bg-n-6 border border-n-5 rounded-md text-n-1 focus:ring-2 focus:ring-color-1 focus:border-transparent"
        >
          <option value="">All Brands</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-n-2 mb-2">
          Price Range (TZS)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) =>
              setPriceRange((prev) => ({ ...prev, min: e.target.value }))
            }
            className="w-full p-2 bg-n-6 border border-n-5 rounded-md text-n-1 focus:ring-2 focus:ring-color-1 focus:border-transparent"
          />
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) =>
              setPriceRange((prev) => ({ ...prev, max: e.target.value }))
            }
            className="w-full p-2 bg-n-6 border border-n-5 rounded-md text-n-1 focus:ring-2 focus:ring-color-1 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  // Modern Product card component
  const ProductCard = ({ product }) => (
    <div className="group bg-n-8 rounded-2xl border border-n-6 overflow-hidden hover:border-color-1 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
      <div className="relative overflow-hidden">
        <img
          src={product.images?.[0]?.image || "/api/placeholder/400/300"}
          alt={product.name}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.is_on_sale && (
            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 text-xs font-semibold rounded-full shadow-lg">
              SALE
            </span>
          )}
          {product.new_arrival && (
            <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 text-xs font-semibold rounded-full shadow-lg">
              NEW
            </span>
          )}
          {product.featured && (
            <span className="bg-gradient-to-r from-color-1 to-color-2 text-white px-3 py-1 text-xs font-semibold rounded-full shadow-lg">
              FEATURED
            </span>
          )}
        </div>

        {/* Discount badge */}
        {product.discount_percentage > 0 && (
          <div className="absolute top-3 right-3">
            <div className="bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm shadow-lg">
              -{product.discount_percentage}%
            </div>
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={() => handleAddToWishlist(product.id)}
          className={`absolute bottom-3 right-3 p-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
            isInWishlist(product.id)
              ? "bg-red-500/90 text-white shadow-lg scale-110"
              : "bg-white/90 text-gray-700 hover:bg-red-500/90 hover:text-white hover:scale-110"
          }`}
        >
          <Heart
            className="w-5 h-5"
            fill={isInWishlist(product.id) ? "currentColor" : "none"}
          />
        </button>

        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={() => navigate(`/product/${product.slug}`)}
            className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200 transform translate-y-4 group-hover:translate-y-0"
          >
            Quick View
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Brand */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-color-1 bg-color-1/10 px-2 py-1 rounded-full">
            {product.brand_detail?.name}
          </span>
          <span className="text-xs text-n-4">
            {product.category_detail?.name}
          </span>
        </div>

        {/* Product name */}
        <h3 className="text-lg font-bold text-n-1 mb-2 line-clamp-2 group-hover:text-color-1 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating || 0)
                    ? "text-yellow-400 fill-current"
                    : "text-n-5"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-n-3">
            ({product.review_count || 0})
          </span>
          {product.review_count > 10 && (
            <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-medium">
              Popular
            </span>
          )}
        </div>

        {/* Price section */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-color-1">
                {formatPrice(product.price, product.currency)}
              </span>
              {product.original_price &&
                product.original_price > product.price && (
                  <span className="text-sm text-n-4 line-through">
                    {formatPrice(product.original_price, product.currency)}
                  </span>
                )}
            </div>
            {product.original_price &&
              product.original_price > product.price && (
                <span className="text-xs text-green-600 font-medium">
                  Save{" "}
                  {formatPrice(
                    product.original_price - product.price,
                    product.currency
                  )}
                </span>
              )}
          </div>
        </div>

        {/* Stock status */}
        <div className="mb-4">
          <div
            className={`text-sm font-medium ${
              product.is_in_stock ? "text-green-400" : "text-red-400"
            }`}
          >
            {product.availability}
          </div>
          {product.is_in_stock &&
            product.stock_quantity <= product.low_stock_threshold && (
              <div className="text-xs text-orange-400 mt-1">
                Only {product.stock_quantity} left!
              </div>
            )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/product/${product.slug}`)}
            className="flex-1 bg-n-6 hover:bg-n-5 text-n-1 hover:text-color-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>

          <button
            onClick={() => handleAddToCart(product.id)}
            disabled={!product.is_in_stock}
            className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${
              product.is_in_stock
                ? "bg-color-1 hover:bg-color-2 text-white shadow-lg hover:shadow-xl"
                : "bg-n-7 text-n-4 cursor-not-allowed"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>

        {!product.is_in_stock && (
          <p className="text-sm text-red-400 mt-3 text-center font-medium">
            Out of Stock
          </p>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <div className="min-h-screen bg-n-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-color-1 mx-auto"></div>
            <p className="mt-4 text-n-3">Loading ViorMart...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <div className="min-h-screen bg-n-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchInitialData}
              className="bg-color-1 text-white px-4 py-2 rounded-md hover:bg-color-2"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />

      <Section
        className="pt-[12rem] -mt-[5.25rem]"
        crosses
        crossesOffset="lg:translate-y-[5.25rem]"
        customPaddings
        id="viormart"
      >
        <div className="container relative z-2">
          <Heading
            tag="ViorMart"
            title="Your Premier Online Shopping Destination"
            text="Quality products, fast delivery, and secure shopping experience in Tanzania. Browse our extensive collection of verified products."
          />

          {/* Offline/Online Status Indicator */}
          {!isOnline && (
            <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg flex items-center gap-3">
              <WifiOff className="w-5 h-5 text-yellow-400" />
              <div>
                <h4 className="text-yellow-400 font-semibold">
                  You&apos;re offline
                </h4>
                <p className="text-n-3 text-sm">
                  Showing cached products. Connect to internet for latest
                  updates.
                </p>
              </div>
              <button
                onClick={refreshData}
                disabled={!isOnline}
                className="ml-auto px-4 py-2 bg-yellow-500 text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors disabled:opacity-50"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Search and Filter Bar */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-n-4 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-n-6 border border-n-5 rounded-lg text-n-1 focus:ring-2 focus:ring-color-1 focus:border-transparent"
                />
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-n-6 border border-n-5 rounded-lg text-n-1 focus:ring-2 focus:ring-color-1 focus:border-transparent"
              >
                <option value="-created_at">Newest First</option>
                <option value="created_at">Oldest First</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
                <option value="-name">Name: Z to A</option>
                <option value="-rating">Highest Rated</option>
              </select>

              {/* View Mode */}
              <div className="flex gap-1 border border-n-5 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid" ? "bg-color-1 text-white" : "text-n-3"
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list" ? "bg-color-1 text-white" : "text-n-3"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden bg-n-6 hover:bg-n-5 text-n-1 px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex gap-8">
            {/* Sidebar Filters */}
            <div
              className={`${
                showFilters ? "block" : "hidden"
              } md:block w-full md:w-64 flex-shrink-0`}
            >
              <FilterSidebar />
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-n-1">
                  Products ({products.length})
                </h2>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-n-3 text-lg">
                    No products found matching your criteria.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="mt-4 bg-color-1 text-white px-4 py-2 rounded-md hover:bg-color-2"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <>
                  <div
                    className={`grid gap-8 ${
                      viewMode === "grid"
                        ? "grid-cols-1 md:grid-cols-2"
                        : "grid-cols-1"
                    }`}
                  >
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}
                          className="px-4 py-2 border border-n-5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-n-6 text-n-1"
                        >
                          Previous
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-4 py-2 rounded-md ${
                              currentPage === i + 1
                                ? "bg-color-1 text-white"
                                : "border border-n-5 hover:bg-n-6 text-n-1"
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 border border-n-5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-n-6 text-n-1"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </Section>

      <Footer />
    </>
  );
};

export default ViorMartPage;
