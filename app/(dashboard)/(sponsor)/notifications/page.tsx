"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState, useCallback } from "react";
import { CiBellOn } from "react-icons/ci";
import NotificationCard from "./NotificationCard";
import { LuCircleCheckBig } from "react-icons/lu";
import { FiTrash2 } from "react-icons/fi";
import api from "@/Provider/api";

interface Notification {
  id: string;
  title: string;
  from: string;
  description: string;
  is_read: boolean;
  created_at: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

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

  const handleMarkAllRead = async () => {
    try {
      await api.patch("/api/notifications/read-all/");
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const handleClearAll = async () => {
    try {
      await api.delete("/api/notifications/clear-all/");
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to clear notifications", err);
    }
  };

  const handleMarkOneRead = async (id: string) => {
    try {
      await api.patch(`/api/notifications/${id}/read/`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleDeleteOne = async (id: string) => {
    try {
      const notif = notifications.find((n) => n.id === id);
      await api.delete(`/api/notifications/${id}/`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (notif && !notif.is_read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

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
                  onMarkRead={handleMarkOneRead}
                  onDelete={handleDeleteOne}
                />
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="sticky bottom-0 bg-[#FFFFFF] flex justify-between px-6 py-3 z-50">
              <button
                className="flex gap-2 items-center cursor-pointer"
                onClick={handleMarkAllRead}
              >
                <LuCircleCheckBig />
                Mark all read
              </button>
              <button
                className="flex gap-2 items-center cursor-pointer"
                onClick={handleClearAll}
              >
                <FiTrash2 className="text-[#E7000B]" />
                Clear all
              </button>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
