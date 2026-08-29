"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import {
  Check,
  FileText,
  Loader2,
  AlertCircle,
  Pencil,
  Sparkles,
  Building2,
  MapPin,
  ExternalLink,
  Layers,
  Car,
  Calendar,
  Percent,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/Provider/api";
import type { PropertyData, UploadedFileItem } from "./place-types";

type ProcessingProps = {
  id: number;
  title?: string;
  description?: string;
  propertyId: number | null;
  propertyData?: PropertyData | null;
  uploadedDocuments?: UploadedFileItem[];
  setCurrentStep?: React.Dispatch<React.SetStateAction<number>>;
  setMemorandumId?: React.Dispatch<React.SetStateAction<number | null>>;
  onEditProperty?: () => void;
};

const getFileName = (url?: string, defaultName?: string) => {
  if (defaultName) return defaultName;
  if (!url) return "Document";
  return decodeURIComponent(url.split("/").pop() || url);
};

const formatDate = (iso?: string) => {
  if (!iso) return "Recently";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "Recently";
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const Processing = ({
  id,
  title,
  description,
  setCurrentStep,
  propertyId,
  propertyData,
  uploadedDocuments = [],
  setMemorandumId: setParentMemorandumId,
  onEditProperty,
}: ProcessingProps) => {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generatedMemorandumId, setGeneratedMemorandumId] = useState<
    number | null
  >(null);

  const generateMemorandum = async () => {
    if (!propertyId) {
      setErrorMsg("Property ID is missing. Please complete property creation first.");
      setStatus("error");
      toast.error("Property ID is missing.");
      return;
    }

    setStatus("loading");
    setErrorMsg(null);

    try {
      const response = await api.post("/api/v1/memorandums/generate/", {
        property_id: propertyId,
      });

      const memId =
        response?.data?.data?.memorandum_id ??
        response?.data?.data?.id ??
        response?.data?.memorandum_id ??
        response?.data?.id;

      if (memId) {
        setGeneratedMemorandumId(Number(memId));
        setParentMemorandumId?.(Number(memId));
      }

      setStatus("success");
      toast.success(
        response?.data?.message ||
          "Memorandum generation initiated successfully! AI is analyzing your documents.",
      );
    } catch (err: unknown) {
      const errorObj = err as {
        response?: { data?: { message?: string; errors?: unknown } };
        message?: string;
      };
      const msg =
        errorObj?.response?.data?.message ||
        (errorObj?.response?.data?.errors
          ? JSON.stringify(errorObj.response.data.errors)
          : errorObj?.message || "Failed to start memorandum generation.");
      setErrorMsg(typeof msg === "string" ? msg : JSON.stringify(msg));
      setStatus("error");
      toast.error("Failed to generate memorandum. Please try again.");
    }
  };

  return (
    <div className="rounded-2xl bg-white border border-[#E5E7EB] shadow-sm mt-6 p-6 pb-12 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-semibold">
            <Check className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#0F172A]">
              Step {id + 1}: {title || "Review & Generate"}
            </h1>
            <p className="text-sm text-[#64748B]">
              {description ||
                "Review property information, uploaded documents, and generate memorandum."}
            </p>
          </div>
        </div>

        {onEditProperty && (
          <button
            type="button"
            onClick={onEditProperty}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#CBD5E1] bg-white text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          >
            <Pencil className="h-3.5 w-3.5 text-blue-600" />
            Edit Property Details
          </button>
        )}
      </div>

      {/* Property Overview Card */}
      {propertyData && (
        <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <h3 className="text-base font-semibold text-[#0F172A]">
                  {propertyData.property_name || "Property Summary"}
                </h3>
              </div>
              <p className="text-xs text-[#64748B] flex items-center gap-1 mt-1">
                <MapPin className="h-3.5 w-3.5" />
                {propertyData.property_address || "No address provided"}
              </p>
            </div>

            {propertyData.property_type && (
              <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                {propertyData.property_type}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-3 border-t border-[#E2E8F0]">
            <div className="bg-white p-3 rounded-lg border border-[#E2E8F0]">
              <span className="text-[11px] text-[#64748B] uppercase font-medium flex items-center gap-1">
                <Layers className="h-3 w-3" /> Units
              </span>
              <p className="text-sm font-semibold text-[#0F172A] mt-0.5">
                {propertyData.number_of_units ? `${propertyData.number_of_units} Units` : "-"}
              </p>
            </div>

            <div className="bg-white p-3 rounded-lg border border-[#E2E8F0]">
              <span className="text-[11px] text-[#64748B] uppercase font-medium">Rentable Area</span>
              <p className="text-sm font-semibold text-[#0F172A] mt-0.5">
                {propertyData.rentable_area ? `${propertyData.rentable_area} SF` : "-"}
              </p>
            </div>

            <div className="bg-white p-3 rounded-lg border border-[#E2E8F0]">
              <span className="text-[11px] text-[#64748B] uppercase font-medium flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Year Built
              </span>
              <p className="text-sm font-semibold text-[#0F172A] mt-0.5">
                {propertyData.year_built || "-"}
              </p>
            </div>

            <div className="bg-white p-3 rounded-lg border border-[#E2E8F0]">
              <span className="text-[11px] text-[#64748B] uppercase font-medium flex items-center gap-1">
                <Percent className="h-3 w-3" /> Occupancy
              </span>
              <p className="text-sm font-semibold text-[#0F172A] mt-0.5">
                {propertyData.occupancy ? `${propertyData.occupancy}%` : "-"}
              </p>
            </div>

            <div className="bg-white p-3 rounded-lg border border-[#E2E8F0]">
              <span className="text-[11px] text-[#64748B] uppercase font-medium">Renovated</span>
              <p className="text-sm font-semibold text-[#0F172A] mt-0.5">
                {propertyData.year_renovated || "-"}
              </p>
            </div>

            <div className="bg-white p-3 rounded-lg border border-[#E2E8F0]">
              <span className="text-[11px] text-[#64748B] uppercase font-medium flex items-center gap-1">
                <Car className="h-3 w-3" /> Parking
              </span>
              <p className="text-sm font-semibold text-[#0F172A] mt-0.5">
                {propertyData.parking_spaces !== undefined && propertyData.parking_spaces !== null
                  ? `${propertyData.parking_spaces} spots`
                  : "-"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Uploaded Documents List */}
      <div className="rounded-xl border border-[#E2E8F0] p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <h4 className="text-sm font-semibold text-[#0F172A]">
              Uploaded Property Documents ({uploadedDocuments.length})
            </h4>
          </div>
        </div>

        {uploadedDocuments.length === 0 ? (
          <p className="text-xs text-[#64748B] py-2">
            No additional documents uploaded. Standard extraction will be based on property details.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {uploadedDocuments.map((doc, index) => (
              <div
                key={doc.id || index}
                className="flex items-center justify-between p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]"
              >
                <div className="min-w-0 pr-3">
                  <p className="text-xs font-medium text-[#0F172A] truncate">
                    {getFileName(doc.file_url, doc.name)}
                  </p>
                  <p className="text-[10px] text-[#64748B] mt-0.5">
                    {formatDate(doc.uploaded_at)} {doc.size ? `• ${(doc.size / 1024).toFixed(1)} KB` : ""}
                  </p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium shrink-0">
                  Ready
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Memorandum Generation Action Card */}
      <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">
                AI Memorandum Generation
              </h3>
              <p className="text-xs text-[#475569] mt-1 max-w-xl leading-relaxed">
                Generate a comprehensive, investment-grade memorandum containing Executive Summary, Financial Performance, Rent Roll Analysis, Demographic Metrics, and Market Highlights.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            {status !== "success" ? (
              <button
                type="button"
                onClick={generateMemorandum}
                disabled={status === "loading"}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating Memorandum...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Memorandum
                  </>
                )}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      generatedMemorandumId
                        ? `/memorandum/${generatedMemorandumId}`
                        : "/memorandum",
                    )
                  }
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View Memorandum
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Status Messages */}
        {status === "loading" && (
          <div className="mt-4 flex items-center gap-2.5 text-xs text-blue-800 bg-blue-100/80 rounded-lg p-3 border border-blue-200 animate-pulse">
            <Loader2 className="h-4 w-4 animate-spin shrink-0 text-blue-600" />
            <span>AI is processing property data, analyzing documents, and drafting your memorandum...</span>
          </div>
        )}

        {status === "success" && (
          <div className="mt-4 flex items-center justify-between flex-wrap gap-2 text-xs text-emerald-800 bg-emerald-50 rounded-lg p-3 border border-emerald-200">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Memorandum generation started successfully! You can view it now or continue.</span>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="mt-4 flex items-center justify-between flex-wrap gap-2 text-xs text-red-800 bg-red-50 rounded-lg p-3 border border-red-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
              <span>{errorMsg || "Failed to generate memorandum."}</span>
            </div>
            <button
              type="button"
              onClick={generateMemorandum}
              className="text-xs font-bold text-red-700 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9]">
        <Button
          text="Back"
          className="button-outline text-sm rounded-md"
          onClick={() => {
            if (!setCurrentStep) return;
            setCurrentStep((prev) => Math.max(0, prev - 1));
          }}
        />
        <Button
          text="Complete & View Summary"
          className="button-primary text-sm rounded-md"
          isDisabled={status === "loading"}
          onClick={() => {
            if (!setCurrentStep) return;
            setCurrentStep((prev) => prev + 1);
          }}
        />
      </div>
    </div>
  );
};

export default Processing;