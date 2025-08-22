import { useState, useEffect } from "react";
import { X, Download, Smartphone, Monitor } from "lucide-react";
import { pritechviorLogo } from "../assets";

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone;
    setIsStandalone(standalone);

    // Check if iOS
    const iOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(iOS);

    // Check if already dismissed today
    const dismissedToday = localStorage.getItem("pwa-install-dismissed");
    const today = new Date().toDateString();

    if (dismissedToday === today || standalone) {
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Show prompt after 30 seconds on first visit or immediately on return visits
      const hasVisited = localStorage.getItem("pwa-has-visited");
      const delay = hasVisited ? 5000 : 30000;

      setTimeout(() => {
        setShowPrompt(true);
      }, delay);

      localStorage.setItem("pwa-has-visited", "true");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // For iOS, show prompt after delay if not standalone
    if (iOS && !standalone) {
      const hasVisited = localStorage.getItem("pwa-has-visited");
      const delay = hasVisited ? 5000 : 30000;

      setTimeout(() => {
        setShowPrompt(true);
      }, delay);

      localStorage.setItem("pwa-has-visited", "true");
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }

      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again today
    const today = new Date().toDateString();
    localStorage.setItem("pwa-install-dismissed", today);
  };

  const handleRemindLater = () => {
    setShowPrompt(false);
    // Show again in 1 hour
    setTimeout(() => {
      setShowPrompt(true);
    }, 3600000); // 1 hour
  };

  if (!showPrompt || isStandalone) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-slideInRight">
      <div className="bg-gradient-to-br from-n-8 to-n-7 border border-n-6 rounded-2xl shadow-2xl p-6 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-color-1/10 to-color-2/10 rounded-full flex items-center justify-center border-2 border-color-1/30">
              <img
                src={pritechviorLogo}
                alt="PritechVior"
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">
                Install PRITECH VIOR
              </h3>
              <p className="text-n-3 text-sm">Get quick access anytime</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-n-4 hover:text-white transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Benefits */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center gap-2 text-n-2 text-sm">
            <div className="w-1.5 h-1.5 bg-color-1 rounded-full"></div>
            <span>Works offline</span>
          </div>
          <div className="flex items-center gap-2 text-n-2 text-sm">
            <div className="w-1.5 h-1.5 bg-color-1 rounded-full"></div>
            <span>Faster loading</span>
          </div>
          <div className="flex items-center gap-2 text-n-2 text-sm">
            <div className="w-1.5 h-1.5 bg-color-1 rounded-full"></div>
            <span>App-like experience</span>
          </div>
        </div>

        {/* Platform-specific instructions */}
        {isIOS ? (
          <div className="mb-6 p-4 bg-n-6 rounded-lg border border-n-5">
            <div className="flex items-center gap-2 mb-2">
              <Smartphone size={16} className="text-color-1" />
              <span className="text-white font-medium text-sm">
                Install on iOS:
              </span>
            </div>
            <ol className="text-n-3 text-xs space-y-1">
              <li>1. Tap the Share button in Safari</li>
              <li>2. Scroll down and tap &ldquo;Add to Home Screen&rdquo;</li>
              <li>3. Tap &ldquo;Add&rdquo; to confirm</li>
            </ol>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-n-6 rounded-lg border border-n-5">
            <div className="flex items-center gap-2 mb-2">
              <Monitor size={16} className="text-color-1" />
              <span className="text-white font-medium text-sm">
                Quick Install:
              </span>
            </div>
            <p className="text-n-3 text-xs">
              Click &ldquo;Install&rdquo; below to add PRITECH VIOR to your
              device for easy access.
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          {!isIOS && deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="flex-1 bg-gradient-to-r from-color-1 to-color-2 text-white py-3 px-4 rounded-xl font-semibold text-sm hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Install
            </button>
          )}
          <button
            onClick={handleRemindLater}
            className="flex-1 bg-n-6 text-n-2 py-3 px-4 rounded-xl font-medium text-sm hover:bg-n-5 hover:text-n-1 transition-all duration-200"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
