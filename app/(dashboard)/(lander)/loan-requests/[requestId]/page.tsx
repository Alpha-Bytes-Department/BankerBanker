"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { toast } from "sonner";
import api from "@/Provider/api";
import {
  formatSectionTitle,
  parsePropertyInformationFromSections,
  sanitizeInlineMarkdownText,
} from "@/lib/memorandum";
import PreviewCover from "@/app/(dashboard)/(sponsor)/memorandum/_components/DetailPageComponent/PreviewCover";
import TableOfContents from "@/app/(dashboard)/(sponsor)/memorandum/_components/DetailPageComponent/TableOfContents";
import DynamicPreviewSections from "@/app/(dashboard)/(sponsor)/memorandum/_components/DetailPageComponent/DynamicPreviewSections";
import {
  getSubmitQuotePath,
  saveLoanQuotePrefillState,
} from "@/lib/quote-submit-state";
import type {
  LoanRequestDetail,
  LoanRequestDocumentLink,
  LoanRequestMemorandumLink,
} from "@/types/loan-request";

type ApiEnvelope<T> = {
  data?: T;
};

type MemorandumSection = {
  id: number;
  section_type: string;
  content: string;
  image_url?: string | null;
  order: number;
};

type MemorandumDetail = {
  id: number;
  title: string;
  status?: string;
  mode?: string;
  property_name?: string;
  property_address?: string;
  property_type?: string;
  number_of_units?: number;
  year_built?: number;
  occupancy?: string | number;
  sponsor_name?: string;
  created_at?: string;
  sections?: MemorandumSection[];
};

const FALLBACK_PROPERTY_IMAGE = "/images/SponsorDashboard.png";

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

const formatTerm = (value: string | number | undefined) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return "-";
  return `${parsed} months`;
};

const formatDateTime = (value?: string) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getFileNameFromUrl = (url: string) => {
  const safeUrl = url.split("?")[0];
  return decodeURIComponent(safeUrl.substring(safeUrl.lastIndexOf("/") + 1));
};

const isPdfUrl = (url: string) => /\.pdf$/i.test(url);
const isImageUrl = (url: string) =>
  /\.(png|jpg|jpeg|gif|webp|svg|bmp|avif)$/i.test(url);

const getMemorandumIdFromLink = (memorandum: LoanRequestMemorandumLink) => {
  if (Number.isFinite(memorandum.id) && memorandum.id > 0) {
    return memorandum.id;
  }

  const match = String(memorandum.url || "").match(
    /\/api\/memorandums\/(\d+)\/?/i,
  );
  const parsed = Number(match?.[1]);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const resolveImageUrl = (value?: string | null) => {
  if (!value) return FALLBACK_PROPERTY_IMAGE;
  const raw = String(value).trim();
  if (!raw || raw === "null" || raw === "undefined") {
    return FALLBACK_PROPERTY_IMAGE;
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

  return FALLBACK_PROPERTY_IMAGE;
};

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const requestId = Array.isArray(params.requestId)
    ? params.requestId[0]
    : params.requestId;

  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<LoanRequestDetail | null>(null);
  const [imageSrc, setImageSrc] = useState(FALLBACK_PROPERTY_IMAGE);
  const [memorandumLoading, setMemorandumLoading] = useState(false);
  const [memorandumDetails, setMemorandumDetails] = useState<
    MemorandumDetail[]
  >([]);
  const [selectedMemorandumId, setSelectedMemorandumId] = useState<
    number | null
  >(null);

  const [selectedDocumentIndex, setSelectedDocumentIndex] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const previewObjectUrlRef = useRef<string | null>(null);

  const fetchMemorandumDetails = useCallback(
    async (links: LoanRequestMemorandumLink[]) => {
      const validMemorandums = links
        .map((item) => ({
          link: item,
          memorandumId: getMemorandumIdFromLink(item),
        }))
        .filter(
          (
            item,
          ): item is {
            link: LoanRequestMemorandumLink;
            memorandumId: number;
          } => Number.isFinite(item.memorandumId),
        );

      if (validMemorandums.length === 0) {
        setMemorandumDetails([]);
        setSelectedMemorandumId(null);
        return;
      }

      setMemorandumLoading(true);

      try {
        const responses = await Promise.all(
          validMemorandums.map(async ({ memorandumId }) => {
            const response = await api.get<ApiEnvelope<MemorandumDetail>>(
              `/api/memorandums/${memorandumId}/`,
            );

            return response.data?.data ?? null;
          }),
        );

        const fetchedMemorandums = responses
          .filter((item): item is MemorandumDetail => Boolean(item))
          .sort((a, b) => a.id - b.id);

        const publishedMemorandums = fetchedMemorandums.filter(
          (item) => String(item.status || "").toLowerCase() === "published",
        );

        const memorandumsToUse =
          publishedMemorandums.length > 0
            ? publishedMemorandums
            : fetchedMemorandums;

        setMemorandumDetails(memorandumsToUse);
        setSelectedMemorandumId(
          memorandumsToUse[0]?.id ?? validMemorandums[0].memorandumId,
        );
      } catch (error) {
        console.error("Failed to load memorandum details", error);
        toast.error("Unable to load memorandum details right now.");
        setMemorandumDetails([]);
        setSelectedMemorandumId(null);
      } finally {
        setMemorandumLoading(false);
      }
    },
    [],
  );

  const fetchDetail = useCallback(async () => {
    if (!requestId) return;

    setLoading(true);
    try {
      const response = await api.get<ApiEnvelope<LoanRequestDetail>>(
        `/api/loans/requests/${requestId}/`,
      );
      const payload = response.data?.data ?? null;
      setDetail(payload);
      setImageSrc(resolveImageUrl(payload?.property_image_url));
      setSelectedDocumentIndex(0);

      if (payload?.memorandum_links?.length) {
        await fetchMemorandumDetails(payload.memorandum_links);
      } else {
        setMemorandumDetails([]);
        setSelectedMemorandumId(null);
      }
    } catch (error) {
      console.error("Failed to load loan request detail", error);
      toast.error("Unable to load loan request detail right now.");
      setDetail(null);
      setMemorandumDetails([]);
      setSelectedMemorandumId(null);
    } finally {
      setLoading(false);
    }
  }, [fetchMemorandumDetails, requestId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const documents = detail?.document_links || [];
  const selectedDocument = useMemo<LoanRequestDocumentLink | null>(() => {
    if (documents.length === 0) return null;
    return documents[selectedDocumentIndex] || documents[0] || null;
  }, [documents, selectedDocumentIndex]);

  const selectedMemorandum = useMemo(() => {
    if (memorandumDetails.length === 0) return null;
    if (selectedMemorandumId === null) return memorandumDetails[0];
    return (
      memorandumDetails.find((item) => item.id === selectedMemorandumId) ||
      memorandumDetails[0]
    );
  }, [memorandumDetails, selectedMemorandumId]);

  const memorandumSections = useMemo(() => {
    const sections = selectedMemorandum?.sections || [];
    return [...sections].sort((a, b) => {
      if (a.order === b.order) {
        return a.id - b.id;
      }
      return a.order - b.order;
    });
  }, [selectedMemorandum?.sections]);

  const parsedPropertyInformation = useMemo(
    () => parsePropertyInformationFromSections(memorandumSections),
    [memorandumSections],
  );

  const memorandumTableItems = useMemo(
    () =>
      memorandumSections.map((section, index) => ({
        id: index + 1,
        title: formatSectionTitle(section.section_type),
        pageNumber: index + 3,
        anchorId: `preview-section-${section.id}`,
      })),
    [memorandumSections],
  );

  const memorandumPropertyName =
    sanitizeInlineMarkdownText(
      selectedMemorandum?.property_name ||
        parsedPropertyInformation.propertyName ||
        detail?.property_name ||
        "Property",
    ) || "Property";

  const memorandumLocation =
    sanitizeInlineMarkdownText(
      selectedMemorandum?.property_address ||
        parsedPropertyInformation.address ||
        detail?.property_address ||
        "",
    ) || "";

  const memorandumPropertyType =
    sanitizeInlineMarkdownText(
      selectedMemorandum?.property_type ||
        parsedPropertyInformation.propertyType ||
        detail?.property_type ||
        "N/A",
    ) || "N/A";

  const memorandumUnits =
    Number(selectedMemorandum?.number_of_units) > 0
      ? Number(selectedMemorandum?.number_of_units)
      : Number(parsedPropertyInformation.numberOfUnits) || 0;

  const memorandumYearBuilt =
    Number(selectedMemorandum?.year_built) > 0
      ? Number(selectedMemorandum?.year_built)
      : Number(parsedPropertyInformation.yearBuilt) ||
        Number(detail?.year_built) ||
        0;

  const memorandumOccupancy =
    Number(selectedMemorandum?.occupancy) > 0
      ? Number(selectedMemorandum?.occupancy)
      : Number(parsedPropertyInformation.occupancy) ||
        Number(detail?.occupancy) ||
        0;

  const handleSubmitQuote = () => {
    if (!detail) {
      toast.error("Loan request details are unavailable.");
      return;
    }

    const numericRequestId = Number(detail.id);
    if (!Number.isFinite(numericRequestId) || numericRequestId <= 0) {
      toast.error("Invalid loan request id.");
      return;
    }

    saveLoanQuotePrefillState(numericRequestId, {
      requestId: numericRequestId,
      propertyName: detail.property_name,
      propertyAddress: detail.property_address,
      propertyType: detail.property_type,
      requestedAmount: Number(detail.requested_amount),
      loanTerm: Number(detail.loan_term),
      ltv: Number(detail.ltv),
      occupancy: Number(detail.occupancy),
      yearBuilt: Number(detail.year_built),
      propertyImageUrl: imageSrc,
    });

    router.push(getSubmitQuotePath(numericRequestId));
  };

  useEffect(() => {
    const cleanupPreview = () => {
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
        previewObjectUrlRef.current = null;
      }
    };

    if (!selectedDocument?.url) {
      cleanupPreview();
      setPreviewUrl(null);
      setPreviewLoading(false);
      setPreviewError(null);
      return;
    }

    let isActive = true;

    const loadPreview = async () => {
      setPreviewLoading(true);
      setPreviewError(null);
      setPreviewUrl(null);
      cleanupPreview();

      try {
        const response = await api.get(selectedDocument.url, {
          responseType: "blob",
        });

        if (!isActive) return;

        const blobUrl = URL.createObjectURL(response.data as Blob);
        previewObjectUrlRef.current = blobUrl;
        setPreviewUrl(blobUrl);
      } catch (error) {
        console.error("Failed to load request document preview", error);
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
      cleanupPreview();
    };
  }, [selectedDocument?.url]);

  if (loading) {
    return (
      <div className="py-10 text-sm text-[#6A7282]">
        Loading request details...
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="py-10 text-sm text-[#6A7282]">
        Loan request not found.
      </div>
    );
  }

  return (
    <div className="space-y-5" id="details">
      <div>
        <Link
          href="/loan-requests"
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Loan Requests
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-5 items-start">
        <div
          className="rounded-xl border border-[#0000001A] bg-white p-4 sm:p-5 xl:order-2"
          id="documents"
        >
          <h2 className="text-lg font-semibold">Document Preview</h2>

          {documents.length > 0 ? (
            <div className="mt-4 space-y-4">
              <div className="flex flex-wrap gap-2">
                {documents.map((document, index) => (
                  <button
                    key={document.id}
                    type="button"
                    onClick={() => setSelectedDocumentIndex(index)}
                    className={`rounded-full px-3 py-1.5 text-xs border transition-colors ${
                      index === selectedDocumentIndex
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Document {index + 1}
                  </button>
                ))}
              </div>

              {selectedDocument ? (
                <>
                  <p className="text-sm text-[#4A5565] font-medium truncate">
                    {getFileNameFromUrl(selectedDocument.url)}
                  </p>

                  <div className="h-56 md:h-72 xl:h-80 rounded-lg border border-[#E5E7EB] overflow-hidden bg-[#F9FAFB]">
                    {previewLoading ? (
                      <div className="h-full flex items-center justify-center text-sm text-[#6A7282]">
                        Loading document preview...
                      </div>
                    ) : previewError ? (
                      <div className="h-full flex items-center justify-center text-sm text-[#6A7282] px-4 text-center">
                        {previewError}
                      </div>
                    ) : previewUrl && isPdfUrl(selectedDocument.url) ? (
                      <iframe
                        src={`${previewUrl}#toolbar=0&navpanes=0`}
                        className="w-full h-full"
                        title="Loan request document preview"
                      />
                    ) : previewUrl && isImageUrl(selectedDocument.url) ? (
                      <img
                        src={previewUrl}
                        alt="Loan request document preview"
                        className="w-full h-full object-contain"
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
                    href={previewUrl || selectedDocument.url}
                    download={getFileNameFromUrl(selectedDocument.url)}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    <Download className="w-4 h-4" />
                    Download Document
                  </a>
                </>
              ) : null}
            </div>
          ) : (
            <p className="mt-3 text-sm text-[#6A7282]">
              No documents available.
            </p>
          )}
        </div>

        <div className="rounded-xl border border-[#0000001A] bg-white p-4 sm:p-5 xl:order-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold">{detail.property_name}</h1>
              <p className="text-sm text-[#6A7282] mt-1">
                Loan Request #{detail.id}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span className="inline-flex w-fit rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                {detail.status || "-"}
              </span>
              <button
                type="button"
                onClick={handleSubmitQuote}
                className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Submit Quote
              </button>
            </div>
          </div>

          <div className="mt-4 relative h-44 rounded-lg overflow-hidden border border-[#E5E7EB] bg-[#F8FAFC]">
            <Image
              src={imageSrc}
              alt={detail.property_name}
              fill
              className="object-cover"
              unoptimized
              onError={() => setImageSrc(FALLBACK_PROPERTY_IMAGE)}
            />
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-[#6A7282]">Requested Amount</p>
              <p className="font-medium">
                {formatCurrency(detail.requested_amount)}
              </p>
            </div>
            <div>
              <p className="text-[#6A7282]">Loan Term</p>
              <p className="font-medium">{formatTerm(detail.loan_term)}</p>
            </div>
            <div>
              <p className="text-[#6A7282]">LTV</p>
              <p className="font-medium">{formatPercent(detail.ltv)}</p>
            </div>
            <div>
              <p className="text-[#6A7282]">Occupancy</p>
              <p className="font-medium">{formatPercent(detail.occupancy)}</p>
            </div>
            <div>
              <p className="text-[#6A7282]">Year Built</p>
              <p className="font-medium">{detail.year_built ?? "-"}</p>
            </div>
            <div>
              <p className="text-[#6A7282]">Property Type</p>
              <p className="font-medium">{detail.property_type || "-"}</p>
            </div>
          </div>

          <div className="mt-4 border-t border-[#E5E7EB] pt-3 text-sm text-[#4A5565] space-y-1">
            <p>
              <span className="text-[#6A7282]">Address:</span>{" "}
              {detail.property_address || "-"}
            </p>
            <p>
              <span className="text-[#6A7282]">Created:</span>{" "}
              {formatDateTime(detail.created_at)}
            </p>
            <p>
              <span className="text-[#6A7282]">Updated:</span>{" "}
              {formatDateTime(detail.updated_at)}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#0000001A] bg-white p-4 sm:p-5">
        <h2 className="text-lg font-semibold">Memorandum Preview</h2>

        {memorandumLoading ? (
          <p className="mt-3 text-sm text-[#6A7282]">
            Loading memorandum details...
          </p>
        ) : selectedMemorandum ? (
          <div className="mt-4">
            {memorandumDetails.length > 1 ? (
              <div className="mb-4 flex flex-wrap gap-2">
                {memorandumDetails.map((memorandum, index) => (
                  <button
                    key={memorandum.id}
                    type="button"
                    onClick={() => setSelectedMemorandumId(memorandum.id)}
                    className={`rounded-full px-3 py-1.5 text-xs border transition-colors ${
                      memorandum.id === selectedMemorandum.id
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Memorandum {index + 1}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="shadow-xl rounded-lg p-3 md:p-6 lg:p-10">
              <PreviewCover
                presentedBy={
                  selectedMemorandum.sponsor_name || "Memorandum Team"
                }
                confidential
                investmentOpportunity="INVESTMENT OFFERING"
                propertyName={memorandumPropertyName}
                location={memorandumLocation}
                stats={{
                  propertyType: memorandumPropertyType,
                  units: memorandumUnits,
                  yearBuilt: memorandumYearBuilt,
                  occupancy: memorandumOccupancy,
                }}
                offeringDate={new Date(
                  selectedMemorandum.created_at || Date.now(),
                ).toLocaleDateString()}
              />

              <TableOfContents items={memorandumTableItems} />
              <DynamicPreviewSections sections={memorandumSections} />
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-[#6A7282]">
            No memorandum available.
          </p>
        )}
      </div>
    </div>
  );
};

export default Page;
