"use client";

import React from "react";
import { FaArrowTrendUp } from "react-icons/fa6";
import { LuBuilding2 } from "react-icons/lu";
import PreviewSection from "./PreviewSection";
import FinancialAnalysis from "./FinancialAnalysis";
import SalesComparables from "./SalesComparables";
import LeaseComparables from "./LeaseComparables";
import AreaAmenities from "./AreaAmenities";
import Sponsorship from "./Sponsorship";
import Disclaimer from "./Disclaimer";
import {
  PropertyOverviewData,
  FinancialAnalysisData,
  SalesComparablesData,
  LeaseComparablesData,
  AreaAmenitiesData,
  SponsorshipData,
  DisclaimerData,
  MarketSummaryData,
} from "@/types/memorandum-detail";

//========== Preview Sections Component ===========

interface PreviewSectionsProps {
  executiveSummary: string;
  propertyOverview: PropertyOverviewData;
  propertyHighlights: string[];
  areaOverview: {
    description: string;
    neighborhoodDescription: string;
    localAmenities: string;
  };
  areaHighlights: string[];
  marketSummary: MarketSummaryData;
  financingSummary: string;
  financialAnalysis: FinancialAnalysisData;
  salesComparables: SalesComparablesData;
  leaseComparables: LeaseComparablesData;
  areaAmenities: AreaAmenitiesData;
  sponsorship: SponsorshipData;
  disclaimer: DisclaimerData;
}

const PreviewSections: React.FC<PreviewSectionsProps> = ({
  executiveSummary,
  propertyOverview,
  propertyHighlights,
  areaOverview,
  areaHighlights,
  marketSummary,
  financingSummary,
  financialAnalysis,
  salesComparables,
  leaseComparables,
  areaAmenities,
  sponsorship,
  disclaimer,
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
              <div className="w-6 h-6 rounded flex items-center justify-center">
                <LuBuilding2 size={28} className="font-bold text-blue-600" />
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
              <div className="w-6 h-6  rounded flex items-center justify-center">
                <FaArrowTrendUp size={28} className=" text-blue-600" />
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

      {/* ====== Property Highlights Section ====== */}
      <PreviewSection sectionNumber={3} title="Property Highlights">
        <div className="bg-gray-50 rounded-lg p-6">
          <ul className="space-y-3">
            {propertyHighlights.map((highlight, index) => (
              <li key={index} className="flex gap-3 text-gray-700">
                <span className="text-gray-900">•</span>
                <p>{highlight}</p>
              </li>
            ))}
          </ul>
        </div>
      </PreviewSection>

      {/* ====== Area Overview Section ====== */}
      <PreviewSection sectionNumber={4} title="Area Overview">
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <p className="text-gray-700 leading-relaxed">
            {areaOverview.description}
          </p>
          <p className="text-gray-700 leading-relaxed">
            {areaOverview.neighborhoodDescription}
          </p>
          <p className="text-gray-700 leading-relaxed">
            {areaOverview.localAmenities}
          </p>
        </div>
      </PreviewSection>

      {/* ====== Area Highlights Section ====== */}
      <PreviewSection sectionNumber={5} title="Area Highlights">
        <div className="bg-gray-50 rounded-lg p-6">
          <ul className="space-y-3">
            {areaHighlights.map((highlight, index) => (
              <li key={index} className="flex gap-3 text-gray-700">
                <span className="text-gray-900">•</span>
                <p>{highlight}</p>
              </li>
            ))}
          </ul>
        </div>
      </PreviewSection>

      {/* ====== Market Summary Section ====== */}
      <PreviewSection sectionNumber={6} title="Market Summary">
        <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
          <p className="text-gray-700 leading-relaxed mb-4">
            {marketSummary.description}
          </p>
          <div className="mt-4">
            <p className="text-sm text-gray-900 mb-2">Key market indicators:</p>
            <ul className="space-y-2">
              {marketSummary.keyIndicators.map((indicator, index) => (
                <li key={index} className="flex gap-2 text-sm text-gray-700">
                  <span>•</span>
                  <span>
                    {indicator.label}: {indicator.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PreviewSection>

      {/* ====== Financing Summary Section ====== */}
      <PreviewSection sectionNumber={7} title="Financing Summary">
        <div className="bg-gray-50 rounded-lg p-6">
          <p className="text-gray-700 leading-relaxed">{financingSummary}</p>
        </div>
      </PreviewSection>

      {/* ====== Financial Analysis Section ====== */}
      <FinancialAnalysis data={financialAnalysis} />

      {/* ====== Sales Comparables Section ====== */}
      <SalesComparables data={salesComparables} />

      {/* ====== Lease Comparables Section ====== */}
      <LeaseComparables data={leaseComparables} />

      {/* ====== Area Amenities Section ====== */}
      <AreaAmenities data={areaAmenities} />

      {/* ====== Sponsorship Section ====== */}
      <Sponsorship data={sponsorship} />

      {/* ====== Disclaimer Section ====== */}
      <Disclaimer data={disclaimer} />
    </div>
  );
};

export default PreviewSections;
