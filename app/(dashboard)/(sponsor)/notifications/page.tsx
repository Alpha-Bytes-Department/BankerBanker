// Fahim
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { CiBellOn } from "react-icons/ci";
import NotificationCard from "./NotificationCard";
import { LuCircleCheckBig, LuMessageCircle } from "react-icons/lu";
import { FaDollarSign } from "react-icons/fa6";
import { FiTrash2 } from "react-icons/fi";

const notificationsData = [
    {
        id: 1,
        title: "New message from Argentic Capital",
        from: "Argentic Capital",
        description: "We've prepared the final loan documents for your review."
    },
    {
        id: 2,
        title: "New message from Prime Commercial",
        from: "Prime Commercial",
        description: "I'll need updated financials before we can finalize."
    },
    {
        id: 3,
        title: "New loan quote received",
        from: "Capital Bank",
        description: "Capital Bank submitted a competitive quote for Downtown Office Complex"
    },
    {
        id: 4,
        title: "New message from Argentic Capital",
        from: "Argentic Capital",
        description: "We've prepared the final loan documents for your review."
    },
    {
        id: 5,
        title: "New message from Prime Commercial",
        from: "Prime Commercial",
        description: "I'll need updated financials before we can finalize."
    },
    {
        id: 6,
        title: "New loan quote received",
        from: "Capital Bank",
        description: "Capital Bank submitted a competitive quote for Downtown Office Complex"
    },
];

export default function Notifications() {
    const [notifications, setNotifications] = useState<number>(3);
    const [all, setAll] = useState(true);
    const [unread, setUnread] = useState(false);
    const [messages, setMessages] = useState(false);
    const [dollar, setDollar] = useState(false);
    return (
        <div className='flex items-center relative cursor-pointer'>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button>
                        <CiBellOn className='text-2xl' />
                        {notifications && <p className='h-5 w-5 rounded-lg bg-[#E7000B] absolute -top-2 -right-2 
                        flex justify-center items-center'><span className='text-white p-1 text-sm'>3</span></p>}
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='max-w-[350px] h-[500px] border border-[#0000001A] bg-[#FFFFFF]
                -right-3'>
                    <div className="sticky top-0 z-10 bg-[#FFFFFF] py-2">
                        <div className='flex justify-between mt-2 px-4'>
                            <p className="text-[#101828]">Notifications</p>
                            <div className="bg-[#DBEAFE] px-2 flex items-center justify-center rounded-lg">
                                <p className="text-[#1447E6] text-sm">3 new</p>
                            </div>
                        </div>
                        <div className='flex gap-4 px-4 mt-2'>
                            <button className={`px-4 py-1 rounded-lg ${all ? "bg-[#4361EE] text-white" :
                                "bg-white text-black"}`} onClick={() => {
                                    setAll(true);
                                    setUnread(false);
                                    setMessages(false);
                                    setDollar(false);
                                }}>
                                All
                            </button>
                            <button className={`px-4 py-1 rounded-lg ${unread ? "bg-[#4361EE] text-white" :
                                "bg-white text-black"}`} onClick={() => {
                                    setUnread(true);
                                    setAll(false);
                                    setMessages(false);
                                    setDollar(false);
                                }}>
                                Unread
                            </button>
                            <button className={`px-4 py-1 rounded-lg ${messages ? "bg-[#4361EE] text-white" :
                                "bg-white text-black"}`} onClick={() => {
                                    setMessages(true);
                                    setUnread(false);
                                    setAll(false);
                                    setDollar(false);
                                }}>
                                <LuMessageCircle className="w-5 h-5" />
                            </button>
                            <button className={`px-4 py-1 rounded-lg ${dollar ? "bg-[#4361EE] text-white" :
                                "bg-white text-black"}`} onClick={() => {
                                    setDollar(true);
                                    setAll(false);
                                    setUnread(false);
                                    setMessages(false);
                                }}>
                                <FaDollarSign />
                            </button>
                        </div>
                    </div>
                    <div className="mt-3">
                        {
                            notificationsData.map(item => (
                                <NotificationCard key={item.id} title={item.title} from={item.from}
                                    description={item.description} />
                            ))
                        }
                    </div>
                    <div className="sticky bottom-0 bg-[#FFFFFF] flex justify-between px-6 py-3 z-50">
                        <button className="flex gap-2 items-center cursor-pointer">
                            <LuCircleCheckBig />
                            Mark all read
                        </button>
                        <button className="flex gap-2 items-center cursor-pointer">
                            <FiTrash2 className="text-[#E7000B]" />
                            Clear all
                        </button>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

// Inside a dropdown / modal → Use position: sticky
// Don't use position: fixed inside DropdownMenu


