"use client";

import React from "react";
import PDFSection from "./PDFSection";
import {
  PropertyOverviewData,
  AreaOverviewData,
  MarketSummaryData,
} from "@/types/memorandum-detail";

/* ========================================
   EXECUTIVE SUMMARY + PROPERTY OVERVIEW
   ========================================
   Combined on ONE page (sections 1 & 2).
   Max ~2500 chars total for safe fit.
======================================== */

interface PDFSummaryOverviewProps {
  executiveSummary: string;
  propertyOverview: PropertyOverviewData;
}

export const PDFSummaryOverview: React.FC<PDFSummaryOverviewProps> = ({
  executiveSummary,
  propertyOverview,
}) => {
  const details = [
    { label: "Property Name", value: propertyOverview.propertyName },
    {
      label: "Address",
      value: `${propertyOverview.address}, ${propertyOverview.zipCode}`,
    },
    { label: "Year Built", value: propertyOverview.yearBuilt },
    { label: "Year Renovated", value: propertyOverview.yearRenovated || "N/A" },
    { label: "Property Type", value: propertyOverview.propertyType },
    { label: "Number of Units", value: propertyOverview.numberOfUnits },
    {
      label: "Rentable Area",
      value: `${propertyOverview.rentableArea.toLocaleString()} SF`,
    },
    { label: "Occupancy", value: `${propertyOverview.occupancy}%` },
    { label: "Parking Spaces", value: propertyOverview.parkingSpaces },
  ];

  return (
    <PDFSection sectionNumber={1} title="Executive Summary & Property Overview">
      {/* Executive Summary */}
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">
          Executive Summary
        </h3>
        <div
          className="rounded-md px-4 py-3 text-[11px] leading-relaxed text-gray-700"
          style={{ backgroundColor: "#F9FAFB" }}
        >
          {executiveSummary}
        </div>
      </div>

      {/* Property Overview – 2-column grid of key-value pairs */}
      <h3 className="text-sm font-semibold text-gray-900 mb-2">
        Property Overview
      </h3>
      <div className="grid grid-cols-2 gap-x-6 gap-y-1 print-avoid-break">
        {details.map((item) => (
          <div
            key={item.label}
            className="flex justify-between py-[5px]"
            style={{ borderBottom: "1px solid #E5E7EB" }}
          >
            <span className="text-gray-500 text-[10px]">{item.label}</span>
            <span className="text-gray-900 text-[10px] font-medium">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </PDFSection>
  );
};

/* ========================================
   PROPERTY HIGHLIGHTS
   ========================================
   Separate page. Max ~6 highlights × 200 chars each.
======================================== */

interface PDFPropertyHighlightsProps {
  highlights: string[];
}

export const PDFPropertyHighlights: React.FC<PDFPropertyHighlightsProps> = ({
  highlights,
}) => {
  return (
    <PDFSection sectionNumber={2} title="Property Highlights">
      <ul className="space-y-3">
        {highlights.map((h, i) => (
          <li key={i} className="flex items-start gap-3 print-avoid-break">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5"
              style={{ backgroundColor: "#DBEAFE", color: "#0D4DA5" }}
            >
              {i + 1}
            </div>
            <span className="text-[11px] text-gray-700 leading-relaxed">
              {h}
            </span>
          </li>
        ))}
      </ul>
    </PDFSection>
  );
};

/* ========================================
   AREA OVERVIEW
   ========================================
   Separate page. 3 sub-sections, max ~1800 chars total.
======================================== */

interface PDFAreaOverviewProps {
  areaOverview: AreaOverviewData;
}

export const PDFAreaOverview: React.FC<PDFAreaOverviewProps> = ({
  areaOverview,
}) => {
  return (
    <PDFSection sectionNumber={3} title="Area Overview">
      <div className="space-y-4">
        <div className="print-avoid-break">
          <h4 className="text-xs font-semibold text-gray-900 mb-1">
            Description
          </h4>
          <p className="text-[11px] text-gray-700 leading-relaxed">
            {areaOverview.description}
          </p>
        </div>
        <div className="print-avoid-break">
          <h4 className="text-xs font-semibold text-gray-900 mb-1">
            Neighborhood
          </h4>
          <p className="text-[11px] text-gray-700 leading-relaxed">
            {areaOverview.neighborhoodDescription}
          </p>
        </div>
        <div className="print-avoid-break">
          <h4 className="text-xs font-semibold text-gray-900 mb-1">
            Local Amenities
          </h4>
          <p className="text-[11px] text-gray-700 leading-relaxed">
            {areaOverview.localAmenities}
          </p>
        </div>
      </div>
    </PDFSection>
  );
};

/* ========================================
   AREA HIGHLIGHTS
   ========================================
   Separate page. Same pattern as property highlights.
======================================== */

interface PDFAreaHighlightsProps {
  highlights: string[];
}

export const PDFAreaHighlights: React.FC<PDFAreaHighlightsProps> = ({
  highlights,
}) => {
  return (
    <PDFSection sectionNumber={4} title="Area Highlights">
      <ul className="space-y-3">
        {highlights.map((h, i) => (
          <li key={i} className="flex items-start gap-3 print-avoid-break">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5"
              style={{ backgroundColor: "#DBEAFE", color: "#0D4DA5" }}
            >
              {i + 1}
            </div>
            <span className="text-[11px] text-gray-700 leading-relaxed">
              {h}
            </span>
          </li>
        ))}
      </ul>
    </PDFSection>
  );
};

/* ========================================
   MARKET SUMMARY
   ========================================
   Separate page. Description + key indicator cards in flex row.
======================================== */

interface PDFMarketSummaryProps {
  data: MarketSummaryData;
}

export const PDFMarketSummary: React.FC<PDFMarketSummaryProps> = ({ data }) => {
  return (
    <PDFSection sectionNumber={5} title="Market Summary">
      <div
        className="rounded-md px-4 py-3 mb-5 print-avoid-break"
        style={{ backgroundColor: "#FAF5FF" }}
      >
        <p className="text-[11px] text-gray-700 leading-relaxed">
          {data.description}
        </p>
      </div>

      {/* Key indicators — flex row, cards */}
      <h4 className="text-xs font-semibold text-gray-900 mb-3">
        Key Market Indicators
      </h4>
      <div className="flex flex-wrap gap-3">
        {data.keyIndicators.map((kpi) => (
          <div
            key={kpi.label}
            className="flex-1 min-w-[130px] max-w-[180px] rounded-md px-3 py-3 text-center print-avoid-break"
            style={{ backgroundColor: "#F3F4F6" }}
          >
            <p className="text-[10px] text-gray-500 mb-1">{kpi.label}</p>
            <p className="text-sm font-semibold text-gray-900">{kpi.value}</p>
          </div>
        ))}
      </div>
    </PDFSection>
  );
};

/* ========================================
   FINANCING SUMMARY
   ========================================
   Separate page.
======================================== */

interface PDFFinancingSummaryProps {
  content: string;
}

export const PDFFinancingSummary: React.FC<PDFFinancingSummaryProps> = ({
  content,
}) => {
  return (
    <PDFSection sectionNumber={6} title="Financing Summary">
      <div
        className="rounded-md px-4 py-3 print-avoid-break"
        style={{ backgroundColor: "#F9FAFB" }}
      >
        <p className="text-[11px] text-gray-700 leading-relaxed">{content}</p>
      </div>
    </PDFSection>
  );
};
