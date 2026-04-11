"use client";
import StatCard from "./StatCard";
import { FiCheck, FiEye } from "react-icons/fi";
import { motion } from "framer-motion";
import type { LoanComparisonSummary, LoanQuote } from "./loan-types";

//========== Type Definitions ===========

type StatType = "primary" | "success" | "warning" | "info";

type QuoteStat = {
  id: number;
  title: string;
  value: string;
  type: StatType;
};

interface ComparisonProps {
  comparison: LoanComparisonSummary | null;
  loading: boolean;
  mutatingQuoteId: number | null;
  onAccept: (quote: LoanQuote) => void;
  onView: (quote: LoanQuote) => void;
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
    return `${value} months`;
  }
  return String(value);
};

const isFinalizedStatus = (status?: string) => {
  const normalized = (status || "").toLowerCase();
  return (
    normalized === "accepted" ||
    normalized === "declined" ||
    normalized === "decline"
  );
};

//========== Comparison Component ===========

const Comparison = ({
  comparison,
  loading,
  mutatingQuoteId,
  onAccept,
  onView,
}: ComparisonProps) => {
  const quoteStats: QuoteStat[] = [
    {
      id: 1,
      title: "Total Quotes",
      value: String(comparison?.total_quotes ?? 0),
      type: "primary",
    },
    {
      id: 2,
      title: "Best Rate",
      value: formatPercent(comparison?.best_rate),
      type: "success",
    },
    {
      id: 3,
      title: "Highest LTV",
      value: formatPercent(comparison?.highest_ltv),
      type: "info",
    },
  ];

  const comparisonQuotes = comparison?.quotes ?? [];
  const metricRows: Array<{
    key: string;
    label: string;
    getValue: (quote: LoanQuote) => string;
  }> = [
    {
      key: "amount",
      label: "Amount",
      getValue: (quote) => formatCurrency(quote.loan_amount),
    },
    {
      key: "rate",
      label: "Rate",
      getValue: (quote) => formatPercent(quote.interest_rate),
    },
    {
      key: "ltv",
      label: "LTV",
      getValue: (quote) => formatPercent(quote.max_as_is_ltv),
    },
    {
      key: "term",
      label: "Term",
      getValue: (quote) => formatTerm(quote.term),
    },
    {
      key: "dscr",
      label: "DSCR",
      getValue: (quote) => `${toNumber(quote.dscr)?.toFixed(2) ?? "-"}x`,
    },
    {
      key: "originationFee",
      label: "Origination Fee",
      getValue: (quote) => formatPercent(quote.origination_fee),
    },
    {
      key: "status",
      label: "Status",
      getValue: (quote) => quote.status || "-",
    },
    {
      key: "expires",
      label: "Expires",
      getValue: (quote) => {
        if (!quote.expires_at) return "-";
        const parsed = new Date(quote.expires_at);
        if (Number.isNaN(parsed.getTime())) return "-";
        return parsed.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      },
    },
  ];

  return (
    <div className="p-5 border border-[#0000001A] rounded-lg">
      {/* ====== Quote Comparison Summary Section ====== */}
      <h1 className="text-lg my-5">Quote Comparison Summary</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quoteStats.map((stat, idx) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: idx * 0.06 }}
          >
            <StatCard title={stat.title} value={stat.value} type={stat.type} />
          </motion.div>
        ))}
      </div>

      {/* ====== Top Recommendations Section ====== */}
      <div className="mt-10 mb-5">
        <h1 className="text-lg">Quotes</h1>
      </div>

      {loading ? (
        <p className="text-sm text-[#6A7282] py-6">Loading quotes...</p>
      ) : comparisonQuotes.length === 0 ? (
        <p className="text-sm text-[#6A7282] py-6">
          No quotes available for comparison.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-[980px] w-full text-sm border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="sticky left-0 z-20 min-w-[200px] bg-gray-50 px-4 py-3 text-left font-semibold text-gray-800 border-b border-r border-gray-200">
                  Metrics
                </th>
                {comparisonQuotes.map((quote) => (
                  <th
                    key={quote.id}
                    className="min-w-[220px] bg-gray-50 px-4 py-3 text-left border-b border-gray-200"
                  >
                    <p className="text-gray-900 font-semibold">
                      {quote.lender_name}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Quote #{quote.id}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {metricRows.map((metric, rowIndex) => (
                <tr key={metric.key}>
                  <th
                    scope="row"
                    className={`sticky left-0 z-10 min-w-[200px] px-4 py-3 text-left font-medium border-r border-b border-gray-200 ${
                      rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    {metric.label}
                  </th>

                  {comparisonQuotes.map((quote) => (
                    <td
                      key={`${metric.key}-${quote.id}`}
                      className={`px-4 py-3 border-b border-gray-200 text-gray-900 ${
                        rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      {metric.getValue(quote)}
                    </td>
                  ))}
                </tr>
              ))}

              <tr>
                <th
                  scope="row"
                  className="sticky left-0 z-10 min-w-[200px] bg-white px-4 py-3 text-left font-medium border-r border-b border-gray-200"
                >
                  Actions
                </th>
                {comparisonQuotes.map((quote) => (
                  <td
                    key={`actions-${quote.id}`}
                    className="bg-white px-4 py-3 border-b border-gray-200"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      {!isFinalizedStatus(quote.status) ? (
                        <button
                          onClick={() => onAccept(quote)}
                          disabled={mutatingQuoteId === quote.id}
                          className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:opacity-60"
                        >
                          <FiCheck className="w-4 h-4" />
                          Accept
                        </button>
                      ) : null}
                      <button
                        onClick={() => onView(quote)}
                        className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                      >
                        <FiEye className="w-4 h-4" />
                        View
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Comparison;
