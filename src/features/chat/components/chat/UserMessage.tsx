import { DoneAllRounded } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

export default function UserMessage({ message, time }: { message: string; time: string }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2.5 }}>
      <Box sx={{ maxWidth: { xs: "92%", sm: 560 }, bgcolor: "primary.main", color: "white", px: 3, py: 2, borderRadius: 3, borderBottomRightRadius: 0 }}>
        <Typography sx={{ whiteSpace: "pre-wrap" }}>{message}</Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: .5, mt: 1 }}>
          <Typography sx={{ fontSize: 11 }} color="rgba(255,255,255,.8)">{time}</Typography>
          <DoneAllRounded sx={{ fontSize: 15, color: "rgba(255,255,255,.8)" }} />
        </Box>
      </Box>
    </Box>
  );
}
