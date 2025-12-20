"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { HeroSectionProps } from "@/types/memorandum-detail";
import { FiUpload } from "react-icons/fi";

//========== Hero Section Component ===========

const HeroSection: React.FC<HeroSectionProps> = ({
  heroImage,
  galleryImages,
  title,
}) => {
  //========== State ===========
  const [selectedImage, setSelectedImage] = useState<string>(heroImage);
  const [images, setImages] = useState<string[]>(galleryImages);
  const fileInputRef = useRef<HTMLInputElement>(null);

  //========== Handlers ===========
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage = reader.result as string;
        setImages([...images, newImage]);
        console.log("Image uploaded:", file.name);
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
          src={selectedImage}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        {/* ====== Hero Title Overlay ====== */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 md:p-8">
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
              src={image}
              alt={`Gallery image ${index + 1}`}
              fill
              className="object-cover"
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
