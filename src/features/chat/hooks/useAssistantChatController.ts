import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getApiErrorMessage } from "../../../shared/api/http";
import { useAppSnackbar } from "../../../shared/providers/SnackbarProvider";
import { chatApi } from "../chat.api";
import {
  appendTurnToMessagesCache,
  applyRequestStatusToMessagesCache,
  createLocalProcessingTurn,
} from "../chat.cache";
import { toConversationTurn } from "../utils";
import { useChatSocket } from "./useChatSocket";
import { useConversationMessages } from "./useConversationMessages";
import { useConversations } from "./useConversations";

export const useAssistantChatController = () => {
  const queryClient = useQueryClient();
  const { show } = useAppSnackbar();
  const socketState = useChatSocket();
  const [activeSessionId, setActiveSessionId] = useState<number | undefined>();
  const [newSessionMode, setNewSessionMode] = useState(false);

  const conversationsQuery = useConversations(12);
  const conversations = useMemo(
    () => conversationsQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [conversationsQuery.data],
  );

  useEffect(() => {
    if (!activeSessionId && !newSessionMode && conversations.length > 0) {
      setActiveSessionId(conversations[0].ragConversationId);
    }
  }, [activeSessionId, newSessionMode, conversations]);

  const messagesQuery = useConversationMessages(activeSessionId);
  const turns = useMemo(
    () =>
      messagesQuery.data?.pages
        .flatMap((page) => page.items)
        .map(toConversationTurn)
        .sort((a, b) => a.turnNumber - b.turnNumber) ?? [],
    [messagesQuery.data],
  );

  const startMutation = useMutation({
    mutationFn: chatApi.startConversation,
    onSuccess: (result, content) => {
      if (!result.ragConversationId) return;
      const conversationId = result.ragConversationId;
      setActiveSessionId(conversationId);
      setNewSessionMode(false);

      // Add only the new question locally. Do not refetch conversations/messages.
      appendTurnToMessagesCache(
        queryClient,
        conversationId,
        createLocalProcessingTurn(conversationId, result, content),
      );
    },
  });

  const sendMutation = useMutation({
    mutationFn: ({ conversationId, content }: { conversationId: number; content: string }) =>
      chatApi.sendMessage(conversationId, content),
    onSuccess: (result, variables) => {
      // Add only this question to the current cache.
      appendTurnToMessagesCache(
        queryClient,
        variables.conversationId,
        createLocalProcessingTurn(variables.conversationId, result, variables.content),
      );
    },
  });

  const lastTurn = turns.at(-1);
  const serverProcessing = lastTurn?.status === "PROCESSING";
  const isPendingAction = startMutation.isPending || sendMutation.isPending || serverProcessing;

  // WebSocket is primary. As a safety fallback, poll only this request id.
  // This never refetches the complete messages/conversations lists.
  useEffect(() => {
    if (!lastTurn || lastTurn.status !== "PROCESSING") return;

    let cancelled = false;
    const requestId = lastTurn.ragRequestId;

    const check = async () => {
      try {
        const request = await chatApi.getRequestStatus(requestId);
        if (cancelled) return;
        applyRequestStatusToMessagesCache(queryClient, request);
      } catch {
        // Keep the local PROCESSING turn. A later check/socket reconnect can complete it.
      }
    };

    void check();
    const timer = window.setInterval(() => void check(), 2_500);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [lastTurn?.ragRequestId, lastTurn?.status, queryClient]);

  const handleSendMessage = async (text: string) => {
    const content = text.trim();
    if (!content || isPendingAction) return;
    try {
      if (!activeSessionId) {
        await startMutation.mutateAsync(content);
      } else {
        await sendMutation.mutateAsync({ conversationId: activeSessionId, content });
      }
    } catch (error) {
      show(getApiErrorMessage(error), "error");
    }
  };

  return {
    activeSessionId,
    conversations,
    turns,
    socketState,
    isPendingAction,
    isLoadingConversations: conversationsQuery.isLoading,
    isLoadingMessages: messagesQuery.isLoading,
    isLoadingMoreMessages: messagesQuery.isFetchingPreviousPage,
    hasMoreMessages: Boolean(messagesQuery.hasPreviousPage),
    handleLoadMoreMessages: () => {
      if (messagesQuery.hasPreviousPage && !messagesQuery.isFetchingPreviousPage) {
        void messagesQuery.fetchPreviousPage();
      }
    },
    handleLoadMoreConversations: () => {
      if (conversationsQuery.hasNextPage && !conversationsQuery.isFetchingNextPage) {
        void conversationsQuery.fetchNextPage();
      }
    },
    handleNewSession: () => {
      setNewSessionMode(true);
      setActiveSessionId(undefined);
    },
    handleSelectSession: (conversationId: number) => {
      setNewSessionMode(false);
      setActiveSessionId(conversationId);
    },
    handleSendMessage,
  };
};
