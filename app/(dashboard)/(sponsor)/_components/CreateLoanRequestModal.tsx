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
  createLoanRequest,
  type SponsorLoanRequestItem,
} from "../_api/loan-requests-api";
import { toast } from "sonner";
import { LuDollarSign, LuCalendar, LuPercent, LuBuilding2 } from "react-icons/lu";

export interface PropertyOption {
  id: number;
  property_name: string;
  property_address?: string;
  property_type?: string;
  thumbnail_url?: string | null;
}

interface CreateLoanRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  properties: PropertyOption[];
  preselectedPropertyId?: number | null;
  onSuccess?: (request: SponsorLoanRequestItem) => void;
}

export default function CreateLoanRequestModal({
  open,
  onOpenChange,
  properties,
  preselectedPropertyId,
  onSuccess,
}: CreateLoanRequestModalProps) {
  const queryClient = useQueryClient();

  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  const [requestedAmount, setRequestedAmount] = useState<string>("5000000.00");
  const [loanTerm, setLoanTerm] = useState<string>("36");
  const [ltv, setLtv] = useState<string>("75.00");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (preselectedPropertyId) {
      setSelectedPropertyId(String(preselectedPropertyId));
    } else if (properties.length > 0 && !selectedPropertyId) {
      setSelectedPropertyId(String(properties[0].id));
    }
  }, [preselectedPropertyId, properties, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const propId = Number(selectedPropertyId);
    if (!Number.isFinite(propId) || propId <= 0) {
      setError("Please select a valid property.");
      return;
    }

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
      const newRequest = await createLoanRequest({
        property: propId,
        requested_amount: amountNum.toFixed(2),
        loan_term: termNum,
        ltv: ltvNum.toFixed(2),
      });

      // Invalidate queries so dashboard, requests list, and quotes refresh immediately
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["loan-requests"] }),
        queryClient.invalidateQueries({ queryKey: ["sponsor-dashboard"] }),
        queryClient.invalidateQueries({ queryKey: ["properties"] }),
      ]);

      toast.success("Loan request created successfully!");
      if (onSuccess) onSuccess(newRequest);
      onOpenChange(false);
    } catch (err: any) {
      console.error("Failed to create loan request", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to create loan request. Please check details and try again.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
      toast.error("Failed to create loan request.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedProperty = properties.find(
    (p) => String(p.id) === selectedPropertyId,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] p-6 bg-white rounded-2xl shadow-xl">
        <DialogHeader className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
              <LuBuilding2 />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                Create Loan Request
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                Submit loan terms to receive competitive quotes from commercial lenders.
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

          {/* Property selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
              Select Property *
            </label>
            <select
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              required
              className="w-full h-11 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            >
              <option value="" disabled>
                -- Choose a property --
              </option>
              {properties.map((prop) => (
                <option key={prop.id} value={prop.id}>
                  {prop.property_name}{" "}
                  {prop.property_address ? `— ${prop.property_address}` : ""}
                </option>
              ))}
            </select>
            {selectedProperty && (
              <p className="mt-1 text-xs text-gray-500">
                Property ID #{selectedProperty.id} • Type:{" "}
                <span className="capitalize font-medium text-gray-700">
                  {selectedProperty.property_type || "Commercial"}
                </span>
              </p>
            )}
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
                placeholder="5000000.00"
                required
                className="w-full h-11 pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
                  placeholder="36"
                  required
                  className="w-full h-11 pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {Number(loanTerm) >= 12
                  ? `~${(Number(loanTerm) / 12).toFixed(1)} years`
                  : `${loanTerm} months`}
              </p>
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
                  placeholder="75.00"
                  required
                  className="w-full h-11 pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Loan-to-value ratio: {ltv}%
              </p>
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
              disabled={submitting || !selectedPropertyId}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                "Submit Loan Request"
              )}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
