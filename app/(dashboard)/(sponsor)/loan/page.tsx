"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
  const [view, setView] = useState<"Card View" | "Comparison">("Card View");
  const [dashboardData, setDashboardData] = useState<SponsorLoanDashboardData>(
    DEFAULT_DASHBOARD_DATA,
  );
  const [loading, setLoading] = useState(true);
  const [mutatingQuoteId, setMutatingQuoteId] = useState<number | null>(null);
  const [pendingAction, setPendingAction] = useState<{
    type: "accept" | "decline" | "delete";
    quote: LoanQuote;
  } | null>(null);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/loans/dashboard/sponsor/");
      const data = response.data?.data;

      setDashboardData({
        header_stats: {
          ...DEFAULT_HEADER_STATS,
          ...(data?.header_stats || {}),
        },
        quote_card_view: data?.quote_card_view || [],
        quote_comparison: {
          ...DEFAULT_DASHBOARD_DATA.quote_comparison,
          ...(data?.quote_comparison || {}),
          quotes: data?.quote_comparison?.quotes || [],
        },
      });
    } catch (error) {
      console.error("Failed to load sponsor loan dashboard", error);
      toast.error("Unable to load loan dashboard data right now.");
      setDashboardData(DEFAULT_DASHBOARD_DATA);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const executeAcceptQuote = async (quote: LoanQuote) => {
    try {
      setMutatingQuoteId(quote.id);
      await api.post(`/api/loans/quotes/${quote.id}/accept/`);
      toast.success("Quote accepted successfully.");
      await loadDashboardData();
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
      await api.post(`/api/loans/quotes/${quote.id}/decline/`);
      toast.success("Quote declined successfully.");
      await loadDashboardData();
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

    const detailResponse = await api.get(`/api/loans/quotes/${quote.id}/`);
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

      await api.delete(`/api/loans/requests/${loanRequestId}/`);
      toast.success("Loan request deleted successfully.");
      await loadDashboardData();
    } catch (error) {
      console.error("Failed to delete loan request", error);
      toast.error("Failed to delete loan request.");
    } finally {
      setMutatingQuoteId(null);
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

  return (
    <div>
      {/* status card  */}
      <div className="flex flex-wrap items-center justify-center xl:justify-start gap-5 lg:gap-7 xl:gap-10 my-10">
        <StatusCard
          type="Properties"
          data={{ value: dashboardData.header_stats.total_properties ?? 0 }}
        />
        <StatusCard
          type="quotes"
          data={{ value: dashboardData.header_stats.quotes_received ?? 0 }}
        />
        <StatusCard
          type="documents"
          data={{ value: dashboardData.header_stats.documents_count ?? 0 }}
        />
        <StatusCard
          type="value"
          data={{ value: dashboardData.header_stats.portfolio_value ?? 0 }}
        />
      </div>
      {/* view selection  */}
      <div className="relative inline-flex rounded-full bg-[#ECECF0] p-1 mb-5">
        <span
          className={`absolute top-1 bottom-1 w-1/2 rounded-full bg-primary transition-all duration-300 ease-in-out ${view === "Card View" ? "left-1" : "left-1/2"}`}
        />
        <button
          onClick={() => setView("Card View")}
          className={`relative z-10 px-4 py-2 rounded-full transition-colors duration-300 ${view === "Card View" ? "text-white" : "text-gray-600"}`}
        >
          Card View
        </button>
        <button
          onClick={() => setView("Comparison")}
          className={`relative z-10 px-4 py-2 rounded-full transition-colors duration-300 ${view === "Comparison" ? "text-white" : "text-gray-600"}`}
        >
          Comparison
        </button>
      </div>
      {/* view randaring  */}
      {view === "Card View" ? (
        loading ? (
          <p className="text-sm text-[#6A7282] py-8">Loading quote cards...</p>
        ) : quoteCards.length === 0 ? (
          <p className="text-sm text-[#6A7282] py-8">
            No quote cards available.
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5 ">
            {quoteCards.map((loan) => (
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
        )
      ) : (
        <Comparison
          comparison={dashboardData.quote_comparison}
          loading={loading}
          mutatingQuoteId={mutatingQuoteId}
          onAccept={(item) => openConfirmAction("accept", item)}
          onView={handleViewQuote}
        />
      )}

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
    </div>
  );
};

export default Page;
