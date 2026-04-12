"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import StatusCard from "@/components/StatusCard";
import LoanRequestCard from "../loan-requests/_components/LoanRequestCard";
import { fetchLenderCombinedData } from "../_utils/lenderLoanData";
import { LoanRequestData } from "@/types/loan-request";
import api from "@/Provider/api";
import {
  getSubmitQuotePath,
  saveLoanQuotePrefillState,
} from "@/lib/quote-submit-state";
import { RefreshCw, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

type AssistantMessage = {
  role: "user" | "assistant" | "typing";
  content: string;
};

type ApiEnvelope<T> = {
  data?: T;
};

type LenderDashboardHeaderStats = {
  active_requests: number;
  quotes_provided: number;
  pending_review: number;
  accepted_quotes: number;
};

const DEFAULT_HEADER_STATS: LenderDashboardHeaderStats = {
  active_requests: 0,
  quotes_provided: 0,
  pending_review: 0,
  accepted_quotes: 0,
};

const Page = () => {
  const router = useRouter();
  const [requests, setRequests] = useState<LoanRequestData[]>([]);
  const [headerStats, setHeaderStats] =
    useState<LenderDashboardHeaderStats>(DEFAULT_HEADER_STATS);
  const [loading, setLoading] = useState(true);
  const [assistantStarted, setAssistantStarted] = useState(false);
  const [assistantConversationId, setAssistantConversationId] = useState<
    number | null
  >(null);
  const [assistantMessages, setAssistantMessages] = useState<
    AssistantMessage[]
  >([]);
  const [assistantInput, setAssistantInput] = useState("");
  const [assistantSending, setAssistantSending] = useState(false);
  const assistantScrollRef = useRef<HTMLDivElement>(null);
  const assistantEndRef = useRef<HTMLDivElement>(null);

  const scrollAssistantToLatest = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      assistantEndRef.current?.scrollIntoView({
        behavior,
        block: "end",
      });

      const container = assistantScrollRef.current;
      if (!container) return;

      container.scrollTo({
        top: container.scrollHeight,
        behavior,
      });
    },
    [],
  );

  const loadDashboardData = useCallback(async () => {
    setLoading(true);

    try {
      const data = await fetchLenderCombinedData();
      setRequests(data.loanRequests);

      try {
        const headerResponse = await api.get<
          ApiEnvelope<LenderDashboardHeaderStats>
        >("/api/dashboard/lender/");

        setHeaderStats({
          ...DEFAULT_HEADER_STATS,
          ...(headerResponse.data?.data || {}),
        });
      } catch (headerError) {
        console.error(
          "Failed to load lender dashboard header stats",
          headerError,
        );
        setHeaderStats(DEFAULT_HEADER_STATS);
      }
    } catch (error) {
      console.error("Failed to load lender dashboard requests", error);
      toast.error("Unable to load available loan requests right now.");
      setRequests([]);
      setHeaderStats(DEFAULT_HEADER_STATS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const topRequests = useMemo(() => requests.slice(0, 4), [requests]);

  const handleSubmitQuote = (id: number) => {
    const selectedRequest = requests.find((request) => request.id === id);

    if (selectedRequest) {
      saveLoanQuotePrefillState(id, {
        requestId: selectedRequest.id,
        propertyName: selectedRequest.propertyName,
        propertyAddress: selectedRequest.address,
        propertyType: selectedRequest.propertyType,
        requestedAmount: selectedRequest.requestedAmount,
        loanTerm: Number.parseInt(selectedRequest.loanTerm, 10) || 0,
        ltv: selectedRequest.ltv,
        occupancy: selectedRequest.occupancy,
        yearBuilt: selectedRequest.yearBuilt,
        propertyImageUrl: selectedRequest.propertyImage,
      });
    }

    router.push(getSubmitQuotePath(id));
  };

  const handleViewDetails = (id: number) => {
    router.push(`/loan-requests/${id}`);
  };

  const startAssistantChat = () => {
    setAssistantStarted(true);
    if (assistantMessages.length === 0) {
      setAssistantMessages([
        {
          role: "assistant",
          content:
            "Hi! I am your AI assistant. Ask me about loan terms, property summaries, or quote strategy.",
        },
      ]);
    }

    requestAnimationFrame(() => {
      scrollAssistantToLatest("auto");
    });
  };

  const resetAssistantChat = () => {
    setAssistantConversationId(null);
    setAssistantInput("");
    setAssistantMessages([
      {
        role: "assistant",
        content: "Started a new chat. What would you like to discuss?",
      },
    ]);

    requestAnimationFrame(() => {
      scrollAssistantToLatest("auto");
    });
  };

  const handleAssistantSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (!assistantInput.trim() || assistantSending) return;

    const prompt = assistantInput.trim();
    setAssistantInput("");
    setAssistantSending(true);

    setAssistantMessages((previous) => [
      ...previous,
      { role: "user", content: prompt },
      { role: "typing", content: "..." },
    ]);

    try {
      const payload: { message: string; conversation_id?: number } = {
        message: prompt,
      };

      if (assistantConversationId) {
        payload.conversation_id = assistantConversationId;
      }

      const response = await api.post("/api/chatbot/chat/", payload);
      const reply = response.data?.data?.reply;
      const conversationId = response.data?.data?.conversation_id;

      if (conversationId) {
        setAssistantConversationId(conversationId);
      }

      setAssistantMessages((previous) => [
        ...previous.filter((message) => message.role !== "typing"),
        {
          role: "assistant",
          content:
            reply || "I could not generate a response. Please try again.",
        },
      ]);
    } catch (error) {
      console.error("Failed to send assistant message", error);
      setAssistantMessages((previous) => [
        ...previous.filter((message) => message.role !== "typing"),
        {
          role: "assistant",
          content:
            "Something went wrong while contacting the assistant. Please try again.",
        },
      ]);
    } finally {
      setAssistantSending(false);
    }
  };

  useEffect(() => {
    if (!assistantStarted) return;

    requestAnimationFrame(() => {
      scrollAssistantToLatest("smooth");
    });
  }, [assistantMessages, assistantStarted, scrollAssistantToLatest]);

  return (
    <div>
      <h1 className="text-xl lg:text-2xl my-2">Lender Dashboard</h1>
      <p className="text-[#4A5565] my-2">
        Review opportunities, submit quotes, and manage lender activity.
      </p>

      <div className="flex flex-wrap items-center justify-center xl:justify-start gap-5 lg:gap-7 xl:gap-10 my-10">
        <StatusCard
          type="Properties"
          data={{
            value: headerStats.active_requests,
            status: headerStats.active_requests,
          }}
          titleOverride="Active Requests"
          statusLabelOverride="currently active"
        />
        <StatusCard
          type="quotes"
          data={{
            value: headerStats.quotes_provided,
            status: headerStats.quotes_provided,
          }}
          titleOverride="Quotes Provided"
          statusLabelOverride="submitted quotes"
        />
        <StatusCard
          type="documents"
          data={{
            value: headerStats.pending_review,
            status: headerStats.pending_review,
          }}
          titleOverride="Pending Review"
          statusLabelOverride="awaiting decision"
        />
        <StatusCard
          type="value"
          data={{
            value: headerStats.accepted_quotes,
            status: headerStats.accepted_quotes,
          }}
          titleOverride="Accepted Quotes"
          statusLabelOverride="approved quotes"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <div className="xl:col-span-3 rounded-xl bg-white p-3 lg:p-5 border border-[#0000001A]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg">Available Loan Requests</h2>
              <p className="text-[#6A7282]">
                Active opportunities seeking quotes
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/loan-requests")}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              View All
            </button>
          </div>

          <div className="my-6 flex flex-col gap-5">
            {loading ? (
              Array.from({ length: 2 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-64 rounded-lg border border-gray-200 bg-gray-50 animate-pulse"
                />
              ))
            ) : topRequests.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-600">
                No loan requests available.
              </div>
            ) : (
              topRequests.map((request) => (
                <LoanRequestCard
                  key={request.id}
                  loanRequest={request}
                  onSubmitQuote={handleSubmitQuote}
                  onViewDetails={handleViewDetails}
                  onViewDocuments={() => {}}
                />
              ))
            )}
          </div>

          {!loading && topRequests.length > 0 ? (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => router.push("/loan-requests")}
                className="rounded-full border border-blue-200 px-6 py-2 text-sm text-blue-700 hover:bg-blue-50 transition-colors"
              >
                See More
              </button>
            </div>
          ) : null}
        </div>

        <div className="xl:col-span-2">
          <div className="h-[72vh] min-h-[560px] max-h-[820px] xl:h-[760px] rounded-3xl border border-[#0000001A] bg-[#F2F5F8] p-5 md:p-6 flex flex-col gap-4 overflow-hidden">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center">
                  <Sparkles className="h-7 w-7 text-black" />
                </div>
                <h3 className="text-xl text-black">AI Assistant</h3>
              </div>

              {assistantStarted ? (
                <button
                  type="button"
                  onClick={resetAssistantChat}
                  className="inline-flex items-center gap-1 rounded-full border border-[#D5D8DE] bg-white px-3 py-1.5 text-xs text-[#1F56AA] hover:bg-[#EEF4FF]"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  New
                </button>
              ) : null}
            </div>

            {!assistantStarted ? (
              <>
                <p className="text-base leading-7 text-black flex-1">
                  I can help analyze documents, generate property summaries, and
                  answer questions about your portfolio.
                </p>

                <button
                  type="button"
                  onClick={startAssistantChat}
                  className="w-full rounded-full bg-[#1F56AA] px-5 py-3 text-base text-white hover:bg-[#194a93] transition-colors"
                >
                  Start Chat
                </button>
              </>
            ) : (
              <>
                <div
                  ref={assistantScrollRef}
                  className="flex-1 min-h-0 overflow-y-auto scroll-smooth rounded-2xl border border-[#D9DEE8] bg-white p-3 space-y-3"
                >
                  {assistantMessages.map((message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={
                        message.role === "user"
                          ? "ml-auto max-w-[90%] rounded-xl bg-[#1F56AA] px-3 py-2 text-sm text-white"
                          : message.role === "typing"
                            ? "max-w-[90%] rounded-xl bg-[#EEF1F6] px-3 py-2 text-sm text-[#6A7282] italic animate-pulse"
                            : "max-w-[90%] rounded-xl bg-[#EEF1F6] px-3 py-2 text-sm text-[#111827]"
                      }
                    >
                      {message.role === "assistant" ? (
                        <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-headings:my-1">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      ) : (
                        message.content
                      )}
                    </div>
                  ))}
                  <div ref={assistantEndRef} />
                </div>

                <form
                  onSubmit={handleAssistantSubmit}
                  className="rounded-2xl border border-[#D9DEE8] bg-white p-2 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={assistantInput}
                    onChange={(event) => setAssistantInput(event.target.value)}
                    placeholder="Ask about this portfolio..."
                    className="flex-1 bg-transparent px-2 py-2 text-sm outline-none"
                    disabled={assistantSending}
                  />
                  <button
                    type="submit"
                    disabled={assistantSending || !assistantInput.trim()}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1F56AA] text-white disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
