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
      <div className="relative w-full h-64 md:h-96 lg:h-[500px] rounded-xl overflow-hidden mb-4">
        <Image
          src={selectedImage || FALLBACK_IMAGE}
          alt={title}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        {/* ====== Hero Title Overlay ====== */}
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-6 md:p-8">
          <h2 className="text-white text-lg md:text-2xl">{title}</h2>
        </div>
      </div>

      {/* ====== Gallery Thumbnails ====== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className={`relative h-32 md:h-40 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
              selectedImage === image
                ? "border-blue-600 shadow-lg"
                : "border-transparent hover:border-gray-300"
            }`}
            onClick={() => setSelectedImage(image)}
          >
            <Image
              src={image || FALLBACK_IMAGE}
              alt={`Gallery image ${index + 1}`}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ))}

        {/* ====== Upload New Image Button ====== */}
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
  );
};

export default HeroSection;
