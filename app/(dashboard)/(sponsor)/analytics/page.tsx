"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/Provider/api";
import AiChat from "./_components/AiChat";
import DocumentList from "./_components/DocumentList";
import Preview from "./_components/Preview";
import type {
  DocviewDocument,
  DocviewProperty,
  PropertyDocumentGroup,
} from "./_components/docview-types";

const getFileNameFromUrl = (url: string) => {
  const safeUrl = url.split("?")[0];
  return decodeURIComponent(safeUrl.substring(safeUrl.lastIndexOf("/") + 1));
};

const Page = () => {
  const searchParams = useSearchParams();

  const [propertyGroups, setPropertyGroups] = useState<PropertyDocumentGroup[]>(
    [],
  );
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(
    null,
  );
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const queryPropertyId = useMemo(() => {
    const raw = searchParams.get("propertyId") || searchParams.get("id");
    if (!raw) return null;

    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }, [searchParams]);

  useEffect(() => {
    const loadDocuments = async () => {
      setLoading(true);
      setError(null);

      try {
        const propertyRes = await api.get("/api/properties/");
        const properties: DocviewProperty[] = propertyRes.data?.data || [];

        if (properties.length === 0) {
          setPropertyGroups([]);
          setSelectedDocumentId(null);
          setSelectedPropertyId(null);
          return;
        }

        const fetchedGroups = await Promise.all(
          properties.map(async (property) => {
            try {
              const docsRes = await api.get(
                `/api/properties/${property.id}/documents/`,
              );
              const documents: DocviewDocument[] = docsRes.data?.data || [];
              return { property, documents };
            } catch (groupError) {
              console.error(
                `Failed to load documents for property ${property.id}`,
                groupError,
              );
              return { property, documents: [] };
            }
          }),
        );

        let orderedGroups = fetchedGroups;
        if (queryPropertyId) {
          const queriedIndex = fetchedGroups.findIndex(
            (group) => group.property.id === queryPropertyId,
          );

          if (queriedIndex > 0) {
            const queriedGroup = fetchedGroups[queriedIndex];
            orderedGroups = [
              queriedGroup,
              ...fetchedGroups.slice(0, queriedIndex),
              ...fetchedGroups.slice(queriedIndex + 1),
            ];
          }
        }

        setPropertyGroups(orderedGroups);

        const queryGroup = queryPropertyId
          ? orderedGroups.find((group) => group.property.id === queryPropertyId)
          : undefined;
        const firstGroupWithDocument = orderedGroups.find(
          (group) => group.documents.length > 0,
        );

        setSelectedPropertyId((currentSelected) => {
          if (
            currentSelected &&
            orderedGroups.some((group) => group.property.id === currentSelected)
          ) {
            return currentSelected;
          }

          if (queryGroup) {
            return queryGroup.property.id;
          }

          if (firstGroupWithDocument) {
            return firstGroupWithDocument.property.id;
          }

          return orderedGroups[0]?.property.id ?? null;
        });

        setSelectedDocumentId((currentSelected) => {
          if (
            currentSelected &&
            orderedGroups.some((group) =>
              group.documents.some((doc) => doc.id === currentSelected),
            )
          ) {
            return currentSelected;
          }

          if (queryGroup?.documents?.length) {
            return queryGroup.documents[0].id;
          }

          return firstGroupWithDocument?.documents?.[0]?.id ?? null;
        });
      } catch (loadError) {
        console.error("Failed to load properties/documents", loadError);
        setError("Unable to load properties and documents right now.");
        setPropertyGroups([]);
        setSelectedDocumentId(null);
        setSelectedPropertyId(null);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [queryPropertyId]);

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

  useEffect(() => {
    if (!selectedGroup) {
      setSelectedDocumentId(null);
      return;
    }

    setSelectedDocumentId((currentSelected) => {
      if (
        currentSelected &&
        selectedGroup.documents.some((doc) => doc.id === currentSelected)
      ) {
        return currentSelected;
      }

      return selectedGroup.documents[0]?.id ?? null;
    });
  }, [selectedGroup]);

  const selectedDocument = useMemo(() => {
    if (!selectedGroup || !selectedDocumentId) {
      return null;
    }

    return (
      selectedGroup.documents.find((doc) => doc.id === selectedDocumentId) ??
      null
    );
  }, [selectedGroup, selectedDocumentId]);

  const handleDownloadDocument = (document: DocviewDocument) => {
    if (typeof window === "undefined") return;

    const anchor = window.document.createElement("a");
    anchor.href = document.file_url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.download = getFileNameFromUrl(document.file_url);
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

  return (
    <div className="flex flex-col w-full gap-3 p-3 sm:p-4 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-3 flex-1">
        <div className="w-full lg:flex-[1.4] min-h-0">
          <Preview
            document={selectedDocument}
            loading={loading}
            propertyId={selectedGroup?.property.id ?? null}
            propertyName={
              selectedGroup?.property.property_name || "No property selected"
            }
            onDownloadDocument={handleDownloadDocument}
          />
        </div>
        <div className="w-full lg:flex-1 min-h-0">
          <AiChat />
        </div>
      </div>
      <div className="w-full">
        <DocumentList
          propertyGroups={propertyGroups}
          selectedDocumentId={selectedDocumentId}
          selectedPropertyId={selectedGroup?.property.id ?? null}
          loading={loading}
          error={error}
          onSelectProperty={handleSelectProperty}
          onSelectDocument={handleSelectDocument}
          onDownloadDocument={handleDownloadDocument}
        />
      </div>
    </div>
  );
};

export default Page;
