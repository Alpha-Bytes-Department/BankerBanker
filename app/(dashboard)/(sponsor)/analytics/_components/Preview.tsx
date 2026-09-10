"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Download,
  FileText,
  ExternalLink,
  FileImage,
  RefreshCw,
  FileSpreadsheet,
  FileCode,
} from "lucide-react";
import mammoth from "mammoth/mammoth.browser";
import type { DocviewDocument } from "./docview-types";

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

const resolveFileUrl = (url: string) => {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;

  const rawBaseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://charissa-intuitable-corroboratorily.ngrok-free.dev/";
  const baseUrl = rawBaseUrl.endsWith("/") ? rawBaseUrl : `${rawBaseUrl}/`;
  return new URL(url.replace(/^\/+/, ""), baseUrl).toString();
};

type FileCategory = "pdf" | "image" | "docx" | "text" | "csv" | "other";

const getFileType = (fileName: string): FileCategory => {
  const extension = fileName.split(".").pop()?.toLowerCase();

  if (extension === "pdf") return "pdf";
  if (extension === "docx" || extension === "doc") return "docx";
  if (
    extension &&
    ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "avif"].includes(
      extension,
    )
  ) {
    return "image";
  }
  if (extension === "csv") return "csv";
  if (extension && ["txt", "json", "md", "xml", "log"].includes(extension)) {
    return "text";
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
    ? document.name || getFileNameFromUrl(document.file_url) || "Document"
    : "No file selected";
  const fileType = useMemo(() => getFileType(fileName), [fileName]);
  const rawFileUrl = document ? resolveFileUrl(document.file_url) : "";

  // Same-origin proxy URL to prevent X-Frame-Options: SAMEORIGIN/DENY blocks from ngrok/backend
  const proxyUrl = rawFileUrl
    ? `/api/document-proxy?url=${encodeURIComponent(rawFileUrl)}`
    : "";

  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [docxHtml, setDocxHtml] = useState("");
  const [textContent, setTextContent] = useState("");

  useEffect(() => {
    if (!document || !proxyUrl) {
      setDocxHtml("");
      setTextContent("");
      setPreviewError(null);
      setPreviewLoading(false);
      return;
    }

    let isActive = true;

    // For DOCX and Text files, fetch through same-origin proxy and parse
    if (fileType === "docx" || fileType === "text" || fileType === "csv") {
      setPreviewLoading(true);
      setPreviewError(null);

      fetch(proxyUrl)
        .then(async (res) => {
          if (!res.ok) {
            throw new Error(`Failed to load file content (${res.status})`);
          }

          if (fileType === "docx") {
            const arrayBuffer = await res.arrayBuffer();
            const result = await mammoth.convertToHtml({ arrayBuffer });
            if (isActive) {
              setDocxHtml(
                result.value || "<p>No readable content in document.</p>",
              );
            }
          } else {
            const text = await res.text();
            if (isActive) {
              setTextContent(text);
            }
          }
        })
        .catch((err) => {
          console.error("Failed to parse document content:", err);
          if (isActive) {
            setPreviewError("Unable to render inline preview for this file.");
          }
        })
        .finally(() => {
          if (isActive) {
            setPreviewLoading(false);
          }
        });

      return () => {
        isActive = false;
      };
    }

    // PDF and Image are streamed directly by the same-origin proxy into iframe/img
    setDocxHtml("");
    setTextContent("");
    setPreviewError(null);
    setPreviewLoading(false);

    return () => {
      isActive = false;
    };
  }, [document, fileType, proxyUrl]);

  return (
    <div className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-5 w-full border border-[#0000001A] rounded-xl h-[55vh] sm:h-[65vh] lg:h-[calc(90vh-1rem)] bg-white shadow-2xs">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl border border-[#DDE3EA] bg-[#F8FAFC] px-3 py-2 shrink-0">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#4A5565]">
            Document Viewer
          </p>
          <p className="text-xs text-[#6A7282]">
            Images, PDFs, Word DOCX, and Text documents supported with inline viewer.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {["PDF", "Images", "DOCX", "CSV / Text"].map((label) => (
            <span
              key={label}
              className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary"
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Selected File Bar */}
      <div className="flex items-center justify-between gap-2 shrink-0">
        <div className="flex gap-2.5 items-center min-w-0 flex-1">
          <span className="shrink-0 p-2 rounded-lg bg-primary/10 text-primary">
            {fileType === "image" ? (
              <FileImage className="w-5 h-5" />
            ) : fileType === "csv" ? (
              <FileSpreadsheet className="w-5 h-5" />
            ) : fileType === "text" ? (
              <FileCode className="w-5 h-5" />
            ) : (
              <FileText className="w-5 h-5" />
            )}
          </span>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-semibold truncate leading-tight text-gray-900">
              {fileName}
            </h1>
            <p className="text-xs text-[#6A7282] truncate">
              {propertyName || "No property selected"}
              {propertyId ? ` • Property #${propertyId}` : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            disabled={!document}
            onClick={() => document && onDownloadDocument(document)}
            className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 flex items-center gap-1.5 border border-[#0000001A] px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Download</span>
          </button>
          {document && rawFileUrl ? (
            <a
              href={rawFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer flex items-center gap-1.5 bg-[#0D4DA5] text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-[#0A3D84] transition-colors shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Full View</span>
            </a>
          ) : null}
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="flex-1 border border-[#E5E7EB] rounded-xl bg-[#F9FAFB] min-h-0 relative overflow-hidden flex flex-col">
        {loading || previewLoading ? (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-sm text-[#6A7282]">
            <RefreshCw className="w-5 h-5 animate-spin text-primary" />
            <p>Loading document preview...</p>
          </div>
        ) : !document ? (
          <div className="h-full flex flex-col justify-center items-center text-center px-4">
            <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
              <FileText className="w-10 h-10 text-primary/60" />
            </div>
            <p className="text-sm sm:text-base font-medium text-[#4A5565] mt-3">
              No document selected
            </p>
            <p className="text-xs sm:text-sm text-[#6A7282] mt-1">
              Select a property and a document below to view its contents.
            </p>
          </div>
        ) : previewError ? (
          <div className="h-full flex flex-col justify-center items-center text-center px-4">
            <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
              <FileText className="w-10 h-10 text-red-500" />
            </div>
            <p className="text-sm sm:text-base font-medium text-[#4A5565] mt-3">
              {previewError}
            </p>
            <div className="flex items-center gap-2 mt-4">
              <a
                href={rawFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 border border-[#0000001A] px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in New Tab</span>
              </a>
              <button
                type="button"
                onClick={() => onDownloadDocument(document)}
                className="flex items-center gap-1.5 bg-primary text-white px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        ) : fileType === "pdf" && proxyUrl ? (
          <div className="h-full w-full bg-white flex flex-col">
            <iframe
              src={proxyUrl}
              className="h-full w-full border-0 rounded-lg"
              title={fileName}
            />
          </div>
        ) : fileType === "image" && proxyUrl ? (
          <div className="h-full w-full flex items-center justify-center p-4 bg-white overflow-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={proxyUrl}
              alt={fileName}
              className="max-h-full max-w-full object-contain rounded-lg shadow-xs"
            />
          </div>
        ) : fileType === "docx" ? (
          <div className="h-full overflow-y-auto p-5 bg-white">
            <div
              className="max-w-none text-sm text-[#1F2937] leading-relaxed [&_p]:mb-3 [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mb-2 [&_h3]:font-semibold [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_table]:border-collapse [&_table]:w-full [&_table]:mb-4 [&_th]:border [&_th]:border-gray-300 [&_th]:p-2 [&_th]:bg-gray-50 [&_td]:border [&_td]:border-gray-300 [&_td]:p-2"
              dangerouslySetInnerHTML={{
                __html: docxHtml || "<p>No preview content available.</p>",
              }}
            />
          </div>
        ) : fileType === "csv" || fileType === "text" ? (
          <div className="h-full overflow-auto p-4 bg-white font-mono text-xs text-gray-800 whitespace-pre">
            {textContent}
          </div>
        ) : (
          <div className="h-full flex flex-col justify-center items-center text-center px-4">
            <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
              <FileText className="w-10 h-10 text-primary" />
            </div>
            <p className="text-sm sm:text-base font-medium text-[#4A5565] mt-3">
              Preview not available for this file format
            </p>
            <p className="text-xs sm:text-sm text-[#6A7282] mt-1">
              Click below to download and view on your device.
            </p>
            <button
              type="button"
              onClick={() => onDownloadDocument(document)}
              className="mt-4 flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-primary/90 transition-colors shadow-2xs"
            >
              <Download className="w-4 h-4" />
              <span>Download File</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;
