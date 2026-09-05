import { Card, Stack, Typography } from "@mui/material";

export default function SessionItem({ title, time, active, onClick }: {
  title: string;
  time: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Card
      elevation={0}
      onClick={onClick}
      sx={{
        px: 1.5,
        py: 1.5,
        borderRadius: 2,
        border: "1px solid",
        borderColor: active ? "secondary.main" : "divider",
        bgcolor: active ? "action.selected" : "background.paper",
        cursor: "pointer",
        transition: ".2s ease",
        "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
      }}
    >
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", gap: 1.5 }}>
        <Typography variant="body2" noWrap sx={{ flex: 1, minWidth: 0, textAlign: "right" }}>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ direction: "ltr", whiteSpace: "nowrap" }}>
          {time}
        </Typography>
      </Stack>
    </Card>
  );
}
