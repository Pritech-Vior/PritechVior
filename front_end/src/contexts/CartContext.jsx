import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// localStorage helper functions
const getLocalCart = () => {
  try {
    const localCart = localStorage.getItem("viormart_cart");
    return localCart ? JSON.parse(localCart) : [];
  } catch (error) {
    console.error("Error reading cart from localStorage:", error);
    return [];
  }
};

const saveLocalCart = (cartItems) => {
  try {
    localStorage.setItem("viormart_cart", JSON.stringify(cartItems));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const localCartItems = getLocalCart();
    setCartItems(localCartItems);

    // Calculate total quantity, not just number of items
    const totalQuantity = localCartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    setCartCount(totalQuantity);
  }, []);

  // Function to refresh cart data from localStorage only
  const refreshCart = useCallback(async () => {
    // Always use localStorage cart (no server sync)
    const localCartItems = getLocalCart();
    setCartItems(localCartItems);

    // Calculate total quantity, not just number of items
    const totalQuantity = localCartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    setCartCount(totalQuantity);
  }, []);

  // Add to cart with localStorage only (no server sync)
  const addToCart = useCallback(
    async (productId, quantity = 1, options = {}, productData = null) => {
      try {
        setLoading(true);
        console.log("addToCart called with:", {
          productId,
          quantity,
          options,
          productData,
        });

        // Always use localStorage cart (no server sync)
        // Use provided productData instead of fetching
        if (!productData) {
          throw new Error("Product data is required for localStorage cart");
        }

        const localCartItems = getLocalCart();
        console.log("Current local cart items:", localCartItems);

        const existingItemIndex = localCartItems.findIndex(
          (item) => item.product.id === productId
        );

        if (existingItemIndex >= 0) {
          // Update existing item
          localCartItems[existingItemIndex].quantity += quantity;
          console.log(
            "Updated existing item:",
            localCartItems[existingItemIndex]
          );
        } else {
          // Add new item
          const newItem = {
            id: Date.now(), // Temporary ID for localStorage
            product: productData,
            quantity: quantity,
            options: options,
          };
          localCartItems.push(newItem);
          console.log("Added new item:", newItem);
        }

        saveLocalCart(localCartItems);
        setCartItems(localCartItems);

        // Calculate total quantity, not just number of items
        const totalQuantity = localCartItems.reduce(
          (total, item) => total + item.quantity,
          0
        );
        setCartCount(totalQuantity);

        console.log("Updated cart state:", {
          cartItems: localCartItems,
          cartCount: totalQuantity,
          itemCount: localCartItems.length,
        });

        return true;
      } catch (error) {
        console.error("Error adding to cart:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Update cart item using localStorage only
  const updateCartItem = useCallback(async (itemId, quantity) => {
    try {
      setLoading(true);

      // Always use localStorage cart (no server sync)
      const localCartItems = getLocalCart();
      const itemIndex = localCartItems.findIndex((item) => item.id === itemId);

      if (itemIndex >= 0) {
        if (quantity > 0) {
          localCartItems[itemIndex].quantity = quantity;
        } else {
          localCartItems.splice(itemIndex, 1);
        }
        saveLocalCart(localCartItems);
        setCartItems(localCartItems);

        // Calculate total quantity, not just number of items
        const totalQuantity = localCartItems.reduce(
          (total, item) => total + item.quantity,
          0
        );
        setCartCount(totalQuantity);
      }

      return true;
    } catch (error) {
      console.error("Error updating cart item:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Remove cart item using localStorage only
  const removeCartItem = useCallback(async (itemId) => {
    try {
      setLoading(true);

      // Always use localStorage cart (no server sync)
      const localCartItems = getLocalCart();
      const filteredItems = localCartItems.filter((item) => item.id !== itemId);
      saveLocalCart(filteredItems);
      setCartItems(filteredItems);

      // Calculate total quantity, not just number of items
      const totalQuantity = filteredItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
      setCartCount(totalQuantity);

      return true;
    } catch (error) {
      console.error("Error removing cart item:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear cart using localStorage only
  const clearCart = useCallback(async () => {
    try {
      setLoading(true);

      // Always clear localStorage only (no server sync)
      saveLocalCart([]);
      setCartItems([]);
      setCartCount(0);

      return true;
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    cartCount,
    cartItems,
    loading,
    refreshCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
