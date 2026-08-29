"use client";
import { useRouter } from "next/navigation";
import { CheckCircle, ExternalLink, ArrowRight, PlusCircle, Building2, MapPin } from "lucide-react";
import type { PropertyData } from "./place-types";

type SubmitSuccessProps = {
  propertyData?: PropertyData | null;
  memorandumId?: number | null;
  onReset?: () => void;
};

const SubmitSuccess = ({
  propertyData,
  memorandumId,
  onReset,
}: SubmitSuccessProps) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center p-4 sm:p-6 pb-20 mt-8">
      <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 text-center shadow-xl overflow-hidden relative">
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 absolute top-0 left-0" />

        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-inner">
          <CheckCircle className="h-9 w-9" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Property & Memorandum Processed!
        </h2>

        <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
          Your property has been successfully created and the AI memorandum generation has been initialized.
        </p>

        {propertyData && (
          <div className="mt-6 rounded-xl border border-gray-100 bg-[#F8FAFC] p-4 text-left">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-600 shrink-0" />
              <p className="text-sm font-semibold text-gray-900 truncate">
                {propertyData.property_name || "New Property"}
              </p>
            </div>
            {propertyData.property_address && (
              <p className="mt-1 text-xs text-gray-500 flex items-center gap-1.5 truncate">
                <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                {propertyData.property_address}
              </p>
            )}
            {memorandumId && (
              <div className="mt-3 pt-3 border-t border-gray-200/60 flex items-center justify-between text-xs">
                <span className="text-gray-500">Memorandum ID:</span>
                <span className="font-semibold text-blue-600">#{memorandumId}</span>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          {memorandumId ? (
            <button
              type="button"
              onClick={() => router.push(`/memorandum/${memorandumId}`)}
              className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition"
            >
              <ExternalLink className="h-4 w-4" />
              View Memorandum
            </button>
          ) : (
            <button
              type="button"
              onClick={() => router.push("/memorandum")}
              className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition"
            >
              <ExternalLink className="h-4 w-4" />
              View Memorandums
            </button>
          )}

          <button
            type="button"
            onClick={() => router.push("/sponsor")}
            className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F172A] px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition"
          >
            Go to Dashboard
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {onReset && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onReset}
              className="text-xs text-gray-500 hover:text-blue-600 font-medium inline-flex items-center gap-1.5 transition"
            >
              <PlusCircle className="h-3.5 w-3.5" /> Add Another Property
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmitSuccess;
