"use client";

import React from "react";
import Image from "next/image";
import PreviewSection from "./PreviewSection";
import { AreaAmenitiesData } from "@/types/memorandum-detail";
import {
  FaGolfBall,
  FaSchool,
  FaShoppingCart,
  FaHospital,
} from "react-icons/fa";
import { MdLocationOn, MdStar } from "react-icons/md";

//========== Area Amenities Component ===========

interface AreaAmenitiesProps {
  data: AreaAmenitiesData;
}

const AreaAmenities: React.FC<AreaAmenitiesProps> = ({ data }) => {
  //========== Icon Mapping ===========
  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      golf: <FaGolfBall className="w-5 h-5" />,
      school: <FaSchool className="w-5 h-5" />,
      shopping: <FaShoppingCart className="w-5 h-5" />,
      hospital: <FaHospital className="w-5 h-5" />,
    };
    return iconMap[iconName] || <MdLocationOn className="w-5 h-5" />;
  };

  //========== Category Color Mapping ===========
  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      Recreation: "bg-purple-100 text-purple-700",
      Education: "bg-blue-100 text-blue-700",
      Shopping: "bg-green-100 text-green-700",
      Healthcare: "bg-red-100 text-red-700",
    };
    return colorMap[category] || "bg-gray-100 text-gray-700";
  };

  return (
    <PreviewSection sectionNumber={11} title="Area Amenities">
      {/* ====== Section Header ====== */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-0.5 w-12 bg-blue-600"></div>
          <span className="text-blue-600 text-xs uppercase tracking-wider">
            Location Benefits
          </span>
        </div>
        <p className="text-sm text-gray-600">
          Nearby points of interest and community amenities
        </p>
      </div>

      {/* ====== Hero Image ====== */}
      <div className="mb-6 relative h-64 md:h-80 rounded-lg overflow-hidden">
        <Image
          src={data.heroImage}
          alt="Area Amenities"
          fill
          className="object-cover"
        />
      </div>

      {/* ====== Amenities Grid ====== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.amenities.map((amenity) => (
          <div
            key={amenity.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              {/* ====== Icon ====== */}
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
                {getIcon(amenity.icon)}
              </div>

              {/* ====== Content ====== */}
              <div className="flex-1">
                <h4 className="text-base text-gray-900 mb-1">{amenity.name}</h4>

                {/* ====== Category Badge ====== */}
                <span
                  className={`inline-block text-xs px-2 py-1 rounded mb-2 ${getCategoryColor(
                    amenity.category
                  )}`}
                >
                  {amenity.category}
                </span>

                {/* ====== Distance and Rating ====== */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MdLocationOn className="w-4 h-4 text-blue-600" />
                    <span>{amenity.distance}</span>
                  </div>

                  {amenity.rating && (
                    <div className="flex items-center gap-1">
                      <MdStar className="w-4 h-4 text-yellow-500" />
                      <span className="text-gray-900">{amenity.rating}/10</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PreviewSection>
  );
};

export default AreaAmenities;
