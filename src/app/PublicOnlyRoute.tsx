import { Box, CircularProgress } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

export default function PublicOnlyRoute() {
  const { isAuthenticated, isBootstrapping } = useAuth();
  if (isBootstrapping) {
    return <Box sx={{ width: "100vw", height: "100vh", display: "grid", placeItems: "center" }}><CircularProgress /></Box>;
  }
  return isAuthenticated ? <Navigate to="/chat" replace /> : <Outlet />;
}
