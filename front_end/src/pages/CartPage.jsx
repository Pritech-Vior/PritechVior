import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  Package,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Section from "../components/Section";

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    cartItems,
    loading,
    updateCartItem,
    removeCartItem,
    clearCart: clearCartContext,
  } = useCart();
  const { showSuccess, showError } = useToast();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Calculate total whenever cartItems change
    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + parseFloat(item.product.price) * item.quantity;
    }, 0);
    setTotal(totalAmount);
  }, [cartItems]);

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity === 0) {
      await removeItem(itemId);
      return;
    }

    try {
      await updateCartItem(itemId, newQuantity);
      showSuccess("Cart updated successfully");
    } catch (error) {
      showError("Failed to update cart");
      console.error("Error updating cart item:", error);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await removeCartItem(itemId);
      showSuccess("Item removed from cart");
    } catch (error) {
      showError("Failed to remove item");
      console.error("Error removing cart item:", error);
    }
  };

  const clearCart = async () => {
    try {
      await clearCartContext();
      showSuccess("Cart cleared successfully");
    } catch (error) {
      showError("Failed to clear cart");
      console.error("Error clearing cart:", error);
    }
  };

  const formatPrice = (price, currency = "TZS") => {
    return new Intl.NumberFormat("sw-TZ", {
      style: "currency",
      currency: currency === "TZS" ? "TZS" : "USD",
    }).format(price);
  };

  const handleContinueShopping = () => {
    navigate("/viormart");
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }
    navigate("/checkout");
  };

  return (
    <>
      <Header />
      <Section className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={handleContinueShopping}
                className="p-2 hover:bg-n-7 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-n-1" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-n-1 flex items-center gap-3">
                  <ShoppingBag className="w-8 h-8 text-color-1" />
                  Shopping Cart
                </h1>
                <p className="text-n-3 mt-1">
                  {cartItems.length} {cartItems.length === 1 ? "item" : "items"}{" "}
                  in your cart
                </p>
              </div>
            </div>

            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="px-4 py-2 text-red-400 hover:text-red-300 border border-red-800 hover:border-red-700 rounded-lg transition-colors hover:bg-red-900/20"
                disabled={loading}
              >
                Clear Cart
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-color-1"></div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
              <ShoppingBag className="w-24 h-24 text-n-4 mb-6" />
              <h2 className="text-2xl font-bold text-n-1 mb-4">
                Your cart is empty
              </h2>
              <p className="text-n-3 text-lg mb-8">
                Looks like you haven&apos;t added any items to your cart yet
              </p>
              <button
                onClick={handleContinueShopping}
                className="px-8 py-3 bg-color-1 hover:bg-color-1/90 text-white rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
              >
                <Package className="w-5 h-5" />
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-6 p-6 rounded-xl border border-n-6 bg-n-8 hover:border-n-5 transition-all duration-200"
                  >
                    <img
                      src={
                        item.product.images?.[0]?.image ||
                        "/api/placeholder/120/120"
                      }
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold text-n-1 mb-2">
                        {item.product.name}
                      </h3>
                      <p className="text-n-3 mb-2">
                        {item.product.brand?.name &&
                          `${item.product.brand.name} • `}
                        {item.product.category_detail?.name}
                      </p>
                      <p className="text-lg font-semibold text-color-1">
                        {formatPrice(item.product.price)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-n-7 rounded-lg border border-n-6">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="p-2 hover:bg-n-6 text-n-4 hover:text-n-1 rounded-l-lg transition-colors"
                          disabled={loading}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 text-n-1 font-medium min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-2 hover:bg-n-6 text-n-4 hover:text-n-1 rounded-r-lg transition-colors"
                          disabled={loading}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="text-sm text-n-3">Total</p>
                        <p className="text-xl font-bold text-n-1">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all duration-200"
                        disabled={loading}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 p-6 rounded-xl border border-n-6 bg-n-8">
                  <h3 className="text-xl font-bold text-n-1 mb-6">
                    Order Summary
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-n-3">
                      <span>Subtotal ({cartItems.length} items)</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between text-n-3">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between text-n-3">
                      <span>Tax</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <hr className="border-n-6" />
                    <div className="flex justify-between text-xl font-bold text-n-1">
                      <span>Total</span>
                      <span className="text-color-1">{formatPrice(total)}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleCheckout}
                      className="w-full px-6 py-3 bg-color-1 hover:bg-color-1/90 text-white rounded-lg font-semibold transition-all duration-200 hover:shadow-lg"
                      disabled={loading}
                    >
                      Proceed to Checkout
                    </button>
                    <button
                      onClick={handleContinueShopping}
                      className="w-full px-6 py-3 border border-n-6 text-n-1 hover:bg-n-7 rounded-lg font-semibold transition-all duration-200"
                    >
                      Continue Shopping
                    </button>
                  </div>

                  {/* Security Badge */}
                  <div className="mt-6 p-4 bg-n-7 rounded-lg">
                    <p className="text-xs text-n-3 text-center">
                      🔒 Secure checkout with SSL encryption
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Section>
      <Footer />
    </>
  );
};

export default CartPage;
