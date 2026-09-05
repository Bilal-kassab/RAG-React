import { AddRounded, HistoryRounded } from "@mui/icons-material";
import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import type { Conversation } from "../../types/chat.types";
import SessionItem from "./SessionItem";

const formatTime = (value: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export default function SessionsCard({
  conversations,
  activeSessionId,
  isLoading,
  onNewSession,
  onSelectSession,
}: {
  conversations: Conversation[];
  activeSessionId?: number;
  isLoading: boolean;
  onNewSession: () => void;
  onSelectSession: (id: number) => void;
}) {
  return (
    <Box>
      <Stack direction="row" sx={{ mb: 2, gap: 1, alignItems: "center" }}>
        <HistoryRounded color="primary" />
        <Typography color="primary" sx={{ fontWeight: 700 }}>جلسات سابقة</Typography>
      </Stack>
      <Button
        fullWidth
        variant="outlined"
        startIcon={<AddRounded />}
        onClick={onNewSession}
        sx={{ justifyContent: "space-between", mb: 1.5, py: 1.1 }}
      >
        جلسة جديدة
      </Button>
      <Stack spacing={1.25}>
        {conversations.map((conversation) => (
          <SessionItem
            key={conversation.ragConversationId}
            title={conversation.title}
            time={formatTime(conversation.lastMessageAt || conversation.createdAt)}
            active={activeSessionId === conversation.ragConversationId}
            onClick={() => onSelectSession(conversation.ragConversationId)}
          />
        ))}
        {isLoading && <Box sx={{ textAlign: "center", py: 2 }}><CircularProgress size={22} /></Box>}
        {!isLoading && conversations.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
            لا توجد جلسات سابقة.
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
