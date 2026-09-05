import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { tokenService } from "../../../shared/auth/tokenService";
import {
  applyFailedToMessagesCache,
  applySucceededToMessagesCache,
} from "../chat.cache";
import { chatSocketService } from "../services/socketService";
import type {
  ChatRequestFailedPayload,
  ChatRequestSucceededPayload,
} from "../types/chat.types";

export type SocketState = "connecting" | "ready" | "disconnected" | "error";

export const useChatSocket = () => {
  const queryClient = useQueryClient();
  const [state, setState] = useState<SocketState>("connecting");

  useEffect(() => {
    const token = tokenService.get();
    if (!token) {
      setState("disconnected");
      return;
    }

    const socket = chatSocketService.connect(token);

    const onConnect = () => setState("connecting");
    const onReady = () => setState("ready");
    const onDisconnect = () => setState("disconnected");
    const onError = () => setState("error");

    // Important: update only the affected turn in React Query cache.
    // No reset/refetch of the full messages list or conversations list.
    const onSucceeded = (payload: ChatRequestSucceededPayload) => {
      applySucceededToMessagesCache(queryClient, payload);
    };
    const onFailed = (payload: ChatRequestFailedPayload) => {
      applyFailedToMessagesCache(queryClient, payload);
    };

    socket.on("connect", onConnect);
    socket.on("chat.connection.ready", onReady);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onError);
    socket.on("chat:request.succeeded", onSucceeded);
    socket.on("chat:request.failed", onFailed);

    return () => {
      socket.off("connect", onConnect);
      socket.off("chat.connection.ready", onReady);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onError);
      socket.off("chat:request.succeeded", onSucceeded);
      socket.off("chat:request.failed", onFailed);
      chatSocketService.disconnect();
    };
  }, [queryClient]);

  return state;
};
