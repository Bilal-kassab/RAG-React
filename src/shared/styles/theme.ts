import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  direction: "rtl",
  palette: {
    primary: { main: "#5a3c62", light: "#9d7ea6", dark: "#432d49" },
    secondary: { main: "#3a6a6c", light: "#78bfc1" },
    background: { default: "#F4F8FB", paper: "#ffffff" },
    text: { primary: "#1f1f24", secondary: "#65656f" },
  },
  typography: { fontFamily: "'Cairo', sans-serif" },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "html, body, #root": { width: "100%", minHeight: "100%", margin: 0 },
        body: { direction: "rtl", backgroundColor: "#F4F8FB" },
        "*": { boxSizing: "border-box" },
      },
    },
    MuiButton: { defaultProps: { disableElevation: true } },
  },
});

export default theme;
