import { createContext, useContext, useState, useCallback } from "react";
import Toast from "../components/Toast";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "error", duration = 5000, position = "top-center") => {
      const id = Date.now() + Math.random();
      const newToast = { id, message, type, duration, position };

      setToasts((prev) => [...prev, newToast]);

      // Auto remove toast after duration + animation time
      setTimeout(() => {
        removeToast(id);
      }, duration + 300);
    },
    [removeToast]
  );

  // Convenience methods
  const showSuccess = useCallback(
    (message, duration, position) => {
      showToast(message, "success", duration, position);
    },
    [showToast]
  );

  const showError = useCallback(
    (message, duration, position) => {
      showToast(message, "error", duration, position);
    },
    [showToast]
  );

  const showWarning = useCallback(
    (message, duration, position) => {
      showToast(message, "warning", duration, position);
    },
    [showToast]
  );

  const showInfo = useCallback(
    (message, duration, position) => {
      showToast(message, "info", duration, position);
    },
    [showToast]
  );

  const value = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Render toasts */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          position={toast.position}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  );
};
