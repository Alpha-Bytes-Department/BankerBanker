import api from "@/Provider/api";

export interface NotificationItem {
  id: string | number;
  title?: string;
  message?: string;
  description?: string;
  from?: string;
  sender?: string;
  sender_name?: string;
  from_user?: string;
  is_read: boolean;
  created_at?: string;
  created?: string;
  notification_type?: string;
  type?: string;
  memorandum_id?: number | string;
  related_id?: number | string;
  target_id?: number | string;
  action_url?: string;
  data?: {
    memorandum_id?: number | string;
    related_id?: number | string;
    target_id?: number | string;
    [key: string]: unknown;
  };
}

export interface NotificationPreferences {
  quote_emails_enabled: boolean;
  marketing_emails_enabled: boolean;
}

/**
 * Normalizes notification item data to guarantee standard fields
 */
export function normalizeNotification(item: Record<string, unknown>): NotificationItem {
  const id = (item.id ?? item._id ?? "") as string | number;
  const title = (item.title || item.subject || "Notification") as string;
  const description = (item.description || item.message || item.body || "") as string;
  const from = (item.from || item.sender || item.sender_name || item.from_user || "System") as string;
  const is_read = Boolean(item.is_read ?? item.read ?? false);
  const created_at = (item.created_at || item.created || item.timestamp || new Date().toISOString()) as string;
  const notification_type = (item.notification_type || item.type || "") as string;

  return {
    ...item,
    id: String(id),
    title,
    description,
    from,
    is_read,
    created_at,
    notification_type,
    memorandum_id: item.memorandum_id as number | string | undefined,
    related_id: item.related_id as number | string | undefined,
    target_id: item.target_id as number | string | undefined,
    action_url: item.action_url as string | undefined,
    data: (item.data as NotificationItem["data"]) || undefined,
  };
}

/**
 * 1. GET /api/v1/notifications/
 * Retrieves all notifications for the authenticated user.
 */
export async function getNotifications(): Promise<NotificationItem[]> {
  const response = await api.get("/api/v1/notifications/");
  const rawData = response.data?.data ?? response.data?.results ?? response.data;

  if (Array.isArray(rawData)) {
    return rawData.map((item) => normalizeNotification(item as Record<string, unknown>));
  }
  return [];
}

/**
 * 2. GET /api/v1/notifications/unread-count/
 * Retrieves the count of unread notifications.
 */
export async function getUnreadCount(): Promise<number> {
  const response = await api.get("/api/v1/notifications/unread-count/");
  const payload = response.data;

  if (typeof payload?.data?.unread_count === "number") {
    return payload.data.unread_count;
  }
  if (typeof payload?.unread_count === "number") {
    return payload.unread_count;
  }
  if (typeof payload?.count === "number") {
    return payload.count;
  }
  if (typeof payload?.data?.count === "number") {
    return payload.data.count;
  }
  if (typeof payload?.data === "number") {
    return payload.data;
  }
  return 0;
}

/**
 * 3. PATCH /api/v1/notifications/read-all/
 * Marks all notifications as read.
 */
export async function markAllNotificationsAsRead(): Promise<void> {
  await api.patch("/api/v1/notifications/read-all/");
}

/**
 * 4. DELETE /api/v1/notifications/clear-all/
 * Deletes all notifications for the user.
 */
export async function clearAllNotifications(): Promise<void> {
  await api.delete("/api/v1/notifications/clear-all/");
}

/**
 * 5. PATCH /api/v1/notifications/{id}/
 * Marks a single notification as read.
 */
export async function markNotificationAsRead(id: string | number): Promise<void> {
  await api.patch(`/api/v1/notifications/${id}/`);
}

/**
 * 6. DELETE /api/v1/notifications/{id}/
 * Deletes a single notification.
 */
export async function deleteNotification(id: string | number): Promise<void> {
  await api.delete(`/api/v1/notifications/${id}/`);
}

/**
 * 7. GET /api/v1/notifications/preferences/
 * Retrieves the user's notification preferences.
 */
export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  const response = await api.get("/api/v1/notifications/preferences/");
  const data = response.data?.data ?? response.data ?? {};

  return {
    quote_emails_enabled: Boolean(data.quote_emails_enabled ?? true),
    marketing_emails_enabled: Boolean(data.marketing_emails_enabled ?? true),
  };
}

/**
 * 8. PATCH /api/v1/notifications/preferences/
 * Updates the user's notification preferences.
 */
export async function updateNotificationPreferences(
  preferences: Partial<NotificationPreferences>,
): Promise<NotificationPreferences> {
  const response = await api.patch("/api/v1/notifications/preferences/", preferences);
  const data = response.data?.data ?? response.data ?? {};

  return {
    quote_emails_enabled: Boolean(data.quote_emails_enabled ?? preferences.quote_emails_enabled ?? true),
    marketing_emails_enabled: Boolean(data.marketing_emails_enabled ?? preferences.marketing_emails_enabled ?? true),
  };
}
