"use client";

import React from "react";
import PreviewSection from "./PreviewSection";
import { PropertyOverviewData } from "@/types/memorandum-detail";

//========== Preview Sections Component ===========

interface PreviewSectionsProps {
  executiveSummary: string;
  propertyOverview: PropertyOverviewData;
}

const PreviewSections: React.FC<PreviewSectionsProps> = ({
  executiveSummary,
  propertyOverview,
}) => {
  return (
    <div>
      {/* ====== Executive Summary Section ====== */}
      <PreviewSection sectionNumber={1} title="Executive Summary">
        <div className="bg-gray-50 rounded-lg p-6">
          <p className="text-gray-700 leading-relaxed">{executiveSummary}</p>
        </div>
      </PreviewSection>

      {/* ====== Property Overview Section ====== */}
      <PreviewSection sectionNumber={2} title="Property Overview">
        <div className="bg-gray-50 rounded-lg p-6 space-y-3">
          <div className="flex flex-col sm:flex-row gap-1">
            <span className="text-gray-900">Property Name:</span>
            <span className="text-gray-700">
              {propertyOverview.propertyName}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-1">
            <span className="text-gray-900">Address:</span>
            <span className="text-gray-700">{propertyOverview.address}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-1">
            <span className="text-gray-900">Year Built/Renovated:</span>
            <span className="text-gray-700">
              {propertyOverview.yearBuilt}
              {propertyOverview.yearRenovated &&
                `/${propertyOverview.yearRenovated}`}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-1">
            <span className="text-gray-900">Property Type:</span>
            <span className="text-gray-700">
              {propertyOverview.propertyType}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-1">
            <span className="text-gray-900">Number of Units:</span>
            <span className="text-gray-700">
              {propertyOverview.numberOfUnits}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-1">
            <span className="text-gray-900">Rentable Area:</span>
            <span className="text-gray-700">
              {propertyOverview.rentableArea.toLocaleString()} SF
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-1">
            <span className="text-gray-900">Occupancy:</span>
            <span className="text-gray-700">{propertyOverview.occupancy}%</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-1">
            <span className="text-gray-900">Parking Spaces:</span>
            <span className="text-gray-700">
              {propertyOverview.parkingSpaces}
            </span>
          </div>
        </div>

        {/* ====== Property Details and Performance Metrics Grid ====== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* ====== Property Details Card ====== */}
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h4 className="text-base text-gray-900">Property Details</h4>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-blue-200">
                <span className="text-gray-700">Property Type:</span>
                <span className="text-gray-900">
                  {propertyOverview.propertyType}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-blue-200">
                <span className="text-gray-700">Number of Units:</span>
                <span className="text-gray-900">
                  {propertyOverview.numberOfUnits}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-blue-200">
                <span className="text-gray-700">Rentable Area:</span>
                <span className="text-gray-900">
                  {propertyOverview.rentableArea.toLocaleString()} SF
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-700">Parking Spaces:</span>
                <span className="text-gray-900">
                  {propertyOverview.parkingSpaces}
                </span>
              </div>
            </div>
          </div>

          {/* ====== Performance Metrics Card ====== */}
          <div className="bg-green-50 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h4 className="text-base text-gray-900">Performance Metrics</h4>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-green-200">
                <span className="text-gray-700">Current Occupancy:</span>
                <span className="text-green-600 bg-green-100 px-3 py-1 rounded">
                  {propertyOverview.occupancy}%
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-green-200">
                <span className="text-gray-700">Year Built:</span>
                <span className="text-gray-900">
                  {propertyOverview.yearBuilt}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-700">Year Renovated:</span>
                <span className="text-gray-900">
                  {propertyOverview.yearRenovated || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </PreviewSection>
    </div>
  );
};

export default PreviewSections;
