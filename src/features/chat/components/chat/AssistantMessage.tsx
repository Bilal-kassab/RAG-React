import { Card, Skeleton, Stack, Typography } from "@mui/material";
import type { Citation } from "../../types/chat.types";
import SourcesAccordion from "./SourcesAccordion";

export default function AssistantMessage({ message, sources, isLoading }: {
  message: string;
  sources?: Citation[];
  isLoading?: boolean;
}) {
  return (
    <Stack direction="row" sx={{ direction: "rtl", alignItems: "flex-start", mb: 3, width: "100%" }}>
      <Card elevation={0} sx={{ flex: 1, px: { xs: 1, sm: 3 }, py: 2, bgcolor: "transparent" }}>
        {isLoading ? (
          <Stack spacing={1} sx={{ width: "100%" }}>
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} width="90%" />
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} width="62%" />
            <Skeleton variant="rectangular" height={38} sx={{ borderRadius: 2, mt: 1 }} />
          </Stack>
        ) : (
          <>
            <Typography component="div" sx={{ lineHeight: 2, whiteSpace: "pre-wrap" }}>{message}</Typography>
            {sources && <SourcesAccordion sources={sources} />}
          </>
        )}
      </Card>
    </Stack>
  );
}
