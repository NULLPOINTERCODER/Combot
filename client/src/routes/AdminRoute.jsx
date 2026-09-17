import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

// Frontend gate for UX only - the real enforcement is server-side (requireAdmin middleware).
export default function AdminRoute() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
}
