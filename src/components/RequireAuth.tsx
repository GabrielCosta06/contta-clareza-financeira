import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services";

export const RequireAuth = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!authService.isOnboarded() && location.pathname !== "/app/onboarding") {
    return <Navigate to="/app/onboarding" replace />;
  }
  return <Outlet />;
};
