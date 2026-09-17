import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
