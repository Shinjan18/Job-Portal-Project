import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show a loading spinner or skeleton screen
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with the return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if route is role-protected and user has the required role
  if (roles.length > 0 && !roles.includes(user.role)) {
    // Redirect to unauthorized page or home
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // User is authenticated and has the required role
  return children;
};

export default ProtectedRoute;
