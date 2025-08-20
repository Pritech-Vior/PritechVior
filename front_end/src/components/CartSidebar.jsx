import { useState, useEffect } from "react";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";

const CartSidebar = ({ isOpen, onClose }) => {
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

  return (
    <>
      {/* Backdrop - only show when open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out z-[9999] flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-600 bg-gray-800 flex-shrink-0">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-blue-400" />
            Shopping Cart
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {!isAuthenticated ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-6">
              <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                Please login to view cart
              </h3>
              <p className="text-gray-300 text-sm">
                Sign in to access your shopping cart
              </p>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-6">
              <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-300 text-sm">
                Add some products to get started
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-gray-600 bg-gray-700"
                >
                  <img
                    src={
                      item.product.images?.[0]?.image ||
                      "/api/placeholder/60/60"
                    }
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-300 mb-2">
                      {formatPrice(item.product.price)}{" "}
                      {item.product.brand?.name &&
                        `• ${item.product.brand.name}`}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 bg-gray-800 rounded-lg border border-gray-600">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="p-2 hover:bg-gray-700 text-gray-400 rounded-l-lg transition-colors"
                          disabled={loading}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 py-2 text-white font-medium min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-2 hover:bg-gray-700 text-gray-400 rounded-r-lg transition-colors"
                          disabled={loading}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all duration-200"
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mt-2">
                      <span className="text-blue-400 font-semibold text-sm">
                        Total: {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {isAuthenticated && cartItems.length > 0 && (
          <div className="border-t border-gray-600 p-6 bg-gray-800 flex-shrink-0">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-white">Total:</span>
              <span className="text-xl font-bold text-blue-400">
                {formatPrice(total)}
              </span>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => {
                  onClose();
                  // Navigate to checkout page
                  window.location.href = "/checkout";
                }}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 hover:shadow-lg"
                disabled={loading}
              >
                Proceed to Checkout
              </button>
              <button
                onClick={clearCart}
                className="w-full px-4 py-2 text-red-400 hover:text-red-300 border border-red-800 hover:border-red-700 rounded-lg transition-colors hover:bg-red-900/20"
                disabled={loading}
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
