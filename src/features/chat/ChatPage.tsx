import { LogoutRounded, MenuRounded } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import AssistantHeader from "./components/header/AssistantHeader";
import ChatContainer from "./components/chat/ChatContainer";
import ChatInput from "./components/input/ChatInput";
import KnowledgeCard from "./components/sidebar/KnowledgeCard";
import SessionsCard from "./components/sidebar/SessionsCard";
import { useAssistantChatController } from "./hooks/useAssistantChatController";

const SIDEBAR_WIDTH = 300;

export default function ChatPage() {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, logout } = useAuth();
  const controller = useAssistantChatController();

  const sidebar = (
    <Box
      onScroll={(event) => {
        const target = event.currentTarget;
        if (target.scrollHeight - target.scrollTop <= target.clientHeight + 24) {
          controller.handleLoadMoreConversations();
        }
      }}
      sx={{ width: SIDEBAR_WIDTH, height: "100%", overflowY: "auto", p: 2, bgcolor: "background.paper" }}
    >
      <KnowledgeCard />
      <Box sx={{ mt: 3 }}>
        <SessionsCard
          conversations={controller.conversations}
          activeSessionId={controller.activeSessionId}
          isLoading={controller.isLoadingConversations}
          onNewSession={() => {
            controller.handleNewSession();
            setDrawerOpen(false);
          }}
          onSelectSession={(id) => {
            controller.handleSelectSession(id);
            setDrawerOpen(false);
          }}
        />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ width: "100vw", height: "100vh", overflow: "hidden", display: "flex", direction: "ltr", bgcolor: "background.default" }}>
      {desktop ? (
        <Box sx={{ width: SIDEBAR_WIDTH, flexShrink: 0, borderRight: "1px solid", borderColor: "divider" }}>{sidebar}</Box>
      ) : (
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          anchor="left"
          slotProps={{ paper: { sx: { width: SIDEBAR_WIDTH } } }}
        >
          {sidebar}
        </Drawer>
      )}

      <Stack sx={{ flex: 1, minWidth: 0, height: "100%", direction: "rtl" }}>
        <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
          <Toolbar sx={{ minHeight: "56px !important", gap: 1 }}>
            {!desktop && <IconButton onClick={() => setDrawerOpen(true)}><MenuRounded /></IconButton>}
            <Typography variant="subtitle2" color="text.secondary" sx={{ flex: 1 }}>
              {user?.phone}
            </Typography>
            <Tooltip title="تسجيل الخروج">
              <IconButton onClick={logout} color="primary"><LogoutRounded /></IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <AssistantHeader socketState={controller.socketState} />
        <Box sx={{ flex: 1, minHeight: 0, display: "flex", justifyContent: "center" }}>
          <Box sx={{ width: "100%", maxWidth: 1000, height: "100%" }}>
            <ChatContainer
              turns={controller.turns}
              onLoadMoreMessages={controller.handleLoadMoreMessages}
              hasMoreMessages={controller.hasMoreMessages}
              isLoadingMore={controller.isLoadingMoreMessages}
              isInitialLoading={controller.isLoadingMessages}
            />
          </Box>
        </Box>
        <Box sx={{ flexShrink: 0, display: "flex", justifyContent: "center" }}>
          <Box sx={{ width: "100%", maxWidth: 1000 }}>
            <ChatInput onSend={controller.handleSendMessage} isLoading={controller.isPendingAction} />
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
