"use client";

import { useMemo } from "react";
import { Download, FileText } from "lucide-react";
import type { DocviewDocument, PropertyDocumentGroup } from "./docview-types";

interface DocumentListProps {
  propertyGroups: PropertyDocumentGroup[];
  selectedDocumentId: number | null;
  selectedPropertyId: number | null;
  loading: boolean;
  error: string | null;
  onSelectProperty: (propertyId: number) => void;
  onSelectDocument: (documentId: number) => void;
  onDownloadDocument: (document: DocviewDocument) => void;
}

const getFileNameFromUrl = (url: string) => {
  const safeUrl = url.split("?")[0];
  return decodeURIComponent(safeUrl.substring(safeUrl.lastIndexOf("/") + 1));
};

const getDocumentTag = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();

  if (!extension) return "Document";
  if (extension === "pdf") return "PDF";
  if (extension === "doc" || extension === "docx") return "Word";
  if (extension === "xls" || extension === "xlsx" || extension === "csv")
    return "Sheet";
  if (extension === "ppt" || extension === "pptx") return "Slides";
  if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(extension)) {
    return "Image";
  }

  return extension.toUpperCase();
};

const tagColors: Record<string, string> = {
  PDF: "bg-red-50 text-red-700 border-red-200",
  Word: "bg-blue-50 text-blue-700 border-blue-200",
  Sheet: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Slides: "bg-orange-50 text-orange-700 border-orange-200",
  Image: "bg-violet-50 text-violet-700 border-violet-200",
  default: "bg-gray-50 text-gray-700 border-gray-200",
};

const DocumentList = ({
  propertyGroups,
  selectedDocumentId,
  selectedPropertyId,
  loading,
  error,
  onSelectProperty,
  onSelectDocument,
  onDownloadDocument,
}: DocumentListProps) => {
  const totalDocuments = useMemo(
    () =>
      propertyGroups.reduce(
        (count, group) => count + group.documents.length,
        0,
      ),
    [propertyGroups],
  );

  const selectedGroup = useMemo(() => {
    if (!propertyGroups.length) {
      return null;
    }

    if (selectedPropertyId) {
      const matchedGroup = propertyGroups.find(
        (group) => group.property.id === selectedPropertyId,
      );
      if (matchedGroup) {
        return matchedGroup;
      }
    }

    return propertyGroups[0];
  }, [propertyGroups, selectedPropertyId]);

  const selectedDocument = useMemo(() => {
    if (!selectedGroup) {
      return null;
    }

    if (selectedDocumentId) {
      const matchedDocument = selectedGroup.documents.find(
        (doc) => doc.id === selectedDocumentId,
      );
      if (matchedDocument) {
        return matchedDocument;
      }
    }

    return selectedGroup.documents[0] ?? null;
  }, [selectedDocumentId, selectedGroup]);

  return (
    <div className="flex flex-col gap-4 border border-[#0000001A] p-3 sm:p-4 rounded-xl bg-white w-full">
      <div className="flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <h1 className="text-sm sm:text-base font-semibold">
            Properties & Documents
          </h1>
          <span className="border border-[#0000001A] bg-gray-50 px-2 py-0.5 rounded-full text-xs font-medium text-[#4A5565]">
            {propertyGroups.length} properties
          </span>
          <span className="border border-[#0000001A] bg-gray-50 px-2 py-0.5 rounded-full text-xs font-medium text-[#4A5565]">
            {totalDocuments} files
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] bg-linear-to-b from-white to-[#F8FAFC] p-3 sm:p-4">
        {loading ? (
          <p className="text-sm text-[#6A7282] text-center py-8">
            Loading properties and documents...
          </p>
        ) : error ? (
          <p className="text-sm text-red-600 text-center py-8">{error}</p>
        ) : !selectedGroup ? (
          <p className="text-sm text-[#6A7282] text-center py-8">
            No properties found.
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-xl border border-[#DDE3EA] bg-white p-3 sm:p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] uppercase tracking-[0.08em] text-[#6A7282] font-semibold">
                  Properties
                </p>
                <span className="text-[11px] text-[#6A7282]">
                  Scrolls after 10 rows
                </span>
              </div>

              <div className="mt-3 min-h-[420px] max-h-[420px] overflow-y-auto rounded-xl border border-[#E5E7EB] bg-[#F9FBFD] p-2 space-y-2">
                {propertyGroups.map((group) => {
                  const isSelected =
                    group.property.id === selectedGroup.property.id;
                  return (
                    <button
                      key={group.property.id}
                      type="button"
                      onClick={() => onSelectProperty(group.property.id)}
                      className={`w-full min-h-10 rounded-lg border px-3 py-2 text-left transition-colors ${
                        isSelected
                          ? "border-primary/35 bg-primary/10"
                          : "border-[#DFE5EC] bg-white hover:bg-[#F2F6FA]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-[#1F2937] truncate">
                          {group.property.property_name}
                        </p>
                        <span className="shrink-0 rounded-full border border-[#D1D5DB] bg-white px-2 py-0.5 text-[11px] text-[#4A5565]">
                          {group.documents.length}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-[#DDE3EA] bg-white p-3 sm:p-4">
              <p className="text-[11px] uppercase tracking-[0.08em] text-[#6A7282] font-semibold">
                Documents in {selectedGroup.property.property_name}
              </p>

              {selectedGroup.documents.length === 0 ? (
                <div className="mt-3 min-h-[420px] max-h-[420px] rounded-xl border border-[#E5E7EB] bg-[#F9FBFD] p-4 flex items-center justify-center text-sm text-[#6A7282] text-center">
                  No documents available for this property.
                </div>
              ) : (
                <div className="mt-3 min-h-[420px] max-h-[420px] overflow-y-auto rounded-xl border border-[#E5E7EB] bg-[#F9FBFD] p-2 space-y-2">
                  {selectedGroup.documents.map((doc) => {
                    const fileName = getFileNameFromUrl(doc.file_url);
                    const docTag = getDocumentTag(fileName);
                    const isSelected = selectedDocument?.id === doc.id;

                    return (
                      <div
                        key={doc.id}
                        className={`rounded-lg border px-3 py-2 ${
                          isSelected
                            ? "border-primary/35 bg-primary/10"
                            : "border-[#DFE5EC] bg-white"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <button
                            type="button"
                            onClick={() => onSelectDocument(doc.id)}
                            className="flex-1 min-w-0 text-left"
                          >
                            <div className="flex items-center gap-2">
                              <span className="shrink-0 p-1.5 rounded-lg bg-primary/10">
                                <FileText className="w-4 h-4 text-primary" />
                              </span>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-[#1F2937] truncate">
                                  {fileName}
                                </p>
                                <div className="mt-1 flex items-center gap-2 flex-wrap">
                                  <span
                                    className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full border font-medium ${
                                      tagColors[docTag] ?? tagColors.default
                                    }`}
                                  >
                                    {docTag}
                                  </span>
                                  <span className="text-xs text-[#6A7282]">
                                    Uploaded{" "}
                                    {new Date(
                                      doc.uploaded_at,
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => onDownloadDocument(doc)}
                            className="cursor-pointer mt-0.5 shrink-0 rounded-full border border-[#D1D5DB] bg-white px-2.5 py-1 text-xs font-medium text-[#1F2937] hover:bg-gray-50 transition-colors"
                          >
                            <span className="inline-flex items-center gap-1">
                              <Download className="w-3.5 h-3.5" />
                              Download
                            </span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentList;
