import { Box, CircularProgress } from "@mui/material";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

export default function ProtectedRoute() {
  const { isAuthenticated, isBootstrapping } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return <Box sx={{ width: "100vw", height: "100vh", display: "grid", placeItems: "center" }}><CircularProgress /></Box>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}
