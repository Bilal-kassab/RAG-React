import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CssBaseline, ThemeProvider } from "@mui/material";
import App from "./App";
import { AuthProvider } from "./features/auth/AuthContext";
import { AppSnackbarProvider } from "./shared/providers/SnackbarProvider";
import theme from "./shared/styles/theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
    mutations: { retry: 0 },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AppSnackbarProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </AppSnackbarProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
