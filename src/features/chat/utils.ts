import type { ConversationTurn, RagTurnApi } from "./types/chat.types";

export const toConversationTurn = (turn: RagTurnApi): ConversationTurn => ({
  ragRequestId: turn.ragRequestId,
  ragConversationId: turn.ragConversationId,
  turnNumber: turn.turnNumber,
  status: turn.status,
  failureCode: turn.failureCode,
  leaseExpiresAt: turn.leaseExpiresAt,
  startedAt: turn.startedAt,
  finishedAt: turn.finishedAt,
  latencyMs: turn.latencyMs,
  userMessage: turn.messages.find((message) => message.role === "USER"),
  assistantMessage: turn.messages.find((message) => message.role === "ASSISTANT"),
});

export const getFailureMessage = (code?: string | null): string => {
  if (!code) return "حدث خطأ غير معروف أثناء معالجة الطلب.";
  if (code.includes("TIMEOUT")) return "انتهت مهلة خدمة الذكاء الاصطناعي. حاول مرة أخرى لاحقاً.";
  if (code.includes("UNAVAILABLE")) return "خدمة الذكاء الاصطناعي غير متاحة حالياً.";
  if (code.includes("UNAUTHORIZED")) return "فشل التحقق من صلاحيات خدمة الذكاء الاصطناعي.";
  if (code.includes("BAD_REQUEST")) return "تم رفض الطلب من خدمة المعالجة.";
  if (code.includes("INVALID_RAG_RESPONSE")) return "وصل رد غير صالح من خدمة الذكاء الاصطناعي.";
  return "حدث خطأ أثناء معالجة رسالتك. يمكنك إعادة المحاولة.";
};
