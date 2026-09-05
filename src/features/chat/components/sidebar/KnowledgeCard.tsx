import { Circle, StorageRounded } from "@mui/icons-material";
import { Box, Card, Stack, Typography } from "@mui/material";

export default function KnowledgeCard() {
  return (
    <Card
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        color: "white",
        background: "linear-gradient(135deg, #5f8d8f 0%, #7B1FA2 50%, #9C27B0 100%)",
        boxShadow: "0 4px 20px rgba(0,0,0,.10)",
      }}
    >
      <Stack direction="row" sx={{ justifyContent: "flex-end", gap: 1.5, alignItems: "center" }}>
        <Typography sx={{ fontWeight: 700 }}>مصادر المعرفة</Typography>
        <StorageRounded />
      </Stack>
      <Stack spacing={1.4} sx={{ mt: 2 }}>
        {["BNF_83", "SDR_7_المرجع_الدوائي_السوري"].map((source) => (
          <Box key={source} sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <Circle sx={{ fontSize: 9, mt: .75 }} />
            <Typography variant="body2" sx={{ overflowWrap: "anywhere" }}>{source}</Typography>
          </Box>
        ))}
      </Stack>
    </Card>
  );
}
