"use client";

import React from "react";
import Image from "next/image";
import { PropertyMapData } from "@/types/loan-request";
import { FiMapPin, FiSend, FiEye, FiX } from "react-icons/fi";

//========== Property Details Panel Component ===========

interface PropertyDetailsPanelProps {
  property: PropertyMapData | null;
  onClose: () => void;
  onSubmitQuote: (id: number) => void;
  onViewFullDetails: (id: number) => void;
}

const PropertyDetailsPanel: React.FC<PropertyDetailsPanelProps> = ({
  property,
  onClose,
  onSubmitQuote,
  onViewFullDetails,
}) => {
  //========== Format Currency ===========
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  //========== Format Number ===========
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  //========== Property Type Colors ===========
  const getPropertyTypeColor = (type: string): string => {
    const colorMap: { [key: string]: string } = {
      Office: "bg-blue-100 text-blue-700",
      Multifamily: "bg-purple-100 text-purple-700",
      Retail: "bg-green-100 text-green-700",
      Industrial: "bg-orange-100 text-orange-700",
      "Mixed-Use": "bg-pink-100 text-pink-700",
    };
    return colorMap[type] || "bg-gray-100 text-gray-700";
  };

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-4 md:p-8">
        <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2 md:mb-3">
          <FiMapPin className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
        </div>
        <h3 className="text-sm md:text-base text-gray-900 mb-2">Select a Property</h3>
        <p className="text-xs md:text-sm text-gray-600">
          Click on any marker to view property details
          <br />
          and submit a quote
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white overflow-hidden">
      {/* ====== Close Button ====== */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 md:top-4 md:right-4 z-10 w-7 h-7 md:w-8 md:h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
      >
        <FiX className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
      </button>

      {/* ====== Property Image ====== */}
      <div className="relative h-32 sm:h-40 shrink-0">
        <Image
          src={property.propertyImage}
          alt={property.propertyName}
          fill
          className="object-cover rounded-lg"
        />

        {/* ====== Urgency Badge ====== */}
        {property.urgencyLevel === "high" && (
          <div className="absolute top-4 left-4">
            <span className="bg-red-500 text-white text-xs px-3 py-1 rounded shadow-md">
              High priority
            </span>
          </div>
        )}
      </div>

      {/* ====== Scrollable Content ====== */}
      <div className="flex-1 p-3 md:p-4 overflow-hidden">
        {/* ====== Property Name ====== */}
        <h2 className="text-base md:text-lg text-gray-900 mb-2 wrap-break-words">{property.propertyName}</h2>

        {/* ====== Address ====== */}
        <div className="flex items-center gap-2 text-gray-600 text-xs md:text-sm mb-3 min-w-0">
          <FiMapPin className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
          <span className="wrap-break-wordbreak-words flex-1 min-w-0">{property.address}</span>
        </div>

        {/* ====== Property Type and Status ====== */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span
            className={`text-xs px-2 md:px-3 py-1 rounded ${getPropertyTypeColor(
              property.propertyType
            )}`}
          >
            {property.propertyType}
          </span>
          {property.isActive && (
            <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded">
              Active
            </span>
          )}
        </div>

        {/* ====== Requested Loan Amount ====== */}
        <div className="mb-4 overflow-hidden">
          <p className="text-xs md:text-sm text-gray-600 mb-1">Requested Loan Amount</p>
          <p className="text-xl md:text-2xl text-blue-600 wrap-break-words">
            {formatCurrency(property.requestedAmount)}
          </p>
        </div>

        {/* ====== Property Details Grid ====== */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm mb-4">
          {/* ====== Loan Term ====== */}
          <div>
            <p className="text-gray-600 mb-1">Loan Term</p>
            <p className="text-gray-900">{property.loanTerm}</p>
          </div>

          {/* ====== Occupancy ====== */}
          <div>
            <p className="text-gray-600 mb-1">Occupancy</p>
            <p className="text-gray-900">{property.occupancy}%</p>
          </div>

          {/* ====== Year Built ====== */}
          <div>
            <p className="text-gray-600 mb-1">Year Built</p>
            <p className="text-gray-900">{property.yearBuilt}</p>
          </div>

          {/* ====== Target LTV ====== */}
          <div>
            <p className="text-gray-600 mb-1">Target LTV</p>
            <p className="text-gray-900">
              {property.targetLtv || property.ltv}%
            </p>
          </div>

          {/* ====== Units (if available) ====== */}
          {property.units && (
            <div>
              <p className="text-gray-600 mb-1">Units</p>
              <p className="text-gray-900">{property.units}</p>
            </div>
          )}

          {/* ====== Square Feet (if available) ====== */}
          {property.squareFeet && (
            <div>
              <p className="text-gray-600 mb-1">Square Feet</p>
              <p className="text-gray-900">
                {formatNumber(property.squareFeet)}
              </p>
            </div>
          )}
        </div>

        {/* ====== Sponsor ====== */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">Sponsor</p>
          <p className="text-gray-900">{property.sponsor}</p>
        </div>

        {/* ====== Action Buttons ====== */}
        <div className="space-y-2">
          <button
            onClick={() => onSubmitQuote(property.id)}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm hover:bg-blue-700 transition-colors"
          >
            <FiSend className="w-3 h-3 md:w-4 md:h-4" />
            Submit Quote
          </button>
          <button
            onClick={() => onViewFullDetails(property.id)}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm hover:bg-gray-50 transition-colors"
          >
            <FiEye className="w-4 h-4" />
            View Full Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPanel;
