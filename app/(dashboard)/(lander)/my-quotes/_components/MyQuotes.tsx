"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/Provider/api";
import {
  LenderDashboardApiData,
  LenderDashboardLoanRequest,
  LenderPropertyMapItem,
  LenderQuoteApiItem,
  LenderQuoteStatsData,
  Quote,
  QuoteFilter,
  QuoteStat,
  QuoteStatus,
} from "@/types/my-quotes";
import StatsCardsQuotes from "./StatsCardsQuotes";
import QuotesList from "./QuotesList";
import QuoteDetailsModal from "./QuoteDetailsModal";

type ApiEnvelope<T> = {
  data?: T;
};

const FALLBACK_PROPERTY_IMAGE = "/images/SponsorDashboard.png";

const normalizeImageUrl = (value?: string | null) => {
  if (!value) return null;

  const raw = String(value).trim();
  if (!raw || raw === "null" || raw === "undefined") {
    return null;
  }

  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/+$/, "");

  if (/^https?:\/\//i.test(raw)) {
    if (!baseUrl) return raw;
    return raw.replace(/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?/i, baseUrl);
  }

  const normalizedPath = raw.replace(/^\/+/, "");

  if (raw.startsWith("/") || normalizedPath.startsWith("media/")) {
    return baseUrl ? `${baseUrl}/${normalizedPath}` : `/${normalizedPath}`;
  }

  return null;
};

const resolveImageUrl = (...values: Array<string | null | undefined>) => {
  const normalizedValues: string[] = [];

  for (const value of values) {
    const normalized = normalizeImageUrl(value);
    if (normalized) normalizedValues.push(normalized);
  }

  const absoluteUrl = normalizedValues.find((item) =>
    /^https?:\/\//i.test(item),
  );
  if (absoluteUrl) return absoluteUrl;

  if (normalizedValues.length > 0) {
    return normalizedValues[0];
  }

  return FALLBACK_PROPERTY_IMAGE;
};

const toNumber = (value: string | number | undefined | null) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatCurrency = (value: string | number | undefined) => {
  const parsed = toNumber(value);
  if (parsed === null) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(parsed);
};

const formatDate = (value?: string) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getDaysUntil = (value?: string) => {
  if (!value) return 0;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 0;
  return Math.ceil((parsed.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
};

const toStatus = (value?: string): QuoteStatus => {
  const normalized = String(value || "").toLowerCase();
  if (normalized.includes("accept")) return "accepted";
  if (
    normalized.includes("reject") ||
    normalized.includes("declin") ||
    normalized.includes("withdraw")
  ) {
    return "rejected";
  }
  if (normalized.includes("review") || normalized.includes("pending")) {
    return "under_review";
  }
  return "submitted";
};

const toStatusLabel = (value?: string) => {
  const raw = String(value || "").trim();
  if (!raw) return "Submitted";
  return raw;
};

const splitAddress = (address?: string) => {
  if (!address) return { city: "-", state: "-" };
  const parts = address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length === 0) return { city: "-", state: "-" };
  if (parts.length === 1) return { city: parts[0], state: "-" };
  const state = parts[parts.length - 1] || "-";
  const city = parts[parts.length - 2] || "-";
  return { city, state };
};

//========== My Quotes Component ===========

const MyQuotes: React.FC = () => {
  const router = useRouter();
  //========== State Management ===========
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<QuoteStat[]>([]);
  const [allQuotes, setAllQuotes] = useState<Quote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const fetchMyQuotesData = useCallback(async () => {
    setLoading(true);

    try {
      const [
        dashboardResponse,
        quoteStatsResponse,
        quotesResponse,
        propertiesResponse,
      ] = await Promise.all([
        api.get<ApiEnvelope<LenderDashboardApiData>>(
          "/api/loans/dashboard/lender/",
        ),
        api.get<ApiEnvelope<LenderQuoteStatsData>>(
          "/api/dashboard/lender/quote-stats/",
        ),
        api.get<ApiEnvelope<LenderQuoteApiItem[]>>("/api/loans/quotes/"),
        api.get<ApiEnvelope<LenderPropertyMapItem[]>>("/api/properties/map/"),
      ]);

      const dashboard = dashboardResponse.data?.data;
      const quoteStats = quoteStatsResponse.data?.data;
      const quoteItems = quotesResponse.data?.data || [];
      const propertyItems = propertiesResponse.data?.data || [];
      const dashboardLoanRequests = dashboard?.available_loan_requests || [];

      const statsCards: QuoteStat[] = [
        {
          id: 1,
          label: "Total Quotes",
          value: String(quoteStats?.total_quotes ?? 0),
          icon: "file",
          bgColor: "bg-blue-50",
          iconColor: "bg-blue-600 text-white",
          borderColor: "border-blue-200",
        },
        {
          id: 2,
          label: "Under Review",
          value: String(quoteStats?.under_review_quotes ?? 0),
          icon: "clock",
          bgColor: "bg-indigo-50",
          iconColor: "bg-indigo-600 text-white",
          borderColor: "border-indigo-200",
        },
        {
          id: 3,
          label: "Accepted Quotes",
          value: String(quoteStats?.accepted_quotes ?? 0),
          icon: "check",
          bgColor: "bg-green-50",
          iconColor: "bg-green-600 text-white",
          borderColor: "border-green-200",
        },
        {
          id: 4,
          label: "Total Value",
          value: formatCurrency(quoteStats?.total_value ?? 0),
          icon: "dollar",
          bgColor: "bg-amber-50",
          iconColor: "bg-amber-600 text-white",
          borderColor: "border-amber-200",
        },
      ];
      setStats(statsCards);

      const quoteByLoanRequestId = new Map<number, LenderQuoteApiItem>(
        quoteItems
          .map((quote) => [Number(quote.loan_request), quote] as const)
          .filter(([id]) => Number.isFinite(id) && id > 0),
      );

      const quoteById = new Map<number, LenderQuoteApiItem>(
        quoteItems
          .map((quote) => [Number(quote.id), quote] as const)
          .filter(([id]) => Number.isFinite(id) && id > 0),
      );

      const propertyById = new Map<number, LenderPropertyMapItem>(
        propertyItems.map((property) => [property.id, property]),
      );

      const mappedQuotes: Quote[] = dashboardLoanRequests.map(
        (dashboardRequest: LenderDashboardLoanRequest) => {
          const loanRequestId = Number(dashboardRequest.id);
          const dashboardQuoteId =
            toNumber(dashboardRequest.loan_quote_id) ??
            toNumber(dashboardRequest.quote_id);
          const quote =
            (dashboardQuoteId ? quoteById.get(dashboardQuoteId) : null) ||
            quoteByLoanRequestId.get(loanRequestId) ||
            null;
          const propertyId = toNumber(dashboardRequest.property_id);
          const propertyInfo = propertyId
            ? propertyById.get(propertyId) || null
            : null;

          const fallbackAddress =
            dashboardRequest.property_address ||
            propertyInfo?.property_address ||
            "-";
          const { city, state } = splitAddress(fallbackAddress);
          const expiresIn = getDaysUntil(quote?.expires_at);
          const status = toStatus(quote?.status);

          return {
            id: quote?.id ?? dashboardQuoteId ?? loanRequestId,
            quoteId: quote?.id ?? dashboardQuoteId ?? 0,
            loanRequestId,
            propertyId: propertyId || null,
            propertyName:
              dashboardRequest.property_name ||
              propertyInfo?.property_name ||
              "Property",
            address: fallbackAddress,
            city,
            state,
            sponsor: "N/A",
            image: resolveImageUrl(
              dashboardRequest.property_image_url,
              propertyInfo?.property_image_url,
            ),
            status,
            statusLabel: toStatusLabel(quote?.status),
            priority: expiresIn <= 3 ? "urgent" : "normal",
            propertyType:
              dashboardRequest.property_type ||
              propertyInfo?.property_type ||
              "-",
            interestRate: `${toNumber(quote?.interest_rate)?.toFixed(2) ?? "-"}%`,
            term:
              (quote?.term ?? dashboardRequest.loan_term)
                ? `${quote?.term ?? dashboardRequest.loan_term} months`
                : "-",
            ltv: `${toNumber(quote?.max_as_is_ltv ?? dashboardRequest.ltv)?.toFixed(2) ?? "-"}%`,
            submittedDate: formatDate(quote?.submitted_at),
            expiresIn,
            quotedAmount: formatCurrency(
              quote?.loan_amount ?? dashboardRequest.requested_amount,
            ),
            competingQuotes: 0,
            avgResponseTime: "-",
            lenderName: quote?.lender_name || "-",
            guarantor: quote?.guarantor || "-",
            rawLoanAmount: quote?.loan_amount || "0",
            rawInterestRate: quote?.interest_rate || "0",
            rawExpiresAt: quote?.expires_at || "",
            raw: quote ?? ({} as LenderQuoteApiItem),
          };
        },
      );

      console.log("Mapped Quotes:", mappedQuotes);
      setAllQuotes(mappedQuotes);
    } catch (error) {
      console.error("Failed to load lender quotes", error);
      toast.error("Unable to load your quote dashboard right now.");
      setAllQuotes([]);
      setStats([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyQuotesData();
  }, [fetchMyQuotesData]);

  const filters: QuoteFilter[] = useMemo(() => {
    const submittedCount = allQuotes.filter(
      (quote) => quote.status === "submitted",
    ).length;
    const underReviewCount = allQuotes.filter(
      (quote) => quote.status === "under_review",
    ).length;
    const acceptedCount = allQuotes.filter(
      (quote) => quote.status === "accepted",
    ).length;
    const rejectedCount = allQuotes.filter(
      (quote) => quote.status === "rejected",
    ).length;

    return [
      { id: "all", label: "All", count: allQuotes.length },
      { id: "submitted", label: "Submitted", count: submittedCount },
      { id: "under_review", label: "Under Review", count: underReviewCount },
      { id: "accepted", label: "Accepted", count: acceptedCount },
      { id: "rejected", label: "Rejected", count: rejectedCount },
    ];
  }, [allQuotes]);

  //========== Filter Quotes ===========
  const filteredQuotes = useMemo(
    () =>
      allQuotes.filter((quote) => {
        if (activeFilter !== "all" && quote.status !== activeFilter) {
          return false;
        }

        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            quote.propertyName.toLowerCase().includes(query) ||
            quote.address.toLowerCase().includes(query) ||
            quote.lenderName.toLowerCase().includes(query) ||
            quote.city.toLowerCase().includes(query)
          );
        }

        return true;
      }),
    [activeFilter, allQuotes, searchQuery],
  );

  const handleViewQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    setIsQuoteModalOpen(true);
  };

  const handleEditQuote = (quote: Quote) => {
    if (!quote.quoteId) {
      toast.error("No submitted quote found for this loan request yet.");
      return;
    }

    router.push(`/my-quotes/${quote.quoteId}/edit`);
  };

  const handleViewProperty = (quote: Quote) => {
    if (!quote.propertyId) {
      toast.error("Property information is not available for this quote.");
      return;
    }

    router.push(`/my-quotes/property/${quote.propertyId}`);
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden pb-6">
      {/* ====== Header ====== */}
      <header className="bg-white text-start rounded-2xl p-4 md:p-6 mb-4 md:mb-6 mx-3 md:mx-0">
        <h1 className="text-xl md:text-2xl font-normal text-gray-900">
          My Quotes
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Live lender quote dashboard, quote list, and management actions.
        </p>
      </header>

      {/* ====== Stats Cards ====== */}
      <div className="mx-3 md:mx-0">
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="h-24 rounded-xl border border-gray-200 bg-gray-50 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <StatsCardsQuotes stats={stats} />
        )}
      </div>

      {/* ====== Quotes List with Search and Filters ====== */}
      <div className="mx-3 md:mx-0">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, idx) => (
              <div
                key={idx}
                className="h-56 rounded-2xl border border-gray-200 bg-gray-50 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <QuotesList
            quotes={filteredQuotes}
            filters={filters}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onViewQuote={handleViewQuote}
            onEditQuote={handleEditQuote}
            onViewProperty={handleViewProperty}
          />
        )}
      </div>

      <QuoteDetailsModal
        open={isQuoteModalOpen}
        onOpenChange={setIsQuoteModalOpen}
        quote={selectedQuote}
      />
    </div>
  );
};

export default MyQuotes;
