import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, isLoading, hasAnyRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-n-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-1 mx-auto mb-4"></div>
          <p className="text-n-3">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    // User doesn't have required role
    return (
      <div className="min-h-screen bg-n-8 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-400 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-n-1 mb-2">Access Denied</h1>
          <p className="text-n-3 mb-6">
            You don&apos;t have permission to access this page. Required roles:{" "}
            {requiredRoles.join(", ")}
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-primary-1 hover:bg-primary-2 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
