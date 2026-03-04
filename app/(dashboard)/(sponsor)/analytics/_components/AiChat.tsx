"use client"
import { Send, Sparkles, Bot } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";

interface Message {
    role: "user" | "assistant" | "typing";
    content: string;
}

const AiChat = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hi! How can I help?" }
    ]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const AIResponse = (text: string) => {
        setMessages(prev => [...prev, { role: "typing", content: "..." }]);

        setTimeout(() => {
            setMessages(prev => {
                const removeTyping = prev.filter(m => m.role !== "typing");
                return [
                    ...removeTyping,
                    {
                        role: "assistant",
                        content: `You said: "${text}". How else can I help you?`
                    }
                ];
            });
        }, 1200);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        const userText = input;
        setMessages(prev => [...prev, { role: "user", content: userText }]);
        setInput("");
        AIResponse(userText);
    };

    return (
        <Card className="rounded-xl border border-[#E5E7EB] py-0 h-[50vh] sm:h-[55vh] lg:h-[calc(90vh-1rem)] flex flex-col gap-0 bg-white w-full">
            {/* Header */}
            <div className="px-3 py-3 sm:px-4 sm:py-4 border-b border-[#E5E7EB] flex justify-between items-center shrink-0">
                <div className='flex items-center gap-2'>
                    <span className='bg-primary/10 p-1.5 sm:p-2 rounded-full'>
                        <Sparkles className='w-4 h-4 sm:w-5 sm:h-5 text-primary' />
                    </span>
                    <div>
                        <h2 className='text-sm sm:text-base font-semibold leading-tight'>AI Assistant</h2>
                        <p className='text-xs text-[#6A7282]'>Always here to help</p>
                    </div>
                </div>
                <span className='flex items-center gap-1 text-xs text-green-500 font-medium'>
                    <span className='w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse'></span>
                    Online
                </span>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-2 sm:p-3 overflow-y-auto space-y-2 sm:space-y-3 min-h-0">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role !== 'user' && (
                            <span className='w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5'>
                                <Bot className='w-3 h-3 sm:w-4 sm:h-4 text-primary' />
                            </span>
                        )}
                        <div
                            className={
                                msg.role === "user"
                                    ? "bg-primary text-white px-3 py-2 rounded-2xl rounded-tr-sm text-sm max-w-[75%] sm:max-w-[80%] break-words"
                                    : msg.role === "typing"
                                        ? "bg-gray-100 text-gray-500 px-3 py-2 rounded-2xl rounded-tl-sm text-sm italic"
                                        : "bg-gray-100 text-[#0A0A0A] px-3 py-2 rounded-2xl rounded-tl-sm text-sm max-w-[75%] sm:max-w-[80%] break-words"
                            }
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Box */}
            <form
                className="p-2 sm:p-3 border-t border-[#E5E7EB] flex gap-2 shrink-0"
                onSubmit={handleSubmit}
            >
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 min-w-0 border border-transparent focus:outline-none focus:border-primary/30 bg-[#F3F3F5] rounded-xl px-3 py-2 text-sm transition-colors"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button
                    type="submit"
                    className='button-primary flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl cursor-pointer shrink-0 text-sm font-medium'
                >
                    <Send className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-white' />
                    <span className='hidden xs:inline sm:inline'>Ask AI</span>
                </button>
            </form>
        </Card>
    );
};

export default AiChat;
