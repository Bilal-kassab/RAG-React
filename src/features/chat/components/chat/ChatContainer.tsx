import { ErrorOutlineRounded } from "@mui/icons-material";
import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import type { ConversationTurn } from "../../types/chat.types";
import { getFailureMessage } from "../../utils";
import AssistantMessage from "./AssistantMessage";
import UserMessage from "./UserMessage";

export default function ChatContainer({
  turns,
  onLoadMoreMessages,
  hasMoreMessages,
  isLoadingMore,
  isInitialLoading,
}: {
  turns: ConversationTurn[];
  onLoadMoreMessages: () => void;
  hasMoreMessages: boolean;
  isLoadingMore: boolean;
  isInitialLoading: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousHeightRef = useRef(0);
  const previousLastTurnRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!containerRef.current || turns.length === 0) return;
    const lastTurn = turns.at(-1)?.ragRequestId;
    if (lastTurn !== previousLastTurnRef.current) {
      containerRef.current.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });
      previousLastTurnRef.current = lastTurn;
    }
  }, [turns]);

  useEffect(() => {
    if (!containerRef.current || previousHeightRef.current === 0) return;
    const current = containerRef.current;
    current.scrollTop = current.scrollHeight - previousHeightRef.current;
    previousHeightRef.current = 0;
  }, [turns.length]);

  const onScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    if (target.scrollTop <= 50 && hasMoreMessages && !isLoadingMore) {
      previousHeightRef.current = target.scrollHeight;
      onLoadMoreMessages();
    }
  };

  if (isInitialLoading) {
    return <Box sx={{ height: "100%", display: "grid", placeItems: "center" }}><CircularProgress /></Box>;
  }

  return (
    <Box
      ref={containerRef}
      onScroll={onScroll}
      sx={{ px: { xs: 2, md: 4 }, py: 2, height: "100%", overflowY: "auto", width: "100%" }}
    >
      {isLoadingMore && <Box sx={{ textAlign: "center", py: 1 }}><CircularProgress size={22} /></Box>}
      {turns.length === 0 && (
        <Box sx={{ height: "100%", minHeight: 260, display: "grid", placeItems: "center" }}>
          <Typography color="text.secondary" sx={{ textAlign: "center" }}>
            ابدأ جلسة جديدة واكتب سؤالك في الأسفل.
          </Typography>
        </Box>
      )}
      {turns.map((turn) => {
        const userTime = turn.userMessage?.createdAt
          ? new Date(turn.userMessage.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : "";
        const isLoading = turn.status === "PROCESSING";

        return (
          <Box key={turn.ragRequestId} sx={{ mb: 1 }}>
            {turn.userMessage && <UserMessage message={turn.userMessage.content} time={userTime} />}
            {turn.status === "FAILED" ? (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mb: 3,
                  border: "1px solid",
                  borderColor: "error.light",
                  bgcolor: "rgba(211,47,47,.05)",
                  borderRadius: 3,
                  display: "flex",
                  gap: 1.5,
                  alignItems: "flex-start",
                }}
              >
                <ErrorOutlineRounded color="error" />
                <Box>
                  <Typography color="error.dark" sx={{ fontWeight: 700 }}>فشل في معالجة الطلب</Typography>
                  <Typography variant="body2" color="text.secondary">{getFailureMessage(turn.failureCode)}</Typography>
                  {turn.failureCode && <Typography variant="caption" color="text.secondary">{turn.failureCode}</Typography>}
                </Box>
              </Paper>
            ) : (
              <AssistantMessage
                isLoading={isLoading}
                message={turn.assistantMessage?.content || "جاري توليد الرد..."}
                sources={turn.assistantMessage?.citations}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
}
