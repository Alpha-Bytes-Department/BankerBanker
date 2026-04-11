"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  CircleCheckBig,
  CircleX,
  Download,
  FileText,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/Provider/api";
import ConfirmActionModal from "@/components/ConfirmActionModal";
import type {
  LoanDocumentLink,
  LoanMemorandumLink,
  LoanQuoteDetail,
  LoanRequestDetail,
} from "../_components/loan-types";

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

const getFileNameFromUrl = (url: string) => {
  const safeUrl = url.split("?")[0];
  return decodeURIComponent(safeUrl.substring(safeUrl.lastIndexOf("/") + 1));
};

const isImageUrl = (url: string) =>
  /\.(png|jpg|jpeg|gif|webp|svg|bmp|avif)$/i.test(url);

const isPdfUrl = (url: string) => /\.pdf$/i.test(url);

const isFinalizedStatus = (status?: string) => {
  const normalized = (status || "").toLowerCase();
  return (
    normalized === "accepted" ||
    normalized === "declined" ||
    normalized === "decline"
  );
};

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const quoteId = Array.isArray(params.quoteId)
    ? params.quoteId[0]
    : params.quoteId;

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<
    null | "accept" | "decline" | "delete"
  >(null);
  const [quote, setQuote] = useState<LoanQuoteDetail | null>(null);
  const [requestDetail, setRequestDetail] = useState<LoanRequestDetail | null>(
    null,
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<
    null | "accept" | "decline" | "delete"
  >(null);
  const previewObjectUrlRef = useRef<string | null>(null);

  const fetchDetails = useCallback(async () => {
    if (!quoteId) return;

    setLoading(true);
    try {
      const quoteResponse = await api.get(`/api/loans/quotes/${quoteId}/`);
      const quoteData: LoanQuoteDetail | null =
        quoteResponse.data?.data ?? null;
      setQuote(quoteData);

      const loanRequestId = Number(quoteData?.loan_request);
      if (Number.isFinite(loanRequestId) && loanRequestId > 0) {
        const requestResponse = await api.get(
          `/api/loans/requests/${loanRequestId}/`,
        );
        setRequestDetail(requestResponse.data?.data ?? null);
      } else {
        setRequestDetail(null);
      }
    } catch (error) {
      console.error("Failed to load quote details", error);
      toast.error("Unable to load quote details.");
      setQuote(null);
      setRequestDetail(null);
    } finally {
      setLoading(false);
    }
  }, [quoteId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const firstDocument = useMemo<LoanDocumentLink | null>(() => {
    return requestDetail?.document_links?.[0] ?? null;
  }, [requestDetail]);

  useEffect(() => {
    const cleanupPreviewUrl = () => {
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
        previewObjectUrlRef.current = null;
      }
    };

    if (!firstDocument?.url) {
      cleanupPreviewUrl();
      setPreviewUrl(null);
      setPreviewError(null);
      setPreviewLoading(false);
      return;
    }

    let isActive = true;

    const loadPreview = async () => {
      setPreviewLoading(true);
      setPreviewError(null);
      setPreviewUrl(null);
      cleanupPreviewUrl();

      try {
        const response = await api.get(firstDocument.url, {
          responseType: "blob",
        });

        if (!isActive) {
          return;
        }

        const blobUrl = URL.createObjectURL(response.data as Blob);
        previewObjectUrlRef.current = blobUrl;
        setPreviewUrl(blobUrl);
      } catch (error) {
        console.error("Failed to load preview document", error);
        if (isActive) {
          setPreviewError("Unable to render this document preview.");
        }
      } finally {
        if (isActive) {
          setPreviewLoading(false);
        }
      }
    };

    loadPreview();

    return () => {
      isActive = false;
      cleanupPreviewUrl();
    };
  }, [firstDocument?.url]);

  const executeAccept = async () => {
    if (!quote) return;
    try {
      setActionLoading("accept");
      await api.post(`/api/loans/quotes/${quote.id}/accept/`);
      toast.success("Quote accepted successfully.");
      await fetchDetails();
    } catch (error) {
      console.error("Failed to accept quote", error);
      toast.error("Failed to accept quote.");
    } finally {
      setActionLoading(null);
    }
  };

  const executeDecline = async () => {
    if (!quote) return;
    try {
      setActionLoading("decline");
      await api.post(`/api/loans/quotes/${quote.id}/decline/`);
      toast.success("Quote declined successfully.");
      await fetchDetails();
    } catch (error) {
      console.error("Failed to decline quote", error);
      toast.error("Failed to decline quote.");
    } finally {
      setActionLoading(null);
    }
  };

  const executeDeleteRequest = async () => {
    const loanRequestId = Number(quote?.loan_request ?? requestDetail?.id);
    if (!Number.isFinite(loanRequestId) || loanRequestId <= 0) {
      toast.error("Unable to resolve loan request id for delete.");
      return;
    }

    try {
      setActionLoading("delete");
      await api.delete(`/api/loans/requests/${loanRequestId}/`);
      toast.success("Loan request deleted successfully.");
      router.push("/loan");
    } catch (error) {
      console.error("Failed to delete loan request", error);
      toast.error("Failed to delete loan request.");
    } finally {
      setActionLoading(null);
    }
  };

  const closeConfirmAction = (open: boolean) => {
    if (!open && actionLoading === null) {
      setPendingAction(null);
    }
  };

  const handleConfirmAction = async () => {
    if (!pendingAction) return;

    if (pendingAction === "accept") {
      await executeAccept();
    }

    if (pendingAction === "decline") {
      await executeDecline();
    }

    if (pendingAction === "delete") {
      await executeDeleteRequest();
    }

    setPendingAction(null);
  };

  const modalConfig = useMemo(() => {
    if (pendingAction === "accept") {
      return {
        title: "Accept quote?",
        description:
          "This will accept this quote and close the related loan request.",
        confirmText: "Accept Quote",
        destructive: false,
      };
    }

    if (pendingAction === "decline") {
      return {
        title: "Decline quote?",
        description:
          "This will decline this quote. You can not undo this action.",
        confirmText: "Decline Quote",
        destructive: true,
      };
    }

    if (pendingAction === "delete") {
      return {
        title: "Delete loan request?",
        description:
          "This will permanently delete this loan request and remove it from your dashboard.",
        confirmText: "Delete Request",
        destructive: true,
      };
    }

    return {
      title: "",
      description: "",
      confirmText: "Confirm",
      destructive: false,
    };
  }, [pendingAction]);

  if (loading) {
    return (
      <div className="py-10 text-sm text-[#6A7282]">
        Loading quote details...
      </div>
    );
  }

  if (!quote) {
    return <div className="py-10 text-sm text-[#6A7282]">Quote not found.</div>;
  }

  const isFinalizedQuote = isFinalizedStatus(quote.status);

  return (
    <div className="space-y-5">
      <div>
        <Link
          href="/loan"
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Loan Quotes
        </Link>
      </div>

      <div className="rounded-xl border border-[#0000001A] bg-white p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">{quote.lender_name}</h1>
            <p className="text-sm text-[#6A7282] mt-1">Quote #{quote.id}</p>
          </div>

          {!isFinalizedQuote ? (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setPendingAction("accept")}
                disabled={actionLoading !== null}
                className="inline-flex items-center gap-1.5 rounded-full button-primary px-4 py-2 text-sm disabled:opacity-60"
              >
                <CircleCheckBig className="w-4 h-4" />
                Accept
              </button>
              <button
                type="button"
                onClick={() => setPendingAction("decline")}
                disabled={actionLoading !== null}
                className="inline-flex items-center gap-1.5 rounded-full button-outline px-4 py-2 text-sm disabled:opacity-60"
              >
                <CircleX className="w-4 h-4" />
                Decline
              </button>
              <button
                type="button"
                onClick={() => setPendingAction("delete")}
                disabled={actionLoading !== null}
                className="inline-flex items-center gap-1.5 rounded-full bg-red-600 text-white px-4 py-2 text-sm hover:bg-red-700 disabled:opacity-60"
              >
                <Trash2 className="w-4 h-4" />
                Delete Request
              </button>
            </div>
          ) : null}
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-[#6A7282]">Loan Amount</p>
            <p className="font-medium">{formatCurrency(quote.loan_amount)}</p>
          </div>
          <div>
            <p className="text-[#6A7282]">Interest Rate</p>
            <p className="font-medium">{formatPercent(quote.interest_rate)}</p>
          </div>
          <div>
            <p className="text-[#6A7282]">Term</p>
            <p className="font-medium">{formatTerm(quote.term)}</p>
          </div>
          <div>
            <p className="text-[#6A7282]">Max As-Is LTV</p>
            <p className="font-medium">{formatPercent(quote.max_as_is_ltv)}</p>
          </div>
          <div>
            <p className="text-[#6A7282]">Origination Fee</p>
            <p className="font-medium">
              {formatPercent(quote.origination_fee)}
            </p>
          </div>
          <div>
            <p className="text-[#6A7282]">DSCR</p>
            <p className="font-medium">
              {toNumber(quote.dscr)?.toFixed(2) ?? "-"}x
            </p>
          </div>
          <div>
            <p className="text-[#6A7282]">Status</p>
            <p className="font-medium">{quote.status || "-"}</p>
          </div>
          <div>
            <p className="text-[#6A7282]">Guarantor</p>
            <p className="font-medium">{quote.guarantor || "-"}</p>
          </div>
          <div>
            <p className="text-[#6A7282]">Loan Request ID</p>
            <p className="font-medium">{quote.loan_request ?? "-"}</p>
          </div>
          <div>
            <p className="text-[#6A7282]">Amortization</p>
            <p className="font-medium">{quote.amortization || "-"}</p>
          </div>
          <div>
            <p className="text-[#6A7282]">Prepayment</p>
            <p className="font-medium">{quote.prepayment || "-"}</p>
          </div>
          <div>
            <p className="text-[#6A7282]">Collateral</p>
            <p className="font-medium">{quote.collateral || "-"}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-5">
        <div className="rounded-xl border border-[#0000001A] bg-white p-4 sm:p-5">
          <h2 className="text-lg font-semibold">Loan Request & Property</h2>
          {requestDetail ? (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[#6A7282]">Property</p>
                <p className="font-medium">{requestDetail.property_name}</p>
              </div>
              <div>
                <p className="text-[#6A7282]">Address</p>
                <p className="font-medium">{requestDetail.property_address}</p>
              </div>
              <div>
                <p className="text-[#6A7282]">Property Type</p>
                <p className="font-medium">{requestDetail.property_type}</p>
              </div>
              <div>
                <p className="text-[#6A7282]">Year Built</p>
                <p className="font-medium">{requestDetail.year_built ?? "-"}</p>
              </div>
              <div>
                <p className="text-[#6A7282]">Occupancy</p>
                <p className="font-medium">
                  {requestDetail.occupancy
                    ? `${requestDetail.occupancy}%`
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-[#6A7282]">Requested Amount</p>
                <p className="font-medium">
                  {formatCurrency(requestDetail.requested_amount)}
                </p>
              </div>
              <div>
                <p className="text-[#6A7282]">Requested Term</p>
                <p className="font-medium">
                  {formatTerm(requestDetail.loan_term)}
                </p>
              </div>
              <div>
                <p className="text-[#6A7282]">Requested LTV</p>
                <p className="font-medium">
                  {formatPercent(requestDetail.ltv)}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#6A7282] mt-3">
              No loan request detail available.
            </p>
          )}

          {requestDetail?.memorandum_links?.length ? (
            <div className="mt-5">
              <h3 className="text-sm font-semibold">Memorandums</h3>
              <div className="mt-2 space-y-2">
                {requestDetail.memorandum_links.map(
                  (memorandum: LoanMemorandumLink) => (
                    <Link
                      key={memorandum.id}
                      href={`/memorandum/${memorandum.id}`}
                      className="block text-sm text-blue-600 hover:text-blue-700"
                    >
                      {memorandum.title}
                    </Link>
                  ),
                )}
              </div>
            </div>
          ) : null}
        </div>

        <div className="rounded-xl border border-[#0000001A] bg-white p-4 sm:p-5">
          <h2 className="text-lg font-semibold">Document Preview</h2>
          {firstDocument ? (
            <div className="mt-4 space-y-3">
              <p className="text-sm text-[#4A5565] font-medium truncate">
                {getFileNameFromUrl(firstDocument.url)}
              </p>

              <div className="h-52 rounded-lg border border-[#E5E7EB] overflow-hidden bg-[#F9FAFB]">
                {previewLoading ? (
                  <div className="h-full flex items-center justify-center text-sm text-[#6A7282]">
                    Loading document preview...
                  </div>
                ) : previewError ? (
                  <div className="h-full flex items-center justify-center text-sm text-[#6A7282] px-4 text-center">
                    {previewError}
                  </div>
                ) : previewUrl && isPdfUrl(firstDocument.url) ? (
                  <iframe
                    src={`${previewUrl}#toolbar=0&navpanes=0`}
                    className="w-full h-full"
                    title="Loan document preview"
                  />
                ) : previewUrl && isImageUrl(firstDocument.url) ? (
                  <img
                    src={previewUrl}
                    alt="Loan document preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-[#6A7282]">
                    <div className="text-center">
                      <FileText className="w-6 h-6 mx-auto mb-2" />
                      Preview not available for this document type.
                    </div>
                  </div>
                )}
              </div>

              <a
                href={previewUrl || firstDocument.url}
                download={getFileNameFromUrl(firstDocument.url)}
                className="inline-flex items-center gap-2 rounded-full button-outline px-4 py-2 text-sm"
              >
                <Download className="w-4 h-4" />
                Download Document
              </a>
            </div>
          ) : (
            <p className="text-sm text-[#6A7282] mt-3">
              No document available for this request.
            </p>
          )}
        </div>
      </div>

      <ConfirmActionModal
        open={Boolean(pendingAction)}
        onOpenChange={closeConfirmAction}
        title={modalConfig.title}
        description={modalConfig.description}
        confirmText={modalConfig.confirmText}
        destructive={modalConfig.destructive}
        isLoading={actionLoading !== null}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
};

export default Page;
