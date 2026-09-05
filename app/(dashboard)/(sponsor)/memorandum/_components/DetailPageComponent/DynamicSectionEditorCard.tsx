"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FiCheck, FiEdit, FiUpload, FiX, FiFileText } from "react-icons/fi";
import { BsFileEarmarkSpreadsheet } from "react-icons/bs";
import { toast } from "sonner";
import SectionMarkdown from "./SectionMarkdown";
import ExcelTableView from "./ExcelTableView";

import type {
  MemorandumSection,
  MemorandumTableData,
} from "@/types/memorandum-detail";
import {
  formatSectionTitle,
  parseKeyValueContentToTable,
  stripLeadingSectionHeading,
} from "./section-utils";

type DynamicSectionEditorCardProps = {
  section: MemorandumSection;
  onSave: (
    sectionId: number,
    content: string,
    tableData?: MemorandumTableData | null,
  ) => Promise<void>;
  onImageUpload: (sectionId: number, file: File) => Promise<string | void>;
};

const DynamicSectionEditorCard = ({
  section,
  onSave,
  onImageUpload,
}: DynamicSectionEditorCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(section.content || "");
  const [editedTableData, setEditedTableData] =
    useState<MemorandumTableData | null>(section.table_data || null);

  // Default view mode: "table" if table_data exists or is convertible, otherwise "document"
  const [viewMode, setViewMode] = useState<"table" | "document">("table");

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sectionTitle =
    section.label ||
    section.title ||
    formatSectionTitle(section.section_key || section.section_type);

  const contentToRender = stripLeadingSectionHeading(
    editedContent,
    sectionTitle,
  );

  const sectionImage = section.image_url || section.image;
  const hasSectionImage = Boolean(sectionImage);

  const hasExplicitTable = Boolean(
    editedTableData?.columns?.length && editedTableData?.rows?.length,
  );
  const keyValueTable = !hasExplicitTable
    ? parseKeyValueContentToTable(contentToRender)
    : null;

  const activeTable = hasExplicitTable
    ? editedTableData
    : keyValueTable;

  const hasTableCapability = Boolean(activeTable);
  const hasProseContent = Boolean(contentToRender && contentToRender.trim().length > 0);
  const canToggleView = hasTableCapability && hasProseContent;

  useEffect(() => {
    setEditedContent(section.content || "");
    setEditedTableData(section.table_data || null);
    if (section.table_data?.columns?.length) {
      setViewMode("table");
    }
  }, [section.content, section.table_data, section.id]);

  const handleSave = async () => {
    const contentToSave = editedContent;

    // Table sections might have empty content string
    if (!hasExplicitTable && contentToSave.trim() === "") {
      toast.error("Section content cannot be empty.");
      return;
    }

    try {
      setIsSaving(true);
      await onSave(section.id, contentToSave, editedTableData);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedContent(section.content || "");
    setEditedTableData(section.table_data || null);
  };

  const handleUploadClick = () => {
    if (hasSectionImage) {
      toast.error("Only one image is allowed for this section.");
      return;
    }

    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      setIsUploadingImage(true);
      await onImageUpload(section.id, file);
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  };

  return (
    <div
      className={`bg-white border rounded-2xl p-4 md:p-6 mb-6 transition-colors ${
        isEditing
          ? "border-emerald-300 shadow-[0_0_0_1px_rgba(16,185,129,0.2)]"
          : "border-gray-200"
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900">
            {sectionTitle}
          </h3>
          {hasTableCapability ? (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <BsFileEarmarkSpreadsheet size={11} />
              Excel Table Enabled
            </span>
          ) : null}

          {/* View Mode Switcher (When both Table and Document Prose are available) */}
          {canToggleView ? (
            <div className="flex items-center rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-xs ml-0 sm:ml-2">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
                  viewMode === "table"
                    ? "bg-white text-emerald-800 shadow-xs border border-slate-200 font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="View as Excel Spreadsheet"
              >
                <BsFileEarmarkSpreadsheet className="text-emerald-700" size={12} />
                <span>Spreadsheet</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("document")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
                  viewMode === "document"
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200 font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="View as Continuous Document Narrative"
              >
                <FiFileText className="text-slate-600" size={12} />
                <span>Narrative</span>
              </button>
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
              type="button"
            >
              <FiEdit className="w-4 h-4" />
              {hasTableCapability ? "Edit Table" : "Edit"}
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-1 bg-emerald-600 text-white px-3.5 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-60 shadow-xs"
                type="button"
              >
                <FiCheck className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center gap-1 text-gray-600 hover:text-gray-700 text-sm px-2.5 py-1.5 disabled:opacity-60"
                type="button"
              >
                <FiX className="w-4 h-4" />
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* ====== Primary Content: Excel Table or Document Narrative ====== */}
      {viewMode === "table" && activeTable ? (
        <div className="mb-4">
          <ExcelTableView
            tableData={activeTable}
            title={sectionTitle}
            subtitle={
              section.section_key ? `Section: ${section.section_key}` : undefined
            }
            editable={isEditing}
            onTableDataChange={(newTable) => {
              setEditedTableData(newTable);
            }}
          />
        </div>
      ) : (
        /* Narrative / Document Mode */
        <div className="mt-3">
          {!isEditing ? (
            <SectionMarkdown
              content={contentToRender}
              className="text-sm md:text-base text-gray-700 leading-relaxed"
            />
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                Section Narrative Content (Markdown)
              </label>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full min-h-[160px] px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm md:text-base resize-y font-mono"
                placeholder="Write section content in markdown..."
              />
            </div>
          )}
        </div>
      )}

      {/* ====== Section Image ====== */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <h4 className="text-sm font-medium text-gray-800 mb-3">Section Image</h4>

        {sectionImage ? (
          <div className="relative h-48 md:h-64 rounded-lg overflow-hidden border border-gray-200 mb-4 max-w-xl">
            <Image
              src={sectionImage}
              alt={`${sectionTitle} image`}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : null}

        <button
          onClick={handleUploadClick}
          disabled={isUploadingImage || hasSectionImage}
          className={`px-4 py-2 rounded-lg border text-sm flex items-center gap-2 transition-colors ${
            isUploadingImage || hasSectionImage
              ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
              : "border-gray-300 text-gray-700 hover:border-emerald-500 hover:text-emerald-700"
          }`}
          type="button"
        >
          <FiUpload className="w-4 h-4" />
          {isUploadingImage
            ? "Uploading..."
            : hasSectionImage
              ? "1 image max"
              : "Upload Image"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          disabled={isUploadingImage || hasSectionImage}
        />
      </div>
    </div>
  );
};

export default DynamicSectionEditorCard;
