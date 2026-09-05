import { SendRounded } from "@mui/icons-material";
import { Box, CircularProgress, IconButton, OutlinedInput, Stack } from "@mui/material";
import { useState } from "react";

export default function ChatInput({ onSend, isLoading }: { onSend: (text: string) => Promise<void> | void; isLoading: boolean }) {
  const [text, setText] = useState("");

  const send = async () => {
    const value = text.trim();
    if (!value || isLoading) return;
    setText("");
    await onSend(value);
  };

  return (
    <Box sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: 5, mb: 2, px: 2, mx: { xs: 2, md: 3 }, boxShadow: "0 8px 28px rgba(40,40,55,.06)" }}>
      <Stack direction="row" sx={{ alignItems: "center" }}>
        <OutlinedInput
          fullWidth
          placeholder={isLoading ? "جاري معالجة الرسالة الحالية..." : "اكتب سؤالك هنا..."}
          multiline
          maxRows={4}
          value={text}
          disabled={isLoading}
          onChange={(e) => setText(e.target.value.slice(0, 1000))}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void send();
            }
          }}
          sx={{ border: "none", "& fieldset": { border: "none" } }}
        />
        <IconButton
          color="primary"
          onClick={() => void send()}
          disabled={isLoading || !text.trim()}
          sx={{ bgcolor: "primary.main", color: "white", "&:hover": { bgcolor: "primary.dark" }, "&.Mui-disabled": { bgcolor: "action.disabledBackground" } }}
        >
          {isLoading ? <CircularProgress size={20} color="inherit" /> : <SendRounded />}
        </IconButton>
      </Stack>
    </Box>
  );
}
