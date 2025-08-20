import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Package,
  Send,
  ArrowLeft,
  DollarSign,
  FileText,
  Sparkles,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Section from "../components/Section";
import shopService from "../services/shopService";

const CustomOrderPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);

  const [formData, setFormData] = useState({
    product_name: "",
    description: "",
    specifications: {},
    quantity: 1,
    budget_range: "",
    target_delivery_date: "",
  });

  const [specifications, setSpecifications] = useState([
    { key: "", value: "" },
  ]);

  // Handle auth loading state
  useEffect(() => {
    // Give a moment for auth to initialize
    const timer = setTimeout(() => {
      setAuthLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Load user's existing custom orders
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      loadUserOrders();
    }
  }, [isAuthenticated, authLoading]);

  const loadUserOrders = async () => {
    try {
      setLoadingOrders(true);
      const orders = await shopService.getCustomOrderRequests();
      console.log("Custom orders loaded:", orders);

      // Handle paginated response
      const ordersArray = orders.results ? orders.results : orders;
      setUserOrders(Array.isArray(ordersArray) ? ordersArray : []);
    } catch (error) {
      console.error("Error loading custom orders:", error);
      setUserOrders([]); // Ensure it's always an array
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpecificationChange = (index, field, value) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = value;
    setSpecifications(newSpecs);
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { key: "", value: "" }]);
  };

  const removeSpecification = (index) => {
    if (specifications.length > 1) {
      setSpecifications(specifications.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      // Convert specifications array to object
      const specsObject = specifications.reduce((acc, spec) => {
        if (spec.key && spec.value) {
          acc[spec.key] = spec.value;
        }
        return acc;
      }, {});

      const requestData = {
        ...formData,
        specifications: specsObject,
        quantity: parseInt(formData.quantity),
      };

      await shopService.createCustomOrderRequest(requestData);
      setSubmitSuccess(true);

      // Reset form
      setFormData({
        product_name: "",
        description: "",
        specifications: {},
        quantity: 1,
        budget_range: "",
        target_delivery_date: "",
      });
      setSpecifications([{ key: "", value: "" }]);

      // Reload orders
      loadUserOrders();

      // Hide success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error("Error submitting custom order request:", error);
      alert("Failed to submit custom order request. Please try again.");
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
      in_production: "text-indigo-600 bg-indigo-100",
      completed: "text-green-700 bg-green-200",
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
      in_production: Package,
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
              <Package className="h-16 w-16 text-color-1 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-n-1 mb-4">
                Login Required
              </h2>
              <p className="text-n-3 mb-6">
                Please log in to submit custom order requests.
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
                Custom order request submitted successfully! We&apos;ll review
                it and get back to you soon.
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Custom Order Form */}
            <div className="bg-n-7 rounded-xl p-6">
              <div className="flex items-center mb-6">
                <Sparkles className="h-6 w-6 text-color-1 mr-3" />
                <h1 className="text-2xl font-bold text-n-1">
                  Custom Order Request
                </h1>
              </div>

              <p className="text-n-3 mb-6">
                Can&apos;t find what you&apos;re looking for? Tell us what you
                need and we&apos;ll help you get it! Whether it&apos;s from
                another online platform or a completely custom product.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Name */}
                <div>
                  <label className="block text-n-1 font-semibold mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-n-6 border border-n-5 text-n-1 placeholder-n-4 focus:outline-none focus:border-color-1"
                    placeholder="What product do you need?"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-n-1 font-semibold mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-n-6 border border-n-5 text-n-1 placeholder-n-4 focus:outline-none focus:border-color-1"
                    placeholder="Describe the product in detail. Include links if requesting from other platforms..."
                  />
                </div>

                {/* Specifications */}
                <div>
                  <label className="block text-n-1 font-semibold mb-2">
                    Specifications
                  </label>
                  <div className="space-y-3">
                    {specifications.map((spec, index) => (
                      <div key={index} className="flex gap-3">
                        <input
                          type="text"
                          placeholder="Feature (e.g., Color, Size)"
                          value={spec.key}
                          onChange={(e) =>
                            handleSpecificationChange(
                              index,
                              "key",
                              e.target.value
                            )
                          }
                          className="flex-1 px-4 py-2 rounded-lg bg-n-6 border border-n-5 text-n-1 placeholder-n-4 focus:outline-none focus:border-color-1"
                        />
                        <input
                          type="text"
                          placeholder="Value (e.g., Red, Large)"
                          value={spec.value}
                          onChange={(e) =>
                            handleSpecificationChange(
                              index,
                              "value",
                              e.target.value
                            )
                          }
                          className="flex-1 px-4 py-2 rounded-lg bg-n-6 border border-n-5 text-n-1 placeholder-n-4 focus:outline-none focus:border-color-1"
                        />
                        {specifications.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSpecification(index)}
                            className="px-3 py-2 text-red-400 hover:text-red-300 transition-colors"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addSpecification}
                      className="text-color-1 hover:text-color-1/80 transition-colors text-sm"
                    >
                      + Add Specification
                    </button>
                  </div>
                </div>

                {/* Quantity and Budget */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-n-1 font-semibold mb-2">
                      Quantity *
                    </label>
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
                      Budget Range <span className="text-red-500">*</span>
                    </label>
                    <p className="text-n-4 text-sm mb-3">
                      Select your budget range to help us provide accurate
                      quotes.
                    </p>
                    <select
                      name="budget_range"
                      value={formData.budget_range}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-n-6 border border-n-5 text-n-1 focus:outline-none focus:border-color-1"
                    >
                      <option value="">Select Budget Range</option>
                      <option value="TSh 1,000 - 10,000">
                        TSh 1,000 - 10,000
                      </option>
                      <option value="TSh 10,000 - 25,000">
                        TSh 10,000 - 25,000
                      </option>
                      <option value="TSh 25,000 - 50,000">
                        TSh 25,000 - 50,000
                      </option>
                      <option value="TSh 50,000 - 100,000">
                        TSh 50,000 - 100,000
                      </option>
                      <option value="TSh 100,000 - 250,000">
                        TSh 100,000 - 250,000
                      </option>
                      <option value="TSh 250,000 - 500,000">
                        TSh 250,000 - 500,000
                      </option>
                      <option value="TSh 500,000 - 1,000,000">
                        TSh 500,000 - 1,000,000
                      </option>
                      <option value="TSh 1,000,000 - 2,500,000">
                        TSh 1,000,000 - 2,500,000
                      </option>
                      <option value="TSh 2,500,000 - 5,000,000">
                        TSh 2,500,000 - 5,000,000
                      </option>
                      <option value="TSh 5,000,000+">TSh 5,000,000+</option>
                      <option value="Custom Range (specify in description)">
                        Custom Range (specify in description)
                      </option>
                    </select>
                  </div>
                </div>

                {/* Target Delivery Date */}
                <div>
                  <label className="block text-n-1 font-semibold mb-2">
                    Target Delivery Date
                  </label>
                  <input
                    type="date"
                    name="target_delivery_date"
                    value={formData.target_delivery_date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-n-6 border border-n-5 text-n-1 focus:outline-none focus:border-color-1"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-color-1 text-white py-3 rounded-lg hover:bg-color-1/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Submit Request
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* User's Orders */}
            <div className="bg-n-7 rounded-xl p-6">
              <h2 className="text-xl font-bold text-n-1 mb-6 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Your Custom Orders
              </h2>

              {loadingOrders ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-color-1 mx-auto mb-4" />
                  <p className="text-n-3">Loading orders...</p>
                </div>
              ) : Array.isArray(userOrders) && userOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-n-4 mx-auto mb-4" />
                  <p className="text-n-3">No custom orders yet</p>
                  <p className="text-n-4 text-sm">
                    Submit your first request to get started!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(Array.isArray(userOrders) ? userOrders : []).map(
                    (order) => (
                      <div
                        key={order.id}
                        className="bg-n-6 rounded-lg p-5 border border-n-5 hover:border-n-4 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-n-1 text-lg mb-2">
                              {order.product_name}
                            </h3>
                            <p className="text-n-3 text-sm mb-3 line-clamp-3">
                              {order.description}
                            </p>
                          </div>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">
                              {order.status.replace("_", " ")}
                            </span>
                          </span>
                        </div>

                        {/* Specifications Display */}
                        {order.specifications &&
                          order.specifications.length > 0 && (
                            <div className="mb-3">
                              <h4 className="text-sm font-medium text-n-2 mb-2">
                                Specifications:
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {order.specifications.map((spec, index) => (
                                  <div
                                    key={index}
                                    className="bg-n-7 p-2 rounded text-xs"
                                  >
                                    <span className="text-n-4">
                                      {spec.key}:
                                    </span>
                                    <span className="text-n-2 ml-1">
                                      {spec.value}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                          <div className="bg-n-7 p-2 rounded">
                            <span className="text-n-4 text-xs">Quantity</span>
                            <p className="text-n-1 font-medium">
                              {order.quantity}
                            </p>
                          </div>
                          <div className="bg-n-7 p-2 rounded">
                            <span className="text-n-4 text-xs">
                              Budget Range
                            </span>
                            <p className="text-n-1 font-medium">
                              {order.budget_range || "Not specified"}
                            </p>
                          </div>
                        </div>

                        {order.quoted_price && (
                          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mt-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-green-400 mb-1">
                                  Quote Available
                                </p>
                                <p className="text-lg font-bold text-n-1">
                                  TSh{" "}
                                  {parseFloat(
                                    order.quoted_price
                                  ).toLocaleString()}
                                </p>
                              </div>
                              <div className="text-green-400">
                                <CheckCircle className="h-6 w-6" />
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-n-5">
                          <div className="text-xs text-n-4">
                            Submitted:{" "}
                            {new Date(order.created_at).toLocaleDateString(
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
                            ID: #{order.id}
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

export default CustomOrderPage;
