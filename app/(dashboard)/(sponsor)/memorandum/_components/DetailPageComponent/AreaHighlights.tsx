"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AreaHighlightsProps } from "@/types/memorandum-detail";
import { PiSparkle } from "react-icons/pi";
import { FiUpload, FiEdit, FiCheck, FiX } from "react-icons/fi";
import SectionMarkdown from "./SectionMarkdown";
import { toast } from "sonner";

//========== Area Highlights Component ===========

const AreaHighlights: React.FC<AreaHighlightsProps> = ({
  highlights,
  isAiGenerated,
  initialImageUrl,
  onEdit,
  onImageUpload,
}) => {
  //========== State ===========
  const [isEditing, setIsEditing] = useState(false);
  const [editedHighlights, setEditedHighlights] = useState<string>(highlights);
  const [galleryImages, setGalleryImages] = useState<string[]>(
    initialImageUrl ? [initialImageUrl] : [],
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasUploadedImage = galleryImages.length >= 1;

  useEffect(() => {
    setEditedHighlights(highlights);
  }, [highlights]);

  useEffect(() => {
    setGalleryImages(initialImageUrl ? [initialImageUrl] : []);
  }, [initialImageUrl]);

  //========== Handlers ===========
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editedHighlights.trim() === "") {
      alert("Please add area highlights before saving.");
      return;
    }

    if (onEdit) {
      await onEdit(editedHighlights);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedHighlights(highlights);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      setIsUploadingImage(true);
      if (onImageUpload) {
        const uploadedImageUrl = await onImageUpload(file);
        if (uploadedImageUrl) {
          setGalleryImages([uploadedImageUrl]);
          return;
        }
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage = reader.result as string;
        setGalleryImages([newImage]);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Area image upload failed:", error);
      alert("Failed to upload area image. Please try again.");
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleUploadClick = () => {
    if (hasUploadedImage) {
      toast.error("Only one image is allowed for this section.");
      return;
    }

    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6 mb-6">
      {/* ====== Header Section ====== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-lg md:text-xl text-gray-900">Area Highlights</h3>
          {/* ====== AI Generated Badge ====== */}
          {isAiGenerated && (
            <span className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
              <PiSparkle className="w-3 h-3" />
              AI Generated
            </span>
          )}
        </div>

        {/* ====== Action Buttons ====== */}
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
            >
              <FiEdit className="w-4 h-4" />
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
              >
                <FiCheck className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1 text-gray-600 hover:text-gray-700 text-sm"
              >
                <FiX className="w-4 h-4" />
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* ====== Highlights List ====== */}
      {!isEditing ? (
        <SectionMarkdown
          content={editedHighlights}
          className="text-sm md:text-base text-gray-700 mb-6"
        />
      ) : (
        <textarea
          value={editedHighlights}
          onChange={(e) => setEditedHighlights(e.target.value)}
          className="w-full min-h-[150px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-y mb-6"
          placeholder="Use markdown list format, e.g. - Near transit and retail hubs"
        />
      )}

      {/* ====== Area Photos Section ====== */}
      <div>
        <h4 className="text-base md:text-lg text-gray-900 mb-3">Area Photos</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="relative h-32 md:h-40 rounded-lg overflow-hidden"
            >
              <Image
                src={image}
                alt={`Area photo ${index + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ))}

          {/* ====== Upload New Photo Button ====== */}
          <div
            onClick={handleUploadClick}
            className={`relative h-32 md:h-40 rounded-lg border-2 border-dashed transition-colors flex items-center justify-center bg-gray-50 ${
              isUploadingImage || hasUploadedImage
                ? "border-gray-200 cursor-not-allowed opacity-70"
                : "border-gray-300 hover:border-blue-600 cursor-pointer hover:bg-gray-100"
            }`}
          >
            <div className="text-center">
              <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-gray-500">
                {isUploadingImage
                  ? "Uploading..."
                  : hasUploadedImage
                    ? "1 image max"
                    : "Upload"}
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={isUploadingImage || hasUploadedImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaHighlights;
