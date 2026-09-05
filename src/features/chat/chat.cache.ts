import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type {
  ChatRequestFailedPayload,
  ChatRequestSucceededPayload,
  PaginatedResponse,
  RagTurnApi,
  SendMessageResponse,
} from "./types/chat.types";
import { messagesQueryKey } from "./hooks/useConversationMessages";

const PAGE_SIZE = 20;

type MessagesCache = InfiniteData<PaginatedResponse<RagTurnApi>, number>;

const nowIso = () => new Date().toISOString();

export const createLocalProcessingTurn = (
  conversationId: number,
  result: SendMessageResponse,
  content: string,
): RagTurnApi => {
  const now = nowIso();
  return {
    ragRequestId: result.ragRequestId,
    ragConversationId: conversationId,
    turnNumber: result.turnNumber ?? 1,
    clientRequestId: `local-${result.ragRequestId}`,
    status: result.status,
    leaseExpiresAt: new Date(Date.now() + 5 * 60_000).toISOString(),
    finishedAt: null,
    failureCode: null,
    latencyMs: null,
    startedAt: now,
    updatedAt: now,
    messages: [
      {
        ragMessageId: -result.ragRequestId,
        ragRequestId: result.ragRequestId,
        role: "USER",
        content,
        createdAt: now,
        citations: [],
      },
    ],
  };
};

export const appendTurnToMessagesCache = (
  queryClient: QueryClient,
  conversationId: number,
  turn: RagTurnApi,
) => {
  queryClient.setQueryData<MessagesCache>(messagesQueryKey(conversationId), (old) => {
    if (!old) {
      return {
        pages: [{ items: [turn], page: 1, limit: PAGE_SIZE, total: 1 }],
        pageParams: [0],
      };
    }

    if (old.pages.some((page) => page.items.some((item) => item.ragRequestId === turn.ragRequestId))) {
      return old;
    }

    const pages = old.pages.map((page) => ({ ...page, total: page.total + 1 }));
    const lastIndex = pages.length - 1;
    pages[lastIndex] = {
      ...pages[lastIndex],
      items: [...pages[lastIndex].items, turn],
    };

    return { ...old, pages };
  });
};

export const applySucceededToMessagesCache = (
  queryClient: QueryClient,
  payload: ChatRequestSucceededPayload,
) => {
  queryClient.setQueryData<MessagesCache>(messagesQueryKey(payload.ragConversationId), (old) => {
    if (!old) return old;

    return {
      ...old,
      pages: old.pages.map((page) => ({
        ...page,
        items: page.items.map((turn) =>
          turn.ragRequestId === payload.ragRequestId
            ? {
                ...turn,
                status: "SUCCEEDED",
                turnNumber: payload.turnNumber,
                finishedAt: payload.finishedAt,
                latencyMs: payload.latencyMs,
                updatedAt: payload.finishedAt,
                failureCode: null,
                messages: [
                  ...turn.messages.filter((message) => message.role !== "ASSISTANT"),
                  payload.assistantMessage,
                ],
              }
            : turn,
        ),
      })),
    };
  });
};

export const applyFailedToMessagesCache = (
  queryClient: QueryClient,
  payload: ChatRequestFailedPayload,
) => {
  queryClient.setQueryData<MessagesCache>(messagesQueryKey(payload.ragConversationId), (old) => {
    if (!old) return old;

    return {
      ...old,
      pages: old.pages.map((page) => ({
        ...page,
        items: page.items.map((turn) =>
          turn.ragRequestId === payload.ragRequestId
            ? {
                ...turn,
                status: "FAILED",
                turnNumber: payload.turnNumber,
                finishedAt: payload.finishedAt,
                updatedAt: payload.finishedAt,
                failureCode: payload.failureCode ?? null,
              }
            : turn,
        ),
      })),
    };
  });
};

export const applyRequestStatusToMessagesCache = (
  queryClient: QueryClient,
  request: RagTurnApi,
) => {
  queryClient.setQueryData<MessagesCache>(messagesQueryKey(request.ragConversationId), (old) => {
    if (!old) return old;

    return {
      ...old,
      pages: old.pages.map((page) => ({
        ...page,
        items: page.items.map((turn) => {
          if (turn.ragRequestId !== request.ragRequestId) return turn;
          const userMessage = turn.messages.find((message) => message.role === "USER");
          const assistantMessages = request.messages.filter((message) => message.role === "ASSISTANT");
          return {
            ...turn,
            ...request,
            messages: userMessage ? [userMessage, ...assistantMessages] : assistantMessages,
          };
        }),
      })),
    };
  });
};
