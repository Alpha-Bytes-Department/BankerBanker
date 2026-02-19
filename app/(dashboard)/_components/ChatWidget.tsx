import { Send, Sparkles, X } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";

interface Message {
    role: "user" | "assistant" | "typing";
    content: string;
}

const ChatWidget = () => {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hi! How can I help?" }
    ]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // AI response generator
    const AIResponse = (text: string) => {
        // Add typing indicator
        setMessages(prev => [...prev, { role: "typing", content: "..." }]);

        setTimeout(() => {
            setMessages(prev => {
                // Remove typing indicator
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

        // Add user message
        const userText = input;
        setMessages(prev => [...prev, { role: "user", content: userText }]);
        setInput("");

        // Trigger AI simulation
        AIResponse(userText);
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className='button-primary fixed bottom-3 right-3 lg:bottom-5 lg:right-5 p-3 lg:p-4 rounded-full'
                title='chat'
            >
                <Sparkles className='lg:w-8 lg:h-8 text-white' />
            </button>

            {open && (
                <Card
                    className="fixed bottom-24 right-6 w-99 h-[450px] shadow-2xl rounded-xl border-[#E5E7EB] py-0 flex flex-col gap-0 bg-white"
                >
                    {/* Header */}
                    <div className="p-4 text-white bg-primary rounded-xl flex justify-between items-center">
                        <div className='flex items-center gap-2'>
                            <span className='bg-[#FFFFFF33] p-2 rounded-full'>
                                <Sparkles className='text-2xl' />
                            </span>
                            <div>
                                <h2>AI Assistant</h2>
                                <p className='text-sm'>Always here to help</p>
                            </div>
                        </div>
                        <button onClick={() => setOpen(false)}>
                            <X className="text-white" />
                        </button>
                    </div>

                    {/* Chat Body */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={
                                    msg.role === "user"
                                        ? "bg-primary text-white p-2 rounded-md w-fit ml-auto max-w-[80%]"
                                        : msg.role === "typing"
                                            ? "bg-gray-200 text-gray-700 p-2 rounded-md w-fit italic"
                                            : "bg-gray-100 p-2 rounded-md w-fit max-w-[80%]"
                                }
                            >
                                {msg.content}
                            </div>
                        ))}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Box */}
                    <form
                        className="p-3 border-t border-[#E5E7EB] flex gap-2"
                        onSubmit={handleSubmit}
                    >
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="w-full border border-[#00000000] focus:outline-[#00000000] bg-[#F3F3F5] rounded-md px-2 py-1"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button type="submit" className='button-primary p-2 rounded-lg cursor-pointer'>
                            <Send className='text-white' />
                        </button>
                    </form>
                </Card>
            )}
        </>
    );
};

export default ChatWidget;
