"use client"
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import MessageText from "./_components/MessageText";
import MessageList from "./_components/messageList";




const Page = () => {
    const [selectedMessageId, setSelectedMessageId] = useState<string | number | null>(null);

    return (
        <div className="flex gap-5">
            <MessageList selectedMessageId={selectedMessageId} setSelectedMessageId={setSelectedMessageId}/>
            {selectedMessageId == null ? <div className="flex flex-col gap-5 p-5 flex-1 border border-[#0000001A] rounded-lg h-[90vh]">
                <div className="flex flex-col justify-center items-center border-[#E5E7EB] my-auto">
                    <MessageSquare size={62} stroke="#99A1AF" />
                    <p className="text-[#4A5565]">No conversation selected</p>
                    <p className="text-[#6A7282]">Select a conversation from the list to view and send messages to lenders</p>
                </div>
            </div>:<MessageText selectedMessageId={selectedMessageId} setSelectedMessageId={setSelectedMessageId}/>}
            
        </div>
    );
};

export default Page;