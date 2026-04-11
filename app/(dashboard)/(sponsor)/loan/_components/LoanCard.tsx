"use client";
import { motion } from "framer-motion";
import Button from "@/components/Button";
import { CircleCheckBig, CircleX, Eye, Trash2 } from "lucide-react";
import type { LoanQuote } from "./loan-types";

type LoanCardProps = {
  loan: LoanQuote;
  isMutating?: boolean;
  onAccept: (loan: LoanQuote) => void;
  onDecline: (loan: LoanQuote) => void;
  onView: (loan: LoanQuote) => void;
  onDelete: (loan: LoanQuote) => void;
};

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

const formatRate = (value: string | number | undefined) => {
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

const getInitials = (name: string) => {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 0) return "LQ";
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
};

const getDaysToExpiry = (expiresAt?: string) => {
  if (!expiresAt) return null;
  const expirationDate = new Date(expiresAt);
  if (Number.isNaN(expirationDate.getTime())) return null;
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.ceil((expirationDate.getTime() - Date.now()) / msPerDay);
};

const getStatusClasses = (status?: string) => {
  const normalized = (status || "Pending").toLowerCase();
  if (normalized === "accepted") return "bg-green-100 text-green-700";
  if (normalized === "declined" || normalized === "decline") {
    return "bg-red-100 text-red-700";
  }
  if (normalized === "submitted") return "bg-blue-100 text-blue-700";
  return "bg-yellow-100 text-yellow-700";
};

const isFinalizedStatus = (status?: string) => {
  const normalized = (status || "").toLowerCase();
  return (
    normalized === "accepted" ||
    normalized === "declined" ||
    normalized === "decline"
  );
};

const LoanCard = ({
  loan,
  isMutating = false,
  onAccept,
  onDecline,
  onView,
  onDelete,
}: LoanCardProps) => {
  const statusLabel = loan.status || "Pending";
  const expiresInDays = getDaysToExpiry(loan.expires_at);
  const isFinalizedQuote = isFinalizedStatus(loan.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.01 }}
      className="max-w-[400px] mx-auto w-full rounded-xl border border-blue-300 p-5 bg-white"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
            {getInitials(loan.lender_name)}
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold">{loan.lender_name}</h3>
            <div className="text-xs text-gray-600">Quote #{loan.id}</div>
            <div className="flex items-center gap-2 text-xs ">
              <span
                className={`rounded-full px-2 py-0.5 ${getStatusClasses(statusLabel)}`}
              >
                {statusLabel}
              </span>
            </div>
          </div>
        </div>
        <span className="text-xs rounded-full bg-gray-100 px-2 py-0.5 text-gray-600">
          Request #{loan.loan_request ?? "-"}
        </span>
      </div>

      {/* Info grid */}
      <div className="mt-4 grid grid-cols-2 gap-y-3 text-sm">
        <p>
          <span className="text-gray-500">Loan Amount</span>
          <br />
          {formatCurrency(loan.loan_amount)}
        </p>
        <p>
          <span className="text-gray-500">LTV</span>
          <br />
          {formatPercent(loan.max_as_is_ltv)}
        </p>
        <p>
          <span className="text-gray-500">Interest Rate</span>
          <br />
          {formatRate(loan.interest_rate)}
        </p>
        <p>
          <span className="text-gray-500">Term</span>
          <br />
          {formatTerm(loan.term)}
        </p>
        <p>
          <span className="text-gray-500">Origination Fee</span>
          <br />
          {formatPercent(loan.origination_fee)}
        </p>
        <p>
          <span className="text-gray-500">DSCR</span>
          <br />
          {toNumber(loan.dscr)?.toFixed(2) ?? "-"}x
        </p>
      </div>

      {/* Document */}
      <div className="mt-4 rounded-lg bg-white p-3 text-sm">
        <p className="text-gray-500">Quote details</p>
        <p className="font-medium">
          Open full quote details to preview documents
        </p>
        <button
          type="button"
          onClick={() => onView(loan)}
          className="text-blue-600 text-xs mt-1"
        >
          View Details →
        </button>
      </div>

      {/* Footer */}
      <div className="mt-4">
        <p className="text-xs text-gray-500">
          Quote expires in:{" "}
          <span className="font-medium">
            {expiresInDays === null
              ? "N/A"
              : expiresInDays <= 0
                ? "Expired"
                : `${expiresInDays} day${expiresInDays === 1 ? "" : "s"}`}
          </span>
        </p>
        <div className="mt-3 flex gap-3">
          {!isFinalizedQuote ? (
            <>
              <Button
                icon={<CircleCheckBig size={16} />}
                onClick={() => onAccept(loan)}
                size="medium"
                text="Accept"
                isDisabled={isMutating}
                className="button-primary flex-1"
              />
              <Button
                icon={<CircleX size={16} />}
                onClick={() => onDecline(loan)}
                size="medium"
                text="Decline"
                isDisabled={isMutating}
                className="button-outline flex-1"
              />
            </>
          ) : null}
          <Button
            icon={<Eye size={16} />}
            onClick={() => onView(loan)}
            text="View"
            size="medium"
            isDisabled={isMutating}
            className="button-outline flex-1"
          />
        </div>
        {!isFinalizedQuote ? (
          <div className="mt-3">
            <Button
              icon={<Trash2 size={16} />}
              onClick={() => onDelete(loan)}
              size="medium"
              text="Delete Request"
              isDisabled={isMutating}
              className="w-full bg-red-600 text-white hover:bg-red-700"
            />
          </div>
        ) : null}
      </div>
    </motion.div>
  );
};

export default LoanCard;
