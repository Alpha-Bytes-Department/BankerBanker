"use client";

import React, { useState } from "react";
import Image from "next/image";
import PreviewSection from "./PreviewSection";
import SectionMarkdown from "./SectionMarkdown";
import ExcelTableView from "./ExcelTableView";
import { BsFileEarmarkSpreadsheet } from "react-icons/bs";
import { FiFileText, FiLayers } from "react-icons/fi";

import {
  formatSectionTitle,
  parseKeyValueContentToTable,
  stripLeadingSectionHeading,
} from "./section-utils";
import type { MemorandumSection } from "@/types/memorandum-detail";

type DynamicPreviewSectionsProps = {
  sections: MemorandumSection[];
};

const DynamicPreviewSections: React.FC<DynamicPreviewSectionsProps> = ({
  sections,
}) => {
  // Global view preference: "table" (default as requested) or "document"
  const [globalMode, setGlobalMode] = useState<"table" | "document">("table");

  // Per-section overrides if user toggles a specific section
  const [sectionOverrides, setSectionOverrides] = useState<
    Record<number, "table" | "document">
  >({});

  const toggleSectionMode = (sectionId: number, mode: "table" | "document") => {
    setSectionOverrides((prev) => ({
      ...prev,
      [sectionId]: mode,
    }));
  };

  return (
    <div>
      {/* ====== Global View Mode Switcher ====== */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-linear-to-r from-emerald-50/70 via-slate-50 to-emerald-50/40 p-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
            <BsFileEarmarkSpreadsheet size={16} />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800">
              Offering Memorandum View Mode
            </h4>
            <p className="text-[11px] text-slate-500">
              All sections enabled with Excel spreadsheet view where data is available
            </p>
          </div>
        </div>

        <div className="flex items-center rounded-lg bg-white p-1 border border-slate-200 shadow-2xs text-xs">
          <button
            type="button"
            onClick={() => {
              setGlobalMode("table");
              setSectionOverrides({});
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
              globalMode === "table"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BsFileEarmarkSpreadsheet size={13} />
            <span>Excel Tables</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setGlobalMode("document");
              setSectionOverrides({});
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
              globalMode === "document"
                ? "bg-slate-800 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FiFileText size={13} />
            <span>Document Narrative</span>
          </button>
        </div>
      </div>

      {/* ====== Sections Rendering ====== */}
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

        const activeTable = hasExplicitTable
          ? section.table_data
          : keyValueTable;

        const hasTableCapability = Boolean(activeTable);
        const hasProseContent = Boolean(
          contentToRender && contentToRender.trim().length > 0,
        );
        const canToggleView = hasTableCapability && hasProseContent;

        // Current active mode for this section
        const effectiveMode =
          sectionOverrides[section.id] ||
          (hasTableCapability ? globalMode : "document");

        return (
          <PreviewSection
            key={section.id}
            sectionNumber={index + 1}
            title={sectionTitle}
            anchorId={`preview-section-${section.id}`}
          >
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-slate-100 shadow-2xs">
              {/* Optional Section Image */}
              {sectionImage ? (
                <div className="relative h-52 md:h-72 rounded-lg overflow-hidden border border-gray-200 mb-5">
                  <Image
                    src={sectionImage}
                    alt={`${sectionTitle} image`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : null}

              {/* Section-level toggle (when both table and prose exist) */}
              {canToggleView ? (
                <div className="mb-4 flex items-center justify-between pb-2 border-b border-slate-200/70">
                  <span className="flex items-center gap-1.5 text-xs text-slate-500">
                    <FiLayers className="text-slate-400" />
                    <span>Displaying {effectiveMode === "table" ? "Spreadsheet View" : "Document Narrative"}</span>
                  </span>
                  <div className="flex items-center rounded-lg bg-white p-0.5 border border-slate-200 text-xs">
                    <button
                      type="button"
                      onClick={() => toggleSectionMode(section.id, "table")}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                        effectiveMode === "table"
                          ? "bg-emerald-100 text-emerald-800 font-semibold"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <BsFileEarmarkSpreadsheet size={11} />
                      <span>Table</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleSectionMode(section.id, "document")}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                        effectiveMode === "document"
                          ? "bg-slate-200 text-slate-800 font-semibold"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <FiFileText size={11} />
                      <span>Narrative</span>
                    </button>
                  </div>
                </div>
              ) : null}

              {/* Render based on effectiveMode */}
              {effectiveMode === "table" && activeTable ? (
                <ExcelTableView
                  tableData={activeTable}
                  title={sectionTitle}
                  subtitle={
                    section.section_key
                      ? `Section: ${section.section_key}`
                      : undefined
                  }
                />
              ) : hasProseContent ? (
                <SectionMarkdown
                  content={contentToRender}
                  className="text-gray-700 leading-relaxed"
                />
              ) : activeTable ? (
                /* Fallback to table if no prose exists */
                <ExcelTableView
                  tableData={activeTable}
                  title={sectionTitle}
                  subtitle={
                    section.section_key
                      ? `Section: ${section.section_key}`
                      : undefined
                  }
                />
              ) : null}
            </div>
          </PreviewSection>
        );
      })}
    </div>
  );
};

export default DynamicPreviewSections;
