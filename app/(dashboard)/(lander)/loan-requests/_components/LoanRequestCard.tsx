"use client";

import React from "react";
import Image from "next/image";
import { LoanRequestCardProps } from "@/types/loan-request";
import { FiMapPin, FiSend, FiEye, FiFile } from "react-icons/fi";

//========== Loan Request Card Component ===========

const LoanRequestCard: React.FC<LoanRequestCardProps> = ({
  loanRequest,
  onSubmitQuote,
  onViewDetails,
  onViewDocuments,
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

  //========== Urgency Badge ===========
  const getUrgencyBadge = () => {
    if (loanRequest.urgencyLevel === "high") {
      return (
        <span className="bg-red-500 text-white text-xs px-3 py-1 rounded">
          Urgent
        </span>
      );
    }
    return null;
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
        {/* ====== Property Image Section ====== */}
        <div className="relative h-64 lg:h-auto">
          <Image
            src={loanRequest.propertyImage}
            alt={loanRequest.propertyName}
            fill
            className="object-cover"
          />

          {/* ====== Badges Overlay ====== */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span
              className={`text-xs px-3 py-1 rounded ${getPropertyTypeColor(
                loanRequest.propertyType
              )}`}
            >
              {loanRequest.propertyType}
            </span>
            {getUrgencyBadge()}
          </div>
        </div>

        {/* ====== Details Section ====== */}
        <div className="lg:col-span-2 p-4 md:p-6">
          <div className="flex flex-col h-full">
            {/* ====== Header ====== */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <div className="flex-1">
                <h3 className="text-lg md:text-xl text-gray-900 mb-2">
                  {loanRequest.propertyName}
                </h3>
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                  <FiMapPin className="w-4 h-4" />
                  <span>{loanRequest.address}</span>
                </div>
                {loanRequest.isActive && (
                  <span className="inline-block bg-green-100 text-green-700 text-xs px-3 py-1 rounded">
                    active
                  </span>
                )}
              </div>

              {/* ====== Requested Amount ====== */}
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Requested Amount</p>
                <p className="text-2xl md:text-3xl text-blue-600">
                  {formatCurrency(loanRequest.requestedAmount)}
                </p>
              </div>
            </div>

            {/* ====== Loan Details Grid ====== */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6 text-sm">
              {/* ====== Loan Term ====== */}
              <div>
                <p className="text-gray-600 mb-1">Loan Term</p>
                <p className="text-gray-900">{loanRequest.loanTerm}</p>
              </div>

              {/* ====== Occupancy ====== */}
              <div>
                <p className="text-gray-600 mb-1">Occupancy</p>
                <p className="text-gray-900">{loanRequest.occupancy}%</p>
              </div>

              {/* ====== Year Built ====== */}
              <div>
                <p className="text-gray-600 mb-1">Year Built</p>
                <p className="text-gray-900">{loanRequest.yearBuilt}</p>
              </div>

              {/* ====== LTV ====== */}
              <div>
                <p className="text-gray-600 mb-1">LTV</p>
                <p className="text-gray-900">{loanRequest.ltv}%</p>
              </div>

              {/* ====== Sponsor ====== */}
              <div className="col-span-2 sm:col-span-1">
                <p className="text-gray-600 mb-1">Sponsor</p>
                <p className="text-gray-900">{loanRequest.sponsor}</p>
              </div>
            </div>

            {/* ====== Action Buttons ====== */}
            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <button
                onClick={() => onSubmitQuote(loanRequest.id)}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                <FiSend className="w-4 h-4" />
                Submit Quote
              </button>
              <button
                onClick={() => onViewDetails(loanRequest.id)}
                className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                <FiEye className="w-4 h-4" />
                View Details
              </button>
              <button
                onClick={() => onViewDocuments(loanRequest.id)}
                className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                <FiFile className="w-4 h-4" />
                Documents
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanRequestCard;
