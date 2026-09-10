"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import api from "@/Provider/api";
import {
  formatSectionTitle,
  parsePropertyInformationFromSections,
  parseKeyValueContentToTable,
  sanitizeInlineMarkdownText,
  stripLeadingSectionHeading,
} from "@/lib/memorandum";
import PDFCoverPage from "./_components/PDFCoverPage";
import PDFSection from "./_components/PDFSection";
import PDFTableOfContents from "./_components/PDFTableOfContents";
import ExcelTableView from "@/app/(dashboard)/(sponsor)/memorandum/_components/DetailPageComponent/ExcelTableView";
import type { MemorandumSection } from "@/types/memorandum-detail";

type MemorandumData = {
  id: number;
  title: string;
  property_name: string;
  property_address?: string;
  property_image_url?: string;
  thumbnail_url?: string;
  property_images?: string[];
  property_type?: string;
  number_of_units?: number;
  year_built?: number;
  occupancy?: number | string;
  status: "Generating" | "Draft" | "Failed" | "Published" | string;
  mode: "Editor" | "Preview" | string;
  created_at?: string;
  sections: MemorandumSection[];
};

const DownloadPage = () => {
  const params = useParams();
  const id = params.id;
  const memorandumId = Array.isArray(id) ? id[0] : id;

  const [data, setData] = useState<MemorandumData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemorandum = async () => {
      if (!memorandumId) return;

      const snapshotStorageKey = `memorandum-download-${memorandumId}`;
      let hasSnapshot = false;

      try {
        const snapshotRaw = sessionStorage.getItem(snapshotStorageKey);
        if (snapshotRaw) {
          const snapshot = JSON.parse(snapshotRaw) as MemorandumData;
          if (snapshot?.id && String(snapshot.id) === String(memorandumId)) {
            setData(snapshot);
            setLoading(false);
            hasSnapshot = true;
          }
        }
      } catch (error) {
        console.error("Failed to load memorandum export snapshot:", error);
      }

      try {
        if (!hasSnapshot) {
          setLoading(true);
        }

        let response;
        try {
          response = await api.get(`/api/v1/memorandums/${memorandumId}/`);
        } catch (err: any) {
          if (err?.response?.status === 404) {
            response = await api.get(`/api/memorandums/${memorandumId}/`);
          } else {
            throw err;
          }
        }
        const latestData = (response.data?.data ?? response.data) as MemorandumData;
        setData(latestData);

        try {
          sessionStorage.setItem(
            snapshotStorageKey,
            JSON.stringify(latestData),
          );
        } catch (error) {
          console.error("Failed to update memorandum export snapshot:", error);
        }
      } catch (error) {
        console.error("Failed to load memorandum for download:", error);
        toast.error("Failed to load memorandum for download.");
      } finally {
        setLoading(false);
      }
    };

    fetchMemorandum();
  }, [memorandumId]);

  const sections = useMemo(() => {
    if (!data?.sections) return [];
    return [...data.sections].sort((a, b) => {
      if (a.order === b.order) return a.id - b.id;
      return a.order - b.order;
    });
  }, [data?.sections]);

  const tableOfContents = useMemo(
    () =>
      sections.map((section, index) => ({
        id: index + 1,
        title:
          section.label ||
          section.title ||
          formatSectionTitle(section.section_key || section.section_type),
        pageNumber: index + 3,
      })),
    [sections],
  );

  const parsedPropertyInformation = useMemo(() => {
    return parsePropertyInformationFromSections(sections);
  }, [sections]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="p-10 text-center">Loading memorandum...</div>;
  }

  if (!data) {
    return <div className="p-10 text-center">Memorandum not found.</div>;
  }

  const resolvedPropertyName =
    sanitizeInlineMarkdownText(
      data.property_name ||
        parsedPropertyInformation.propertyName ||
        data.title,
    ) || data.title;

  const resolvedLocation =
    sanitizeInlineMarkdownText(
      data.property_address || parsedPropertyInformation.address || "",
    ) || "";
  const resolvedPropertyType =
    sanitizeInlineMarkdownText(
      data.property_type || parsedPropertyInformation.propertyType || "N/A",
    ) || "N/A";
  const resolvedUnits =
    Number(data.number_of_units) > 0
      ? Number(data.number_of_units)
      : Number(parsedPropertyInformation.numberOfUnits) || 0;
  const resolvedYearBuilt =
    Number(data.year_built) > 0
      ? Number(data.year_built)
      : Number(parsedPropertyInformation.yearBuilt) || 0;
  const resolvedOccupancy =
    Number(data.occupancy) > 0
      ? Number(data.occupancy)
      : Number(parsedPropertyInformation.occupancy) || 0;

  return (
    <>
      <div className="no-print fixed top-4 right-4 z-50 flex gap-2 items-center">
        <div className="bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-700 shadow-sm">
          <span className="font-medium">Status:</span> {data.status} |{" "}
          <span className="font-medium">Mode:</span> {data.mode}
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium text-white shadow-lg transition-colors bg-[#0D4DA5] hover:bg-[#0A3F87]"
          type="button"
        >
          Print / Download
        </button>
      </div>

      <div
        className="mx-auto bg-white"
        style={{ maxWidth: "210mm", minHeight: "297mm" }}
      >
        <PDFCoverPage
          presentedBy="Memorandum Team"
          confidential={true}
          investmentOpportunity="OFFERING MEMORANDUM"
          propertyName={resolvedPropertyName}
          location={resolvedLocation}
          stats={{
            propertyType: resolvedPropertyType,
            units: resolvedUnits,
            yearBuilt: resolvedYearBuilt,
            occupancy: resolvedOccupancy,
          }}
          offeringDate={new Date(
            data.created_at || Date.now(),
          ).toLocaleDateString()}
          heroImage={
            (Array.isArray(data.property_images) && data.property_images.length > 0
              ? data.property_images[0]
              : null) ||
            data.thumbnail_url ||
            data.property_image_url ||
            ""
          }
        />

        <PDFTableOfContents items={tableOfContents} />

        {sections.map((section, index) => {
          const sectionTitle =
            section.label ||
            section.title ||
            formatSectionTitle(section.section_key || section.section_type);
          const contentToRender = stripLeadingSectionHeading(
            section.content || "",
            sectionTitle,
          );
          const sectionImage = section.image_url || section.image;
          const hasExplicitTable = Boolean(
            section.table_data?.columns?.length &&
              section.table_data?.rows?.length,
          );
          const keyValueTable = !hasExplicitTable
            ? parseKeyValueContentToTable(contentToRender)
            : null;

          return (
            <PDFSection
              key={section.id}
              sectionNumber={index + 1}
              title={sectionTitle}
            >
              <div className="rounded-md p-4 bg-gray-50 print-avoid-break">
                {sectionImage ? (
                  <div className="mb-4 rounded-md overflow-hidden border border-gray-200">
                    <div className="relative w-full h-[220px]">
                      <Image
                        src={sectionImage}
                        alt={`${sectionTitle} image`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </div>
                ) : null}

                {hasExplicitTable && section.table_data ? (
                  <div className="mb-3">
                    <ExcelTableView
                      tableData={section.table_data}
                      title={sectionTitle}
                    />
                  </div>
                ) : null}

                {!hasExplicitTable && keyValueTable ? (
                  <div className="mb-3">
                    <ExcelTableView
                      tableData={keyValueTable}
                      title={`${sectionTitle} (Specs)`}
                    />
                  </div>
                ) : null}

                {contentToRender && !hasExplicitTable && !keyValueTable ? (
                  <div className="text-gray-700 text-[11px] leading-relaxed wrap-break-word [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_h1]:mb-3 [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:mb-3 [&_h2]:text-base [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:text-sm [&_h3]:font-semibold [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-3 [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-gray-100 [&_pre]:p-3 [&_table]:mb-3 [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:rounded-lg [&_th]:border [&_th]:border-gray-300 [&_th]:bg-gray-100 [&_th]:px-2 [&_th]:py-1 [&_th]:text-left [&_th]:font-semibold [&_td]:border [&_td]:border-gray-300 [&_td]:px-2 [&_td]:py-1">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {contentToRender}
                    </ReactMarkdown>
                  </div>
                ) : null}
              </div>
            </PDFSection>
          );
        })}
      </div>
    </>
  );
};

export default DownloadPage;
