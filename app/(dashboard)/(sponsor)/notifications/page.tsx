"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CiBellOn } from "react-icons/ci";
import NotificationCard from "./NotificationCard";
import { LuCircleCheckBig } from "react-icons/lu";
import { FiTrash2 } from "react-icons/fi";
import api from "@/Provider/api";
import ConfirmActionModal from "@/components/ConfirmActionModal";

interface Notification {
  id: string;
  title: string;
  from: string;
  description: string;
  is_read: boolean;
  created_at: string;
  notification_type?: string;
  memorandum_id?: number | string;
  related_id?: number | string;
  target_id?: number | string;
  action_url?: string;
  data?: {
    memorandum_id?: number | string;
    related_id?: number | string;
    target_id?: number | string;
  };
}

type PendingNotificationAction =
  | { type: "mark-all-read" }
  | { type: "clear-all" }
  | { type: "mark-one-read"; id: string; redirectTo?: string }
  | { type: "delete-one"; id: string };

export default function Notifications() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [actionLoading, setActionLoading] = useState(false);
  const [pendingAction, setPendingAction] =
    useState<PendingNotificationAction | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api.get("/api/notifications/");
      setNotifications(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await api.get("/api/notifications/unread-count/");
      setUnreadCount(res.data?.data?.unread_count || 0);
    } catch (err) {
      console.error("Failed to fetch unread count", err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

  const executeMarkAllRead = async (): Promise<boolean> => {
    try {
      await api.patch("/api/notifications/read-all/");
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
      return true;
    } catch (err) {
      console.error("Failed to mark all as read", err);
      return false;
    }
  };

  const executeClearAll = async (): Promise<boolean> => {
    try {
      await api.delete("/api/notifications/clear-all/");
      setNotifications([]);
      setUnreadCount(0);
      return true;
    } catch (err) {
      console.error("Failed to clear notifications", err);
      return false;
    }
  };

  const executeMarkOneRead = async (id: string): Promise<boolean> => {
    try {
      await api.patch(`/api/notifications/${id}/read/`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      return true;
    } catch (err) {
      console.error("Failed to mark notification as read", err);
      return false;
    }
  };

  const toNumberOrNull = (value: unknown): number | null => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim().length > 0) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
    return null;
  };

  const isMemorandumGenerated = (notification: Notification) => {
    const normalizedType = (notification.notification_type || "")
      .toLowerCase()
      .replace(/[_-]/g, " ");

    return (
      normalizedType.includes("memorandum") &&
      normalizedType.includes("generated")
    );
  };

  const getMemorandumId = (notification: Notification): number | null => {
    const directId =
      toNumberOrNull(notification.memorandum_id) ||
      toNumberOrNull(notification.related_id) ||
      toNumberOrNull(notification.target_id) ||
      toNumberOrNull(notification.data?.memorandum_id) ||
      toNumberOrNull(notification.data?.related_id) ||
      toNumberOrNull(notification.data?.target_id);

    if (directId) return directId;

    const maybeUrl = notification.action_url || "";
    const match = maybeUrl.match(/\/memorandum\/(\d+)/i);
    if (match?.[1]) return Number(match[1]);

    return null;
  };

  const handleNotificationClick = async (notification: Notification) => {
    const memorandumId = isMemorandumGenerated(notification)
      ? getMemorandumId(notification)
      : null;
    const redirectTo = memorandumId ? `/memorandum/${memorandumId}` : undefined;

    if (!notification.is_read) {
      setPendingAction({
        type: "mark-one-read",
        id: notification.id,
        redirectTo,
      });
      return;
    }

    if (!isMemorandumGenerated(notification)) {
      return;
    }

    if (!memorandumId) {
      console.warn(
        "Memorandum notification clicked without a valid memorandum id",
        notification,
      );
      return;
    }

    router.push(`/memorandum/${memorandumId}`);
  };

  const executeDeleteOne = async (id: string): Promise<boolean> => {
    try {
      const notif = notifications.find((n) => n.id === id);
      await api.delete(`/api/notifications/${id}/`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (notif && !notif.is_read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      return true;
    } catch (err) {
      console.error("Failed to delete notification", err);
      return false;
    }
  };

  const getConfirmDialogContent = () => {
    if (!pendingAction) {
      return {
        title: "Confirm action",
        description: "Are you sure you want to continue?",
        confirmText: "Confirm",
        destructive: false,
      };
    }

    switch (pendingAction.type) {
      case "mark-all-read":
        return {
          title: "Mark all as read?",
          description: "This will update all notifications to read status.",
          confirmText: "Mark all read",
          destructive: false,
        };
      case "clear-all":
        return {
          title: "Clear all notifications?",
          description:
            "This will permanently delete all notifications from your list.",
          confirmText: "Clear all",
          destructive: true,
        };
      case "mark-one-read":
        return {
          title: "Mark notification as read?",
          description: pendingAction.redirectTo
            ? "This will mark the notification as read and open the related memorandum."
            : "This will mark the notification as read.",
          confirmText: "Mark as read",
          destructive: false,
        };
      case "delete-one":
        return {
          title: "Delete notification?",
          description:
            "This will permanently remove the selected notification.",
          confirmText: "Delete",
          destructive: true,
        };
      default:
        return {
          title: "Confirm action",
          description: "Are you sure you want to continue?",
          confirmText: "Confirm",
          destructive: false,
        };
    }
  };

  const handleConfirmAction = async () => {
    if (!pendingAction) return;

    setActionLoading(true);
    try {
      switch (pendingAction.type) {
        case "mark-all-read": {
          await executeMarkAllRead();
          break;
        }
        case "clear-all": {
          await executeClearAll();
          break;
        }
        case "mark-one-read": {
          const success = await executeMarkOneRead(pendingAction.id);
          if (success && pendingAction.redirectTo) {
            router.push(pendingAction.redirectTo);
          }
          break;
        }
        case "delete-one": {
          await executeDeleteOne(pendingAction.id);
          break;
        }
      }
    } finally {
      setActionLoading(false);
      setPendingAction(null);
    }
  };

  const dialogContent = getConfirmDialogContent();

  return (
    <div className="flex items-center relative cursor-pointer">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button>
            <CiBellOn className="text-2xl" />
            {unreadCount > 0 && (
              <p className="h-5 w-5 rounded-lg bg-[#E7000B] absolute -top-2 -right-2 flex justify-center items-center">
                <span className="text-white p-1 text-sm">{unreadCount}</span>
              </p>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-w-[300px] md:max-w-[400px] h-[500px] border border-[#0000001A] mr-7 md:mr-10 2xl:mr-15 3xl:mr-25 bg-[#FFFFFF] -right-3">
          <div className="sticky -top-1 z-10 bg-[#FFFFFF] py-2">
            <div className="flex justify-between mt-2 px-4">
              <p className="text-[#101828]">Notifications</p>
              {unreadCount > 0 && (
                <div className="bg-[#DBEAFE] px-2 flex items-center justify-center rounded-lg">
                  <p className="text-[#1447E6] text-sm">{unreadCount} new</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3  w-96 flex flex-col gap-2 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-sm text-[#6A7282] py-8">
                No notifications
              </p>
            ) : (
              notifications.map((item) => (
                <NotificationCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  from={item.from}
                  description={item.description}
                  is_read={item.is_read}
                  created_at={item.created_at}
                  onRequestMarkRead={(id) =>
                    setPendingAction({ type: "mark-one-read", id })
                  }
                  onRequestDelete={(id) =>
                    setPendingAction({ type: "delete-one", id })
                  }
                  onClickNotification={() => handleNotificationClick(item)}
                />
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="sticky bottom-0 bg-[#FFFFFF] flex justify-between px-6 py-3 z-50">
              <button
                className="flex gap-2 items-center cursor-pointer"
                onClick={() => setPendingAction({ type: "mark-all-read" })}
              >
                <LuCircleCheckBig />
                Mark all read
              </button>
              <button
                className="flex gap-2 items-center cursor-pointer"
                onClick={() => setPendingAction({ type: "clear-all" })}
              >
                <FiTrash2 className="text-[#E7000B]" />
                Clear all
              </button>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmActionModal
        open={Boolean(pendingAction)}
        onOpenChange={(open) => {
          if (!open && !actionLoading) {
            setPendingAction(null);
          }
        }}
        title={dialogContent.title}
        description={dialogContent.description}
        confirmText={dialogContent.confirmText}
        destructive={dialogContent.destructive}
        isLoading={actionLoading}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}
