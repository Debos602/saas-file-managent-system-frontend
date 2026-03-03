import { Navigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Loading } from "./ui/loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  // allow strings too so callers can pass 'admin'|'user' (case-insensitive)
  allowedRoles?: (UserRole | string)[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, role, isLoading } = useAuth();

  console.log("ProtectedRoute render - isAuthenticated:", isAuthenticated, "role:", role, "isLoading:", isLoading);

  // while auth status is being determined, show a small loader
  if (isLoading) return <Loading />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // normalize allowed roles (accept both 'admin' and 'ADMIN')
  const normalizedAllowed = allowedRoles?.map((r) => (typeof r === "string" ? (r as string).toUpperCase() : r)) as UserRole[] | undefined;

  if (normalizedAllowed && role && !normalizedAllowed.includes(role)) {
    return <Navigate to={role === "ADMIN" ? "/admin" : "/dashboard"} replace />;
  }

  return <>{children}</>;
}
