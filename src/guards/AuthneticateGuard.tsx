import { Navigate, Outlet } from "react-router-dom";
import { useStore } from "@/store/useStore";

export function AuthenticateGuard() {
  const { isAuthenticated } = useStore();
  const hasToken = !!localStorage.getItem("token");

  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
