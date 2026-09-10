import api from "@/Provider/api";
import type {
  DocviewDocument,
  DocviewProperty,
  ChatSession,
  ChatMessage,
} from "../_components/docview-types";

/**
 * Fetch all properties
 * Postman: GET /api/v1/properties/
 */
export async function fetchProperties(): Promise<DocviewProperty[]> {
  let response;
  try {
    response = await api.get("/api/v1/properties/");
  } catch {
    response = await api.get("/api/properties/");
  }

  const raw =
    response.data?.data ??
    (Array.isArray(response.data) ? response.data : []);

  if (!Array.isArray(raw)) return [];

  return raw.map((p: any) => ({
    id: p.id,
    property_name: p.property_name || `Property #${p.id}`,
    property_address: p.property_address || "",
    property_type: p.property_type || "",
    property_image_url: p.property_image_url || "",
    thumbnail_url: p.thumbnail_url || null,
  }));
}

/**
 * Fetch all documents for a property
 * Postman: GET /api/v1/properties/{{id}}/files/
 */
export async function fetchPropertyDocuments(
  propertyId: number,
): Promise<DocviewDocument[]> {
  let response;
  try {
    response = await api.get(`/api/v1/properties/${propertyId}/files/`);
  } catch {
    try {
      response = await api.get(`/api/properties/${propertyId}/files/`);
    } catch {
      response = await api.get(`/api/properties/${propertyId}/documents/`);
    }
  }

  const rawDocs =
    response?.data?.data ??
    (Array.isArray(response?.data) ? response.data : []) ??
    (Array.isArray((response?.data as any)?.files)
      ? (response.data as any).files
      : []);

  const list = Array.isArray(rawDocs)
    ? rawDocs
    : Array.isArray((rawDocs as any)?.files)
      ? (rawDocs as any).files
      : [];

  return list.map((item: any, index: number) => ({
    id: item.id || index + 1,
    file_url:
      item.file_url ||
      item.file ||
      item.url ||
      item.document_url ||
      item.src ||
      "",
    uploaded_at:
      item.uploaded_at || item.created_at || new Date().toISOString(),
    name: item.name || item.file_name || item.title || undefined,
    size: typeof item.size === "number" ? item.size : undefined,
  }));
}

/**
 * List chat sessions for a property
 * Postman: GET /api/v1/properties/{{id}}/chat/sessions/
 */
export async function fetchChatSessions(
  propertyId: number,
): Promise<ChatSession[]> {
  let response;
  try {
    response = await api.get(`/api/v1/properties/${propertyId}/chat/sessions/`);
  } catch {
    response = await api.get(`/api/properties/${propertyId}/chat/sessions/`);
  }

  const raw = response.data?.data ?? (Array.isArray(response.data) ? response.data : []);
  return Array.isArray(raw) ? raw : [];
}

/**
 * Get messages in a chat session
 * Postman: GET /api/v1/properties/{{id}}/chat/sessions/{{session_id}}/
 */
export async function fetchChatMessages(
  propertyId: number,
  sessionId: number,
): Promise<ChatMessage[]> {
  let response;
  try {
    response = await api.get(
      `/api/v1/properties/${propertyId}/chat/sessions/${sessionId}/`,
    );
  } catch {
    response = await api.get(
      `/api/properties/${propertyId}/chat/sessions/${sessionId}/`,
    );
  }

  const raw = response.data?.data ?? (Array.isArray(response.data) ? response.data : []);
  if (!Array.isArray(raw)) return [];

  return raw.map((msg: any) => ({
    id: msg.id,
    role: msg.role === "user" ? "user" : "assistant",
    content: msg.content || "",
    created_at: msg.created_at,
  }));
}

/**
 * Post a message to property chat
 * Postman: POST /api/v1/properties/{{id}}/chat/
 */
export async function sendChatMessage(
  propertyId: number,
  message: string,
  sessionId?: number | null,
): Promise<{ session_id: number; reply: string }> {
  const body: { message: string; session_id?: number } = { message };
  if (sessionId) {
    body.session_id = sessionId;
  }

  let response;
  try {
    response = await api.post(`/api/v1/properties/${propertyId}/chat/`, body);
  } catch {
    response = await api.post(`/api/properties/${propertyId}/chat/`, body);
  }

  const data = response.data?.data ?? response.data ?? {};
  return {
    session_id: data.session_id,
    reply: data.reply || data.response || "No response received.",
  };
}

/**
 * Delete a chat session
 * Postman: DELETE /api/v1/properties/{{id}}/chat/sessions/{{session_id}}/
 */
export async function deleteChatSession(
  propertyId: number,
  sessionId: number,
): Promise<void> {
  try {
    await api.delete(
      `/api/v1/properties/${propertyId}/chat/sessions/${sessionId}/`,
    );
  } catch {
    await api.delete(
      `/api/properties/${propertyId}/chat/sessions/${sessionId}/`,
    );
  }
}
