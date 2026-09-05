import { Box, Paper, Typography } from "@mui/material";
import logo from "../../assets/logonobg.png";

export const AuthShell = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Box
    sx={{
      minHeight: "100vh",
      width: "100%",
      display: "grid",
      placeItems: "center",
      px: 2,
      py: 4,
      background:
        "radial-gradient(circle at 15% 10%, rgba(90,60,98,.15), transparent 32%), radial-gradient(circle at 85% 90%, rgba(58,106,108,.12), transparent 30%), #F4F8FB",
    }}
  >
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: 420,
        px: { xs: 3, sm: 4 },
        pb: 4,
        pt: 1,
        border: "1px solid",
        borderColor: "rgba(90,60,98,.25)",
        boxShadow: "0 18px 55px rgba(50, 35, 56, .12)",
        borderRadius: 3,
      }}
    >
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Box component="img" src={logo} alt="MediXa" sx={{ width: 120, height: 120, objectFit: "contain" }} />
        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: -2, mb: 1 }}>
          أهلاً بك في منظومتنا ..!
        </Typography>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
      </Box>
      {children}
    </Paper>
  </Box>
);
