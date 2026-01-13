"use client"
// Fahim
import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { GoDotFill } from "react-icons/go";
import { IoCheckmarkSharp } from "react-icons/io5";
import { LuMessageCircle } from "react-icons/lu";

interface NotificationCardProps {
    title: string,
    from: string,
    description: string
}

export default function NotificationCard({ title, from, description }: NotificationCardProps) {
    const [read, setRead] = useState(false);

    
    return (
        <div className={`${read ? "bg-[white]" : "bg-[#EFF6FF]"} border-t border-b px-2 py-3 flex gap-2 border border-[#0000001A]`}
            onClick={() => setRead(true)}>
            <div className="w-8 h-8 rounded-full bg-[#DBEAFE] flex items-center justify-center shrink-0">
                <LuMessageCircle className="w-5 h-5 text-[#155DFC]" />
            </div>
            <div>
                <div className="flex justify-between items-center">
                    <h1 className="font-semibold text-[#101828] text-base">{title}</h1>
                    {read ? "" : <GoDotFill className="text-[#155DFC]" />}
                </div>
                <p className="text-xs text-[#4A5565]">From:{" "}{from}</p>
                <p className="text-[#4A5565] text-sm">{description}</p>
                <div className="flex justify-between items-center mt-1">
                    <p className="text-sm text-[#6A7282]">1h ago</p>
                    <div className="flex gap-3 items-center">
                        <button className="cursor-pointer" onClick={() => setRead(true)}>
                            {read ? "" : (
                                <div className="flex gap-1 items-center">
                                    <IoCheckmarkSharp />
                                    <p className="text-[#0A0A0A] text-xs">Mark read</p>
                                </div>)}
                        </button>
                        <button className="cursor-pointer">
                            <FiTrash2 className="text-[#E7000B]" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}