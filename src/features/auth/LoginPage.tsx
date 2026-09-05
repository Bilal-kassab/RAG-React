import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../../shared/api/http";
import { useAppSnackbar } from "../../shared/providers/SnackbarProvider";
import { useAuth } from "./AuthContext";
import { AuthShell } from "./AuthShell";

export default function LoginPage() {
  const { login } = useAuth();
  const { show } = useAppSnackbar();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [form, setForm] = useState({ phone: "", password: "" });

  const from = (location.state as { from?: string } | null)?.from || "/chat";

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsPending(true);
    try {
      await login(form);
      show("تم تسجيل الدخول بنجاح.", "success");
      navigate(from, { replace: true });
    } catch (error) {
      show(getApiErrorMessage(error), "error");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AuthShell title="تسجيل الدخول">
      <Box component="form" onSubmit={submit} noValidate>
        <TextField
          fullWidth
          required
          autoFocus
          label="رقم الهاتف"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+9639XXXXXXXX"
          value={form.phone}
          onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
          helperText="استخدم رقماً دولياً من 8 إلى 15 رقماً"
          sx={{ mb: 2.5 }}
        />
        <TextField
          fullWidth
          required
          label="كلمة المرور"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          sx={{ mb: 3 }}
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          disabled={isPending || !form.phone.trim() || form.password.length < 8}
          sx={{ py: 1.4 }}
        >
          {isPending ? <CircularProgress size={23} color="inherit" /> : "تسجيل الدخول"}
        </Button>
        <Typography variant="body2" sx={{ mt: 2.5, textAlign: "center" }}>
          ليس لديك حساب؟{" "}
          <Typography component={Link} to="/register" color="primary" sx={{ textDecoration: "none", fontWeight: 700 }}>
            إنشاء حساب
          </Typography>
        </Typography>
      </Box>
    </AuthShell>
  );
}
