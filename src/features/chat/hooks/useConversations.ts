import { useInfiniteQuery } from "@tanstack/react-query";
import { chatApi } from "../chat.api";

export const conversationsQueryKey = ["chat-conversations"] as const;

export const useConversations = (limit = 20) =>
  useInfiniteQuery({
    queryKey: conversationsQueryKey,
    initialPageParam: 1,
    queryFn: ({ pageParam }) => chatApi.listConversations(pageParam, limit),
    getNextPageParam: (lastPage) =>
      lastPage.page * lastPage.limit < lastPage.total ? lastPage.page + 1 : undefined,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
