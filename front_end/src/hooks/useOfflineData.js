import { useState, useEffect } from "react";

export const useOfflineData = (apiEndpoint, storageKey) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to get cached data first
        const cachedData = localStorage.getItem(storageKey);
        if (cachedData) {
          setData(JSON.parse(cachedData));
          setLoading(false);
        }

        if (isOnline) {
          // Fetch fresh data when online
          const response = await fetch(apiEndpoint);
          if (response.ok) {
            const freshData = await response.json();
            setData(freshData);
            // Cache the fresh data
            localStorage.setItem(storageKey, JSON.stringify(freshData));
            setError(null);
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } else if (!cachedData) {
          throw new Error("No cached data available offline");
        }
      } catch (err) {
        setError(err.message);
        console.error("Data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiEndpoint, storageKey, isOnline]);

  const refreshData = async () => {
    if (!isOnline) return;

    setLoading(true);
    try {
      const response = await fetch(apiEndpoint);
      if (response.ok) {
        const freshData = await response.json();
        setData(freshData);
        localStorage.setItem(storageKey, JSON.stringify(freshData));
        setError(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, isOnline, refreshData };
};

export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
};

export default useOfflineData;
