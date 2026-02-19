"use client"
import { Star } from "lucide-react";
import { useState } from "react";


const chats = [
    {
        id: 1,
        name: "Argentic Capita",
        message: "We've prepared the final loan documents for your review.",
        time: "1h ago",
        unread: 2,
        starred: true,
        initials: "AR",
    },
    {
        id: 2,
        name: "Capital Bank",
        message: "Thank you for accepting our quote. Let me know when you're ready to proceed.",
        time: "6h ago",
        unread: 0,
        starred: false,
        initials: "CA",
    },
    {
        id: 3,
        name: "Prime Commercial",
        message: "I'll need updated financials before we can finalize.",
        time: "1d ago",
        unread: 1,
        starred: true,
        initials: "PR",
    },
    {
        id: 4,
        name: "Metro Lending",
        message: "I have some questions about your property specifications.",
        time: "Just now",
        unread: 1,
        starred: false,
        initials: "ME",
    },
];

interface MessageListProps {
  selectedMessageId ?: string | number | null;
  setSelectedMessageId ?: (value: string | number | null) => void
}

const AllMessage = ({
    selectedMessageId,
    setSelectedMessageId
}:MessageListProps) => {
    const [filter, setFilter] = useState<"all" | "unread" | "stared">("all");
    

    return (
        <div className="w-full max-w-md h-[90vh] rounded-xl bg-white shadow-sm border border-[#0000001A]">
            {/* Search */}
            <div className="p-4 border-b border-[#0000001A]">
                <input
                    placeholder="Search messages..."
                    className="w-full rounded-md bg-gray-100 px-4 py-2 text-sm outline-none"
                />
            </div>
            {/* Filters */}
            <div className="flex gap-2 px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
                <button onClick={()=>setFilter("all")} className={`flex-1 rounded-md py-1.5 text-sm ${filter === "all" ? "bg-black text-white" : "border border-[#0000001A]"}`}>
                    All
                </button>
                <button onClick={()=>setFilter("unread")} className={`flex-1 rounded-md py-1.5 text-sm ${filter === "unread" ? "bg-black text-white" : "border border-[#0000001A]"}`}>
                    Unread
                </button>
                <button onClick={()=>setFilter("stared")} className={`flex-1 rounded-md py-1.5 text-sm flex justify-center items-center ${filter === "stared" ? "bg-black text-white" : "border border-[#0000001A]"}`}>
                    <Star/>
                </button>
            </div>
            {/* Chat List */}
            <div>
                {chats.map(chat => (
                    <div
                        key={chat.id}
                        onClick={()=>setSelectedMessageId?.(chat.id)}
                        className={`flex gap-3 px-4 py-4 border-b border-[#0000001A] cursor-pointer ${chat.id === selectedMessageId ? "bg-blue-50" : "hover:bg-gray-50"
                            }`}
                    >
                        {/* Avatar */}
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
                            {chat.initials}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <h4 className="font-medium text-sm">{chat.name}</h4>
                                <span className="text-xs text-gray-500">{chat.time}</span>
                            </div>
                            <p className="text-sm text-gray-700 line-clamp-1">
                                {chat.message}
                            </p>

                            {chat.unread > 0 && (
                                <span className="mt-1 inline-block rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                                    {chat.unread} new
                                </span>
                            )}
                        </div>

                        {/* Star */}
                        {chat.starred && (
                            <span className="text-yellow-400 text-sm">⭐</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllMessage;