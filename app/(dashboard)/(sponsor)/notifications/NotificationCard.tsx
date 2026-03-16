"use client";
import { FiTrash2 } from "react-icons/fi";
import { GoDotFill } from "react-icons/go";
import { IoCheckmarkSharp } from "react-icons/io5";
import { LuMessageCircle } from "react-icons/lu";

interface NotificationCardProps {
  id: string;
  title: string;
  from: string;
  description: string;
  is_read: boolean;
  created_at: string;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function NotificationCard({
  id,
  title,
  from,
  description,
  is_read,
  created_at,
  onMarkRead,
  onDelete,
}: NotificationCardProps) {
  const handleMarkRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!is_read) onMarkRead(id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
  };

  return (
    <div
      className={`${is_read ? "bg-white" : "bg-[#EFF6FF]"} border-t border-b px-2 py-3 flex gap-2 border border-[#0000001A] cursor-pointer`}
      onClick={() => {
        if (!is_read) onMarkRead(id);
      }}
    >
      <div className="w-8 h-8 rounded-full bg-[#DBEAFE] flex items-center justify-center shrink-0">
        <LuMessageCircle className="w-5 h-5 text-[#155DFC]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center gap-1">
          <h1 className="font-semibold text-[#101828] text-base truncate">
            {title}
          </h1>
          {!is_read && <GoDotFill className="text-[#155DFC] shrink-0" />}
        </div>
        <p className="text-xs text-[#4A5565]">From: {from}</p>
        <p className="text-[#4A5565] text-sm">{description}</p>
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm text-[#6A7282]">{timeAgo(created_at)}</p>
          <div className="flex gap-3 items-center">
            {!is_read && (
              <button className="cursor-pointer" onClick={handleMarkRead}>
                <div className="flex gap-1 items-center">
                  <IoCheckmarkSharp />
                  <p className="text-[#0A0A0A] text-xs">Mark read</p>
                </div>
              </button>
            )}
            <button className="cursor-pointer" onClick={handleDelete}>
              <FiTrash2 className="text-[#E7000B]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
