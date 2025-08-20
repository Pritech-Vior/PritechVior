import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  User,
  Phone,
  Mail,
  Lock,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import shopService from "../services/shopService";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Section from "../components/Section";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartCount, loading: cartLoading, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    // Customer Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",

    // Billing Address
    billingAddress: "",
    billingCity: "",
    billingRegion: "",
    billingPostalCode: "",
    billingCountry: "Tanzania",

    // Shipping Address
    sameAsBilling: true,
    shippingAddress: "",
    shippingCity: "",
    shippingRegion: "",
    shippingPostalCode: "",
    shippingCountry: "Tanzania",

    // Payment Information
    paymentMethod: "mpesa",
    mpesaNumber: "",

    // Additional Information
    orderNotes: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartLoading && cartCount === 0) {
      navigate("/viormart");
      showToast(
        "Your cart is empty. Please add items before checkout.",
        "error"
      );
    }
  }, [cartCount, cartLoading, navigate, showToast]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: "/checkout",
          message: "Please log in to complete your order",
        },
      });
      showToast("Please log in to complete your order.", "error");
    }
  }, [isAuthenticated, navigate, showToast]);

  // Pre-fill user data if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
      }));
    }
  }, [isAuthenticated, user]);

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => {
    const price = parseFloat(item.product.price) || 0;
    return total + price * item.quantity;
  }, 0);

  const shippingCost = 0; // Free shipping
  const taxRate = 0.18; // 18% VAT
  const tax = subtotal * taxRate;
  const total = subtotal + shippingCost + tax;

  const formatPrice = (price, currency = "TZS") => {
    return new Intl.NumberFormat("sw-TZ", {
      style: "currency",
      currency: currency === "TZS" ? "TZS" : "USD",
    }).format(price);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
        // Clear shipping address if same as billing is checked
        ...(name === "sameAsBilling" && checked
          ? {
              shippingAddress: "",
              shippingCity: "",
              shippingRegion: "",
              shippingPostalCode: "",
              shippingCountry: "Tanzania",
            }
          : {}),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.billingAddress.trim())
      newErrors.billingAddress = "Billing address is required";
    if (!formData.billingCity.trim())
      newErrors.billingCity = "City is required";
    if (!formData.billingRegion.trim())
      newErrors.billingRegion = "Region is required";

    // Shipping address if different from billing
    if (!formData.sameAsBilling) {
      if (!formData.shippingAddress.trim())
        newErrors.shippingAddress = "Shipping address is required";
      if (!formData.shippingCity.trim())
        newErrors.shippingCity = "Shipping city is required";
      if (!formData.shippingRegion.trim())
        newErrors.shippingRegion = "Shipping region is required";
    }

    // Payment method validation
    if (formData.paymentMethod === "mpesa" && !formData.mpesaNumber.trim()) {
      newErrors.mpesaNumber = "M-Pesa number is required";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation (basic)
    const phoneRegex = /^[+]?[\d\s\-()]+$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast("Please fill in all required fields correctly", "error");
      return;
    }

    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        items: cartItems.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
          product_name: item.product.name,
        })),
        customer_info: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        billing_address: {
          address: formData.billingAddress,
          city: formData.billingCity,
          region: formData.billingRegion,
          postal_code: formData.billingPostalCode,
          country: formData.billingCountry,
        },
        shipping_address: formData.sameAsBilling
          ? {
              address: formData.billingAddress,
              city: formData.billingCity,
              region: formData.billingRegion,
              postal_code: formData.billingPostalCode,
              country: formData.billingCountry,
            }
          : {
              address: formData.shippingAddress,
              city: formData.shippingCity,
              region: formData.shippingRegion,
              postal_code: formData.shippingPostalCode,
              country: formData.shippingCountry,
            },
        payment_method: formData.paymentMethod,
        payment_details:
          formData.paymentMethod === "mpesa"
            ? {
                mpesa_number: formData.mpesaNumber,
              }
            : {},
        order_notes: formData.orderNotes,
        subtotal: subtotal,
        tax: tax,
        shipping_cost: shippingCost,
        total: total,
      };

      // Create order in backend
      const response = await shopService.createOrder(orderData);

      // Clear the cart after successful order
      await clearCart();

      showToast(
        "Order placed successfully! You will receive a confirmation email shortly.",
        "success"
      );

      // Redirect to order confirmation page with actual order data
      navigate("/order-confirmation", {
        state: {
          orderId: response.order_id || `ORD-${Date.now()}`,
          orderData: orderData, // Always use our complete frontend orderData
          backendOrder: response.order, // Optional: keep backend response for reference
        },
      });
    } catch (error) {
      console.error("Error placing order:", error);
      showToast("Error placing order. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (cartLoading) {
    return (
      <>
        <Header />
        <Section className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-color-1"></div>
            </div>
          </div>
        </Section>
      </>
    );
  }

  return (
    <>
      <Header />
      <Section className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/cart")}
                className="p-2 hover:bg-n-7 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-n-1" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-n-1 flex items-center gap-3">
                  <CreditCard className="w-8 h-8 text-color-1" />
                  Checkout
                </h1>
                <p className="text-n-3 mt-1">Complete your order below</p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Left Column - Forms */}
            <div className="space-y-8">
              {/* Customer Information */}
              <div className="bg-n-8 border border-n-6 p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 text-n-1 flex items-center gap-2">
                  <User className="w-5 h-5 text-color-1" />
                  Customer Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-n-3 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-n-7 border rounded-md focus:outline-none focus:ring-2 focus:ring-color-1 text-n-1 ${
                        errors.firstName ? "border-red-500" : "border-n-6"
                      }`}
                    />
                    {errors.firstName && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-n-3 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-n-7 border rounded-md focus:outline-none focus:ring-2 focus:ring-color-1 text-n-1 ${
                        errors.lastName ? "border-red-500" : "border-n-6"
                      }`}
                    />
                    {errors.lastName && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-n-3 mb-1">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-n-4 absolute left-3 top-3" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 pl-10 bg-n-7 border rounded-md focus:outline-none focus:ring-2 focus:ring-color-1 text-n-1 ${
                          errors.email ? "border-red-500" : "border-n-6"
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-n-3 mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-n-4 absolute left-3 top-3" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+255 XXX XXX XXX"
                        className={`w-full px-3 py-2 pl-10 bg-n-7 border rounded-md focus:outline-none focus:ring-2 focus:ring-color-1 text-n-1 ${
                          errors.phone ? "border-red-500" : "border-n-6"
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="bg-n-8 border border-n-6 p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 text-n-1 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-color-1" />
                  Billing Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-n-3 mb-1">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="billingAddress"
                      value={formData.billingAddress}
                      onChange={handleInputChange}
                      placeholder="Street address, P.O. Box, etc."
                      className={`w-full px-3 py-2 bg-n-7 border rounded-md focus:outline-none focus:ring-2 focus:ring-color-1 text-n-1 ${
                        errors.billingAddress ? "border-red-500" : "border-n-6"
                      }`}
                    />
                    {errors.billingAddress && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.billingAddress}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-n-3 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="billingCity"
                        value={formData.billingCity}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 bg-n-7 border rounded-md focus:outline-none focus:ring-2 focus:ring-color-1 text-n-1 ${
                          errors.billingCity ? "border-red-500" : "border-n-6"
                        }`}
                      />
                      {errors.billingCity && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.billingCity}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-n-3 mb-1">
                        Region *
                      </label>
                      <select
                        name="billingRegion"
                        value={formData.billingRegion}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 bg-n-7 border rounded-md focus:outline-none focus:ring-2 focus:ring-color-1 text-n-1 ${
                          errors.billingRegion ? "border-red-500" : "border-n-6"
                        }`}
                      >
                        <option value="">Select Region</option>
                        <option value="Dar es Salaam">Dar es Salaam</option>
                        <option value="Arusha">Arusha</option>
                        <option value="Mwanza">Mwanza</option>
                        <option value="Dodoma">Dodoma</option>
                        <option value="Mbeya">Mbeya</option>
                        <option value="Kilimanjaro">Kilimanjaro</option>
                        <option value="Morogoro">Morogoro</option>
                        <option value="Tanga">Tanga</option>
                        <option value="Zanzibar">Zanzibar</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.billingRegion && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.billingRegion}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-n-3 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="billingPostalCode"
                        value={formData.billingPostalCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-n-7 border border-n-6 rounded-md focus:outline-none focus:ring-2 focus:ring-color-1 text-n-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-n-8 border border-n-6 p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 text-n-1">
                  Shipping Address
                </h2>
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="sameAsBilling"
                      checked={formData.sameAsBilling}
                      onChange={handleInputChange}
                      className="mr-2 bg-n-7 border-n-6 text-color-1 focus:ring-color-1"
                    />
                    <span className="text-sm text-n-3">
                      Same as billing address
                    </span>
                  </label>
                </div>

                {!formData.sameAsBilling && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-n-3 mb-1">
                        Address *
                      </label>
                      <input
                        type="text"
                        name="shippingAddress"
                        value={formData.shippingAddress}
                        onChange={handleInputChange}
                        placeholder="Street address, P.O. Box, etc."
                        className={`w-full px-3 py-2 bg-n-7 border rounded-md focus:outline-none focus:ring-2 focus:ring-color-1 text-n-1 ${
                          errors.shippingAddress
                            ? "border-red-500"
                            : "border-n-6"
                        }`}
                      />
                      {errors.shippingAddress && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.shippingAddress}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-n-3 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          name="shippingCity"
                          value={formData.shippingCity}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 bg-n-7 border rounded-md focus:outline-none focus:ring-2 focus:ring-color-1 text-n-1 ${
                            errors.shippingCity
                              ? "border-red-500"
                              : "border-n-6"
                          }`}
                        />
                        {errors.shippingCity && (
                          <p className="text-red-400 text-sm mt-1">
                            {errors.shippingCity}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-n-3 mb-1">
                          Region *
                        </label>
                        <select
                          name="shippingRegion"
                          value={formData.shippingRegion}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 bg-n-7 border rounded-md focus:outline-none focus:ring-2 focus:ring-color-1 text-n-1 ${
                            errors.shippingRegion
                              ? "border-red-500"
                              : "border-n-6"
                          }`}
                        >
                          <option value="">Select Region</option>
                          <option value="Dar es Salaam">Dar es Salaam</option>
                          <option value="Arusha">Arusha</option>
                          <option value="Mwanza">Mwanza</option>
                          <option value="Dodoma">Dodoma</option>
                          <option value="Mbeya">Mbeya</option>
                          <option value="Kilimanjaro">Kilimanjaro</option>
                          <option value="Morogoro">Morogoro</option>
                          <option value="Tanga">Tanga</option>
                          <option value="Zanzibar">Zanzibar</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.shippingRegion && (
                          <p className="text-red-400 text-sm mt-1">
                            {errors.shippingRegion}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-n-3 mb-1">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          name="shippingPostalCode"
                          value={formData.shippingPostalCode}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-n-7 border border-n-6 rounded-md focus:outline-none focus:ring-2 focus:ring-color-1 text-n-1"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-n-8 border border-n-6 p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 text-n-1 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-color-1" />
                  Payment Method
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="mpesa"
                        checked={formData.paymentMethod === "mpesa"}
                        onChange={handleInputChange}
                        className="mr-2 bg-n-7 border-n-6 text-color-1 focus:ring-color-1"
                      />
                      <span className="text-sm text-n-3">
                        M-Pesa Mobile Payment
                      </span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank"
                        checked={formData.paymentMethod === "bank"}
                        onChange={handleInputChange}
                        className="mr-2 bg-n-7 border-n-6 text-color-1 focus:ring-color-1"
                      />
                      <span className="text-sm text-n-3">Bank Transfer</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === "cod"}
                        onChange={handleInputChange}
                        className="mr-2 bg-n-7 border-n-6 text-color-1 focus:ring-color-1"
                      />
                      <span className="text-sm text-n-3">Cash on Delivery</span>
                    </label>
                  </div>

                  {formData.paymentMethod === "mpesa" && (
                    <div>
                      <label className="block text-sm font-medium text-n-3 mb-1">
                        M-Pesa Number *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-n-4 absolute left-3 top-3" />
                        <input
                          type="tel"
                          name="mpesaNumber"
                          value={formData.mpesaNumber}
                          onChange={handleInputChange}
                          placeholder="+255 XXX XXX XXX"
                          className={`w-full px-3 py-2 pl-10 bg-n-7 border rounded-md focus:outline-none focus:ring-2 focus:ring-color-1 text-n-1 ${
                            errors.mpesaNumber ? "border-red-500" : "border-n-6"
                          }`}
                        />
                      </div>
                      {errors.mpesaNumber && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.mpesaNumber}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-n-8 border border-n-6 p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 text-n-1">
                  Additional Information
                </h2>
                <div>
                  <label className="block text-sm font-medium text-n-3 mb-1">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    name="orderNotes"
                    value={formData.orderNotes}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Notes about your order, e.g. special notes for delivery."
                    className="w-full px-3 py-2 bg-n-7 border border-n-6 rounded-md focus:outline-none focus:ring-2 focus:ring-color-1 text-n-1"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:sticky lg:top-8 lg:self-start">
              <div className="bg-n-8 border border-n-6 p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 text-n-1 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-color-1" />
                  Order Summary
                </h2>

                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-start border-b border-n-6 pb-3"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-n-1">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-n-3">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <span className="font-medium text-n-1">
                        {formatPrice(
                          parseFloat(item.product.price) * item.quantity
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Totals */}
                <div className="border-t border-n-6 pt-4 space-y-2">
                  <div className="flex justify-between text-n-3">
                    <span>Subtotal ({cartCount} items)</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-n-3">
                    <span>Shipping</span>
                    <span>
                      {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-n-3">
                    <span>Tax (18% VAT)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="border-t border-n-6 pt-2 flex justify-between text-lg font-semibold text-n-1">
                    <span>Total</span>
                    <span className="text-color-1">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={loading || cartCount === 0}
                  className="w-full mt-6 px-6 py-3 bg-color-1 hover:bg-color-1/90 text-white rounded-lg font-semibold transition-all duration-200 hover:shadow-lg disabled:bg-n-6 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    `Place Order - ${formatPrice(total)}`
                  )}
                </button>

                {/* Security Notice */}
                <div className="mt-4 flex items-center justify-center text-sm text-n-4">
                  <Lock className="w-4 h-4 mr-2" />
                  Secure checkout with SSL
                </div>
              </div>

              {/* Back to Cart */}
              <button
                type="button"
                onClick={() => navigate("/cart")}
                className="w-full mt-4 px-6 py-3 border border-n-6 text-n-1 hover:bg-n-7 rounded-lg font-semibold transition-all duration-200"
              >
                ← Back to Cart
              </button>
            </div>
          </form>
        </div>
      </Section>
      <Footer />
    </>
  );
};

export default CheckoutPage;
