import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Heart,
  ShoppingCart,
  Share2,
  Package,
  Shield,
  MessageCircle,
  User,
  Send,
} from "lucide-react";
import Section from "../components/Section";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";
import shopService from "../services/shopService";

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { showSuccess, showError } = useToast();

  // Product data
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Interactive features
  const [inWishlist, setInWishlist] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Review states
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [showReviews, setShowReviews] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        console.log("Fetching product with slug:", slug);

        // Fetch main product data by slug
        const productData = await shopService.getProductBySlug(slug);
        console.log("Received product data:", productData);
        console.log("Product category:", productData.category_detail);
        console.log("Product brand:", productData.brand_detail);
        console.log("Product product_type:", productData.product_type_detail);
        setProduct(productData);

        // Check if product is in wishlist/cart
        if (isAuthenticated && productData) {
          try {
            const wishlist = await shopService.getWishlist();
            setInWishlist(
              wishlist.products?.some((p) => p.id === productData.id) || false
            );
          } catch (err) {
            console.log("Wishlist check failed:", err);
          }

          try {
            const cart = await shopService.getCart();
            setInCart(
              cart.items?.some((item) => item.product.id === productData.id) ||
                false
            );
          } catch (err) {
            console.log("Cart check failed:", err);
          }
        }

        // Fetch reviews
        if (productData) {
          try {
            const reviewsData = await shopService.getProductReviews(
              productData.slug
            );
            setReviews(reviewsData.results || reviewsData || []);
          } catch (err) {
            console.log("Reviews fetch failed:", err);
            setReviews([]);
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, isAuthenticated]);

  const handleAddToCart = async () => {
    if (!product) {
      showError("Product not found");
      return;
    }

    try {
      await addToCart(product.id, quantity, {}, product);
      setInCart(true);
      showSuccess("Product added to cart!");
    } catch (error) {
      showError("Failed to add product to cart");
      console.error("Add to cart error:", error);
    }
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      showError("Please login to manage wishlist");
      navigate("/login");
      return;
    }

    if (!product) {
      showError("Product not found");
      return;
    }

    try {
      if (inWishlist) {
        await shopService.removeFromWishlist(product.id);
        setInWishlist(false);
        showSuccess("Removed from wishlist");
      } else {
        await shopService.addToWishlist(product.id);
        setInWishlist(true);
        showSuccess("Added to wishlist!");
      }
    } catch (error) {
      showError("Failed to update wishlist");
      console.error("Wishlist error:", error);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showError("Please login to add reviews");
      navigate("/login");
      return;
    }

    if (!product) {
      showError("Product not found");
      return;
    }

    if (!newReview.trim()) {
      showError("Please write a review");
      return;
    }

    try {
      setIsAddingReview(true);
      await shopService.addProductReview(product.slug, {
        rating: newRating,
        comment: newReview.trim(),
      });

      // Refresh reviews
      const reviewsData = await shopService.getProductReviews(product.slug);
      setReviews(reviewsData.results || reviewsData || []);

      setNewReview("");
      setNewRating(5);
      showSuccess("Review added successfully!");
    } catch (error) {
      showError("Failed to add review");
      console.error("Review error:", error);
    } finally {
      setIsAddingReview(false);
    }
  };

  const formatPrice = (price, currency = "TZS") => {
    return new Intl.NumberFormat("sw-TZ", {
      style: "currency",
      currency: currency === "TZS" ? "TZS" : "USD",
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <>
        <Header />
        <Section className="pt-[12rem] -mt-[5.25rem]">
          <div className="container relative z-2">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-color-1"></div>
            </div>
          </div>
        </Section>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <Section className="pt-[12rem] -mt-[5.25rem]">
          <div className="container relative z-2">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-n-1 mb-4">
                Product Not Found
              </h1>
              <p className="text-n-3 mb-6">
                {error || "The product you're looking for doesn't exist."}
              </p>
              <button
                onClick={() => navigate("/viormart")}
                className="h-11 px-7 rounded-lg bg-color-1 hover:bg-color-2 text-white font-semibold transition-colors flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Store
              </button>
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

      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Section>
          <div className="container relative z-2">
            {/* Back Button */}
            <button
              className="mb-6 h-11 px-7 rounded-lg bg-n-6 text-n-1 hover:bg-n-5 font-semibold transition-colors flex items-center"
              onClick={() => navigate("/viormart")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Store
            </button>

            {/* Product Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              {/* Product Images */}
              <div>
                <div className="mb-4">
                  <img
                    src={
                      product.images?.[currentImageIndex]?.image ||
                      "/api/placeholder/500/500"
                    }
                    alt={product.name}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                </div>

                {product.images && product.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {product.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                          index === currentImageIndex
                            ? "border-color-1"
                            : "border-n-6"
                        }`}
                      >
                        <img
                          src={img.image}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div>
                <div className="mb-4">
                  <h1 className="text-3xl font-bold text-n-1 mb-2">
                    {product.name}
                  </h1>
                  <p className="text-n-3 mb-2">
                    by {product.brand_detail?.name || "Unknown Brand"}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-n-4"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-n-3">
                      ({product.review_count || 0} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-color-1">
                      {formatPrice(product.price, product.currency)}
                    </span>
                    {product.original_price &&
                      product.original_price > product.price && (
                        <span className="text-lg text-n-4 line-through ml-3">
                          {formatPrice(
                            product.original_price,
                            product.currency
                          )}
                        </span>
                      )}
                    {product.discount_percentage > 0 && (
                      <span className="ml-3 bg-red-100 text-red-600 px-2 py-1 text-sm rounded">
                        -{product.discount_percentage}% OFF
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Meta */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-n-7 p-4 rounded-lg border border-n-6">
                    <div className="flex items-center gap-2 text-n-3 mb-1">
                      <Package className="w-4 h-4" />
                      <span className="text-sm font-medium">Category</span>
                    </div>
                    <p className="text-n-1 font-semibold">
                      {product.category_detail?.name || "Uncategorized"}
                    </p>
                  </div>

                  <div className="bg-n-7 p-4 rounded-lg border border-n-6">
                    <div className="flex items-center gap-2 text-n-3 mb-1">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm font-medium">Availability</span>
                    </div>
                    <p
                      className={`font-semibold capitalize ${
                        product.is_in_stock ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {product.is_in_stock ? "In Stock" : "Out of Stock"}
                    </p>
                    {product.is_in_stock && product.stock_quantity && (
                      <p className="text-xs text-n-4 mt-1">
                        {product.stock_quantity} units available
                      </p>
                    )}
                  </div>
                </div>

                {/* Additional Product Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {product.brand_detail && (
                    <div className="bg-n-7 p-4 rounded-lg border border-n-6">
                      <div className="flex items-center gap-2 text-n-3 mb-1">
                        <Package className="w-4 h-4" />
                        <span className="text-sm font-medium">Brand</span>
                      </div>
                      <p className="text-n-1 font-semibold">
                        {product.brand_detail.name}
                      </p>
                    </div>
                  )}

                  {product.product_type_detail && (
                    <div className="bg-n-7 p-4 rounded-lg border border-n-6">
                      <div className="flex items-center gap-2 text-n-3 mb-1">
                        <Package className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          Product Type
                        </span>
                      </div>
                      <p className="text-n-1 font-semibold">
                        {product.product_type_detail.name}
                      </p>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {product.tags && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-n-3 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.split(",").map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-n-6 text-n-1 text-sm rounded-full"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                {product.is_in_stock && (
                  <div className="mb-6">
                    <label className="block text-n-2 text-sm mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-full bg-n-6 hover:bg-n-5 flex items-center justify-center text-n-1"
                      >
                        -
                      </button>
                      <span className="text-n-1 font-medium w-12 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-full bg-n-6 hover:bg-n-5 flex items-center justify-center text-n-1"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 mb-8">
                  <button
                    className={`flex-1 h-11 px-7 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                      product.is_in_stock
                        ? "bg-color-1 hover:bg-color-2 text-white"
                        : "bg-n-5 text-n-4 cursor-not-allowed"
                    }`}
                    onClick={handleAddToCart}
                    disabled={!product.is_in_stock}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {inCart ? "Added to Cart" : "Add to Cart"}
                  </button>

                  <button
                    className={`px-4 h-11 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                      inWishlist
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-n-6 text-n-1 hover:bg-n-5"
                    }`}
                    onClick={handleToggleWishlist}
                  >
                    <Heart
                      className="w-5 h-5"
                      fill={inWishlist ? "currentColor" : "none"}
                    />
                  </button>

                  <button className="px-4 h-11 rounded-lg font-semibold bg-n-6 text-n-1 hover:bg-n-5 transition-colors flex items-center justify-center">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-n-1 mb-4">
                    Description
                  </h3>
                  <p className="text-n-3 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Specifications */}
                {product.specifications && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-n-1 mb-4">
                      Specifications
                    </h3>
                    <div className="bg-n-7 p-6 rounded-lg border border-n-6">
                      {typeof product.specifications === "object" ? (
                        <div className="space-y-3">
                          {Object.entries(product.specifications).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="flex justify-between items-start"
                              >
                                <span className="text-n-2 font-medium capitalize">
                                  {key.replace(/_/g, " ")}:
                                </span>
                                <span className="text-n-3 text-right max-w-xs">
                                  {value}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="text-n-3">{product.specifications}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="border-t border-n-6 pt-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-n-1">
                  Customer Reviews ({reviews.length})
                </h2>
                <button
                  className="h-11 px-7 rounded-lg bg-n-6 text-n-1 hover:bg-n-5 font-semibold transition-colors flex items-center"
                  onClick={() => setShowReviews(!showReviews)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {showReviews ? "Hide" : "Show"} Reviews
                </button>
              </div>

              {showReviews && (
                <div className="space-y-8">
                  {/* Add Review Form */}
                  {isAuthenticated && (
                    <form
                      onSubmit={handleAddReview}
                      className="bg-n-7 p-6 rounded-lg border border-n-6"
                    >
                      <h3 className="text-lg font-semibold text-n-1 mb-4">
                        Write a Review
                      </h3>

                      {/* Rating Selector */}
                      <div className="mb-4">
                        <label className="block text-n-2 text-sm mb-2">
                          Rating
                        </label>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewRating(star)}
                              className={`text-2xl ${
                                star <= newRating
                                  ? "text-yellow-400"
                                  : "text-n-4"
                              }`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>

                      <textarea
                        value={newReview}
                        onChange={(e) => setNewReview(e.target.value)}
                        placeholder="Share your experience with this product..."
                        className="w-full h-32 p-3 bg-n-6 border border-n-5 rounded-lg text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none resize-none"
                      />

                      <div className="flex justify-end mt-4">
                        <button
                          type="submit"
                          disabled={isAddingReview}
                          className="h-11 px-7 rounded-lg bg-color-1 hover:bg-color-2 text-white font-semibold transition-colors flex items-center justify-center disabled:opacity-50"
                        >
                          {isAddingReview ? (
                            "Adding..."
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Add Review
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Reviews List */}
                  <div className="space-y-6">
                    {reviews.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageCircle className="w-16 h-16 text-n-4 mx-auto mb-4" />
                        <p className="text-n-3">
                          No reviews yet. Be the first to review this product!
                        </p>
                      </div>
                    ) : (
                      reviews.map((review) => (
                        <div
                          key={review.id}
                          className="bg-n-7 p-6 rounded-lg border border-n-6"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-n-6 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-n-3" />
                              </div>
                              <div>
                                <h4 className="text-n-1 font-medium">
                                  {review.user?.username || "Anonymous"}
                                </h4>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < review.rating
                                            ? "text-yellow-400 fill-current"
                                            : "text-n-4"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-n-4 text-sm">
                                    {formatDate(review.created_at)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="text-n-3 leading-relaxed">
                            {review.comment}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Section>
      </div>

      <Footer />
    </>
  );
};

export default ProductDetailPage;
