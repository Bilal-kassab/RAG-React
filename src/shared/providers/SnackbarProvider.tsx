import { Alert, Snackbar, type AlertColor } from "@mui/material";
import { createContext, useContext, useMemo, useState } from "react";

interface SnackbarValue {
  show: (message: string, severity?: AlertColor) => void;
}

const SnackbarContext = createContext<SnackbarValue | null>(null);

export const AppSnackbarProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<{ open: boolean; message: string; severity: AlertColor }>({
    open: false,
    message: "",
    severity: "success",
  });

  const value = useMemo<SnackbarValue>(
    () => ({
      show: (message, severity = "success") =>
        setState({ open: true, message, severity }),
    }),
    [],
  );

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        open={state.open}
        autoHideDuration={4500}
        onClose={() => setState((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          variant="filled"
          severity={state.severity}
          onClose={() => setState((prev) => ({ ...prev, open: false }))}
          sx={{ minWidth: 280 }}
        >
          {state.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useAppSnackbar = () => {
  const value = useContext(SnackbarContext);
  if (!value) throw new Error("useAppSnackbar must be used within AppSnackbarProvider");
  return value;
};
