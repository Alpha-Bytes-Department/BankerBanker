"use client";

import Image from "next/image";
import PreviewSection from "./PreviewSection";
import SectionMarkdown from "./SectionMarkdown";
import SectionBlockRenderer from "./SectionBlockRenderer";
import {
  formatSectionTitle,
  stripLeadingSectionHeading,
} from "./section-utils";
import type { SectionBlock } from "@/types/memorandum-detail";

type DynamicSection = {
  id: number;
  section_type: string;
  title?: string;
  content: string;
  blocks?: SectionBlock[];
  image_url?: string | null;
};

type DynamicPreviewSectionsProps = {
  sections: DynamicSection[];
};

const DynamicPreviewSections = ({ sections }: DynamicPreviewSectionsProps) => {
  return (
    <div>
      {sections.map((section, index) => {
        const sectionTitle =
          section.title || formatSectionTitle(section.section_type);
        const hasBlocks =
          Array.isArray(section.blocks) && section.blocks.length > 0;
        const contentToRender = stripLeadingSectionHeading(
          section.content || "",
          sectionTitle,
        );

        return (
          <PreviewSection
            key={section.id}
            sectionNumber={index + 1}
            title={sectionTitle}
            anchorId={`preview-section-${section.id}`}
          >
            <div className="bg-gray-50 rounded-lg p-6">
              {section.image_url ? (
                <div className="relative h-52 md:h-72 rounded-lg overflow-hidden border border-gray-200 mb-5">
                  <Image
                    src={section.image_url}
                    alt={`${sectionTitle} image`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : null}

              {hasBlocks ? (
                <SectionBlockRenderer
                  blocks={section.blocks!}
                  skipFirstHeading={true}
                />
              ) : (
                <SectionMarkdown
                  content={contentToRender}
                  className="text-gray-700 leading-relaxed"
                />
              )}
            </div>
          </PreviewSection>
        );
      })}
    </div>
  );
};

export default DynamicPreviewSections;
