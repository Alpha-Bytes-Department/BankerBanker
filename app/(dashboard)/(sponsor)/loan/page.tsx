"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FaPlus } from "react-icons/fa6";
import { LuDollarSign } from "react-icons/lu";

import LoanCard from "./_components/LoanCard";
import StatusCard from "@/components/StatusCard";
import Comparison from "./_components/Comparison";
import ConfirmActionModal from "@/components/ConfirmActionModal";
import api from "@/Provider/api";
import { toast } from "sonner";
import type {
  LoanQuote,
  SponsorLoanDashboardData,
  SponsorLoanHeaderStats,
} from "./_components/loan-types";

import {
  fetchSponsorDashboard,
  fetchLoanRequests,
  deleteLoanRequest,
  type SponsorLoanRequestItem,
} from "../_api/loan-requests-api";
import SponsorLoanRequestCard from "../_components/SponsorLoanRequestCard";
import CreateLoanRequestModal from "../_components/CreateLoanRequestModal";
import UpdateLoanRequestModal from "../_components/UpdateLoanRequestModal";
import LoanRequestQuotesModal from "../_components/LoanRequestQuotesModal";

const DEFAULT_HEADER_STATS: SponsorLoanHeaderStats = {
  total_properties: 0,
  quotes_received: 0,
  documents_count: 0,
  portfolio_value: 0,
};

const DEFAULT_DASHBOARD_DATA: SponsorLoanDashboardData = {
  header_stats: DEFAULT_HEADER_STATS,
  quote_card_view: [],
  quote_comparison: {
    total_quotes: 0,
    best_rate: 0,
    highest_ltv: 0,
    quotes: [],
  },
};

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const queryRequestId = useMemo(() => {
    const raw =
      searchParams.get("requestId") ||
      searchParams.get("loan_request_id") ||
      searchParams.get("request_id") ||
      searchParams.get("id");
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }, [searchParams]);

  const [selectedQuotesRequest, setSelectedQuotesRequest] =
    useState<SponsorLoanRequestItem | null>(null);
  const [selectedQuotesRequestId, setSelectedQuotesRequestId] =
    useState<number | null>(null);

  useEffect(() => {
    if (queryRequestId) {
      setSelectedQuotesRequestId(queryRequestId);
    }
  }, [queryRequestId]);

  const [view, setView] = useState<"Requests" | "Card View" | "Comparison">(
    "Requests",
  );

  // TanStack Query for Loan Requests
  const { data: loanRequests = [], isLoading: requestsLoading } =
    useQuery<SponsorLoanRequestItem[]>({
      queryKey: ["loan-requests"],
      queryFn: fetchLoanRequests,
      staleTime: 60 * 1000,
    });

  // TanStack Query for Dashboard Data
  const { data: dashboardData = DEFAULT_DASHBOARD_DATA, isLoading: dashboardLoading } =
    useQuery({
      queryKey: ["sponsor-dashboard"],
      queryFn: fetchSponsorDashboard,
      staleTime: 60 * 1000,
    });

  // Fetch properties for property selection in modal
  const { data: properties = [] } = useQuery<any[]>({
    queryKey: ["properties"],
    queryFn: async () => {
      const res = await api
        .get("/api/v1/properties/")
        .catch(() => api.get("/api/properties/"));
      const raw = res?.data?.data ?? res?.data;
      return Array.isArray(raw) ? raw : Array.isArray(raw?.results) ? raw.results : [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const [mutatingQuoteId, setMutatingQuoteId] = useState<number | null>(null);
  const [pendingAction, setPendingAction] = useState<{
    type: "accept" | "decline" | "delete";
    quote: LoanQuote;
  } | null>(null);

  // Loan Request Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingLoanRequest, setEditingLoanRequest] =
    useState<SponsorLoanRequestItem | null>(null);
  const [deletingLoanRequest, setDeletingLoanRequest] =
    useState<SponsorLoanRequestItem | null>(null);
  const [isDeletingRequest, setIsDeletingRequest] = useState(false);

  const executeAcceptQuote = async (quote: LoanQuote) => {
    try {
      setMutatingQuoteId(quote.id);
      try {
        await api.post(`/api/v1/loans/quotes/${quote.id}/accept/`);
      } catch {
        await api.post(`/api/loans/quotes/${quote.id}/accept/`);
      }
      toast.success("Quote accepted successfully.");
      await queryClient.invalidateQueries({ queryKey: ["sponsor-dashboard"] });
    } catch (error) {
      console.error("Failed to accept quote", error);
      toast.error("Failed to accept quote.");
    } finally {
      setMutatingQuoteId(null);
    }
  };

  const executeDeclineQuote = async (quote: LoanQuote) => {
    try {
      setMutatingQuoteId(quote.id);
      try {
        await api.post(`/api/v1/loans/quotes/${quote.id}/decline/`);
      } catch {
        await api.post(`/api/loans/quotes/${quote.id}/decline/`);
      }
      toast.success("Quote declined successfully.");
      await queryClient.invalidateQueries({ queryKey: ["sponsor-dashboard"] });
    } catch (error) {
      console.error("Failed to decline quote", error);
      toast.error("Failed to decline quote.");
    } finally {
      setMutatingQuoteId(null);
    }
  };

  const resolveLoanRequestId = async (quote: LoanQuote) => {
    if (quote.loan_request) {
      return quote.loan_request;
    }

    let detailResponse;
    try {
      detailResponse = await api.get(`/api/v1/loans/quotes/${quote.id}/`);
    } catch {
      detailResponse = await api.get(`/api/loans/quotes/${quote.id}/`);
    }
    const derivedRequestId = Number(detailResponse.data?.data?.loan_request);
    return Number.isFinite(derivedRequestId) ? derivedRequestId : null;
  };

  const executeDeleteQuoteRequest = async (quote: LoanQuote) => {
    try {
      setMutatingQuoteId(quote.id);
      const loanRequestId = await resolveLoanRequestId(quote);

      if (!loanRequestId) {
        toast.error("Unable to resolve loan request for deletion.");
        return;
      }

      await deleteLoanRequest(loanRequestId);
      toast.success("Loan request deleted successfully.");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["loan-requests"] }),
        queryClient.invalidateQueries({ queryKey: ["sponsor-dashboard"] }),
      ]);
    } catch (error) {
      console.error("Failed to delete loan request", error);
      toast.error("Failed to delete loan request.");
    } finally {
      setMutatingQuoteId(null);
    }
  };

  const executeDeleteLoanRequest = async () => {
    if (!deletingLoanRequest) return;
    try {
      setIsDeletingRequest(true);
      await deleteLoanRequest(deletingLoanRequest.id);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["loan-requests"] }),
        queryClient.invalidateQueries({ queryKey: ["sponsor-dashboard"] }),
      ]);
      toast.success("Loan request deleted successfully.");
      setDeletingLoanRequest(null);
    } catch (error) {
      console.error("Failed to delete loan request", error);
      toast.error("Failed to delete loan request.");
    } finally {
      setIsDeletingRequest(false);
    }
  };

  const handleViewQuote = (quote: LoanQuote) => {
    router.push(`/loan/${quote.id}`);
  };

  const openConfirmAction = (
    type: "accept" | "decline" | "delete",
    quote: LoanQuote,
  ) => {
    setPendingAction({ type, quote });
  };

  const closeConfirmAction = () => {
    if (mutatingQuoteId !== null) return;
    setPendingAction(null);
  };

  const handleConfirmAction = async () => {
    if (!pendingAction) return;

    if (pendingAction.type === "accept") {
      await executeAcceptQuote(pendingAction.quote);
    }

    if (pendingAction.type === "decline") {
      await executeDeclineQuote(pendingAction.quote);
    }

    if (pendingAction.type === "delete") {
      await executeDeleteQuoteRequest(pendingAction.quote);
    }

    setPendingAction(null);
  };

  const modalConfig = useMemo(() => {
    if (!pendingAction) {
      return {
        title: "",
        description: "",
        confirmText: "Confirm",
        destructive: false,
      };
    }

    const lenderName = pendingAction.quote.lender_name;

    if (pendingAction.type === "accept") {
      return {
        title: "Accept quote?",
        description: `This will accept the quote from ${lenderName} and close the related request.`,
        confirmText: "Accept Quote",
        destructive: false,
      };
    }

    if (pendingAction.type === "decline") {
      return {
        title: "Decline quote?",
        description: `This will decline the quote from ${lenderName}. You can not undo this action.`,
        confirmText: "Decline Quote",
        destructive: true,
      };
    }

    return {
      title: "Delete loan request?",
      description: `This will permanently delete the related loan request for ${lenderName}.`,
      confirmText: "Delete Request",
      destructive: true,
    };
  }, [pendingAction]);

  const quoteCards = useMemo(
    () => dashboardData.quote_card_view || [],
    [dashboardData],
  );

  const headerStats = dashboardData?.header_stats || DEFAULT_HEADER_STATS;

  return (
    <div>
      {/* ── Header Title & CTA ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
            Commercial Loans & Quotes
          </h1>
          <p className="text-sm text-[#6A7282] mt-0.5">
            Submit loan requests for your properties and review quotes from commercial lenders.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <FaPlus className="text-xs" />
          <span>New Loan Request</span>
        </button>
      </div>

      {/* ── Status Cards (from /api/v1/loans/dashboard/sponsor/) ── */}
      <div className="flex flex-wrap items-center justify-center xl:justify-start gap-5 lg:gap-7 xl:gap-10 my-8">
        <StatusCard
          type="Properties"
          data={{ value: headerStats.total_properties ?? properties.length }}
        />
        <StatusCard
          type="quotes"
          data={{ value: headerStats.quotes_received ?? quoteCards.length }}
        />
        <StatusCard
          type="documents"
          data={{ value: headerStats.documents_count ?? 0 }}
        />
        <StatusCard
          type="value"
          data={{ value: headerStats.portfolio_value ?? 0 }}
        />
      </div>

      {/* ── View Selection Tabs ── */}
      <div className="relative inline-flex rounded-full bg-[#ECECF0] p-1 mb-6">
        <button
          onClick={() => setView("Requests")}
          className={`relative z-10 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            view === "Requests" ? "bg-primary text-white shadow-xs" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          My Loan Requests ({loanRequests.length})
        </button>
        <button
          onClick={() => setView("Card View")}
          className={`relative z-10 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            view === "Card View" ? "bg-primary text-white shadow-xs" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Lender Quotes ({quoteCards.length})
        </button>
        <button
          onClick={() => setView("Comparison")}
          className={`relative z-10 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            view === "Comparison" ? "bg-primary text-white shadow-xs" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Quote Comparison
        </button>
      </div>

      {/* ── View Rendering ── */}
      {view === "Requests" && (
        <div>
          {requestsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 py-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 rounded-2xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : loanRequests.length === 0 ? (
            <div className="text-center py-16 px-4 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50 my-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl mb-3">
                <LuDollarSign />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">
                No loan requests created yet
              </h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto mb-4">
                Select any of your commercial properties and request loan terms to get quotes from lenders.
              </p>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm transition-colors cursor-pointer"
              >
                <FaPlus className="text-xs" />
                <span>Create Loan Request</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {loanRequests.map((request) => (
                <SponsorLoanRequestCard
                  key={request.id}
                  request={request}
                  onEdit={(req) => setEditingLoanRequest(req)}
                  onDelete={(req) => setDeletingLoanRequest(req)}
                  onViewQuotes={(req) => {
                    setSelectedQuotesRequest(req);
                    setSelectedQuotesRequestId(req.id);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {view === "Card View" && (
        <div>
          {dashboardLoading ? (
            <p className="text-sm text-[#6A7282] py-8">Loading quote cards...</p>
          ) : quoteCards.length === 0 ? (
            <div className="text-center py-16 px-4 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50 my-4">
              <p className="text-sm text-[#6A7282]">
                No lender quotes received yet. When commercial lenders review your requests, their quotes will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
              {quoteCards.map((loan: LoanQuote) => (
                <LoanCard
                  key={loan.id}
                  loan={loan}
                  isMutating={mutatingQuoteId === loan.id}
                  onAccept={(item) => openConfirmAction("accept", item)}
                  onDecline={(item) => openConfirmAction("decline", item)}
                  onDelete={(item) => openConfirmAction("delete", item)}
                  onView={handleViewQuote}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {view === "Comparison" && (
        <Comparison
          comparison={dashboardData.quote_comparison}
          loading={dashboardLoading}
          mutatingQuoteId={mutatingQuoteId}
          onAccept={(item) => openConfirmAction("accept", item)}
          onView={handleViewQuote}
        />
      )}

      {/* ── Create Loan Request Modal ── */}
      <CreateLoanRequestModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        properties={properties}
      />

      {/* ── Update Loan Request Modal ── */}
      <UpdateLoanRequestModal
        open={Boolean(editingLoanRequest)}
        onOpenChange={(open) => {
          if (!open) setEditingLoanRequest(null);
        }}
        loanRequest={editingLoanRequest}
      />

      {/* ── Delete Loan Request Modal ── */}
      <ConfirmActionModal
        open={Boolean(deletingLoanRequest)}
        onOpenChange={(open) => {
          if (!open && !isDeletingRequest) setDeletingLoanRequest(null);
        }}
        title="Delete loan request?"
        description={
          deletingLoanRequest
            ? `This will permanently remove the loan request for "${deletingLoanRequest.property_name}".`
            : "This will permanently remove the selected loan request."
        }
        confirmText="Delete Request"
        destructive
        isLoading={isDeletingRequest}
        onConfirm={executeDeleteLoanRequest}
      />

      {/* ── Confirm Action Modal for Quotes ── */}
      <ConfirmActionModal
        open={Boolean(pendingAction)}
        onOpenChange={closeConfirmAction}
        title={modalConfig.title}
        description={modalConfig.description}
        confirmText={modalConfig.confirmText}
        destructive={modalConfig.destructive}
        isLoading={mutatingQuoteId !== null}
        onConfirm={handleConfirmAction}
      />

      {/* ── Loan Request Quotes Modal ── */}
      <LoanRequestQuotesModal
        open={Boolean(selectedQuotesRequestId || selectedQuotesRequest)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedQuotesRequest(null);
            setSelectedQuotesRequestId(null);
          }
        }}
        loanRequestId={selectedQuotesRequestId || selectedQuotesRequest?.id || null}
        loanRequest={selectedQuotesRequest}
      />
    </div>
  );
};

export default Page;
