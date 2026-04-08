"use client"
import { Send, Sparkles, Bot, ChevronLeft, Plus, Trash2 } from 'lucide-react';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Card } from "@/components/ui/card";
import api from '@/Provider/api';
import ReactMarkdown from 'react-markdown';

interface Message {
    id?: number;
    role: "user" | "assistant" | "typing";
    content: string;
    created_at?: string;
}

interface Conversation {
    id: number;
    title: string;
    created_at: string;
    updated_at: string;
}

interface ApiConversationMessage {
    id: number;
    role: "user" | "assistant";
    content: string;
    created_at: string;
}

type View = "conversations" | "chat";

const AiChat = () => {
    const [view, setView] = useState<View>("conversations");
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchConversations = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get("/api/chatbot/conversations/");
            setConversations(res.data?.data || []);
        } catch (error) {
            console.error("Failed to fetch conversations", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    const openConversation = async (id: number) => {
        setLoading(true);
        setActiveConversationId(id);
        setView("chat");
        try {
            const res = await api.get(`/api/chatbot/conversations/${id}/messages/`);
            const loadedMessages: Message[] = (res.data?.data || []).map((message: ApiConversationMessage) => ({
                id: message.id,
                role: message.role,
                content: message.content,
                created_at: message.created_at,
            }));

            setMessages(loadedMessages);
        } catch (error) {
            console.error("Failed to load messages", error);
        } finally {
            setLoading(false);
        }
    };

    const startNewChat = () => {
        setView("chat");
        setActiveConversationId(null);
        setMessages([{ role: "assistant", content: "Hi! How can I help?" }]);
    };

    const handleBackToConversations = () => {
        setView("conversations");
        setActiveConversationId(null);
        setMessages([]);
        setInput("");
        fetchConversations();
    };

    const handleDeleteConversation = async (event: React.MouseEvent, id: number) => {
        event.stopPropagation();
        try {
            await api.delete(`/api/chatbot/conversations/${id}/`);
            setConversations((previous) => previous.filter((conversation) => conversation.id !== id));

            if (activeConversationId === id) {
                setActiveConversationId(null);
                setMessages([]);
                setView("conversations");
            }
        } catch (error) {
            console.error("Failed to delete conversation", error);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!input.trim() || sending) return;

        const userText = input.trim();
        setInput("");

        setMessages((previous) => [
            ...previous,
            { role: "user", content: userText },
            { role: "typing", content: "..." },
        ]);
        setSending(true);

        try {
            const body: { message: string; conversation_id?: number } = { message: userText };
            if (activeConversationId) {
                body.conversation_id = activeConversationId;
            }

            const res = await api.post("/api/chatbot/chat/", body);
            const data = res.data?.data;

            if (data?.conversation_id) {
                setActiveConversationId(data.conversation_id);
            }

            setMessages((previous) => [
                ...previous.filter((message) => message.role !== "typing"),
                {
                    role: "assistant",
                    content: data?.reply || "Sorry, I couldn't get a response.",
                },
            ]);
            fetchConversations();
        } catch (error) {
            console.error("Failed to send message", error);
            setMessages((previous) => [
                ...previous.filter((message) => message.role !== "typing"),
                {
                    role: "assistant",
                    content: "Something went wrong. Please try again.",
                },
            ]);
        } finally {
            setSending(false);
        }
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
                <div className='flex items-center gap-2'>
                    {view === "chat" ? (
                        <button
                            type="button"
                            className='text-xs px-2 py-1 rounded-lg border border-[#E5E7EB] hover:bg-[#F9FAFB]'
                            onClick={handleBackToConversations}
                        >
                            <span className='inline-flex items-center gap-1'>
                                <ChevronLeft className='w-3.5 h-3.5' />
                                History
                            </span>
                        </button>
                    ) : (
                        <button
                            type="button"
                            className='text-xs px-2 py-1 rounded-lg border border-[#E5E7EB] hover:bg-[#F9FAFB]'
                            onClick={startNewChat}
                        >
                            <span className='inline-flex items-center gap-1'>
                                <Plus className='w-3.5 h-3.5' />
                                New Chat
                            </span>
                        </button>
                    )}
                    <span className='flex items-center gap-1 text-xs text-green-500 font-medium'>
                        <span className='w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse'></span>
                        Online
                    </span>
                </div>
            </div>

            {view === "conversations" ? (
                <div className="flex-1 p-2 sm:p-3 overflow-y-auto min-h-0">
                    {loading ? (
                        <p className="text-center text-sm text-gray-400 mt-8">Loading conversations...</p>
                    ) : conversations.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center gap-3 text-gray-500 px-4">
                            <p className="text-sm">No conversations yet.</p>
                            <button
                                type="button"
                                onClick={startNewChat}
                                className="button-primary px-4 py-2 rounded-xl text-sm"
                            >
                                Start a chat
                            </button>
                        </div>
                    ) : (
                        <ul className="divide-y divide-[#E5E7EB]">
                            {conversations.map((conversation) => (
                                <li
                                    key={conversation.id}
                                    className="py-3 px-2 flex items-center justify-between gap-3 hover:bg-[#FAFAFA] rounded-lg cursor-pointer"
                                    onClick={() => openConversation(conversation.id)}
                                >
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-[#111827] truncate">
                                            {conversation.title || "Untitled conversation"}
                                        </p>
                                        <p className="text-xs text-[#6B7280] mt-0.5">
                                            {new Date(conversation.updated_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        className="text-[#E7000B] p-1 rounded hover:bg-[#FFF1F2]"
                                        onClick={(event) => handleDeleteConversation(event, conversation.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ) : (
                <>
                    {/* Chat Body */}
                    <div className="flex-1 p-2 sm:p-3 overflow-y-auto space-y-2 sm:space-y-3 min-h-0">
                        {loading ? (
                            <p className="text-center text-sm text-gray-400 mt-8">Loading messages...</p>
                        ) : messages.length === 0 ? (
                            <p className="text-center text-sm text-gray-400 mt-8">Send a message to get started.</p>
                        ) : (
                            messages.map((msg, index) => (
                                <div key={`${msg.id || index}-${msg.role}`} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.role !== 'user' && (
                                        <span className='w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5'>
                                            <Bot className='w-3 h-3 sm:w-4 sm:h-4 text-primary' />
                                        </span>
                                    )}
                                    <div
                                        className={
                                            msg.role === "user"
                                                ? "bg-primary text-white px-3 py-2 rounded-2xl rounded-tr-sm text-sm max-w-[75%] sm:max-w-[80%] wrap-break-word"
                                                : msg.role === "typing"
                                                    ? "bg-gray-100 text-gray-500 px-3 py-2 rounded-2xl rounded-tl-sm text-sm italic"
                                                    : "bg-gray-100 text-[#0A0A0A] px-3 py-2 rounded-2xl rounded-tl-sm text-sm max-w-[75%] sm:max-w-[80%] wrap-break-word prose prose-sm"
                                        }
                                    >
                                        {msg.role === "assistant" ? <ReactMarkdown>{msg.content}</ReactMarkdown> : msg.content}
                                    </div>
                                </div>
                            ))
                        )}
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
                            onChange={(event) => setInput(event.target.value)}
                            disabled={sending}
                        />
                        <button
                            type="submit"
                            disabled={sending}
                            className='button-primary flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl cursor-pointer shrink-0 text-sm font-medium disabled:opacity-50'
                        >
                            <Send className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-white' />
                            <span className='hidden xs:inline sm:inline'>Ask AI</span>
                        </button>
                    </form>
                </>
            )}
        </Card>
    );
};

export default AiChat;
