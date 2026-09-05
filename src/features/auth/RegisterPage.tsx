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
import { Link, useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../../shared/api/http";
import { useAppSnackbar } from "../../shared/providers/SnackbarProvider";
import { useAuth } from "./AuthContext";
import { AuthShell } from "./AuthShell";

export default function RegisterPage() {
  const { register } = useAuth();
  const { show } = useAppSnackbar();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [form, setForm] = useState({ phone: "", password: "", confirmPassword: "" });

  const passwordMismatch = Boolean(form.confirmPassword) && form.password !== form.confirmPassword;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (passwordMismatch) {
      show("كلمتا المرور غير متطابقتين.", "error");
      return;
    }
    setIsPending(true);
    try {
      await register({ phone: form.phone, password: form.password });
      show("تم إنشاء الحساب وتسجيل الدخول بنجاح.", "success");
      navigate("/chat", { replace: true });
    } catch (error) {
      show(getApiErrorMessage(error), "error");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AuthShell title="إنشاء حساب">
      <Box component="form" onSubmit={submit} noValidate>
        <TextField
          fullWidth
          required
          autoFocus
          label="رقم الهاتف"
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
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          helperText="8 أحرف على الأقل"
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
          sx={{ mb: 2.5 }}
        />
        <TextField
          fullWidth
          required
          error={passwordMismatch}
          label="تأكيد كلمة المرور"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
          helperText={passwordMismatch ? "كلمتا المرور غير متطابقتين" : " "}
          sx={{ mb: 2 }}
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          disabled={isPending || !form.phone.trim() || form.password.length < 8 || !form.confirmPassword || passwordMismatch}
          sx={{ py: 1.4 }}
        >
          {isPending ? <CircularProgress size={23} color="inherit" /> : "تسجيل"}
        </Button>
        <Typography variant="body2" sx={{ mt: 2.5, textAlign: "center" }}>
          لديك حساب بالفعل؟{" "}
          <Typography component={Link} to="/login" color="primary" sx={{ textDecoration: "none", fontWeight: 700 }}>
            سجل الدخول
          </Typography>
        </Typography>
      </Box>
    </AuthShell>
  );
}
