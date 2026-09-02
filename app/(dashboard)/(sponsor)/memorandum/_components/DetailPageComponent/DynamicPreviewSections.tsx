"use client";

import React from "react";
import Image from "next/image";
import PreviewSection from "./PreviewSection";
import SectionMarkdown from "./SectionMarkdown";
import ExcelTableView from "./ExcelTableView";

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
  return (
    <div>
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
          <PreviewSection
            key={section.id}
            sectionNumber={index + 1}
            title={sectionTitle}
            anchorId={`preview-section-${section.id}`}
          >
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
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

              {/* If section has structured table_data, render as Excel spreadsheet */}
              {hasExplicitTable && section.table_data ? (
                <ExcelTableView
                  tableData={section.table_data}
                  title={sectionTitle}
                  subtitle={
                    section.section_key
                      ? `Section: ${section.section_key}`
                      : undefined
                  }
                />
              ) : null}

              {/* If text is purely key-value pairs, render as Excel spec sheet */}
              {!hasExplicitTable && keyValueTable ? (
                <ExcelTableView
                  tableData={keyValueTable}
                  title={`${sectionTitle} (Specs)`}
                  subtitle="Property Attributes"
                />
              ) : null}

              {/* Render prose markdown content if present */}
              {contentToRender && !keyValueTable ? (
                <SectionMarkdown
                  content={contentToRender}
                  className="text-gray-700 leading-relaxed"
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
