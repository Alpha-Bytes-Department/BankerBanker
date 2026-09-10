"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  LuDollarSign,
  LuCalendar,
  LuPercent,
  LuBuilding2,
  LuShieldCheck,
  LuExternalLink,
  LuClock,
  LuInbox,
  LuBadgePercent,
  LuLandmark,
} from "react-icons/lu";
import { CircleCheckBig, CircleX } from "lucide-react";
import { IoLocationOutline } from "react-icons/io5";

import ConfirmActionModal from "@/components/ConfirmActionModal";
import type { LoanQuoteDetail } from "../loan/_components/loan-types";
import {
  fetchQuotesForLoanRequest,
  fetchLoanRequestDetail,
  acceptLoanQuote,
  declineLoanQuote,
  type SponsorLoanRequestItem,
} from "../_api/loan-requests-api";

interface LoanRequestQuotesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loanRequestId: number | null;
  loanRequest?: SponsorLoanRequestItem | null;
  onQuoteAcceptedOrDeclined?: () => void;
}

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

export default function LoanRequestQuotesModal({
  open,
  onOpenChange,
  loanRequestId,
  loanRequest: initialLoanRequest,
  onQuoteAcceptedOrDeclined,
}: LoanRequestQuotesModalProps) {
  const queryClient = useQueryClient();

  const [selectedQuoteId, setSelectedQuoteId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState<"accept" | "decline" | null>(null);
  const [pendingAction, setPendingAction] = useState<"accept" | "decline" | null>(null);

  // 1. Fetch Request detail if not provided
  const { data: fetchedRequest } = useQuery<SponsorLoanRequestItem | null>({
    queryKey: ["loan-request-detail", loanRequestId],
    queryFn: () => (loanRequestId ? fetchLoanRequestDetail(loanRequestId) : Promise.resolve(null)),
    enabled: open && Boolean(loanRequestId) && !initialLoanRequest,
    staleTime: 60 * 1000,
  });

  const request = initialLoanRequest || fetchedRequest;

  // 2. Fetch Quotes for this Loan Request
  const {
    data: quotes = [],
    isLoading: quotesLoading,
    refetch: refetchQuotes,
  } = useQuery<LoanQuoteDetail[]>({
    queryKey: ["loan-request-quotes", loanRequestId],
    queryFn: () => (loanRequestId ? fetchQuotesForLoanRequest(loanRequestId) : Promise.resolve([])),
    enabled: open && Boolean(loanRequestId),
    staleTime: 30 * 1000,
  });

  // Auto-select first quote when quotes load
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

      if (onQuoteAcceptedOrDeclined) {
        onQuoteAcceptedOrDeclined();
      }
    } catch (err) {
      console.error(`Failed to ${pendingAction} quote`, err);
      toast.error(`Failed to ${pendingAction} quote.`);
    } finally {
      setActionLoading(null);
      setPendingAction(null);
    }
  };

  const isFinalized = (status?: string) => {
    const s = (status || "").toLowerCase();
    return s === "accepted" || s === "declined" || s === "approved" || s === "rejected";
  };

  const statusBadge = (status?: string) => {
    const s = (status || "").toLowerCase();
    if (s === "accepted" || s === "approved") {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          Accepted
        </span>
      );
    }
    if (s === "declined" || s === "rejected") {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          Declined
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
        {status || "Pending Review"}
      </span>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[92vh] flex flex-col p-0 overflow-hidden bg-white border border-gray-200 shadow-2xl rounded-2xl">
          {/* ── Dialog Header ── */}
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100 bg-gray-50/60 shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
                    Loan Request #{loanRequestId}
                  </span>
                  {request?.property_type && (
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-700 capitalize">
                      {request.property_type}
                    </span>
                  )}
                  {request?.status && (
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      {request.status}
                    </span>
                  )}
                </div>

                <DialogTitle className="text-xl font-bold text-gray-900 mt-2">
                  {request?.property_name || `Property #${request?.property || loanRequestId}`}
                </DialogTitle>

                {request?.property_address && (
                  <DialogDescription className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <IoLocationOutline className="shrink-0 text-gray-400" />
                    <span>{request.property_address}</span>
                  </DialogDescription>
                )}
              </div>

              {/* Loan Request Summary Quick Stats */}
              {request && (
                <div className="flex items-center gap-2 sm:gap-3 shrink-0 bg-white p-2.5 rounded-xl border border-gray-200 shadow-2xs">
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] uppercase font-semibold text-gray-400">
                      Requested
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {formatCurrency(request.requested_amount)}
                    </span>
                  </div>
                  <div className="w-px h-7 bg-gray-200" />
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] uppercase font-semibold text-gray-400">
                      Target LTV
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {request.ltv}%
                    </span>
                  </div>
                  <div className="w-px h-7 bg-gray-200" />
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] uppercase font-semibold text-gray-400">
                      Term
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {request.loan_term} mo
                    </span>
                  </div>
                </div>
              )}
            </div>
          </DialogHeader>

          {/* ── Dialog Scrollable Body ── */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {quotesLoading ? (
              <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-500 font-medium">
                  Loading quotes for Loan Request #{loanRequestId}...
                </p>
              </div>
            ) : quotes.length === 0 ? (
              /* Empty State */
              <div className="text-center py-12 px-4 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-2xl mb-3">
                  <LuInbox />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">
                  No Quotes Received Yet
                </h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                  Commercial lenders have been notified of your loan request for{" "}
                  <span className="font-semibold text-gray-700">
                    {request?.property_name || "this property"}
                  </span>
                  . As soon as a lender submits term sheets, their quotes and full underwriting
                  details will appear here.
                </p>

                {request && (
                  <div className="max-w-md mx-auto bg-white rounded-xl border border-gray-200 p-4 text-left shadow-2xs">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
                      Submitted Loan Parameters
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-gray-400 block">Requested Amount:</span>
                        <span className="font-semibold text-gray-800">
                          {formatCurrency(request.requested_amount)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Target LTV:</span>
                        <span className="font-semibold text-gray-800">{request.ltv}%</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Term Duration:</span>
                        <span className="font-semibold text-gray-800">
                          {request.loan_term} months
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Status:</span>
                        <span className="font-semibold text-gray-800">
                          {request.status || "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Quotes Display */
              <div className="space-y-6">
                {/* Quotes Selector Tabs (if multiple quotes) */}
                {quotes.length > 1 && (
                  <div>
                    <span className="text-xs font-semibold text-gray-500 mb-2 block">
                      Received Quotes ({quotes.length})
                    </span>
                    <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-xl">
                      {quotes.map((q) => {
                        const isSelected = q.id === activeQuote?.id;
                        return (
                          <button
                            key={q.id}
                            type="button"
                            onClick={() => setSelectedQuoteId(q.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                              isSelected
                                ? "bg-white text-blue-700 shadow-xs font-semibold"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/60"
                            }`}
                          >
                            <LuLandmark className="text-sm" />
                            <span>{q.lender_name}</span>
                            <span className="text-gray-400">|</span>
                            <span>{formatCurrency(q.loan_amount)}</span>
                            <span>@{formatPercent(q.interest_rate)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Active Quote Detail Sheet */}
                {activeQuote && (
                  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
                    {/* Active Quote Header */}
                    <div className="p-5 bg-gradient-to-r from-blue-50/50 via-white to-gray-50/50 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800 tracking-wider">
                            Quote #{activeQuote.id}
                          </span>
                          {statusBadge(activeQuote.status)}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mt-1">
                          {activeQuote.lender_name}
                        </h3>
                        {activeQuote.guarantor && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            Guarantor:{" "}
                            <span className="font-medium text-gray-700">
                              {activeQuote.guarantor}
                            </span>
                          </p>
                        )}
                      </div>

                      {/* Top Action Buttons */}
                      <div className="flex items-center gap-2">
                        {!isFinalized(activeQuote.status) && (
                          <>
                            <button
                              type="button"
                              onClick={() => setPendingAction("accept")}
                              disabled={actionLoading !== null}
                              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-2xs disabled:opacity-50 cursor-pointer"
                            >
                              <CircleCheckBig className="w-4 h-4" />
                              <span>Accept Quote</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setPendingAction("decline")}
                              disabled={actionLoading !== null}
                              className="px-3.5 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 text-xs font-semibold hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-colors flex items-center gap-1.5 shadow-2xs disabled:opacity-50 cursor-pointer"
                            >
                              <CircleX className="w-4 h-4" />
                              <span>Decline</span>
                            </button>
                          </>
                        )}

                        <Link
                          href={`/loan/${activeQuote.id}`}
                          onClick={() => onOpenChange(false)}
                          className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 text-xs font-semibold hover:bg-gray-50 hover:text-blue-600 transition-colors flex items-center gap-1 shadow-2xs"
                        >
                          <span>Full Page View</span>
                          <LuExternalLink className="text-xs" />
                        </Link>
                      </div>
                    </div>

                    {/* Key 4 Highlights */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-gray-50/40 border-b border-gray-100">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-semibold text-gray-400 uppercase flex items-center gap-1">
                          <LuDollarSign /> Loan Amount
                        </span>
                        <span className="text-lg font-bold text-gray-900 mt-0.5">
                          {formatCurrency(activeQuote.loan_amount)}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[11px] font-semibold text-gray-400 uppercase flex items-center gap-1">
                          <LuPercent /> Interest Rate
                        </span>
                        <span className="text-lg font-bold text-blue-600 mt-0.5">
                          {formatPercent(activeQuote.interest_rate)}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[11px] font-semibold text-gray-400 uppercase flex items-center gap-1">
                          <LuCalendar /> Loan Term
                        </span>
                        <span className="text-lg font-bold text-gray-900 mt-0.5">
                          {formatTerm(activeQuote.term)}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[11px] font-semibold text-gray-400 uppercase flex items-center gap-1">
                          <LuBadgePercent /> Max As-Is LTV
                        </span>
                        <span className="text-lg font-bold text-gray-900 mt-0.5">
                          {formatPercent(activeQuote.max_as_is_ltv)}
                        </span>
                      </div>
                    </div>

                    {/* Detailed Breakdowns in Grids */}
                    <div className="p-5 space-y-5 text-xs">
                      {/* Section 1: Capital & Funding */}
                      <div>
                        <h4 className="font-bold text-gray-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-gray-100 text-blue-800">
                          <LuDollarSign className="text-sm" /> Capital & Funding Structure
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                          <div className="p-2.5 rounded-lg bg-gray-50/70 border border-gray-100">
                            <span className="text-gray-400 block">Initial Funding</span>
                            <span className="font-semibold text-gray-900 text-sm">
                              {formatCurrency(activeQuote.initial_funding)}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-gray-50/70 border border-gray-100">
                            <span className="text-gray-400 block">Future Funding</span>
                            <span className="font-semibold text-gray-900 text-sm">
                              {formatCurrency(activeQuote.future_funding)}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-gray-50/70 border border-gray-100">
                            <span className="text-gray-400 block">Sponsor Equity</span>
                            <span className="font-semibold text-gray-900 text-sm">
                              {formatCurrency(activeQuote.sponsor_equity)}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-gray-50/70 border border-gray-100">
                            <span className="text-gray-400 block">Origination Fee</span>
                            <span className="font-semibold text-gray-900 text-sm">
                              {formatPercent(activeQuote.origination_fee)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Underwriting & Debt Metrics */}
                      <div>
                        <h4 className="font-bold text-gray-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-gray-100 text-blue-800">
                          <LuBadgePercent className="text-sm" /> Underwriting & Ratios
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-3">
                          <div className="p-2.5 rounded-lg bg-gray-50/70 border border-gray-100">
                            <span className="text-gray-400 block">Max LTC</span>
                            <span className="font-semibold text-gray-900">
                              {formatPercent(activeQuote.max_ltc)}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-gray-50/70 border border-gray-100">
                            <span className="text-gray-400 block">Max Stabilized LTV</span>
                            <span className="font-semibold text-gray-900">
                              {formatPercent(activeQuote.max_as_stabilized_ltv)}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-gray-50/70 border border-gray-100">
                            <span className="text-gray-400 block">Min As-Is DY</span>
                            <span className="font-semibold text-gray-900">
                              {formatPercent(activeQuote.min_as_is_dy)}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-gray-50/70 border border-gray-100">
                            <span className="text-gray-400 block">Min Stabilized DY</span>
                            <span className="font-semibold text-gray-900">
                              {formatPercent(activeQuote.min_stabilized_dy)}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-gray-50/70 border border-gray-100">
                            <span className="text-gray-400 block">DSCR Target</span>
                            <span className="font-semibold text-gray-900">
                              {activeQuote.dscr ? `${Number(activeQuote.dscr).toFixed(2)}x` : "-"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Required Reserves */}
                      <div>
                        <h4 className="font-bold text-gray-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-gray-100 text-blue-800">
                          <LuBuilding2 className="text-sm" /> Required Reserves
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                          <div className="p-2.5 rounded-lg bg-gray-50/70 border border-gray-100">
                            <span className="text-gray-400 block">CapEx Reserve</span>
                            <span className="font-semibold text-gray-900">
                              {formatCurrency(activeQuote.capex_reserve)}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-gray-50/70 border border-gray-100">
                            <span className="text-gray-400 block">FF&E Reserve</span>
                            <span className="font-semibold text-gray-900">
                              {formatCurrency(activeQuote.ff_and_e_reserve)}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-gray-50/70 border border-gray-100">
                            <span className="text-gray-400 block">Interest Carry Reserve</span>
                            <span className="font-semibold text-gray-900">
                              {formatCurrency(activeQuote.interest_carry_reserve)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Section 4: Legal, Collateral & Structuring */}
                      <div>
                        <h4 className="font-bold text-gray-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-gray-100 text-blue-800">
                          <LuShieldCheck className="text-sm" /> Collateral & Legal Structuring
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                          <div className="p-2.5 rounded-lg bg-gray-50/70 border border-gray-100">
                            <span className="text-gray-400 block">Collateral Security</span>
                            <span className="font-semibold text-gray-900">
                              {activeQuote.collateral || "First Lien Deed of Trust"}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-gray-50/70 border border-gray-100">
                            <span className="text-gray-400 block">Recourse Classification</span>
                            <span className="font-semibold text-gray-900">
                              {activeQuote.recourse || "Non-Recourse with Standard Carveouts"}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-gray-50/70 border border-gray-100">
                            <span className="text-gray-400 block">Amortization Schedule</span>
                            <span className="font-semibold text-gray-900">
                              {activeQuote.amortization || "Interest Only / 30 Year"}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-gray-50/70 border border-gray-100">
                            <span className="text-gray-400 block">Prepayment Terms</span>
                            <span className="font-semibold text-gray-900">
                              {activeQuote.prepayment || "Yield Maintenance"}
                            </span>
                          </div>
                          {activeQuote.extension_conditions && (
                            <div className="sm:col-span-2 p-2.5 rounded-lg bg-gray-50/70 border border-gray-100">
                              <span className="text-gray-400 block">Extension Conditions</span>
                              <span className="font-semibold text-gray-900">
                                {activeQuote.extension_conditions}
                              </span>
                            </div>
                          )}
                          {activeQuote.expires_at && (
                            <div className="sm:col-span-2 flex items-center gap-1.5 text-gray-500 pt-1">
                              <LuClock className="text-amber-500" />
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
          </div>

          {/* ── Dialog Footer ── */}
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between shrink-0">
            <span className="text-xs text-gray-500">
              {quotes.length > 0
                ? `${quotes.length} quote${quotes.length === 1 ? "" : "s"} available for Loan Request #${loanRequestId}`
                : `Awaiting lender response for Loan Request #${loanRequestId}`}
            </span>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-xs font-semibold hover:bg-gray-100 transition-colors shadow-2xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal for Accept / Decline */}
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
    </>
  );
}
