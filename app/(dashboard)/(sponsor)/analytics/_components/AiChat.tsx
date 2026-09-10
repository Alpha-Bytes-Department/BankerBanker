"use client";

import {
  Send,
  Sparkles,
  Bot,
  ChevronLeft,
  Plus,
  Trash2,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchChatSessions,
  fetchChatMessages,
  sendChatMessage,
  deleteChatSession,
} from "../_api/analytics-api";
import type { ChatSession, ChatMessage } from "./docview-types";
import { toast } from "sonner";

type View = "sessions" | "chat";

interface AiChatProps {
  propertyId: number | null;
}

const AiChat = ({ propertyId }: AiChatProps) => {
  const queryClient = useQueryClient();
  const [view, setView] = useState<View>("sessions");
  const [input, setInput] = useState("");
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);

  // Local optimistic messages state when actively chatting
  const [optimisticMessages, setOptimisticMessages] = useState<ChatMessage[]>(
    [],
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ─── Reset state whenever selected property changes ───
  useEffect(() => {
    setView("sessions");
    setActiveSessionId(null);
    setOptimisticMessages([]);
    setInput("");
  }, [propertyId]);

  // ─── Query 1: Fetch Chat Sessions with TanStack Query ───
  const {
    data: sessions = [],
    isLoading: sessionsLoading,
    refetch: refetchSessions,
  } = useQuery({
    queryKey: ["property-chat-sessions", propertyId],
    queryFn: () => (propertyId ? fetchChatSessions(propertyId) : Promise.resolve([])),
    enabled: Boolean(propertyId),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // ─── Query 2: Fetch Messages in Active Session ───
  const {
    data: sessionMessages = [],
    isLoading: messagesLoading,
  } = useQuery({
    queryKey: ["property-chat-messages", propertyId, activeSessionId],
    queryFn: () =>
      propertyId && activeSessionId
        ? fetchChatMessages(propertyId, activeSessionId)
        : Promise.resolve([]),
    enabled: Boolean(propertyId && activeSessionId),
    staleTime: 1000 * 60 * 5,
  });

  // Combine server messages with optimistic messages
  const displayMessages: ChatMessage[] = activeSessionId
    ? optimisticMessages.length > 0
      ? optimisticMessages
      : sessionMessages
    : optimisticMessages;

  useEffect(() => {
    if (sessionMessages.length > 0 && optimisticMessages.length === 0) {
      setOptimisticMessages(sessionMessages);
    }
  }, [sessionMessages, optimisticMessages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayMessages]);

  // ─── Mutation 1: Send Message ───
  const sendMessageMutation = useMutation({
    mutationFn: async ({
      text,
      sessionId,
    }: {
      text: string;
      sessionId?: number | null;
    }) => {
      if (!propertyId) throw new Error("No property selected");
      return sendChatMessage(propertyId, text, sessionId);
    },
    onSuccess: (data) => {
      const returnedSessionId = data.session_id || activeSessionId;
      if (returnedSessionId && returnedSessionId !== activeSessionId) {
        setActiveSessionId(returnedSessionId);
      }

      setOptimisticMessages((prev) => [
        ...prev.filter((m) => m.role !== "typing"),
        {
          role: "assistant",
          content: data.reply || "I couldn't generate a response.",
          created_at: new Date().toISOString(),
        },
      ]);

      // Invalidate queries so session list and message cache are updated
      queryClient.invalidateQueries({
        queryKey: ["property-chat-sessions", propertyId],
      });
      if (returnedSessionId) {
        queryClient.invalidateQueries({
          queryKey: ["property-chat-messages", propertyId, returnedSessionId],
        });
      }
    },
    onError: (err: any) => {
      console.error("Failed to send chat message", err);
      const status = err?.response?.status;
      let errorText = "Something went wrong. Please try again.";
      if (status === 503) {
        errorText = "AI service is temporarily busy. Please try again in a moment.";
      } else if (status === 403) {
        errorText = "You do not have permission to access this chat.";
      }

      setOptimisticMessages((prev) => [
        ...prev.filter((m) => m.role !== "typing"),
        {
          role: "assistant",
          content: errorText,
          created_at: new Date().toISOString(),
        },
      ]);
      toast.error(errorText);
    },
  });

  // ─── Mutation 2: Delete Session ───
  const deleteSessionMutation = useMutation({
    mutationFn: async (sessionId: number) => {
      if (!propertyId) return;
      return deleteChatSession(propertyId, sessionId);
    },
    onSuccess: (_, deletedSessionId) => {
      queryClient.setQueryData(
        ["property-chat-sessions", propertyId],
        (old: ChatSession[] | undefined) =>
          old ? old.filter((s) => s.id !== deletedSessionId) : [],
      );
      queryClient.removeQueries({
        queryKey: ["property-chat-messages", propertyId, deletedSessionId],
      });
      if (activeSessionId === deletedSessionId) {
        setActiveSessionId(null);
        setOptimisticMessages([]);
        setView("sessions");
      }
      toast.success("Chat session deleted");
    },
    onError: (err) => {
      console.error("Failed to delete chat session", err);
      toast.error("Failed to delete chat session");
    },
  });

  // ─── Handlers ───
  const openSession = (session: ChatSession) => {
    setActiveSessionId(session.id);
    setOptimisticMessages([]);
    setView("chat");
  };

  const startNewChat = () => {
    setActiveSessionId(null);
    setOptimisticMessages([
      {
        role: "assistant",
        content:
          "Hi! I can analyze and answer questions regarding this property's files and documents. What would you like to inquire about?",
        created_at: new Date().toISOString(),
      },
    ]);
    setView("chat");
  };

  const handleBackToSessions = () => {
    setView("sessions");
    setActiveSessionId(null);
    setOptimisticMessages([]);
    setInput("");
    refetchSessions();
  };

  const handleDeleteSession = (
    event: React.MouseEvent,
    sessionId: number,
  ) => {
    event.stopPropagation();
    deleteSessionMutation.mutate(sessionId);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim() || sendMessageMutation.isPending || !propertyId) return;

    const userText = input.trim();
    setInput("");

    setOptimisticMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userText,
        created_at: new Date().toISOString(),
      },
      {
        role: "typing",
        content: "...",
      },
    ]);

    sendMessageMutation.mutate({
      text: userText,
      sessionId: activeSessionId,
    });
  };

  // ─── Empty state: No property selected ───
  if (!propertyId) {
    return (
      <Card className="rounded-xl border border-[#E5E7EB] py-0 h-[50vh] sm:h-[55vh] lg:h-[calc(90vh-1rem)] flex flex-col gap-0 bg-white w-full shadow-2xs">
        <div className="px-3 py-3 sm:px-4 sm:py-4 border-b border-[#E5E7EB] flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <span className="bg-primary/10 p-2 rounded-lg text-primary">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-semibold leading-tight text-gray-900">
                AI Assistant
              </h2>
              <p className="text-xs text-[#6A7282]">Property document chat</p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
          <span className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
            <MessageSquare className="w-8 h-8 text-primary/50" />
          </span>
          <p className="text-sm font-medium text-[#4A5565]">
            No property selected
          </p>
          <p className="text-xs text-[#6A7282] max-w-xs">
            Select a property from the list below to begin chatting and asking questions about its documents.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl border border-[#E5E7EB] py-0 h-[50vh] sm:h-[55vh] lg:h-[calc(90vh-1rem)] flex flex-col gap-0 bg-white w-full shadow-2xs">
      {/* Header */}
      <div className="px-3 py-3 sm:px-4 sm:py-3.5 border-b border-[#E5E7EB] flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="bg-primary/10 p-2 rounded-lg text-primary">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          </span>
          <div>
            <h2 className="text-sm sm:text-base font-semibold leading-tight text-gray-900">
              AI Assistant
            </h2>
            <p className="text-xs text-[#6A7282]">
              Property #{propertyId}{" "}
              {activeSessionId ? `• Session #${activeSessionId}` : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {view === "chat" ? (
            <button
              type="button"
              className="text-xs px-2.5 py-1.5 rounded-lg border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors flex items-center gap-1 font-medium text-gray-700"
              onClick={handleBackToSessions}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>History</span>
            </button>
          ) : (
            <button
              type="button"
              className="text-xs px-2.5 py-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors flex items-center gap-1 font-medium shadow-2xs"
              onClick={startNewChat}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Chat</span>
            </button>
          )}
          <span className="flex items-center gap-1 text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            Online
          </span>
        </div>
      </div>

      {/* Sessions list view */}
      {view === "sessions" ? (
        <div className="flex-1 p-2 sm:p-3 overflow-y-auto min-h-0">
          <div className="flex items-center justify-between px-2 py-1 mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Chat History ({sessions.length})
            </span>
            <button
              type="button"
              onClick={() => refetchSessions()}
              className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
              title="Refresh sessions"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {sessionsLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-sm text-gray-400">
              <RefreshCw className="w-4 h-4 animate-spin text-primary" />
              <p>Loading sessions...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-3 text-gray-500 px-4 py-8">
              <MessageSquare className="w-8 h-8 text-gray-300" />
              <p className="text-sm">No chat sessions yet for this property.</p>
              <button
                type="button"
                onClick={startNewChat}
                className="bg-primary text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-medium hover:bg-primary/90 transition-colors shadow-2xs"
              >
                Start a new chat
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-[#E5E7EB]">
              {sessions.map((session) => (
                <li
                  key={session.id}
                  className="py-3 px-3 flex items-center justify-between gap-3 hover:bg-[#F9FAFB] rounded-xl cursor-pointer transition-colors group"
                  onClick={() => openSession(session)}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#111827] truncate group-hover:text-primary transition-colors">
                      {session.title || "Document Discussion"}
                    </p>
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      {new Date(session.updated_at || session.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    title="Delete session"
                    className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 shrink-0 transition-colors"
                    onClick={(e) => handleDeleteSession(e, session.id)}
                    disabled={deleteSessionMutation.isPending}
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
          {/* Chat body */}
          <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 min-h-0">
            {messagesLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2 text-sm text-gray-400">
                <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                <p>Loading messages...</p>
              </div>
            ) : displayMessages.length === 0 ? (
              <p className="text-center text-sm text-gray-400 mt-8">
                Send a question below to analyze this property&apos;s files.
              </p>
            ) : (
              displayMessages.map((msg, index) => (
                <div
                  key={`${msg.id ?? index}-${msg.role}`}
                  className={`flex gap-2.5 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role !== "user" && (
                    <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 text-primary">
                      <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </span>
                  )}
                  <div
                    className={
                      msg.role === "user"
                        ? "bg-primary text-white px-3.5 py-2.5 rounded-2xl rounded-tr-xs text-xs sm:text-sm max-w-[80%] break-words shadow-2xs"
                        : msg.role === "typing"
                          ? "bg-gray-100 text-gray-500 px-3.5 py-2.5 rounded-2xl rounded-tl-xs text-xs sm:text-sm italic"
                          : "bg-gray-100 text-gray-900 px-3.5 py-2.5 rounded-2xl rounded-tl-xs text-xs sm:text-sm max-w-[85%] break-words prose prose-sm"
                    }
                  >
                    {msg.role === "assistant" ? (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input box */}
          <form
            className="p-2.5 sm:p-3 border-t border-[#E5E7EB] flex gap-2 shrink-0 bg-white"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="Ask about this property's documents..."
              className="flex-1 min-w-0 border border-gray-200 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/40 bg-[#F9FAFB] rounded-xl px-3.5 py-2 text-xs sm:text-sm transition-all"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={sendMessageMutation.isPending}
            />
            <button
              type="submit"
              disabled={sendMessageMutation.isPending || !input.trim()}
              className="bg-primary text-white flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 rounded-xl cursor-pointer shrink-0 text-xs sm:text-sm font-medium disabled:opacity-50 hover:bg-primary/90 transition-colors shadow-2xs"
            >
              {sendMessageMutation.isPending ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              )}
              <span className="hidden xs:inline sm:inline">Ask AI</span>
            </button>
          </form>
        </>
      )}
    </Card>
  );
};

export default AiChat;
