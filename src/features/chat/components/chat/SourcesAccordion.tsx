import { Box, Chip, Stack, Typography } from "@mui/material";
import type { Citation } from "../../types/chat.types";

export default function SourcesAccordion({ sources }: { sources: Citation[] }) {
  if (sources.length === 0) return null;
  return (
    <Box sx={{ mt: 2, border: "1px solid", borderColor: "divider", borderRadius: 3, p: 1.5 }}>
      <Typography sx={{ mb: 1, fontWeight: 700 }}>المصادر</Typography>
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
        {sources.map((source) => (
          <Chip
            key={source.ragMessageCitationId}
            variant="outlined"
            color="primary"
            label={`${source.title || source.sourceType}${source.page != null ? ` (P.${source.page})` : ""}`}
            title={source.snippet || undefined}
          />
        ))}
      </Stack>
    </Box>
  );
}
