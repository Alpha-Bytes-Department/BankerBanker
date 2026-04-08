"use client";

import { Download, FileText, ExternalLink } from "lucide-react";
import type { DocviewDocument } from "./docview-types";

interface PreviewProps {
    document: DocviewDocument | null;
    propertyId: number | null;
    propertyName: string;
    loading: boolean;
    onDownloadDocument: (document: DocviewDocument) => void;
}

const getFileNameFromUrl = (url: string) => {
    const safeUrl = url.split('?')[0];
    return decodeURIComponent(safeUrl.substring(safeUrl.lastIndexOf('/') + 1));
};

const Preview = ({
    document,
    propertyId,
    propertyName,
    loading,
    onDownloadDocument,
}: PreviewProps) => {
    const fileName = document ? getFileNameFromUrl(document.file_url) : "No file selected";

    return (
        <div className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-5 w-full border border-[#0000001A] rounded-xl h-[55vh] sm:h-[65vh] lg:h-[calc(90vh-1rem)] bg-white">
            {/* Header */}
            <div className="flex items-center justify-between gap-2 shrink-0">
                <div className="flex gap-2 items-center min-w-0 flex-1">
                    <span className="shrink-0 p-1.5 rounded-lg bg-primary/10">
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </span>
                    <div className="min-w-0">
                        <h1 className="text-sm sm:text-base font-semibold truncate leading-tight">
                            {fileName}
                        </h1>
                        <p className="text-xs text-[#6A7282] truncate">
                            {propertyId ? `Property #${propertyId}` : "No property selected"}
                            {propertyName ? ` · ${propertyName}` : ""}
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    disabled={!document}
                    onClick={() => document && onDownloadDocument(document)}
                    className='cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 flex items-center gap-1.5 border border-[#0000001A] px-2.5 py-1.5 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors shrink-0'
                >
                    <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Download</span>
                </button>
            </div>

            {/* Preview Area */}
            <div className="flex-1 border border-[#E5E7EB] rounded-xl bg-[#F9FAFB] min-h-0 relative overflow-hidden">
                {loading ? (
                    <div className="h-full flex items-center justify-center text-sm text-[#6A7282]">
                        Loading preview...
                    </div>
                ) : document ? (
                    <iframe
                        src={`${document.file_url}#toolbar=1&navpanes=0`}
                        title={fileName}
                        className="w-full h-full"
                    />
                ) : (
                    <div className="h-full flex flex-col justify-center items-center text-center px-4">
                        <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm">
                            <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                        </div>
                        <p className="text-sm sm:text-base font-medium text-[#4A5565] mt-3">No document selected</p>
                        <p className="text-xs sm:text-sm text-[#6A7282] mt-1">Pick a document from the list to preview it here.</p>
                    </div>
                )}
            </div>

            {/* Preview Actions */}
            <div className="flex items-center justify-end gap-2 shrink-0">
                {document && (
                    <a
                        href={document.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer flex items-center gap-1.5 border border-[#0000001A] px-2.5 py-1.5 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                        <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Open Full View</span>
                    </a>
                )}
            </div>
        </div>
    );
};

export default Preview;
