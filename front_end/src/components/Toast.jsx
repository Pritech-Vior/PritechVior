import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

const Toast = ({
  message,
  type = "error",
  duration = 5000,
  onClose,
  position = "top-center",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      setIsLeaving(false);
      setProgress(100);

      // Progress bar animation
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - 100 / (duration / 100);
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, 100);

      // Auto close timer
      const timer = setTimeout(() => {
        setIsLeaving(true);
        setTimeout(() => {
          setIsVisible(false);
          onClose && onClose();
        }, 300);
      }, duration);

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    }
  }, [message, duration, onClose]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose && onClose();
    }, 300);
  };

  const getToastStyles = () => {
    const baseStyles =
      "fixed z-[9999] max-w-md w-full mx-4 rounded-lg shadow-xl border transition-all duration-300 transform overflow-hidden";

    const positionStyles = {
      "top-right": "top-20 right-4",
      "top-left": "top-20 left-4",
      "bottom-right": "bottom-4 right-4",
      "bottom-left": "bottom-4 left-4",
      "top-center": "top-20 left-1/2 -translate-x-1/2",
      "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
      center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    };

    const typeStyles = {
      success:
        "bg-green-900/95 border-green-700 text-green-100 backdrop-blur-sm",
      error: "bg-red-900/95 border-red-700 text-red-100 backdrop-blur-sm",
      warning:
        "bg-yellow-900/95 border-yellow-700 text-yellow-100 backdrop-blur-sm",
      info: "bg-blue-900/95 border-blue-700 text-blue-100 backdrop-blur-sm",
    };

    const animationStyles = isLeaving
      ? "opacity-0 scale-95 translate-y-2"
      : "opacity-100 scale-100 translate-y-0";

    return `${baseStyles} ${positionStyles[position]} ${typeStyles[type]} ${animationStyles}`;
  };

  const getProgressBarColor = () => {
    switch (type) {
      case "success":
        return "bg-green-400";
      case "error":
        return "bg-red-400";
      case "warning":
        return "bg-yellow-400";
      case "info":
        return "bg-blue-400";
      default:
        return "bg-red-400";
    }
  };

  const getIcon = () => {
    const iconProps = { size: 20, className: "flex-shrink-0" };

    switch (type) {
      case "success":
        return <CheckCircle {...iconProps} className="text-green-400" />;
      case "error":
        return <AlertCircle {...iconProps} className="text-red-400" />;
      case "warning":
        return <AlertTriangle {...iconProps} className="text-yellow-400" />;
      case "info":
        return <Info {...iconProps} className="text-blue-400" />;
      default:
        return <AlertCircle {...iconProps} className="text-red-400" />;
    }
  };

  if (!isVisible || !message) return null;

  return (
    <div className={getToastStyles()}>
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 h-1 bg-white/20 w-full">
        <div
          className={`h-full transition-all duration-100 ease-linear ${getProgressBarColor()}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start space-x-3">
          {getIcon()}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium break-words leading-relaxed">
              {message}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-gray-400 hover:text-white transition-colors duration-200 p-1 rounded-full hover:bg-white/10"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
