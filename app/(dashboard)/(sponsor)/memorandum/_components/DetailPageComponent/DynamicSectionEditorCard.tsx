"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FiCheck, FiEdit, FiUpload, FiX } from "react-icons/fi";
import { toast } from "sonner";
import SectionMarkdown from "./SectionMarkdown";
import {
  formatSectionTitle,
  stripLeadingSectionHeading,
} from "./section-utils";

type DynamicSection = {
  id: number;
  section_type: string;
  content: string;
  image_url?: string | null;
};

type DynamicSectionEditorCardProps = {
  section: DynamicSection;
  onSave: (sectionId: number, content: string) => Promise<void>;
  onImageUpload: (sectionId: number, file: File) => Promise<string | void>;
};

const DynamicSectionEditorCard = ({
  section,
  onSave,
  onImageUpload,
}: DynamicSectionEditorCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(section.content || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sectionTitle = formatSectionTitle(section.section_type);
  const contentToRender = stripLeadingSectionHeading(
    editedContent,
    sectionTitle,
  );

  useEffect(() => {
    setEditedContent(section.content || "");
  }, [section.content, section.id]);

  const hasSectionImage = Boolean(section.image_url);

  const handleSave = async () => {
    if (editedContent.trim() === "") {
      toast.error("Section content cannot be empty.");
      return;
    }

    try {
      setIsSaving(true);
      await onSave(section.id, editedContent);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedContent(section.content || "");
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
    <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <h3 className="text-lg md:text-xl text-gray-900">{sectionTitle}</h3>

        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
              type="button"
            >
              <FiEdit className="w-4 h-4" />
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 disabled:opacity-60"
                type="button"
              >
                <FiCheck className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center gap-1 text-gray-600 hover:text-gray-700 text-sm disabled:opacity-60"
                type="button"
              >
                <FiX className="w-4 h-4" />
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {!isEditing ? (
        <SectionMarkdown
          content={contentToRender}
          className="text-sm md:text-base text-gray-700 leading-relaxed"
        />
      ) : (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full min-h-[180px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base resize-y"
          placeholder="Write section content in markdown format..."
        />
      )}

      <div className="mt-6">
        <h4 className="text-base text-gray-900 mb-3">Section Image</h4>

        {section.image_url ? (
          <div className="relative h-48 md:h-64 rounded-lg overflow-hidden border border-gray-200 mb-4">
            <Image
              src={section.image_url}
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
              ? "border-gray-200 text-gray-400 cursor-not-allowed"
              : "border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600"
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
