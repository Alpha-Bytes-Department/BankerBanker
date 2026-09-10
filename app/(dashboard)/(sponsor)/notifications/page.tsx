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
import NotificationPreferencesModal from "./NotificationPreferencesModal";
import { LuCircleCheckBig, LuSettings } from "react-icons/lu";
import { FiTrash2 } from "react-icons/fi";
import ConfirmActionModal from "@/components/ConfirmActionModal";
import {
  getNotifications,
  getUnreadCount,
  markAllNotificationsAsRead,
  clearAllNotifications,
  markNotificationAsRead,
  deleteNotification,
  NotificationItem,
} from "./notificationApi";
import { toast } from "sonner";

type PendingNotificationAction =
  | { type: "mark-all-read" }
  | { type: "clear-all" }
  | { type: "mark-one-read"; id: string | number; redirectTo?: string }
  | { type: "delete-one"; id: string | number };

export default function Notifications() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [pendingAction, setPendingAction] =
    useState<PendingNotificationAction | null>(null);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const items = await getNotifications();
      setNotifications(items);
    } catch (err: any) {
      console.warn("Failed to fetch notifications:", err?.message || err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (err: any) {
      console.warn("Failed to fetch unread count:", err?.message || err);
      setUnreadCount(0);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

  const executeMarkAllRead = async (): Promise<boolean> => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
      return true;
    } catch (err) {
      console.error("Failed to mark all as read", err);
      toast.error("Failed to mark all notifications as read");
      return false;
    }
  };

  const executeClearAll = async (): Promise<boolean> => {
    try {
      await clearAllNotifications();
      setNotifications([]);
      setUnreadCount(0);
      toast.success("All notifications cleared");
      return true;
    } catch (err) {
      console.error("Failed to clear notifications", err);
      toast.error("Failed to clear notifications");
      return false;
    }
  };

  const executeMarkOneRead = async (id: string | number): Promise<boolean> => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (String(n.id) === String(id) ? { ...n, is_read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      return true;
    } catch (err) {
      console.error("Failed to mark notification as read", err);
      toast.error("Failed to mark notification as read");
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

  const isMemorandumGenerated = (notification: NotificationItem) => {
    const normalizedType = (notification.notification_type || notification.type || "")
      .toLowerCase()
      .replace(/[_-]/g, " ");

    return (
      normalizedType.includes("memorandum") &&
      normalizedType.includes("generated")
    );
  };

  const getMemorandumId = (notification: NotificationItem): number | null => {
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

  const handleNotificationClick = async (notification: NotificationItem) => {
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

  const executeDeleteOne = async (id: string | number): Promise<boolean> => {
    try {
      const notif = notifications.find((n) => String(n.id) === String(id));
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => String(n.id) !== String(id)));
      if (notif && !notif.is_read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      toast.success("Notification deleted");
      return true;
    } catch (err) {
      console.error("Failed to delete notification", err);
      toast.error("Failed to delete notification");
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
          <button className="relative p-1.5 rounded-full hover:bg-gray-100 transition-colors focus:outline-none">
            <CiBellOn className="text-2xl text-[#101828]" />
            {unreadCount > 0 && (
              <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#E7000B] absolute -top-0.5 -right-0.5 flex justify-center items-center text-white text-[11px] font-bold shadow-sm">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[340px] md:w-[400px] max-h-[520px] flex flex-col border border-[#0000001A] mr-7 md:mr-10 2xl:mr-15 3xl:mr-25 bg-[#FFFFFF] shadow-xl rounded-xl -right-3 p-0 overflow-hidden">
          {/* Header */}
          <div className="bg-[#FFFFFF] border-b border-[#F1F5F9] px-4 py-3 shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-[#101828] font-semibold text-base">Notifications</p>
              {unreadCount > 0 && (
                <div className="bg-[#DBEAFE] px-2 py-0.5 flex items-center justify-center rounded-md">
                  <p className="text-[#1447E6] text-xs font-medium">{unreadCount} new</p>
                </div>
              )}
            </div>

            {/* Notification Preferences trigger button */}
            <button
              type="button"
              onClick={() => setIsPreferencesOpen(true)}
              className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
              title="Notification Settings & Preferences"
            >
              <LuSettings className="text-lg" />
            </button>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto min-h-[160px] max-h-[380px] divide-y divide-[#F1F5F9]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-[#6A7282] text-sm">
                <p>Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-[#6A7282] text-sm">
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((item) => (
                <NotificationCard
                  key={String(item.id)}
                  id={item.id}
                  title={item.title || "Notification"}
                  from={item.from || "System"}
                  description={item.description || item.message || ""}
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

          {/* Bottom Footer Actions */}
          {notifications.length > 0 && (
            <div className="border-t border-[#F1F5F9] bg-[#FAFAFA] flex justify-between px-4 py-2.5 shrink-0">
              <button
                type="button"
                className="flex gap-1.5 items-center text-xs font-medium text-[#475569] hover:text-[#0F172A] cursor-pointer transition-colors"
                onClick={() => setPendingAction({ type: "mark-all-read" })}
              >
                <LuCircleCheckBig className="text-sm text-blue-600" />
                Mark all read
              </button>
              <button
                type="button"
                className="flex gap-1.5 items-center text-xs font-medium text-[#DC2626] hover:text-[#B91C1C] cursor-pointer transition-colors"
                onClick={() => setPendingAction({ type: "clear-all" })}
              >
                <FiTrash2 className="text-sm" />
                Clear all
              </button>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Preferences Modal */}
      <NotificationPreferencesModal
        open={isPreferencesOpen}
        onOpenChange={setIsPreferencesOpen}
      />

      {/* Confirmation Modal */}
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

