"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import api from "@/Provider/api";
import type { LenderQuoteApiItem } from "@/types/my-quotes";

type ApiEnvelope<T> = {
  data?: T;
};

type QuotePatchForm = {
  interest_rate: string;
  loan_amount: string;
  expires_at: string;
};

const formatCurrency = (value: string | number | undefined) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(parsed);
};

const toDateTimeLocalValue = (value?: string) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  const local = new Date(parsed.getTime() - parsed.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

const toServerIsoDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString();
};

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const quoteId = Array.isArray(params.quoteId)
    ? params.quoteId[0]
    : params.quoteId;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [quote, setQuote] = useState<LenderQuoteApiItem | null>(null);
  const [form, setForm] = useState<QuotePatchForm>({
    interest_rate: "",
    loan_amount: "",
    expires_at: "",
  });

  const fetchQuote = useCallback(async () => {
    if (!quoteId) return;

    setLoading(true);
    try {
      const response = await api.get<ApiEnvelope<LenderQuoteApiItem>>(
        `/api/loans/quotes/${quoteId}/`,
      );
      const payload = response.data?.data ?? null;
      setQuote(payload);
      setForm({
        interest_rate: payload?.interest_rate || "",
        loan_amount: payload?.loan_amount || "",
        expires_at: toDateTimeLocalValue(payload?.expires_at),
      });
    } catch (error) {
      console.error("Failed to load quote for edit", error);
      toast.error("Unable to load quote details.");
      setQuote(null);
    } finally {
      setLoading(false);
    }
  }, [quoteId]);

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  const updateField = (field: keyof QuotePatchForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!quoteId) {
      toast.error("Invalid quote id.");
      return;
    }

    const expiresAtIso = toServerIsoDate(form.expires_at);
    if (!expiresAtIso) {
      toast.error("Please provide a valid expiration date.");
      return;
    }

    setSaving(true);
    try {
      await api.patch(`/api/loans/quotes/${quoteId}/`, {
        interest_rate: form.interest_rate,
        loan_amount: form.loan_amount,
        expires_at: expiresAtIso,
      });

      toast.success("Quote updated successfully.");
      router.push("/my-quotes");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Failed to update quote. Please check your values.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-10 text-sm text-[#6A7282]">
        Loading quote editor...
      </div>
    );
  }

  if (!quote) {
    return <div className="py-10 text-sm text-[#6A7282]">Quote not found.</div>;
  }

  return (
    <div className="space-y-5 pb-10">
      <Link
        href="/my-quotes"
        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to My Quotes
      </Link>

      <div className="rounded-xl border border-[#0000001A] bg-white p-4 sm:p-5">
        <h1 className="text-2xl text-gray-900">Edit Quote</h1>
        <p className="mt-1 text-sm text-[#6A7282]">
          Update allowed fields for Quote #{quote.id}.
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
          <div>
            <p className="text-[#6A7282]">Lender</p>
            <p className="font-medium">{quote.lender_name || "-"}</p>
          </div>
          <div>
            <p className="text-[#6A7282]">Loan Request ID</p>
            <p className="font-medium">{quote.loan_request}</p>
          </div>
          <div>
            <p className="text-[#6A7282]">Current Amount</p>
            <p className="font-medium">{formatCurrency(quote.loan_amount)}</p>
          </div>
          <div>
            <p className="text-[#6A7282]">Current Interest</p>
            <p className="font-medium">{quote.interest_rate}%</p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-[#0000001A] bg-white p-4 sm:p-5 space-y-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="text-sm">
            <p className="mb-1 text-[#4A5565]">Interest Rate (%)</p>
            <input
              required
              type="number"
              step="0.01"
              min="0"
              value={form.interest_rate}
              onChange={(e) => updateField("interest_rate", e.target.value)}
              className="w-full rounded-lg border border-[#D6D8DC] px-3 py-2"
            />
          </label>

          <label className="text-sm">
            <p className="mb-1 text-[#4A5565]">Loan Amount</p>
            <input
              required
              type="number"
              step="0.01"
              min="0"
              value={form.loan_amount}
              onChange={(e) => updateField("loan_amount", e.target.value)}
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
        </div>

        <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700">
          Editable fields are limited to the PATCH contract: interest_rate,
          loan_amount, expires_at.
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default Page;
