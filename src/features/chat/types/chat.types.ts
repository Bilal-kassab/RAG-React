export type RequestStatus = "PROCESSING" | "SUCCEEDED" | "FAILED";
export type MessageRole = "USER" | "ASSISTANT";

export interface Citation {
  ragMessageCitationId: number;
  position: number;
  sourceType: string;
  documentId: string | null;
  chunkId: string | null;
  title: string | null;
  page: number | null;
  snippet: string | null;
  score: number | null;
  createdAt?: string;
}

export interface ChatMessage {
  ragMessageId: number;
  ragRequestId: number;
  role: MessageRole;
  content: string;
  createdAt: string;
  citations: Citation[];
}

export interface Conversation {
  ragConversationId: number;
  title: string;
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RagTurnApi {
  ragRequestId: number;
  ragConversationId: number;
  turnNumber: number;
  clientRequestId: string;
  status: RequestStatus;
  leaseExpiresAt: string;
  finishedAt: string | null;
  failureCode: string | null;
  latencyMs: number | null;
  startedAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface ConversationTurn {
  ragRequestId: number;
  ragConversationId: number;
  turnNumber: number;
  status: RequestStatus;
  failureCode: string | null;
  leaseExpiresAt: string;
  startedAt: string;
  finishedAt: string | null;
  latencyMs: number | null;
  userMessage?: ChatMessage;
  assistantMessage?: ChatMessage;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
}

export interface SendMessageResponse {
  ragConversationId?: number;
  ragRequestId: number;
  status: RequestStatus;
  turnNumber?: number;
  duplicated: boolean;
}

export interface ChatRequestSucceededPayload {
  ragRequestId: number;
  ragConversationId: number;
  turnNumber: number;
  status: "SUCCEEDED";
  conversationTitle?: string;
  finishedAt: string;
  latencyMs: number;
  assistantMessage: ChatMessage;
}

export interface ChatRequestFailedPayload {
  ragRequestId: number;
  ragConversationId: number;
  turnNumber: number;
  status: "FAILED";
  failureCode?: string | null;
  finishedAt: string;
}
