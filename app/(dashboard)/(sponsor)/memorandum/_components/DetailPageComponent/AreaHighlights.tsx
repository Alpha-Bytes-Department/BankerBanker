"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { AreaHighlightsProps } from "@/types/memorandum-detail";
import { PiSparkle } from "react-icons/pi";
import {
  FiUpload,
  FiEdit,
  FiCheck,
  FiX,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";

//========== Area Highlights Component ===========

const AreaHighlights: React.FC<AreaHighlightsProps> = ({
  highlights,
  isAiGenerated,
  onEdit,
}) => {
  //========== State ===========
  const [isEditing, setIsEditing] = useState(false);
  const [editedHighlights, setEditedHighlights] =
    useState<string[]>(highlights);
  const [galleryImages, setGalleryImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800",
    "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800",
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  //========== Handlers ===========
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    
    const hasEmptyFields = editedHighlights.some(
      (highlight) => highlight.trim() === ""
    );

    if (hasEmptyFields) {
      alert("Please fill in all highlights before saving.");
      return;
    }

    setIsEditing(false);
    console.log("Area Highlights saved:", {
      highlights: editedHighlights,
      images: galleryImages,
    });
    if (onEdit) onEdit();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedHighlights(highlights);
  };

  const handleAddField = () => {
    setEditedHighlights([...editedHighlights, ""]);
  };

  const handleRemoveField = (index: number) => {
    setEditedHighlights(editedHighlights.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index: number, value: string) => {
    const updated = [...editedHighlights];
    updated[index] = value;
    setEditedHighlights(updated);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage = reader.result as string;
        setGalleryImages([...galleryImages, newImage]);
        console.log("Area photo uploaded:", file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
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
        <div className="space-y-3 mb-6">
          {editedHighlights.map((highlight, index) => (
            <div
              key={index}
              className="flex gap-3 text-sm md:text-base text-gray-700"
            >
              <span className="text-gray-900">•</span>
              <p className="flex-1">{highlight}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {editedHighlights.map((highlight, index) => (
            <div key={index} className="flex gap-2 items-start">
              <span className="text-gray-900 mt-2">•</span>
              <input
                type="text"
                value={highlight}
                onChange={(e) => handleFieldChange(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder={`Highlight ${index + 1}`}
              />
              <button
                onClick={() => handleRemoveField(index)}
                className="text-red-500 hover:text-red-700 p-2"
                type="button"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={handleAddField}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
            type="button"
          >
            <FiPlus className="w-4 h-4" />
            Add Highlight
          </button>
        </div>
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
              />
            </div>
          ))}

          {/* ====== Upload New Photo Button ====== */}
          <div
            onClick={handleUploadClick}
            className="relative h-32 md:h-40 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-600 cursor-pointer transition-colors flex items-center justify-center bg-gray-50 hover:bg-gray-100"
          >
            <div className="text-center">
              <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-gray-500">Upload</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaHighlights;
