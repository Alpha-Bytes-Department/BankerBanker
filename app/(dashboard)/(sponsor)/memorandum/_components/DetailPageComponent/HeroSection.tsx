"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HeroSectionProps } from "@/types/memorandum-detail";
import { FiUpload } from "react-icons/fi";

//========== Hero Section Component ===========

const FALLBACK_IMAGE = "/images/SponsorDashboard.png";

const normalizeImageUrl = (image?: string) => {
  if (!image) return "";

  const trimmed = image.trim();
  if (!trimmed) return "";

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("/")
  ) {
    return trimmed;
  }

  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/+$/, "");
  if (!baseUrl) return trimmed;

  return `${baseUrl}/${trimmed.replace(/^\/+/, "")}`;
};

const HeroSection: React.FC<HeroSectionProps> = ({
  heroImage,
  galleryImages,
  title,
}) => {
  //========== State ===========
  const [selectedImage, setSelectedImage] = useState<string>(
    normalizeImageUrl(heroImage),
  );
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const normalizedImages = [heroImage, ...galleryImages]
      .map((image) => normalizeImageUrl(image))
      .filter(Boolean);

    const uniqueImages = Array.from(new Set(normalizedImages));
    setImages(uniqueImages);

    if (!uniqueImages.length) {
      setSelectedImage("");
      return;
    }

    setSelectedImage((prevSelected) =>
      uniqueImages.includes(prevSelected) ? prevSelected : uniqueImages[0],
    );
  }, [heroImage, galleryImages]);

  //========== Handlers ===========
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage = reader.result as string;
        setImages((prev) => [...prev, newImage]);
        setSelectedImage(newImage);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-6">
      {/* ====== Hero Image Container ====== */}
      <div className="relative w-full h-64 md:h-96 lg:h-[500px] rounded-xl overflow-hidden mb-4 border border-gray-200 shadow-sm">
        <Image
          src={selectedImage || FALLBACK_IMAGE}
          alt={title}
          fill
          className="object-cover"
          priority
          unoptimized
          onError={() => setSelectedImage(FALLBACK_IMAGE)}
        />
        {/* ====== Hero Title Overlay ====== */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 md:p-8 flex items-end justify-between">
          <div>
            <span className="inline-block bg-blue-600/90 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-md mb-2">
              Featured Property Photo
            </span>
            <h2 className="text-white text-lg md:text-2xl font-bold drop-shadow-sm">{title}</h2>
          </div>
          {images.length > 0 && (
            <div className="hidden sm:block bg-black/60 backdrop-blur-sm text-white/90 text-xs px-3 py-1.5 rounded-lg border border-white/20">
              {images.length} {images.length === 1 ? "Photo" : "Photos"}
            </div>
          )}
        </div>
      </div>

      {/* ====== Gallery Thumbnails ====== */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Property Gallery & Assets
          </h4>
          <span className="text-xs text-gray-400">
            Click any image to set as hero preview
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className={`relative h-28 sm:h-32 md:h-36 rounded-lg overflow-hidden cursor-pointer border-2 transition-all shadow-xs group ${
                selectedImage === image
                  ? "border-blue-600 ring-2 ring-blue-600/30 shadow-md scale-[1.02]"
                  : "border-gray-200 hover:border-blue-400 hover:scale-[1.01]"
              }`}
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image || FALLBACK_IMAGE}
                alt={`Gallery image ${index + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized
              />
              {selectedImage === image && (
                <div className="absolute top-1.5 right-1.5 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                  Active
                </div>
              )}
            </div>
          ))}

          {/* ====== Upload New Image Button ====== */}
          <div
            onClick={handleUploadClick}
            className="relative h-28 sm:h-32 md:h-36 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-600 cursor-pointer transition-colors flex items-center justify-center bg-gray-50 hover:bg-blue-50/50 group"
          >
            <div className="text-center p-2">
              <FiUpload className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400 group-hover:text-blue-600 mx-auto mb-1 transition-colors" />
              <p className="text-xs font-medium text-gray-600 group-hover:text-blue-600">
                Upload Photo
              </p>
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

export default HeroSection;
