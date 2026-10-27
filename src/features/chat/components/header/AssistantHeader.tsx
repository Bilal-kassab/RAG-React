import { Circle } from "@mui/icons-material";
import { Box, Chip, Typography } from "@mui/material";
import type { SocketState } from "../../hooks/useChatSocket";

const socketLabel: Record<SocketState, { label: string; color: "success" | "warning" | "default" | "error" }> = {
  ready: { label: "متصل ", color: "success" },
  connecting: { label: "جارٍ الاتصال", color: "warning" },
  disconnected: { label: "غير متصل الآن..", color: "default" },
  error: { label: "خطأ ضمن السيرفر.. نأسف على الأمر", color: "error" },
};

export default function AssistantHeader({ socketState }: { socketState: SocketState }) {
  const status = socketLabel[socketState];
  return (
    <Box sx={{ textAlign: "center", px: 2, py: 1.5 }}>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>👋 مرحباً، أنا مساعدك الذكي</Typography>
        <Chip
          size="small"
          variant="outlined"
          color={status.color}
          icon={<Circle sx={{ fontSize: "10px !important" }} />}
          label={status.label}
        />
      </Box>
      <Typography variant="body2" color="text.secondary">
        اسألني عن الأدوية، التداخلات، الجرعات، أو أي موضوع طبي آخر
      </Typography>
    </Box>
  );
}
