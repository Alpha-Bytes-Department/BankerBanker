"use client";

import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  updateLoanRequest,
  type SponsorLoanRequestItem,
} from "../_api/loan-requests-api";
import { toast } from "sonner";
import { LuDollarSign, LuCalendar, LuPercent, LuPencil } from "react-icons/lu";

interface UpdateLoanRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loanRequest: SponsorLoanRequestItem | null;
  onSuccess?: (updatedRequest: SponsorLoanRequestItem) => void;
}

export default function UpdateLoanRequestModal({
  open,
  onOpenChange,
  loanRequest,
  onSuccess,
}: UpdateLoanRequestModalProps) {
  const queryClient = useQueryClient();

  const [requestedAmount, setRequestedAmount] = useState<string>("");
  const [loanTerm, setLoanTerm] = useState<string>("");
  const [ltv, setLtv] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loanRequest) {
      setRequestedAmount(String(loanRequest.requested_amount || ""));
      setLoanTerm(String(loanRequest.loan_term || ""));
      setLtv(String(loanRequest.ltv || ""));
      setError("");
    }
  }, [loanRequest, open]);

  if (!loanRequest) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const amountNum = parseFloat(requestedAmount.replace(/,/g, ""));
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Requested amount must be a positive number.");
      return;
    }

    const termNum = parseInt(loanTerm, 10);
    if (isNaN(termNum) || termNum <= 0) {
      setError("Loan term must be at least 1 month.");
      return;
    }

    const ltvNum = parseFloat(ltv);
    if (isNaN(ltvNum) || ltvNum <= 0 || ltvNum > 100) {
      setError("LTV must be between 1% and 100%.");
      return;
    }

    try {
      setSubmitting(true);
      const updated = await updateLoanRequest(loanRequest.id, {
        requested_amount: amountNum.toFixed(2),
        loan_term: termNum,
        ltv: ltvNum.toFixed(2),
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["loan-requests"] }),
        queryClient.invalidateQueries({ queryKey: ["sponsor-dashboard"] }),
      ]);

      toast.success("Loan request updated successfully!");
      if (onSuccess) onSuccess(updated);
      onOpenChange(false);
    } catch (err: any) {
      console.error("Failed to update loan request", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to update loan request. Please check values and try again.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
      toast.error("Failed to update loan request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-6 bg-white rounded-2xl shadow-xl">
        <DialogHeader className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg">
              <LuPencil />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                Update Loan Request
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                Modify loan terms for{" "}
                <span className="font-medium text-gray-800">
                  {loanRequest.property_name}
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          {/* Read-only property banner */}
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between text-xs text-gray-600">
            <div>
              <span className="font-semibold text-gray-800 block text-sm">
                {loanRequest.property_name}
              </span>
              <span>{loanRequest.property_address || "Address not provided"}</span>
            </div>
            <span className="px-2.5 py-1 bg-white border rounded-full text-xs font-medium text-gray-700">
              ID #{loanRequest.id}
            </span>
          </div>

          {/* Requested Amount */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
              Requested Loan Amount ($) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base">
                <LuDollarSign />
              </span>
              <input
                type="number"
                step="any"
                min="1000"
                value={requestedAmount}
                onChange={(e) => setRequestedAmount(e.target.value)}
                placeholder="5500000.00"
                required
                className="w-full h-11 pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Formatted:{" "}
              <span className="font-semibold text-gray-700">
                ${Number(requestedAmount || 0).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Loan Term */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                Loan Term (Months) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base">
                  <LuCalendar />
                </span>
                <input
                  type="number"
                  min="1"
                  max="360"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  placeholder="48"
                  required
                  className="w-full h-11 pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                />
              </div>
            </div>

            {/* Target LTV */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                Target LTV (%) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base">
                  <LuPercent />
                </span>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="100"
                  value={ltv}
                  onChange={(e) => setLtv(e.target.value)}
                  placeholder="70.00"
                  required
                  className="w-full h-11 pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 gap-2 sm:gap-0">
            <button
              type="button"
              disabled={submitting}
              onClick={() => onOpenChange(false)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
