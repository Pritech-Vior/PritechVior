import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  ExternalLink,
  Package,
  Send,
  ArrowLeft,
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  AlertCircle,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Section from "../components/Section";
import shopService from "../services/shopService";

const ProductRequestPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [userRequests, setUserRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [platforms, setPlatforms] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);

  const [formData, setFormData] = useState({
    platform_id: "",
    product_url: "",
    product_name: "",
    quantity: 1,
    original_price: "",
    notes: "",
  });

  // Handle auth loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setAuthLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Load platforms regardless of authentication (public data)
  useEffect(() => {
    loadPlatforms();
  }, []);

  // Load user's existing requests only when authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      loadUserRequests();
    }
  }, [isAuthenticated, authLoading]);

  const loadPlatforms = async () => {
    try {
      const platformsData = await shopService.getPlatforms();
      console.log("Platforms loaded:", platformsData);
      console.log("Is array?", Array.isArray(platformsData));
      console.log("Type:", typeof platformsData);

      // Handle paginated response
      const platformsArray = platformsData.results
        ? platformsData.results
        : platformsData;
      setPlatforms(Array.isArray(platformsArray) ? platformsArray : []);
    } catch (error) {
      console.error("Error loading platforms:", error);
      setPlatforms([]); // Ensure it's always an array
    }
  };

  const loadUserRequests = async () => {
    try {
      setLoadingRequests(true);
      const requests = await shopService.getProductRequests();
      console.log("Product requests loaded:", requests);
      console.log("Is array?", Array.isArray(requests));
      console.log("Type:", typeof requests);

      // Handle paginated response
      const requestsArray = requests.results ? requests.results : requests;
      setUserRequests(Array.isArray(requestsArray) ? requestsArray : []);
    } catch (error) {
      console.error("Error loading product requests:", error);
      setUserRequests([]); // Ensure it's always an array
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        ...formData,
        quantity: parseInt(formData.quantity),
        original_price: parseFloat(formData.original_price),
        platform_id: formData.platform_id || null,
      };

      await shopService.createProductRequest(requestData);
      setSubmitSuccess(true);

      // Reset form
      setFormData({
        platform_id: "",
        product_url: "",
        product_name: "",
        quantity: 1,
        original_price: "",
        notes: "",
      });

      // Reload requests
      loadUserRequests();

      // Hide success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error("Error submitting product request:", error);
      alert("Failed to submit product request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "text-yellow-600 bg-yellow-100",
      reviewing: "text-blue-600 bg-blue-100",
      quoted: "text-purple-600 bg-purple-100",
      approved: "text-green-600 bg-green-100",
      ordered: "text-indigo-600 bg-indigo-100",
      received: "text-green-700 bg-green-200",
      completed: "text-green-800 bg-green-300",
      cancelled: "text-red-600 bg-red-100",
    };
    return colors[status] || "text-gray-600 bg-gray-100";
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      reviewing: FileText,
      quoted: DollarSign,
      approved: CheckCircle,
      ordered: Package,
      received: Package,
      completed: CheckCircle,
      cancelled: AlertCircle,
    };
    const Icon = icons[status] || Clock;
    return <Icon className="h-4 w-4" />;
  };

  if (authLoading) {
    return (
      <>
        <Header />
        <Section className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden min-h-screen bg-n-8">
          <div className="container mx-auto px-4 py-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-color-1 mx-auto mb-4" />
            <p className="text-n-3">Loading...</p>
          </div>
        </Section>
        <Footer />
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <Section className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden min-h-screen bg-n-8">
          <div className="container mx-auto px-4 py-8 text-center">
            <div className="bg-n-7 rounded-xl p-8 max-w-md mx-auto">
              <Globe className="h-16 w-16 text-color-1 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-n-1 mb-4">
                Login Required
              </h2>
              <p className="text-n-3 mb-6">
                Please log in to submit product requests from external
                platforms.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="bg-color-1 text-white px-6 py-2 rounded-lg hover:bg-color-1/90 transition-colors"
              >
                Login
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
      <Section className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden min-h-screen bg-n-8">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate("/viormart")}
            className="flex items-center text-n-3 hover:text-color-1 mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Shop
          </button>

          {/* Success Message */}
          {submitSuccess && (
            <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-4 mb-6 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
              <span className="text-green-400">
                Product request submitted successfully! We&apos;ll review it and
                get back to you with a quote.
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Request Form */}
            <div className="bg-n-7 rounded-xl p-6">
              <div className="flex items-center mb-6">
                <Globe className="h-6 w-6 text-color-1 mr-3" />
                <h1 className="text-2xl font-bold text-n-1">Product Request</h1>
              </div>

              <p className="text-n-3 mb-6">
                Found a product on another platform? Share the link and
                we&apos;ll help you get it delivered to Tanzania! We partner
                with major international platforms for reliable sourcing.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Platform Selection */}
                <div>
                  <label className="block text-n-1 font-semibold mb-2">
                    Platform{" "}
                    <span className="text-n-4 font-normal">(Optional)</span>
                  </label>
                  <p className="text-n-4 text-sm mb-3">
                    Select the platform where you found the product. This helps
                    us process your request faster.
                  </p>
                  <select
                    name="platform_id"
                    value={formData.platform_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-n-6 border border-n-5 text-n-1 focus:outline-none focus:border-color-1"
                  >
                    <option value="">Select Platform (if known)</option>
                    {(Array.isArray(platforms) ? platforms : []).map(
                      (platform) => (
                        <option key={platform.id} value={platform.id}>
                          {platform.name}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* Product URL */}
                <div>
                  <label className="block text-n-1 font-semibold mb-2">
                    Product URL or Link <span className="text-red-500">*</span>
                  </label>
                  <p className="text-n-4 text-sm mb-3">
                    Paste the complete link to the product you want to order.
                    Include shipping details if available.
                  </p>
                  <input
                    type="url"
                    name="product_url"
                    value={formData.product_url}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-n-6 border border-n-5 text-n-1 placeholder-n-4 focus:outline-none focus:border-color-1"
                    placeholder="https://example.com/product-link"
                  />
                </div>

                {/* Product Name */}
                <div>
                  <label className="block text-n-1 font-semibold mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <p className="text-n-4 text-sm mb-3">
                    Enter the exact product name as shown on the website. This
                    helps us identify the correct item.
                  </p>
                  <input
                    type="text"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-n-6 border border-n-5 text-n-1 placeholder-n-4 focus:outline-none focus:border-color-1"
                    placeholder="Product name as shown on the site"
                  />
                </div>

                {/* Quantity and Original Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-n-1 font-semibold mb-2">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <p className="text-n-4 text-xs mb-2">
                      How many items do you want?
                    </p>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      min="1"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-n-6 border border-n-5 text-n-1 placeholder-n-4 focus:outline-none focus:border-color-1"
                    />
                  </div>
                  <div>
                    <label className="block text-n-1 font-semibold mb-2">
                      Original Price <span className="text-red-500">*</span>
                    </label>
                    <p className="text-n-4 text-xs mb-2">
                      Price shown on the website
                    </p>
                    <input
                      type="number"
                      name="original_price"
                      value={formData.original_price}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-n-6 border border-n-5 text-n-1 placeholder-n-4 focus:outline-none focus:border-color-1"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-n-1 font-semibold mb-2">
                    Additional Notes{" "}
                    <span className="text-n-4 font-normal">(Optional)</span>
                  </label>
                  <p className="text-n-4 text-sm mb-3">
                    Include any special requirements like size, color, shipping
                    preferences, or other important details.
                  </p>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg bg-n-6 border border-n-5 text-n-1 placeholder-n-4 focus:outline-none focus:border-color-1"
                    placeholder="Size preference, color choice, delivery instructions, etc."
                  />
                </div>

                {/* Submit Button */}
                <div className="bg-n-6 p-4 rounded-lg mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-500/10 p-2 rounded-full">
                      <Globe className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-n-1 mb-1">
                        How it works:
                      </h3>
                      <p className="text-xs text-n-4">
                        1. Submit your request with the product link
                        <br />
                        2. We&apos;ll contact you with pricing and shipping
                        details
                        <br />
                        3. Pay and we&apos;ll handle the international shipping
                        to Tanzania
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-color-1 to-blue-600 text-white py-4 rounded-lg hover:from-color-1/90 hover:to-blue-600/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold text-lg shadow-lg"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Submit Product Request
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* User's Requests */}
            <div className="bg-n-7 rounded-xl p-6">
              <h2 className="text-xl font-bold text-n-1 mb-6 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Your Product Requests
              </h2>

              {loadingRequests ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-color-1 mx-auto mb-4" />
                  <p className="text-n-3">Loading requests...</p>
                </div>
              ) : Array.isArray(userRequests) && userRequests.length === 0 ? (
                <div className="text-center py-8">
                  <Globe className="h-12 w-12 text-n-4 mx-auto mb-4" />
                  <p className="text-n-3">No product requests yet</p>
                  <p className="text-n-4 text-sm">
                    Submit your first request to get started!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(Array.isArray(userRequests) ? userRequests : []).map(
                    (request) => (
                      <div
                        key={request.id}
                        className="bg-n-6 rounded-lg p-5 border border-n-5 hover:border-n-4 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-n-1 text-lg mb-1">
                              {request.product_name}
                            </h3>
                            {request.platform && (
                              <span className="text-xs text-n-4 bg-n-7 px-2 py-1 rounded">
                                {request.platform.name}
                              </span>
                            )}
                          </div>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              request.status
                            )}`}
                          >
                            {getStatusIcon(request.status)}
                            <span className="ml-1 capitalize">
                              {request.status}
                            </span>
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <ExternalLink className="h-4 w-4 text-n-4" />
                          <a
                            href={request.product_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-color-1 hover:text-color-1/80 text-sm truncate flex-1"
                          >
                            View Original Product
                          </a>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                          <div className="bg-n-7 p-2 rounded">
                            <span className="text-n-4 text-xs">Quantity</span>
                            <p className="text-n-1 font-medium">
                              {request.quantity}
                            </p>
                          </div>
                          <div className="bg-n-7 p-2 rounded">
                            <span className="text-n-4 text-xs">
                              Original Price
                            </span>
                            <p className="text-n-1 font-medium">
                              ${parseFloat(request.original_price).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {request.quoted_price && (
                          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mt-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-green-400 mb-1">
                                  Our Quote Available
                                </p>
                                <p className="text-lg font-bold text-n-1">
                                  TSh{" "}
                                  {parseFloat(
                                    request.quoted_price
                                  ).toLocaleString()}
                                </p>
                                {request.service_fee > 0 && (
                                  <p className="text-xs text-n-4">
                                    + TSh{" "}
                                    {parseFloat(
                                      request.service_fee
                                    ).toLocaleString()}{" "}
                                    service fee
                                  </p>
                                )}
                              </div>
                              <div className="text-green-400">
                                <CheckCircle className="h-6 w-6" />
                              </div>
                            </div>
                          </div>
                        )}

                        {request.notes && (
                          <div className="mt-3 p-2 bg-n-7 rounded">
                            <p className="text-xs text-n-4 mb-1">Notes:</p>
                            <p className="text-sm text-n-2">{request.notes}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-n-5">
                          <div className="text-xs text-n-4">
                            Submitted:{" "}
                            {new Date(request.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </div>
                          <div className="text-xs text-n-4">
                            ID: #{request.id}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>
      <Footer />
    </>
  );
};

export default ProductRequestPage;
