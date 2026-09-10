"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  CircleCheckBig,
  CircleX,
  ExternalLink,
  Inbox,
  Landmark,
  Building2,
  Calendar,
  DollarSign,
  Percent,
  ShieldCheck,
  BadgePercent,
  Clock,
} from "lucide-react";
import { IoLocationOutline } from "react-icons/io5";
import { toast } from "sonner";
import ConfirmActionModal from "@/components/ConfirmActionModal";
import type { LoanQuoteDetail } from "../../_components/loan-types";
import {
  fetchLoanRequestDetail,
  fetchQuotesForLoanRequest,
  acceptLoanQuote,
  declineLoanQuote,
  type SponsorLoanRequestItem,
} from "../../../_api/loan-requests-api";

const toNumber = (value: string | number | undefined) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatCurrency = (value: string | number | undefined) => {
  const parsed = toNumber(value);
  if (parsed === null) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(parsed);
};

const formatPercent = (value: string | number | undefined) => {
  const parsed = toNumber(value);
  if (parsed === null) return "-";
  return `${parsed.toFixed(2)}%`;
};

const formatTerm = (value: string | number | undefined) => {
  if (value === undefined || value === null || value === "") return "-";
  if (typeof value === "number" || /^\d+$/.test(String(value))) {
    const num = Number(value);
    const years = (num / 12).toFixed(1);
    return `${num} months (${years} yrs)`;
  }
  return String(value);
};

const isFinalizedStatus = (status?: string) => {
  const s = (status || "").toLowerCase();
  return (
    s === "accepted" ||
    s === "declined" ||
    s === "approved" ||
    s === "rejected" ||
    s === "decline"
  );
};

export default function LoanRequestQuotesPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();

  const requestIdRaw = Array.isArray(params.requestId)
    ? params.requestId[0]
    : params.requestId;
  const requestId = Number(requestIdRaw);

  const [selectedQuoteId, setSelectedQuoteId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState<"accept" | "decline" | null>(
    null,
  );
  const [pendingAction, setPendingAction] = useState<"accept" | "decline" | null>(
    null,
  );

  // 1. Fetch Loan Request Details
  const { data: request, isLoading: requestLoading } =
    useQuery<SponsorLoanRequestItem | null>({
      queryKey: ["loan-request-detail", requestId],
      queryFn: () => (requestId ? fetchLoanRequestDetail(requestId) : Promise.resolve(null)),
      enabled: Boolean(requestId && requestId > 0),
    });

  // 2. Fetch Quotes for this Loan Request
  const {
    data: quotes = [],
    isLoading: quotesLoading,
    refetch: refetchQuotes,
  } = useQuery<LoanQuoteDetail[]>({
    queryKey: ["loan-request-quotes", requestId],
    queryFn: () => (requestId ? fetchQuotesForLoanRequest(requestId) : Promise.resolve([])),
    enabled: Boolean(requestId && requestId > 0),
  });

  // Auto-select first quote
  useEffect(() => {
    if (quotes.length > 0 && (!selectedQuoteId || !quotes.some((q) => q.id === selectedQuoteId))) {
      setSelectedQuoteId(quotes[0].id);
    }
  }, [quotes, selectedQuoteId]);

  const activeQuote = useMemo(() => {
    return quotes.find((q) => q.id === selectedQuoteId) || quotes[0] || null;
  }, [quotes, selectedQuoteId]);

  const handleExecuteAction = async () => {
    if (!pendingAction || !activeQuote) return;

    try {
      setActionLoading(pendingAction);
      if (pendingAction === "accept") {
        await acceptLoanQuote(activeQuote.id);
        toast.success(`Quote from ${activeQuote.lender_name} accepted!`);
      } else {
        await declineLoanQuote(activeQuote.id);
        toast.success(`Quote from ${activeQuote.lender_name} declined.`);
      }

      await Promise.all([
        refetchQuotes(),
        queryClient.invalidateQueries({ queryKey: ["loan-requests"] }),
        queryClient.invalidateQueries({ queryKey: ["sponsor-dashboard"] }),
      ]);
    } catch (err) {
      console.error(`Failed to ${pendingAction} quote`, err);
      toast.error(`Failed to ${pendingAction} quote.`);
    } finally {
      setActionLoading(null);
      setPendingAction(null);
    }
  };

  const statusBadge = (status?: string) => {
    const s = (status || "").toLowerCase();
    if (s === "accepted" || s === "approved") {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          Accepted
        </span>
      );
    }
    if (s === "declined" || s === "rejected") {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          Declined
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
        {status || "Pending Review"}
      </span>
    );
  };

  if (!requestId || isNaN(requestId)) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">Invalid Loan Request ID.</p>
        <Link href="/loan" className="text-blue-600 font-semibold hover:underline mt-2 inline-block">
          Return to Loans
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* ── Breadcrumb Back Link ── */}
      <div>
        <Link
          href="/loan"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Loan Requests
        </Link>
      </div>

      {/* ── Header Card: Loan Request Summary ── */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
        {requestLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-6 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-72 bg-gray-100 rounded" />
          </div>
        ) : request ? (
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
                  Loan Request #{request.id}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-gray-100 text-gray-700 capitalize">
                  {request.property_type}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                  {request.status}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mt-2">
                {request.property_name}
              </h1>

              {request.property_address && (
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <IoLocationOutline className="shrink-0 text-gray-400" />
                  <span>{request.property_address}</span>
                </p>
              )}
            </div>

            {/* Terms Summary Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col">
                <span className="text-[11px] font-semibold text-gray-400 uppercase">
                  Requested Amount
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(request.requested_amount)}
                </span>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col">
                <span className="text-[11px] font-semibold text-gray-400 uppercase">
                  Target LTV
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {request.ltv}%
                </span>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col">
                <span className="text-[11px] font-semibold text-gray-400 uppercase">
                  Requested Term
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {request.loan_term} mo
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Loan Request #{requestId}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Quotes and underwriting details for this loan request.
            </p>
          </div>
        )}
      </div>

      {/* ── Quotes Details Section ── */}
      {quotesLoading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading quotes for Request #{requestId}...</p>
        </div>
      ) : quotes.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 px-4 border border-dashed border-gray-200 rounded-2xl bg-white shadow-xs">
          <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-3xl mb-4">
            <Inbox className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            No Quotes Received Yet
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            Commercial lenders are currently underwriting your loan request. When quotes are
            submitted, their complete term sheets will appear right here.
          </p>
          <Link
            href="/loan"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-xs transition-colors"
          >
            <span>Back to Loan Requests</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Quotes Navigation Bar (if multiple quotes) */}
          {quotes.length > 1 && (
            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-gray-100 rounded-2xl border border-gray-200/70">
              {quotes.map((q) => {
                const isSelected = q.id === activeQuote?.id;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setSelectedQuoteId(q.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? "bg-white text-blue-700 shadow-sm font-semibold border border-gray-100"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
                    }`}
                  >
                    <Landmark className="w-4 h-4" />
                    <span>{q.lender_name}</span>
                    <span className="text-gray-300">|</span>
                    <span>{formatCurrency(q.loan_amount)}</span>
                    <span className="text-blue-600">@{formatPercent(q.interest_rate)}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Detailed Quote Term Sheet Card */}
          {activeQuote && (
            <div className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden">
              {/* Term Sheet Header */}
              <div className="p-6 bg-gradient-to-r from-blue-50/40 via-white to-gray-50/40 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase bg-blue-100 text-blue-800 tracking-wider">
                      Quote #{activeQuote.id}
                    </span>
                    {statusBadge(activeQuote.status)}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mt-2">
                    {activeQuote.lender_name}
                  </h2>
                  {activeQuote.guarantor && (
                    <p className="text-xs text-gray-500 mt-1">
                      Guarantor: <span className="font-semibold text-gray-700">{activeQuote.guarantor}</span>
                    </p>
                  )}
                </div>

                {/* Accept / Decline Action Buttons */}
                <div className="flex items-center gap-3">
                  {!isFinalizedStatus(activeQuote.status) && (
                    <>
                      <button
                        type="button"
                        onClick={() => setPendingAction("accept")}
                        disabled={actionLoading !== null}
                        className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
                      >
                        <CircleCheckBig className="w-4 h-4" />
                        <span>Accept Quote</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingAction("decline")}
                        disabled={actionLoading !== null}
                        className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-xs font-semibold hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
                      >
                        <CircleX className="w-4 h-4" />
                        <span>Decline Quote</span>
                      </button>
                    </>
                  )}

                  <Link
                    href={`/loan/${activeQuote.id}`}
                    className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-xs font-semibold hover:bg-gray-50 hover:text-blue-600 transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Full Page View</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Top 4 Financial Metric Banners */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-gray-50/50 border-b border-gray-100">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-400 uppercase flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" /> Loan Amount
                  </span>
                  <span className="text-xl font-bold text-gray-900 mt-1">
                    {formatCurrency(activeQuote.loan_amount)}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-400 uppercase flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5" /> Interest Rate
                  </span>
                  <span className="text-xl font-bold text-blue-600 mt-1">
                    {formatPercent(activeQuote.interest_rate)}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-400 uppercase flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Loan Term
                  </span>
                  <span className="text-xl font-bold text-gray-900 mt-1">
                    {formatTerm(activeQuote.term)}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-400 uppercase flex items-center gap-1">
                    <BadgePercent className="w-3.5 h-3.5" /> Max As-Is LTV
                  </span>
                  <span className="text-xl font-bold text-gray-900 mt-1">
                    {formatPercent(activeQuote.max_as_is_ltv)}
                  </span>
                </div>
              </div>

              {/* Detailed Breakdown Sections */}
              <div className="p-6 space-y-6 text-sm">
                {/* 1. Capital & Funding Structure */}
                <div>
                  <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-gray-100 text-blue-900">
                    <DollarSign className="w-4 h-4 text-blue-600" /> Capital & Funding Structure
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                    <div className="p-3 rounded-xl bg-gray-50/70 border border-gray-100">
                      <span className="text-xs text-gray-400 block">Initial Funding</span>
                      <span className="font-bold text-gray-900 mt-0.5 block">
                        {formatCurrency(activeQuote.initial_funding)}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50/70 border border-gray-100">
                      <span className="text-xs text-gray-400 block">Future Funding</span>
                      <span className="font-bold text-gray-900 mt-0.5 block">
                        {formatCurrency(activeQuote.future_funding)}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50/70 border border-gray-100">
                      <span className="text-xs text-gray-400 block">Sponsor Equity</span>
                      <span className="font-bold text-gray-900 mt-0.5 block">
                        {formatCurrency(activeQuote.sponsor_equity)}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50/70 border border-gray-100">
                      <span className="text-xs text-gray-400 block">Origination Fee</span>
                      <span className="font-bold text-gray-900 mt-0.5 block">
                        {formatPercent(activeQuote.origination_fee)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Underwriting & Debt Yields */}
                <div>
                  <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-gray-100 text-blue-900">
                    <BadgePercent className="w-4 h-4 text-blue-600" /> Underwriting & Ratios
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-4">
                    <div className="p-3 rounded-xl bg-gray-50/70 border border-gray-100">
                      <span className="text-xs text-gray-400 block">Max LTC</span>
                      <span className="font-bold text-gray-900 mt-0.5 block">
                        {formatPercent(activeQuote.max_ltc)}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50/70 border border-gray-100">
                      <span className="text-xs text-gray-400 block">Max Stabilized LTV</span>
                      <span className="font-bold text-gray-900 mt-0.5 block">
                        {formatPercent(activeQuote.max_as_stabilized_ltv)}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50/70 border border-gray-100">
                      <span className="text-xs text-gray-400 block">Min As-Is DY</span>
                      <span className="font-bold text-gray-900 mt-0.5 block">
                        {formatPercent(activeQuote.min_as_is_dy)}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50/70 border border-gray-100">
                      <span className="text-xs text-gray-400 block">Min Stabilized DY</span>
                      <span className="font-bold text-gray-900 mt-0.5 block">
                        {formatPercent(activeQuote.min_stabilized_dy)}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50/70 border border-gray-100">
                      <span className="text-xs text-gray-400 block">DSCR Target</span>
                      <span className="font-bold text-gray-900 mt-0.5 block">
                        {activeQuote.dscr ? `${Number(activeQuote.dscr).toFixed(2)}x` : "-"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Required Reserves */}
                <div>
                  <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-gray-100 text-blue-900">
                    <Building2 className="w-4 h-4 text-blue-600" /> Required Reserves
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    <div className="p-3 rounded-xl bg-gray-50/70 border border-gray-100">
                      <span className="text-xs text-gray-400 block">CapEx Reserve</span>
                      <span className="font-bold text-gray-900 mt-0.5 block">
                        {formatCurrency(activeQuote.capex_reserve)}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50/70 border border-gray-100">
                      <span className="text-xs text-gray-400 block">FF&E Reserve</span>
                      <span className="font-bold text-gray-900 mt-0.5 block">
                        {formatCurrency(activeQuote.ff_and_e_reserve)}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50/70 border border-gray-100">
                      <span className="text-xs text-gray-400 block">Interest Carry Reserve</span>
                      <span className="font-bold text-gray-900 mt-0.5 block">
                        {formatCurrency(activeQuote.interest_carry_reserve)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. Collateral & Legal Structuring */}
                <div>
                  <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-gray-100 text-blue-900">
                    <ShieldCheck className="w-4 h-4 text-blue-600" /> Collateral & Legal Structuring
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div className="p-3 rounded-xl bg-gray-50/70 border border-gray-100">
                      <span className="text-xs text-gray-400 block">Collateral Security</span>
                      <span className="font-semibold text-gray-900 mt-0.5 block">
                        {activeQuote.collateral || "First Lien Deed of Trust"}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50/70 border border-gray-100">
                      <span className="text-xs text-gray-400 block">Recourse Classification</span>
                      <span className="font-semibold text-gray-900 mt-0.5 block">
                        {activeQuote.recourse || "Non-Recourse with Standard Carveouts"}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50/70 border border-gray-100">
                      <span className="text-xs text-gray-400 block">Amortization Schedule</span>
                      <span className="font-semibold text-gray-900 mt-0.5 block">
                        {activeQuote.amortization || "Interest Only / 30 Year"}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50/70 border border-gray-100">
                      <span className="text-xs text-gray-400 block">Prepayment Terms</span>
                      <span className="font-semibold text-gray-900 mt-0.5 block">
                        {activeQuote.prepayment || "Yield Maintenance"}
                      </span>
                    </div>
                    {activeQuote.extension_conditions && (
                      <div className="sm:col-span-2 p-3 rounded-xl bg-gray-50/70 border border-gray-100">
                        <span className="text-xs text-gray-400 block">Extension Conditions</span>
                        <span className="font-semibold text-gray-900 mt-0.5 block">
                          {activeQuote.extension_conditions}
                        </span>
                      </div>
                    )}
                    {activeQuote.expires_at && (
                      <div className="sm:col-span-2 flex items-center gap-2 text-xs text-gray-500 pt-1">
                        <Clock className="w-4 h-4 text-amber-500" />
                        <span>
                          Quote expires on:{" "}
                          <span className="font-semibold text-gray-700">
                            {new Date(activeQuote.expires_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmActionModal
        open={Boolean(pendingAction)}
        onOpenChange={(open) => {
          if (!open && actionLoading === null) setPendingAction(null);
        }}
        title={
          pendingAction === "accept"
            ? `Accept quote from ${activeQuote?.lender_name}?`
            : `Decline quote from ${activeQuote?.lender_name}?`
        }
        description={
          pendingAction === "accept"
            ? `This will accept the term sheet of ${formatCurrency(
                activeQuote?.loan_amount,
              )} at ${formatPercent(activeQuote?.interest_rate)} from ${
                activeQuote?.lender_name
              } and close this loan request.`
            : `This will decline this quote. You will not be able to undo this action.`
        }
        confirmText={pendingAction === "accept" ? "Accept Quote" : "Decline Quote"}
        destructive={pendingAction === "decline"}
        isLoading={actionLoading !== null}
        onConfirm={handleExecuteAction}
      />
    </div>
  );
}
