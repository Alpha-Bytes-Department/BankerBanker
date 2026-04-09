"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Download, FileText, ExternalLink } from "lucide-react";
import mammoth from "mammoth/mammoth.browser";
import { Document, Page, pdfjs } from "react-pdf";
import api from "@/Provider/api";
import type { DocviewDocument } from "./docview-types";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

interface PreviewProps {
  document: DocviewDocument | null;
  propertyId: number | null;
  propertyName: string;
  loading: boolean;
  onDownloadDocument: (document: DocviewDocument) => void;
}

const getFileNameFromUrl = (url: string) => {
  const safeUrl = url.split("?")[0];
  return decodeURIComponent(safeUrl.substring(safeUrl.lastIndexOf("/") + 1));
};

const getFileType = (fileName: string): "pdf" | "image" | "docx" | "other" => {
  const extension = fileName.split(".").pop()?.toLowerCase();

  if (extension === "pdf") {
    return "pdf";
  }

  if (extension === "docx") {
    return "docx";
  }

  if (
    extension &&
    ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "avif"].includes(
      extension,
    )
  ) {
    return "image";
  }

  return "other";
};

const Preview = ({
  document,
  propertyId,
  propertyName,
  loading,
  onDownloadDocument,
}: PreviewProps) => {
  const fileName = document
    ? getFileNameFromUrl(document.file_url)
    : "No file selected";
  const fileType = useMemo(() => getFileType(fileName), [fileName]);

  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [docxHtml, setDocxHtml] = useState("");
  const [pdfPageCount, setPdfPageCount] = useState(0);
  const [pdfPageWidth, setPdfPageWidth] = useState(820);

  const pdfContainerRef = useRef<HTMLDivElement | null>(null);
  const previewBlobRef = useRef<string | null>(null);

  useEffect(() => {
    if (!document) {
      setPreviewBlobUrl(null);
      setDocxHtml("");
      setPdfPageCount(0);
      setPreviewError(null);
      setPreviewLoading(false);
      return;
    }

    let isActive = true;

    const cleanupBlob = () => {
      if (previewBlobRef.current) {
        URL.revokeObjectURL(previewBlobRef.current);
        previewBlobRef.current = null;
      }
    };

    const loadPreviewBlob = async () => {
      cleanupBlob();
      setPreviewBlobUrl(null);
      setDocxHtml("");
      setPdfPageCount(0);
      setPreviewError(null);
      setPreviewLoading(true);

      try {
        const response = await api.get(document.file_url, {
          responseType: "blob",
        });
        const blob = response.data as Blob;

        if (!isActive) {
          return;
        }

        if (fileType === "docx") {
          const arrayBuffer = await blob.arrayBuffer();
          const result = await mammoth.convertToHtml({ arrayBuffer });

          if (!isActive) {
            return;
          }

          setDocxHtml(result.value || "<p>No preview content available.</p>");
          return;
        }

        const objectUrl = URL.createObjectURL(blob);
        previewBlobRef.current = objectUrl;
        setPreviewBlobUrl(objectUrl);
      } catch (error) {
        console.error("Failed to load preview blob", error);
        if (isActive) {
          setPreviewError("Unable to preview this file in panel.");
        }
      } finally {
        if (isActive) {
          setPreviewLoading(false);
        }
      }
    };

    loadPreviewBlob();

    return () => {
      isActive = false;
      cleanupBlob();
    };
  }, [document?.id, document?.file_url, fileType]);

  useEffect(() => {
    if (fileType !== "pdf") {
      return;
    }

    const containerNode = pdfContainerRef.current;
    if (!containerNode) {
      return;
    }

    const updateWidth = () => {
      const width = Math.max(containerNode.clientWidth - 24, 320);
      setPdfPageWidth(width);
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(containerNode);

    return () => {
      observer.disconnect();
    };
  }, [fileType, previewBlobUrl]);

  return (
    <div className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-5 w-full border border-[#0000001A] rounded-xl h-[55vh] sm:h-[65vh] lg:h-[calc(90vh-1rem)] bg-white">
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
              {propertyName || "No property selected"}
              {propertyId ? ` · #${propertyId}` : ""}
            </p>
          </div>
        </div>
        <button
          type="button"
          disabled={!document}
          onClick={() => document && onDownloadDocument(document)}
          className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 flex items-center gap-1.5 border border-[#0000001A] px-2.5 py-1.5 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors shrink-0"
        >
          <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Download</span>
        </button>
      </div>

      <div className="flex-1 border border-[#E5E7EB] rounded-xl bg-[#F9FAFB] min-h-0 relative overflow-hidden">
        {loading || previewLoading ? (
          <div className="h-full flex items-center justify-center text-sm text-[#6A7282]">
            Loading preview...
          </div>
        ) : !document ? (
          <div className="h-full flex flex-col justify-center items-center text-center px-4">
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm">
              <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
            <p className="text-sm sm:text-base font-medium text-[#4A5565] mt-3">
              No document selected
            </p>
            <p className="text-xs sm:text-sm text-[#6A7282] mt-1">
              Select a property and document to preview.
            </p>
          </div>
        ) : previewError ? (
          <div className="h-full flex flex-col justify-center items-center text-center px-4">
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm">
              <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
            <p className="text-sm sm:text-base font-medium text-[#4A5565] mt-3">
              {previewError}
            </p>
            <button
              type="button"
              onClick={() => onDownloadDocument(document)}
              className="mt-3 flex items-center gap-1.5 border border-[#0000001A] px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Download File</span>
            </button>
          </div>
        ) : fileType === "pdf" && previewBlobUrl ? (
          <div ref={pdfContainerRef} className="h-full overflow-y-auto p-3">
            <Document
              file={previewBlobUrl}
              onLoadSuccess={({ numPages }) => setPdfPageCount(numPages)}
              onLoadError={() =>
                setPreviewError("Unable to render this PDF in preview.")
              }
              loading={
                <div className="h-full flex items-center justify-center text-sm text-[#6A7282]">
                  Rendering PDF...
                </div>
              }
            >
              <div className="flex flex-col items-center gap-3 pb-3">
                {Array.from({ length: pdfPageCount || 1 }).map((_, index) => (
                  <Page
                    key={index + 1}
                    pageNumber={index + 1}
                    width={pdfPageWidth}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                ))}
              </div>
            </Document>
          </div>
        ) : fileType === "image" && previewBlobUrl ? (
          <div className="h-full w-full flex items-center justify-center p-3 bg-white overflow-auto">
            <img
              src={previewBlobUrl}
              alt={fileName}
              className="max-h-full max-w-full object-contain rounded-lg"
            />
          </div>
        ) : fileType === "docx" ? (
          <div className="h-full overflow-y-auto p-4 bg-white">
            <div
              className="max-w-none text-sm text-[#1F2937] leading-relaxed [&_p]:mb-3 [&_h1]:mb-3 [&_h2]:mb-2 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
              dangerouslySetInnerHTML={{
                __html: docxHtml || "<p>No preview content available.</p>",
              }}
            />
          </div>
        ) : (
          <div className="h-full flex flex-col justify-center items-center text-center px-4">
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm">
              <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
            <p className="text-sm sm:text-base font-medium text-[#4A5565] mt-3">
              Preview not available for this file type
            </p>
            <p className="text-xs sm:text-sm text-[#6A7282] mt-1">
              Download this file to open it with a supported application.
            </p>
            <button
              type="button"
              onClick={() => onDownloadDocument(document)}
              className="mt-3 flex items-center gap-1.5 border border-[#0000001A] px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Download File</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 shrink-0">
        {document ? (
          <a
            href={document.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer flex items-center gap-1.5 border border-[#0000001A] px-2.5 py-1.5 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Open Full View</span>
          </a>
        ) : null}
      </div>
    </div>
  );
};

export default Preview;
