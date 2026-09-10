"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useQueries, useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import AiChat from "./_components/AiChat";
import DocumentList from "./_components/DocumentList";
import Preview from "./_components/Preview";
import {
  fetchProperties,
  fetchPropertyDocuments,
} from "./_api/analytics-api";
import type {
  DocviewDocument,
  DocviewProperty,
  PropertyDocumentGroup,
} from "./_components/docview-types";
import { toast } from "sonner";

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

const Page = () => {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(
    null,
  );
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(
    null,
  );

  const queryPropertyId = useMemo(() => {
    const raw = searchParams.get("propertyId") || searchParams.get("id");
    if (!raw) return null;

    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }, [searchParams]);

  // ─── Query 1: Fetch All Properties (Postman: GET /api/v1/properties/) ───
  const {
    data: properties = [],
    isLoading: propertiesLoading,
    isError: propertiesError,
    error: propErr,
    refetch: refetchProperties,
  } = useQuery<DocviewProperty[]>({
    queryKey: ["properties"],
    queryFn: fetchProperties,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  // ─── Query 2: Fetch Documents for each Property (Postman: GET /api/v1/properties/{{id}}/files/) ───
  const documentQueries = useQueries({
    queries: properties.map((property) => ({
      queryKey: ["property-documents", property.id],
      queryFn: () => fetchPropertyDocuments(property.id),
      staleTime: 1000 * 60 * 5, // 5 minutes cache per property files
    })),
  });

  // ─── Combine Cached Properties & Documents into Groups ───
  const propertyGroups: PropertyDocumentGroup[] = useMemo(() => {
    if (!properties.length) return [];

    const groups = properties.map((property, index) => {
      const documents = documentQueries[index]?.data || [];
      return {
        property,
        documents,
      };
    });

    if (!queryPropertyId) return groups;

    const matchedIndex = groups.findIndex(
      (g) => g.property.id === queryPropertyId,
    );
    if (matchedIndex > 0) {
      const matched = groups[matchedIndex];
      return [
        matched,
        ...groups.slice(0, matchedIndex),
        ...groups.slice(matchedIndex + 1),
      ];
    }

    return groups;
  }, [properties, documentQueries, queryPropertyId]);

  // ─── Sync Selected Property ID ───
  useEffect(() => {
    if (!propertyGroups.length) {
      setSelectedPropertyId(null);
      return;
    }

    setSelectedPropertyId((current) => {
      if (current && propertyGroups.some((g) => g.property.id === current)) {
        return current;
      }

      if (queryPropertyId) {
        const queryGroup = propertyGroups.find(
          (g) => g.property.id === queryPropertyId,
        );
        if (queryGroup) return queryGroup.property.id;
      }

      const firstWithDocs = propertyGroups.find((g) => g.documents.length > 0);
      return firstWithDocs ? firstWithDocs.property.id : propertyGroups[0].property.id;
    });
  }, [propertyGroups, queryPropertyId]);

  // ─── Current Selected Group ───
  const selectedGroup = useMemo(() => {
    if (!propertyGroups.length) return null;
    if (selectedPropertyId) {
      const matched = propertyGroups.find(
        (g) => g.property.id === selectedPropertyId,
      );
      if (matched) return matched;
    }
    return propertyGroups[0];
  }, [propertyGroups, selectedPropertyId]);

  // ─── Sync Selected Document ID ───
  useEffect(() => {
    if (!selectedGroup || selectedGroup.documents.length === 0) {
      setSelectedDocumentId(null);
      return;
    }

    setSelectedDocumentId((current) => {
      if (
        current &&
        selectedGroup.documents.some((doc) => doc.id === current)
      ) {
        return current;
      }
      return selectedGroup.documents[0].id;
    });
  }, [selectedGroup]);

  // ─── Current Selected Document ───
  const selectedDocument = useMemo(() => {
    if (!selectedGroup || !selectedDocumentId) return null;
    return (
      selectedGroup.documents.find((doc) => doc.id === selectedDocumentId) ??
      null
    );
  }, [selectedGroup, selectedDocumentId]);

  // ─── Document Download Action ───
  const handleDownloadDocument = (document: DocviewDocument) => {
    if (typeof window === "undefined") return;

    const fileUrl = resolveFileUrl(document.file_url);
    const fileName =
      document.name ||
      getFileNameFromUrl(document.file_url) ||
      "document";

    const anchor = window.document.createElement("a");
    anchor.href = fileUrl;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.download = fileName;
    window.document.body.appendChild(anchor);
    anchor.click();
    window.document.body.removeChild(anchor);
  };

  const handleSelectProperty = (propertyId: number) => {
    setSelectedPropertyId(propertyId);
  };

  const handleSelectDocument = (documentId: number) => {
    setSelectedDocumentId(documentId);
  };

  const handleRefreshAll = async () => {
    await queryClient.invalidateQueries({ queryKey: ["properties"] });
    await queryClient.invalidateQueries({ queryKey: ["property-documents"] });
    toast.success("Properties and documents reloaded");
  };

  const isGlobalLoading =
    propertiesLoading ||
    (properties.length > 0 &&
      documentQueries.some((q) => q.isLoading && !q.data));

  const errorMessage = propertiesError
    ? (propErr as Error)?.message || "Failed to load properties."
    : null;

  return (
    <div className="flex flex-col w-full gap-3 p-3 sm:p-4 min-h-screen">
      {/* Top action bar */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
            Document Analytics & Message Portal
          </h1>
          <p className="text-xs text-[#6A7282]">
            Cached multi-property documents and interactive AI chat assistance
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefreshAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-xs font-medium text-gray-700 transition-colors shadow-2xs cursor-pointer"
          title="Refresh cached properties and files"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Refresh Data</span>
        </button>
      </div>

      {/* Main viewer grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 flex-1">
        {/* Document Viewer (col-span-3) */}
        <div className="w-full lg:col-span-3 min-h-0">
          <Preview
            document={selectedDocument}
            loading={isGlobalLoading}
            propertyId={selectedGroup?.property.id ?? null}
            propertyName={
              selectedGroup?.property.property_name || "No property selected"
            }
            onDownloadDocument={handleDownloadDocument}
          />
        </div>

        {/* AI Assistant Message Portal (col-span-1) */}
        <div className="w-full lg:col-span-1 min-h-0">
          <AiChat propertyId={selectedGroup?.property.id ?? null} />
        </div>
      </div>

      {/* Property & Document List Panel */}
      <div className="w-full">
        <DocumentList
          propertyGroups={propertyGroups}
          selectedDocumentId={selectedDocumentId}
          selectedPropertyId={selectedGroup?.property.id ?? null}
          loading={isGlobalLoading}
          error={errorMessage}
          onSelectProperty={handleSelectProperty}
          onSelectDocument={handleSelectDocument}
          onDownloadDocument={handleDownloadDocument}
        />
      </div>
    </div>
  );
};

export default Page;
