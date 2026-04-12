"use client";

import React from "react";
import { Building2, CalendarClock, HandCoins } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Quote } from "@/types/my-quotes";

type QuoteDetailsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quote: Quote | null;
};

const toNumber = (value: string | number | undefined | null) => {
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

const formatDateTime = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

type DetailTone = "money" | "risk" | "terms" | "meta";

const resolveFieldTone = (label: string): DetailTone => {
  const normalized = label.toLowerCase();

  if (
    normalized.includes("amount") ||
    normalized.includes("funding") ||
    normalized.includes("equity") ||
    normalized.includes("reserve") ||
    normalized.includes("fee")
  ) {
    return "money";
  }

  if (
    normalized.includes("ltv") ||
    normalized.includes("dy") ||
    normalized.includes("rate") ||
    normalized.includes("dscr")
  ) {
    return "risk";
  }

  if (
    normalized.includes("term") ||
    normalized.includes("amortization") ||
    normalized.includes("prepayment") ||
    normalized.includes("collateral") ||
    normalized.includes("recourse") ||
    normalized.includes("extension")
  ) {
    return "terms";
  }

  return "meta";
};

const DETAIL_TONE_STYLES: Record<
  DetailTone,
  {
    container: string;
    label: string;
    badge: string;
    value: string;
  }
> = {
  money: {
    container:
      "border-emerald-200 bg-linear-to-br from-emerald-50 to-teal-50 shadow-[0_8px_24px_rgba(16,185,129,0.10)]",
    label: "text-emerald-800",
    badge: "bg-emerald-600/90 text-white",
    value: "text-emerald-950",
  },
  risk: {
    container:
      "border-blue-200 bg-linear-to-br from-blue-50 to-cyan-50 shadow-[0_8px_24px_rgba(37,99,235,0.10)]",
    label: "text-blue-800",
    badge: "bg-blue-600/90 text-white",
    value: "text-blue-950",
  },
  terms: {
    container:
      "border-violet-200 bg-linear-to-br from-violet-50 to-indigo-50 shadow-[0_8px_24px_rgba(124,58,237,0.10)]",
    label: "text-violet-800",
    badge: "bg-violet-600/90 text-white",
    value: "text-violet-950",
  },
  meta: {
    container:
      "border-amber-200 bg-linear-to-br from-amber-50 to-orange-50 shadow-[0_8px_24px_rgba(217,119,6,0.10)]",
    label: "text-amber-800",
    badge: "bg-amber-600/90 text-white",
    value: "text-amber-950",
  },
};

const DetailField = ({ label, value }: { label: string; value: string }) => {
  const tone = resolveFieldTone(label);
  const styles = DETAIL_TONE_STYLES[tone];

  return (
    <div
      className={`rounded-xl border px-3 py-2.5 transition-transform hover:-translate-y-0.5 ${styles.container}`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className={`text-[11px] uppercase tracking-wide ${styles.label}`}>
          {label}
        </p>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] ${styles.badge}`}
        >
          {tone}
        </span>
      </div>
      <p className={`mt-1.5 text-sm wrap-break-word ${styles.value}`}>
        {value || "-"}
      </p>
    </div>
  );
};

const QuoteDetailsModal: React.FC<QuoteDetailsModalProps> = ({
  open,
  onOpenChange,
  quote,
}) => {
  const raw = quote?.raw;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-7xl overflow-hidden p-0"
        showCloseButton
      >
        <div className="bg-linear-to-r from-[#0D4DA5] via-[#1660C2] to-[#2B7BE4] px-6 py-5 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Quote Details
            </DialogTitle>
            <DialogDescription className="text-blue-100">
              Review complete lender quote terms and pricing details.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg bg-white/15 px-3 py-2 backdrop-blur-sm">
              <p className="text-xs text-blue-100">Lender</p>
              <p className="mt-1 text-sm font-medium">
                {quote?.lenderName || "-"}
              </p>
            </div>
            <div className="rounded-lg bg-white/15 px-3 py-2 backdrop-blur-sm">
              <p className="text-xs text-blue-100">Quote Amount</p>
              <p className="mt-1 text-sm font-medium">
                {formatCurrency(raw?.loan_amount)}
              </p>
            </div>
            <div className="rounded-lg bg-white/15 px-3 py-2 backdrop-blur-sm">
              <p className="text-xs text-blue-100">Status</p>
              <p className="mt-1 text-sm font-medium">
                {quote?.statusLabel || "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="max-h-[65vh] overflow-y-auto bg-slate-50 p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            <DetailField label="Guarantor" value={raw?.guarantor || "-"} />
            <DetailField
              label="Loan Amount"
              value={formatCurrency(raw?.loan_amount)}
            />
            <DetailField
              label="Initial Funding"
              value={formatCurrency(raw?.initial_funding)}
            />
            <DetailField
              label="Future Funding"
              value={formatCurrency(raw?.future_funding)}
            />
            <DetailField
              label="Sponsor Equity"
              value={formatCurrency(raw?.sponsor_equity)}
            />
            <DetailField
              label="Interest Rate"
              value={formatPercent(raw?.interest_rate)}
            />
            <DetailField
              label="Max As-Is LTV"
              value={formatPercent(raw?.max_as_is_ltv)}
            />
            <DetailField label="Max LTC" value={formatPercent(raw?.max_ltc)} />
            <DetailField
              label="Max As-Stabilized LTV"
              value={formatPercent(raw?.max_as_stabilized_ltv)}
            />
            <DetailField
              label="Min As-Is DY"
              value={formatPercent(raw?.min_as_is_dy)}
            />
            <DetailField
              label="Min Stabilized DY"
              value={formatPercent(raw?.min_stabilized_dy)}
            />
            <DetailField
              label="Term"
              value={raw?.term ? `${raw.term} months` : "-"}
            />
            <DetailField
              label="Amortization"
              value={raw?.amortization || "-"}
            />
            <DetailField label="Prepayment" value={raw?.prepayment || "-"} />
            <DetailField
              label="Origination Fee"
              value={formatPercent(raw?.origination_fee)}
            />
            <DetailField
              label="Capex Reserve"
              value={formatCurrency(raw?.capex_reserve)}
            />
            <DetailField
              label="FF and E Reserve"
              value={formatCurrency(raw?.ff_and_e_reserve)}
            />
            <DetailField
              label="Interest Carry Reserve"
              value={formatCurrency(raw?.interest_carry_reserve)}
            />
            <DetailField
              label="Extension Conditions"
              value={raw?.extension_conditions || "-"}
            />
            <DetailField label="Collateral" value={raw?.collateral || "-"} />
            <DetailField label="Recourse" value={raw?.recourse || "-"} />
            <DetailField
              label="DSCR"
              value={raw?.dscr ? `${raw.dscr}x` : "-"}
            />
            <DetailField
              label="Submitted At"
              value={formatDateTime(raw?.submitted_at)}
            />
            <DetailField
              label="Expires At"
              value={formatDateTime(raw?.expires_at)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-5 py-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Building2 className="h-3.5 w-3.5" />
            <span>{quote?.propertyName || "Property"}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <HandCoins className="h-3.5 w-3.5" />
              Loan Request #{quote?.loanRequestId || "-"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarClock className="h-3.5 w-3.5" />
              Quote #{quote?.quoteId || "-"}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteDetailsModal;
