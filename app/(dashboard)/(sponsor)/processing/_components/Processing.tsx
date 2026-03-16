import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { Check, FileText, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import api from "@/Provider/api";

type UploadedDocument = {
    id: number;
    file_url: string;
    uploaded_at: string;
};

type ProcessingProps = {
    id: number;
    title?: string;
    description?: string;
    propertyId: number | null;
    uploadedDocuments?: UploadedDocument[];
    setCurrentStep?: React.Dispatch<React.SetStateAction<number>>;
};

// Derive a clean filename from a URL or file_url
const getFileName = (url: string) => decodeURIComponent(url.split("/").pop() || url);

// Derive rough file size label isn't available from API — show upload time instead
const formatDate = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });

const Processing = ({
    id,
    title,
    description,
    setCurrentStep,
    propertyId,
    uploadedDocuments = [],
}: ProcessingProps) => {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [memorandumId, setMemorandumId] = useState<number | null>(null);

    // Trigger generation automatically on mount
    useEffect(() => {
        if (!propertyId) return;
        generateMemorandum();
    }, [propertyId]);

    const generateMemorandum = async () => {
        if (!propertyId) {
            setErrorMsg("Property ID is missing.");
            setStatus("error");
            return;
        }

        setStatus("loading");
        setErrorMsg(null);

        try {
            const response = await api.post("/api/memorandums/generate/", {
                property_id: propertyId,
            });

            if (response?.data?.success) {
                setMemorandumId(response.data.data.memorandum_id);
                setStatus("success");
                toast.success(response.data.message || "Memorandum generation started.");
            } else {
                throw new Error(response?.data?.message || "Generation failed.");
            }
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.errors ||
                err?.message ||
                "Something went wrong.";
            setErrorMsg(typeof msg === "string" ? msg : JSON.stringify(msg));
            setStatus("error");
            toast.error("Failed to start memorandum generation.");
        }
    };

    return (
        <div className="rounded-xl bg-white shadow-sm mt-6 p-5 pb-16 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-sm font-semibold">
                    <Check stroke="#0D4DA5" />
                </div>
                <div>
                    <h1 className="text-xl">Step {id + 1}: {title}</h1>
                    <p className="text-[#4A5565]">{description}</p>
                </div>
            </div>

            {/* AI Document Analysis */}
            <div className="rounded-lg bg-blue-50 border border-blue-100 p-5">
                <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <FileText stroke="#0D4DA5" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">
                            AI Document Analysis
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                            Our AI will analyze your uploaded documents to automatically extract:
                        </p>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                            {[
                                "Property details",
                                "Market analysis",
                                "Financial metrics",
                                "Investment highlights",
                            ].map(item => (
                                <div key={item} className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-green-500" />
                                    <span className="text-gray-700">{item}</span>
                                </div>
                            ))}
                        </div>

                        {/* Generation status banner */}
                        <div className="mt-4">
                            {status === "loading" && (
                                <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-100 rounded-lg px-3 py-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Starting memorandum generation…
                                </div>
                            )}
                            {status === "success" && (
                                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                                    <Check className="h-4 w-4" />
                                    Memorandum generation started
                                    {memorandumId && (
                                        <span className="ml-1 text-green-500">(ID: {memorandumId})</span>
                                    )}
                                </div>
                            )}
                            {status === "error" && (
                                <div className="flex items-center justify-between gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 shrink-0" />
                                        {errorMsg}
                                    </div>
                                    <button
                                        onClick={generateMemorandum}
                                        className="text-xs font-medium underline hover:no-underline"
                                    >
                                        Retry
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Uploaded Documents */}
            <div className="border border-[#E5E7EB] rounded-lg p-5">
                <div className="px-4 py-3 text-sm font-medium text-gray-700">
                    Uploaded Documents ({uploadedDocuments.length})
                </div>

                {uploadedDocuments.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-gray-400">No documents uploaded.</p>
                ) : (
                    <div>
                        {uploadedDocuments.map((doc) => (
                            <div
                                key={doc.id}
                                className="flex items-center justify-between px-4 py-3 bg-[#F9FAFB] rounded-lg mb-3"
                            >
                                <div className="min-w-0 flex-1 pr-4">
                                    <p className="text-sm font-medium text-gray-800 truncate">
                                        {getFileName(doc.file_url)}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Uploaded {formatDate(doc.uploaded_at)}
                                    </p>
                                </div>

                                <span
                                    className={`text-xs px-3 py-1 rounded-full shrink-0 ${
                                        status === "success"
                                            ? "bg-green-100 text-green-600"
                                            : status === "error"
                                            ? "bg-red-100 text-red-500"
                                            : "bg-blue-100 text-blue-600"
                                    }`}
                                >
                                    {status === "success"
                                        ? "Queued"
                                        : status === "error"
                                        ? "Failed"
                                        : "Processing"}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4">
                <Button
                    text="Back"
                    className="button-outline text-sm rounded-md"
                    onClick={() => {
                        if (!setCurrentStep) return;
                        setCurrentStep(id - 1);
                    }}
                />
                <Button
                    text="Continue"
                    className="button-primary text-sm rounded-md"
                    isDisabled={status === "loading"}
                    onClick={() => {
                        if (!setCurrentStep) return;
                        setCurrentStep(id + 1);
                    }}
                />
            </div>
        </div>
    );
};

export default Processing;