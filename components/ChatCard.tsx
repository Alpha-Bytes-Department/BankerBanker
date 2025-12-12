import React from 'react';
import { BsChat } from "react-icons/bs";
import Button from './Button';
import { Sparkles } from 'lucide-react';

type ChatCardProps = {
    type: "aiChat" | "message",
    link?: string
}


const CardTypes = {
    message : {
        title: "Your Broker",
        description: "Need information or support? Your AI is ready to chat anytime.",
        icon: <BsChat className='text-2xl'/>
    },
    aiChat: {
        title: "Assistant",
        description: "Whenever you need help, simply reach out—I am here for you.",
        icon: <Sparkles className='text-2xl'/>
    }
}

const ChatCard = ({
    type = "message"
}:ChatCardProps) => {
    return (
        <div className='flex flex-col gap-10 justify-between p-5 border border-[#0000001A] bg-[#F6FAFD] w-[344px] lg:w-[450px] rounded-xl'>
            <div className='flex gap-5'>
                <span>{CardTypes[type].icon}</span>
                <p className='text-lg'>{CardTypes[type].title}</p>
            </div>
            <p>{CardTypes[type].description}</p>
            <Button text='Start Chat'/>
        </div>
    );
};

export default ChatCard;