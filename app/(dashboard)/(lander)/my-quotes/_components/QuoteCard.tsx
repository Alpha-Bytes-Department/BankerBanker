"use client";

import React from "react";
import { Quote } from "@/types/my-quotes";
import Image from "next/image";
import { FiEye, FiEdit2, FiX, FiHome, FiMoreVertical } from "react-icons/fi";

//========== Quote Card Component ===========

interface QuoteCardProps {
  quote: Quote;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote }) => {
  //========== Get Status Badge Color ===========
  const getStatusBadgeColor = () => {
    switch (quote.status) {
      case "under_review":
        return "bg-blue-500";
      case "accepted":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  //========== Get Status Text ===========
  const getStatusText = () => {
    switch (quote.status) {
      case "under_review":
        return "UNDER REVIEW";
      case "accepted":
        return "ACCEPTED";
      case "rejected":
        return "REJECTED";
      default:
        return "PENDING";
    }
  };

  //========== Get Priority Badge ===========
  const getPriorityBadge = () => {
    if (quote.priority === "priority" || quote.priority === "urgent") {
      return (
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
          Priority
        </span>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex flex-col lg:flex-row">
        {/* ====== Property Image ====== */}
        <div className="relative w-full lg:w-44 h-44 lg:h-auto flex-shrink-0">
          <Image
            src={quote.image}
            alt={quote.propertyName}
            fill
            className="object-cover"
          />
          {getPriorityBadge()}
          <span className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-medium px-2 py-1 rounded">
            {quote.propertyType}
          </span>
          <span
            className={`absolute bottom-2 left-2 ${getStatusBadgeColor()} text-white text-xs font-medium px-2 py-1 rounded`}
          >
            {getStatusText()}
          </span>
        </div>

        {/* ====== Quote Details ====== */}
        <div className="flex-1 p-4 md:p-5 min-w-0">
          {/* ====== Header ====== */}
          <div className="flex items-start justify-between mb-3 gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 truncate">
                {quote.propertyName}
              </h3>
              <p className="text-xs md:text-sm text-gray-600 flex items-center gap-1 mb-1">
                <span className="truncate">
                  {quote.address}, {quote.city}, {quote.state}
                </span>
              </p>
              <p className="text-xs md:text-sm text-gray-500">
                {quote.sponsor}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-gray-500 mb-1">Quoted Amount</p>
              <p className="text-lg md:text-xl font-bold text-blue-600">
                {quote.quotedAmount}
              </p>
            </div>
          </div>

          {/* ====== Details Grid ====== */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-4 text-xs md:text-sm">
            <div>
              <p className="text-gray-500 mb-1">Interest Rate</p>
              <p className="font-medium text-gray-900">{quote.interestRate}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Term</p>
              <p className="font-medium text-gray-900">{quote.term}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">LTV</p>
              <p className="font-medium text-gray-900">{quote.ltv}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Submitted</p>
              <p className="font-medium text-gray-900">{quote.submittedDate}</p>
            </div>
          </div>

          {/* ====== Footer Info ====== */}
          <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-600 mb-4">
            <span className="flex items-center gap-1">
              <FiEye className="w-4 h-4" />
              {quote.competingQuotes} competing quotes
            </span>
            <span className="flex items-center gap-1">
              Avg response: {quote.avgResponseTime}
            </span>
            <span
              className={`font-medium ${
                quote.expiresIn < 0 ? "text-red-600" : "text-orange-600"
              }`}
            >
              Expires in:{" "}
              {quote.expiresIn < 0
                ? `${Math.abs(quote.expiresIn)} days`
                : `${quote.expiresIn} days`}
            </span>
          </div>

          {/* ====== Status Message ====== */}
          {quote.statusMessage && (
            <div
              className={`mb-4 p-3 rounded-lg text-xs md:text-sm ${
                quote.status === "accepted"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {quote.statusMessage}
            </div>
          )}

          {/* ====== Action Buttons ====== */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <button className="flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs md:text-sm font-medium text-gray-700">
              <FiEye className="w-4 h-4" />
              View Quote
            </button>

            {quote.status === "under_review" && (
              <>
                <button className="flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs md:text-sm font-medium text-gray-700">
                  <FiEdit2 className="w-4 h-4" />
                  Edit
                </button>
                <button className="flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-xs md:text-sm font-medium text-red-600">
                  <FiX className="w-4 h-4" />
                  Withdraw
                </button>
              </>
            )}

            {quote.status === "accepted" && (
              <button className="flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs md:text-sm font-medium">
                Contact Sponsor
              </button>
            )}

            <button className="flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs md:text-sm font-medium text-gray-700">
              <FiHome className="w-4 h-4" />
              View Property
            </button>

            <button className="ml-auto p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <FiMoreVertical className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteCard;
