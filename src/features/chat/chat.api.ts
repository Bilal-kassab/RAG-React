import { http } from "../../shared/api/http";
import type {
  Conversation,
  PaginatedResponse,
  RagTurnApi,
  SendMessageResponse,
} from "./types/chat.types";

const buildRequestPayload = (content: string) => ({
  clientRequestId: crypto.randomUUID(),
  content: content.trim(),
});

export const chatApi = {
  async listConversations(page = 1, limit = 20): Promise<PaginatedResponse<Conversation>> {
    const { data } = await http.get<PaginatedResponse<Conversation>>("/Chatting/conversations", {
      params: { page, limit },
    });
    return data;
  },

  async listMessages(
    conversationId: number,
    page = 1,
    limit = 20,
  ): Promise<PaginatedResponse<RagTurnApi>> {
    const { data } = await http.get<PaginatedResponse<RagTurnApi>>(
      `/Chatting/conversations/${conversationId}/messages`,
      { params: { page, limit } },
    );
    return data;
  },

  async getRequestStatus(ragRequestId: number): Promise<RagTurnApi> {
    const { data } = await http.get<RagTurnApi>(`/Chatting/requests/${ragRequestId}`);
    return data;
  },

  async startConversation(content: string): Promise<SendMessageResponse> {
    const { data } = await http.post<SendMessageResponse>(
      "/Chatting/conversations/start",
      buildRequestPayload(content),
    );
    return data;
  },

  async sendMessage(conversationId: number, content: string): Promise<SendMessageResponse> {
    const { data } = await http.post<SendMessageResponse>(
      `/Chatting/conversations/${conversationId}/messages`,
      buildRequestPayload(content),
    );
    return data;
  },
};
