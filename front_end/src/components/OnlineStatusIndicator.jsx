import { useState, useEffect } from "react";
import { Wifi, WifiOff } from "lucide-react";

const OnlineStatusIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    console.log(
      "OnlineStatusIndicator mounted, initial online status:",
      navigator.onLine
    );

    const handleOnline = () => {
      console.log("Online event triggered");
      setIsOnline(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    };

    const handleOffline = () => {
      console.log("Offline event triggered");
      setIsOnline(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      {/* Status indicator dot */}
      <div className="fixed top-4 right-4 z-50">
        <div className="flex items-center gap-2 bg-n-8/90 backdrop-blur-sm border border-n-6 rounded-full px-3 py-2 shadow-lg">
          <div
            className={`w-2 h-2 rounded-full ${
              isOnline ? "bg-green-500" : "bg-red-500"
            } animate-pulse`}
          ></div>
          <span className="text-xs text-n-2 font-medium">
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      {/* Toast notification */}
      {showToast && (
        <div className="fixed top-16 right-4 z-50 animate-slideInRight">
          <div
            className={`bg-n-8 border rounded-xl p-4 shadow-2xl backdrop-blur-sm ${
              isOnline ? "border-green-500/50" : "border-red-500/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isOnline ? "bg-green-500/20" : "bg-red-500/20"
                }`}
              >
                {isOnline ? (
                  <Wifi size={20} className="text-green-500" />
                ) : (
                  <WifiOff size={20} className="text-red-500" />
                )}
              </div>
              <div>
                <h4
                  className={`font-semibold text-sm ${
                    isOnline ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {isOnline ? "Back Online!" : "Gone Offline"}
                </h4>
                <p className="text-n-3 text-xs">
                  {isOnline
                    ? "Syncing latest data..."
                    : "You can still browse cached content"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OnlineStatusIndicator;
