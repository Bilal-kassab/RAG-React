import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./app/ProtectedRoute";
import PublicOnlyRoute from "./app/PublicOnlyRoute";
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import ChatPage from "./features/chat/ChatPage";
import { useAuth } from "./features/auth/AuthContext";

export default function App() {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/chat" element={<ChatPage />} />
      </Route>
      <Route path="/" element={<Navigate to={isAuthenticated ? "/chat" : "/login"} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
