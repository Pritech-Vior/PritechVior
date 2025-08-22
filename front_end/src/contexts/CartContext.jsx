import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import shopService from "../services/shopService";
import { useAuth } from "./AuthContext";

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
  const { isAuthenticated } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const localCartItems = getLocalCart();
    setCartItems(localCartItems);
    setCartCount(localCartItems.length);
  }, []);

  // Function to refresh cart data
  const refreshCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const cart = await shopService.getCart();
        const items = cart.items || [];
        setCartItems(items);
        setCartCount(items.length);
        saveLocalCart(items);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    } else {
      const localCartItems = getLocalCart();
      setCartItems(localCartItems);
      setCartCount(localCartItems.length);
    }
  }, [isAuthenticated]);

  // Add to cart with localStorage support
  const addToCart = useCallback(
    async (productId, quantity = 1, options = {}, productData = null) => {
      try {
        setLoading(true);

        if (isAuthenticated) {
          // Add to server cart
          await shopService.addToCart(productId, quantity, options);
          await refreshCart();
        } else {
          // Add to localStorage cart
          // Use provided productData instead of fetching
          if (!productData) {
            throw new Error("Product data is required for localStorage cart");
          }

          const localCartItems = getLocalCart();

          const existingItemIndex = localCartItems.findIndex(
            (item) => item.product.id === productId
          );

          if (existingItemIndex >= 0) {
            // Update existing item
            localCartItems[existingItemIndex].quantity += quantity;
          } else {
            // Add new item
            const newItem = {
              id: Date.now(), // Temporary ID for localStorage
              product: productData,
              quantity: quantity,
              options: options,
            };
            localCartItems.push(newItem);
          }

          saveLocalCart(localCartItems);
          setCartItems(localCartItems);
          setCartCount(localCartItems.length);
        }

        return true;
      } catch (error) {
        console.error("Error adding to cart:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, refreshCart]
  );

  // Update cart item
  const updateCartItem = useCallback(
    async (itemId, quantity) => {
      try {
        setLoading(true);

        if (isAuthenticated) {
          await shopService.updateCartItem(itemId, quantity);
          await refreshCart();
        } else {
          const localCartItems = getLocalCart();
          const itemIndex = localCartItems.findIndex(
            (item) => item.id === itemId
          );

          if (itemIndex >= 0) {
            if (quantity > 0) {
              localCartItems[itemIndex].quantity = quantity;
            } else {
              localCartItems.splice(itemIndex, 1);
            }
            saveLocalCart(localCartItems);
            setCartItems(localCartItems);
            setCartCount(localCartItems.length);
          }
        }

        return true;
      } catch (error) {
        console.error("Error updating cart item:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, refreshCart]
  );

  // Remove cart item
  const removeCartItem = useCallback(
    async (itemId) => {
      try {
        setLoading(true);

        if (isAuthenticated) {
          await shopService.removeCartItem(itemId);
          await refreshCart();
        } else {
          const localCartItems = getLocalCart();
          const filteredItems = localCartItems.filter(
            (item) => item.id !== itemId
          );
          saveLocalCart(filteredItems);
          setCartItems(filteredItems);
          setCartCount(filteredItems.length);
        }

        return true;
      } catch (error) {
        console.error("Error removing cart item:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, refreshCart]
  );

  // Clear cart
  const clearCart = useCallback(async () => {
    try {
      setLoading(true);

      if (isAuthenticated) {
        await shopService.clearCart();
      }

      // Always clear localStorage
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
  }, [isAuthenticated]);

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
