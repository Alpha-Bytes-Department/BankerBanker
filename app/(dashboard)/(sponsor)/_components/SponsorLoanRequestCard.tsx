"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LuCalendar,
  LuDollarSign,
  LuPercent,
  LuPencil,
  LuTrash2,
  LuArrowUpRight,
} from "react-icons/lu";
import { IoLocationOutline } from "react-icons/io5";
import type { SponsorLoanRequestItem } from "../_api/loan-requests-api";

const FALLBACK_IMAGE = "/images/SponsorDashboard.png";

interface SponsorLoanRequestCardProps {
  request: SponsorLoanRequestItem;
  onEdit: (request: SponsorLoanRequestItem) => void;
  onDelete: (request: SponsorLoanRequestItem) => void;
  onViewQuotes?: (request: SponsorLoanRequestItem) => void;
  isDeleting?: boolean;
}

export default function SponsorLoanRequestCard({
  request,
  onEdit,
  onDelete,
  onViewQuotes,
  isDeleting = false,
}: SponsorLoanRequestCardProps) {
  const [imgError, setImgError] = useState(false);

  const rawImage =
    request.thumbnail_url ||
    request.property_image_url ||
    (Array.isArray(request.property_images) && request.property_images.length > 0
      ? request.property_images[0]
      : null);

  const imageSrc = imgError || !rawImage ? FALLBACK_IMAGE : rawImage;

  const formattedAmount = Number(request.requested_amount || 0).toLocaleString(
    "en-US",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
  );

  const statusColor = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("accept") || s.includes("approved"))
      return "bg-green-100 text-green-700 border-green-200";
    if (s.includes("review") || s.includes("quote"))
      return "bg-blue-100 text-blue-700 border-blue-200";
    if (s.includes("decline") || s.includes("reject"))
      return "bg-red-100 text-red-700 border-red-200";
    return "bg-amber-100 text-amber-800 border-amber-200";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Top Image + Badge */}
        <div className="relative w-full h-44 bg-gray-100">
          <Image
            src={imageSrc}
            alt={request.property_name}
            fill
            className="object-cover"
            unoptimized
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Property Type Badge */}
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 text-gray-800 shadow-xs capitalize">
            {request.property_type || "Commercial"}
          </span>

          {/* Status Badge */}
          <span
            className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold border shadow-xs ${statusColor(
              request.status,
            )}`}
          >
            {request.status || "Pending"}
          </span>

          {/* Property Name overlay */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <h3 className="text-base font-bold truncate leading-snug">
              {request.property_name}
            </h3>
            <p className="text-xs text-white/80 flex items-center gap-1 truncate">
              <IoLocationOutline className="shrink-0" />
              <span className="truncate">
                {request.property_address || "No address specified"}
              </span>
            </p>
          </div>
        </div>

        {/* Loan Terms Grid */}
        <div className="p-4 grid grid-cols-3 gap-2 border-b border-gray-100">
          {/* Requested Amount */}
          <div className="flex flex-col">
            <span className="text-[11px] uppercase font-semibold text-gray-400 flex items-center gap-0.5">
              <LuDollarSign /> Amount
            </span>
            <span className="text-base font-bold text-gray-900 truncate">
              ${formattedAmount}
            </span>
          </div>

          {/* Loan Term */}
          <div className="flex flex-col">
            <span className="text-[11px] uppercase font-semibold text-gray-400 flex items-center gap-0.5">
              <LuCalendar /> Term
            </span>
            <span className="text-sm font-bold text-gray-900">
              {request.loan_term} mo
            </span>
            <span className="text-[10px] text-gray-400">
              {(request.loan_term / 12).toFixed(1)} yrs
            </span>
          </div>

          {/* Target LTV */}
          <div className="flex flex-col">
            <span className="text-[11px] uppercase font-semibold text-gray-400 flex items-center gap-0.5">
              <LuPercent /> LTV
            </span>
            <span className="text-sm font-bold text-gray-900">
              {request.ltv}%
            </span>
            <span className="text-[10px] text-gray-400">Target</span>
          </div>
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="p-3 bg-gray-50/70 flex items-center justify-between gap-2 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(request)}
            className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-colors text-xs font-medium flex items-center gap-1"
            title="Edit request"
          >
            <LuPencil className="text-sm" />
            <span>Edit</span>
          </button>

          <button
            type="button"
            disabled={isDeleting}
            onClick={() => onDelete(request)}
            className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors text-xs font-medium flex items-center gap-1 disabled:opacity-50"
            title="Delete request"
          >
            <LuTrash2 className="text-sm" />
            <span>Delete</span>
          </button>
        </div>

        {onViewQuotes ? (
          <button
            type="button"
            onClick={() => onViewQuotes(request)}
            className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
          >
            <span>View Quotes</span>
            <LuArrowUpRight className="text-xs" />
          </button>
        ) : (
          <Link
            href={`/loan?requestId=${request.id}`}
            className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-2xs"
          >
            <span>View Quotes</span>
            <LuArrowUpRight className="text-xs" />
          </Link>
        )}
      </div>
    </div>
  );
}
