"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import api from "@/Provider/api";
import { readLoanQuotePrefillState } from "@/lib/quote-submit-state";
import type { LoanRequestDetail } from "@/types/loan-request";

type ApiEnvelope<T> = {
  data?: T;
};

type QuoteCreatePayload = {
  lender_name: string;
  guarantor: string;
  expires_at: string;
  loan_amount: string;
  initial_funding: string;
  future_funding: string;
  sponsor_equity: string;
  max_as_is_ltv: string;
  max_ltc: string;
  max_as_stabilized_ltv: string;
  min_as_is_dy: string;
  min_stabilized_dy: string;
  term: string;
  interest_rate: string;
  amortization: string;
  prepayment: string;
  origination_fee: string;
  capex_reserve: string;
  ff_and_e_reserve: string;
  interest_carry_reserve: string;
  extension_conditions: string;
  collateral: string;
  recourse: string;
};

const toNumber = (value: string | number | undefined | null) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const asMoney = (value: number) => value.toFixed(2);

const toDateTimeLocalValue = (date: Date) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const buildDefaultForm = (
  prefillAmount: number,
  prefillTerm: number,
  prefillLtv: number,
): QuoteCreatePayload => {
  const loanAmount = prefillAmount > 0 ? prefillAmount : 4750000;
  const initialFunding = loanAmount * 0.84;
  const futureFunding = Math.max(loanAmount - initialFunding, 0);

  return {
    lender_name: "",
    guarantor: "",
    expires_at: toDateTimeLocalValue(addDays(new Date(), 30)),
    loan_amount: asMoney(loanAmount),
    initial_funding: asMoney(initialFunding),
    future_funding: asMoney(futureFunding),
    sponsor_equity: asMoney(loanAmount * 0.25),
    max_as_is_ltv: (prefillLtv > 0 ? prefillLtv : 72).toFixed(2),
    max_ltc: "80.00",
    max_as_stabilized_ltv: "70.00",
    min_as_is_dy: "8.50",
    min_stabilized_dy: "9.00",
    term: String(prefillTerm > 0 ? prefillTerm : 24),
    interest_rate: "7.25",
    amortization: "30-year amortization",
    prepayment: "3-2-1 step-down",
    origination_fee: "1.00",
    capex_reserve: "50000.00",
    ff_and_e_reserve: "25000.00",
    interest_carry_reserve: "100000.00",
    extension_conditions: "Two 6-month extensions at 0.25% fee each.",
    collateral: "First lien deed of trust",
    recourse: "Non-recourse with standard carve-outs",
  };
};

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const requestId = Array.isArray(params.requestId)
    ? params.requestId[0]
    : params.requestId;

  const numericRequestId = Number(requestId);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [detail, setDetail] = useState<LoanRequestDetail | null>(null);
  const [form, setForm] = useState<QuoteCreatePayload>(() =>
    buildDefaultForm(0, 24, 72),
  );

  useEffect(() => {
    const hydrate = async () => {
      if (!Number.isFinite(numericRequestId) || numericRequestId <= 0) {
        toast.error("Invalid request id.");
        setLoading(false);
        return;
      }

      const statePrefill = readLoanQuotePrefillState(numericRequestId);

      try {
        const response = await api.get<ApiEnvelope<LoanRequestDetail>>(
          `/api/loans/requests/${numericRequestId}/`,
        );
        const payload = response.data?.data ?? null;
        setDetail(payload);

        const requestAmount =
          toNumber(statePrefill?.requestedAmount) ||
          toNumber(payload?.requested_amount) ||
          0;
        const requestTerm =
          toNumber(statePrefill?.loanTerm) ||
          toNumber(payload?.loan_term) ||
          24;
        const requestLtv =
          toNumber(statePrefill?.ltv) || toNumber(payload?.ltv) || 72;

        setForm(buildDefaultForm(requestAmount, requestTerm, requestLtv));
      } catch (error) {
        console.error(
          "Failed to load request detail for quote submission",
          error,
        );
        toast.error("Unable to load request details.");

        const fallbackAmount = toNumber(statePrefill?.requestedAmount) || 0;
        const fallbackTerm = toNumber(statePrefill?.loanTerm) || 24;
        const fallbackLtv = toNumber(statePrefill?.ltv) || 72;
        setForm(buildDefaultForm(fallbackAmount, fallbackTerm, fallbackLtv));
      } finally {
        setLoading(false);
      }
    };

    hydrate();
  }, [numericRequestId]);

  const summary = useMemo(() => {
    return {
      propertyName: detail?.property_name || "Property",
      propertyType: detail?.property_type || "-",
      requestedAmount: detail?.requested_amount || form.loan_amount,
      term: detail?.loan_term || form.term,
      ltv: detail?.ltv || form.max_as_is_ltv,
      address: detail?.property_address || "-",
    };
  }, [detail, form.loan_amount, form.max_as_is_ltv, form.term]);

  const updateField = (field: keyof QuoteCreatePayload, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!Number.isFinite(numericRequestId) || numericRequestId <= 0) {
      toast.error("Invalid request id.");
      return;
    }

    setSubmitting(true);

    try {
      await api.post(`/api/loans/requests/${numericRequestId}/quotes/`, {
        lender_name: form.lender_name.trim(),
        guarantor: form.guarantor.trim(),
        expires_at: new Date(form.expires_at).toISOString(),
        loan_amount: form.loan_amount,
        initial_funding: form.initial_funding,
        future_funding: form.future_funding,
        sponsor_equity: form.sponsor_equity,
        max_as_is_ltv: form.max_as_is_ltv,
        max_ltc: form.max_ltc,
        max_as_stabilized_ltv: form.max_as_stabilized_ltv,
        min_as_is_dy: form.min_as_is_dy,
        min_stabilized_dy: form.min_stabilized_dy,
        term: Number(form.term),
        interest_rate: form.interest_rate,
        amortization: form.amortization.trim(),
        prepayment: form.prepayment.trim(),
        origination_fee: form.origination_fee,
        capex_reserve: form.capex_reserve,
        ff_and_e_reserve: form.ff_and_e_reserve,
        interest_carry_reserve: form.interest_carry_reserve,
        extension_conditions: form.extension_conditions.trim(),
        collateral: form.collateral.trim(),
        recourse: form.recourse.trim(),
      });

      toast.success("Quote submitted successfully.");
      router.push(`/loan-requests/${numericRequestId}`);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Failed to submit quote. Please review form values and try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-10 text-sm text-[#6A7282]">Loading quote form...</div>
    );
  }

  return (
    <div className="space-y-5 pb-10">
      <Link
        href={
          Number.isFinite(numericRequestId)
            ? `/loan-requests/${numericRequestId}`
            : "/loan-requests"
        }
        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Loan Request
      </Link>

      <div className="rounded-xl border border-[#0000001A] bg-white p-4 sm:p-5">
        <h1 className="text-2xl text-gray-900">Submit Quote</h1>
        <p className="mt-1 text-sm text-[#6A7282]">
          {summary.propertyName} | {summary.propertyType}
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3 text-sm">
          <div>
            <p className="text-[#6A7282]">Requested Amount</p>
            <p className="font-medium">
              ${Number(summary.requestedAmount).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[#6A7282]">Loan Term</p>
            <p className="font-medium">{summary.term} months</p>
          </div>
          <div>
            <p className="text-[#6A7282]">LTV</p>
            <p className="font-medium">{summary.ltv}%</p>
          </div>
          <div className="sm:col-span-2 xl:col-span-2">
            <p className="text-[#6A7282]">Address</p>
            <p className="font-medium">{summary.address}</p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-[#0000001A] bg-white p-4 sm:p-5 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <label className="text-sm">
            <p className="mb-1 text-[#4A5565]">Lender Name</p>
            <input
              required
              value={form.lender_name}
              onChange={(e) => updateField("lender_name", e.target.value)}
              className="w-full rounded-lg border border-[#D6D8DC] px-3 py-2"
            />
          </label>

          <label className="text-sm">
            <p className="mb-1 text-[#4A5565]">Guarantor</p>
            <input
              value={form.guarantor}
              onChange={(e) => updateField("guarantor", e.target.value)}
              className="w-full rounded-lg border border-[#D6D8DC] px-3 py-2"
            />
          </label>

          <label className="text-sm">
            <p className="mb-1 text-[#4A5565]">Expires At</p>
            <input
              required
              type="datetime-local"
              value={form.expires_at}
              onChange={(e) => updateField("expires_at", e.target.value)}
              className="w-full rounded-lg border border-[#D6D8DC] px-3 py-2"
            />
          </label>

          <label className="text-sm">
            <p className="mb-1 text-[#4A5565]">Loan Amount</p>
            <input
              required
              type="number"
              step="0.01"
              value={form.loan_amount}
              onChange={(e) => updateField("loan_amount", e.target.value)}
              className="w-full rounded-lg border border-[#D6D8DC] px-3 py-2"
            />
          </label>

          <label className="text-sm">
            <p className="mb-1 text-[#4A5565]">Initial Funding</p>
            <input
              required
              type="number"
              step="0.01"
              value={form.initial_funding}
              onChange={(e) => updateField("initial_funding", e.target.value)}
              className="w-full rounded-lg border border-[#D6D8DC] px-3 py-2"
            />
          </label>

          <label className="text-sm">
            <p className="mb-1 text-[#4A5565]">Future Funding</p>
            <input
              required
              type="number"
              step="0.01"
              value={form.future_funding}
              onChange={(e) => updateField("future_funding", e.target.value)}
              className="w-full rounded-lg border border-[#D6D8DC] px-3 py-2"
            />
          </label>

          <label className="text-sm">
            <p className="mb-1 text-[#4A5565]">Sponsor Equity</p>
            <input
              required
              type="number"
              step="0.01"
              value={form.sponsor_equity}
              onChange={(e) => updateField("sponsor_equity", e.target.value)}
              className="w-full rounded-lg border border-[#D6D8DC] px-3 py-2"
            />
          </label>

          <label className="text-sm">
            <p className="mb-1 text-[#4A5565]">Max As-Is LTV</p>
            <input
              required
              type="number"
              step="0.01"
              value={form.max_as_is_ltv}
              onChange={(e) => updateField("max_as_is_ltv", e.target.value)}
              className="w-full rounded-lg border border-[#D6D8DC] px-3 py-2"
            />
          </label>

          <label className="text-sm">
            <p className="mb-1 text-[#4A5565]">Max LTC</p>
            <input
              required
              type="number"
              step="0.01"
              value={form.max_ltc}
              onChange={(e) => updateField("max_ltc", e.target.value)}
              className="w-full rounded-lg border border-[#D6D8DC] px-3 py-2"
            />
          </label>

          <label className="text-sm">
            <p className="mb-1 text-[#4A5565]">Max As-Stabilized LTV</p>
            <input
              required
              type="number"
              step="0.01"
              value={form.max_as_stabilized_ltv}
              onChange={(e) =>
                updateField("max_as_stabilized_ltv", e.target.value)
              }
              className="w-full rounded-lg border border-[#D6D8DC] px-3 py-2"
            />
          </label>

          <label className="text-sm">
            <p className="mb-1 text-[#4A5565]">Min As-Is DY</p>
            <input
              required
              type="number"
              step="0.01"
              value={form.min_as_is_dy}
              onChange={(e) => updateField("min_as_is_dy", e.target.value)}
              className="w-full rounded-lg border border-[#D6D8DC] px-3 py-2"
            />
          </label>

          <label className="text-sm">
            <p className="mb-1 text-[#4A5565]">Min Stabilized DY</p>
            <input
              required
              type="number"
              step="0.01"
              value={form.min_stabilized_dy}
              onChange={(e) => updateField("min_stabilized_dy", e.target.value)}
              className="w-full rounded-lg border border-[#D6D8DC] px-3 py-2"
            />
          </label>

          <label className="text-sm">
            <p className="mb-1 text-[#4A5565]">Term (months)</p>
            <input
              required
              type="number"
              min="1"
              step="1"
              value={form.term}
              onChange={(e) => updateField("term", e.target.value)}
              className="w-full rounded-lg border border-[#D6D8DC] px-3 py-2"
            />
          </label>

          <label className="text-sm">
            <p className="mb-1 text-[#4A5565]">Interest Rate</p>
            <input
              required
              type="number"
              step="0.01"
              value={form.interest_rate}
              onChange={(e) => updateField("interest_rate", e.target.value)}
              className="w-full rounded-lg border border-[#D6D8DC] px-3 py-2"
            />
          </label>

          <label className="text-sm md:col-span-2 xl:col-span-1">
            <p className="mb-1 text-[#4A5565]">Amortization</p>
            <input
              required
              value={form.amortization}
              onChange={(e) => updateField("amortization", e.target.value)}
              className="w-full rounded-lg border border-[#D6D8DC] px-3 py-2"
            />
          </label>

          <label className="text-sm md:col-span-2 xl:col-span-1">
            <p className="mb-1 text-[#4A5565]">Prepayment</p>
            <input
              required
              value={form.prepayment}
              onChange={(e) => updateField("prepayment", e.target.value)}
              className="w-full rounded-lg border border-[#D6D8DC] px-3 py-2"
            />
          </label>

          <label className="text-sm">
            <p className="mb-1 text-[#4A5565]">Origination Fee</p>
            <input
              required
              type="number"
              step="0.01"
              value={form.origination_fee}
              onChange={(e) => updateField("origination_fee", e.target.value)}
              className="w-full rounded-lg border border-[#D6D8DC] px-3 py-2"
            />
          </label>

          <label className="text-sm">
            <p className="mb-1 text-[#4A5565]">Capex Reserve</p>
            <input
              required
              type="number"
              step="0.01"
              value={form.capex_reserve}
              onChange={(e) => updateField("capex_reserve", e.target.value)}
              className="w-full rounded-lg border border-[#D6D8DC] px-3 py-2"
            />
          </label>

          <label className="text-sm">
            <p className="mb-1 text-[#4A5565]">FF and E Reserve</p>
            <input
              required
              type="number"
              step="0.01"
              value={form.ff_and_e_reserve}
              onChange={(e) => updateField("ff_and_e_reserve", e.target.value)}
              className="w-full rounded-lg border border-[#D6D8DC] px-3 py-2"
            />
          </label>

          <label className="text-sm">
            <p className="mb-1 text-[#4A5565]">Interest Carry Reserve</p>
            <input
              required
              type="number"
              step="0.01"
              value={form.interest_carry_reserve}
              onChange={(e) =>
                updateField("interest_carry_reserve", e.target.value)
              }
              className="w-full rounded-lg border border-[#D6D8DC] px-3 py-2"
            />
          </label>

          <label className="text-sm md:col-span-2 xl:col-span-3">
            <p className="mb-1 text-[#4A5565]">Extension Conditions</p>
            <input
              required
              value={form.extension_conditions}
              onChange={(e) =>
                updateField("extension_conditions", e.target.value)
              }
              className="w-full rounded-lg border border-[#D6D8DC] px-3 py-2"
            />
          </label>

          <label className="text-sm md:col-span-2 xl:col-span-3">
            <p className="mb-1 text-[#4A5565]">Collateral</p>
            <input
              required
              value={form.collateral}
              onChange={(e) => updateField("collateral", e.target.value)}
              className="w-full rounded-lg border border-[#D6D8DC] px-3 py-2"
            />
          </label>

          <label className="text-sm md:col-span-2 xl:col-span-3">
            <p className="mb-1 text-[#4A5565]">Recourse</p>
            <input
              required
              value={form.recourse}
              onChange={(e) => updateField("recourse", e.target.value)}
              className="w-full rounded-lg border border-[#D6D8DC] px-3 py-2"
            />
          </label>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? "Submitting Quote..." : "Submit Quote"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
