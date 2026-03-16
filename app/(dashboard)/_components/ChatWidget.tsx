"use client";
import { Send, Sparkles, X, Trash2, ChevronLeft, Plus } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import api from "@/Provider/api";
import ReactMarkdown from "react-markdown";

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

type View = "conversations" | "chat";

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("conversations");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<
    number | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch conversations list
  const fetchConversations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/chatbot/conversations/");
      setConversations(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch conversations", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load conversations when widget opens
  useEffect(() => {
    if (open && view === "conversations") {
      fetchConversations();
    }
  }, [open, view, fetchConversations]);

  // Load message history for a conversation
  const openConversation = async (id: number) => {
    setLoading(true);
    setActiveConversationId(id);
    setView("chat");
    try {
      const res = await api.get(`/api/chatbot/conversations/${id}/messages/`);
      const msgs: Message[] = (res.data?.data || []).map((m: any) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        created_at: m.created_at,
      }));
      setMessages(msgs);
    } catch (err) {
      console.error("Failed to load messages", err);
    } finally {
      setLoading(false);
    }
  };

  // Start a brand-new conversation (no conversation_id on first message)
  const startNewChat = () => {
    setActiveConversationId(null);
    setMessages([]);
    setView("chat");
  };

  // Send message
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userText = input.trim();
    setInput("");

    // Optimistically add user message + typing indicator
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userText },
      { role: "typing", content: "..." },
    ]);
    setSending(true);

    try {
      const body: { message: string; conversation_id?: number } = {
        message: userText,
      };
      if (activeConversationId) {
        body.conversation_id = activeConversationId;
      }

      const res = await api.post("/api/chatbot/chat/", body);
      const data = res.data?.data;

      // Persist conversation id for follow-ups
      if (data?.conversation_id) {
        setActiveConversationId(data.conversation_id);
      }

      setMessages((prev) => [
        ...prev.filter((m) => m.role !== "typing"),
        {
          role: "assistant",
          content: data?.reply || "Sorry, I couldn't get a response.",
        },
      ]);
    } catch (err) {
      console.error("Failed to send message", err);
      setMessages((prev) => [
        ...prev.filter((m) => m.role !== "typing"),
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  // Delete a conversation
  const handleDeleteConversation = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      await api.delete(`/api/chatbot/conversations/${id}/`);
      setConversations((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to delete conversation", err);
    }
  };

  const handleBack = () => {
    setView("conversations");
    setActiveConversationId(null);
    setMessages([]);
    fetchConversations(); // refresh list in case title was updated
  };

  const handleClose = () => {
    setOpen(false);
    setView("conversations");
    setActiveConversationId(null);
    setMessages([]);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="button-primary fixed bottom-3 right-3 lg:bottom-5 lg:right-5 p-3 lg:p-4 rounded-full"
        title="chat"
      >
        <Sparkles className="lg:w-8 lg:h-8 text-white" />
      </button>

      {open && (
        <Card className="fixed bottom-24 right-6 w-99 h-[450px] shadow-2xl rounded-xl border-[#E5E7EB] py-0 flex flex-col gap-0 bg-white overflow-hidden">
          {/* Header */}
          <div className="p-4 text-white bg-primary rounded-t-xl flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              {view === "chat" && (
                <button onClick={handleBack} className="mr-1">
                  <ChevronLeft className="text-white w-5 h-5" />
                </button>
              )}
              <span className="bg-[#FFFFFF33] p-2 rounded-full">
                <Sparkles className="text-2xl" />
              </span>
              <div>
                <h2>AI Assistant</h2>
                <p className="text-sm">Always here to help</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {view === "conversations" && (
                <button
                  onClick={startNewChat}
                  title="New chat"
                  className="bg-[#FFFFFF33] p-1.5 rounded-full"
                >
                  <Plus className="text-white w-4 h-4" />
                </button>
              )}
              <button onClick={handleClose}>
                <X className="text-white" />
              </button>
            </div>
          </div>

          {/* Conversations List View */}
          {view === "conversations" && (
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <p className="text-center text-sm text-gray-400 mt-10">
                  Loading...
                </p>
              ) : conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
                  <p className="text-sm">No conversations yet.</p>
                  <button
                    onClick={startNewChat}
                    className="button-primary text-white text-sm px-4 py-2 rounded-lg"
                  >
                    Start a chat
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-[#E5E7EB]">
                  {conversations.map((conv) => (
                    <li
                      key={conv.id}
                      onClick={() => openConversation(conv.id)}
                      className="flex justify-between items-center px-4 py-3 hover:bg-gray-50 cursor-pointer group"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#101828] truncate">
                          {conv.title || "Untitled conversation"}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(conv.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteConversation(e, conv.id)}
                        className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4 text-[#E7000B]" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Chat View */}
          {view === "chat" && (
            <>
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {loading ? (
                  <p className="text-center text-sm text-gray-400 mt-10">
                    Loading messages...
                  </p>
                ) : messages.length === 0 ? (
                  <p className="text-center text-sm text-gray-400 mt-10">
                    Send a message to get started.
                  </p>
                ) : (
                  messages.map((msg, i) => (
                    <div
                      key={i}
                      className={
                        msg.role === "user"
                          ? "bg-primary text-white p-2 rounded-md w-fit ml-auto max-w-[80%] text-sm"
                          : msg.role === "typing"
                            ? "bg-gray-200 text-gray-500 p-2 rounded-md w-fit italic text-sm animate-pulse"
                            : "bg-gray-100 p-2 rounded-md w-fit max-w-[80%] text-sm prose prose-sm"
                      }
                    >
                      {msg.role === "assistant" ? (
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      ) : (
                        msg.content
                      )}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form
                className="p-3 border-t border-[#E5E7EB] flex gap-2 shrink-0"
                onSubmit={handleSubmit}
              >
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="w-full border-0 focus:outline-none bg-[#F3F3F5] rounded-md px-2 py-1 text-sm"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="button-primary p-2 rounded-lg cursor-pointer disabled:opacity-50"
                >
                  <Send className="text-white w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </Card>
      )}
    </>
  );
};

export default ChatWidget;
