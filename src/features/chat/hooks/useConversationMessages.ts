import { useInfiniteQuery } from "@tanstack/react-query";
import { chatApi } from "../chat.api";
import type { PaginatedResponse, RagTurnApi } from "../types/chat.types";

const PAGE_SIZE = 20;
export const messagesQueryKey = (conversationId: number) => ["chat-messages", conversationId] as const;

export const useConversationMessages = (conversationId?: number) =>
  useInfiniteQuery({
    queryKey: ["chat-messages", conversationId],
    enabled: Boolean(conversationId),
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const id = conversationId!;
      if (pageParam === 0) {
        const probe = await chatApi.listMessages(id, 1, 1);
        if (probe.total === 0) {
          return { items: [], page: 1, limit: PAGE_SIZE, total: 0 } satisfies PaginatedResponse<RagTurnApi>;
        }
        const latestPage = Math.max(1, Math.ceil(probe.total / PAGE_SIZE));
        return chatApi.listMessages(id, latestPage, PAGE_SIZE);
      }
      return chatApi.listMessages(id, pageParam, PAGE_SIZE);
    },
    getPreviousPageParam: (firstPage) => (firstPage.page > 1 ? firstPage.page - 1 : undefined),
    getNextPageParam: () => undefined,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
