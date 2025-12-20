"use client";

import Link from "next/link";
import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import MemorandumHeader from "./MemorandumHeader";
import HeroSection from "./HeroSection";
import ExecutiveSummary from "./ExecutiveSummary";
import PropertyOverview from "./PropertyOverview";
import PropertyHighlights from "./PropertyHighlights";
import AreaOverview from "./AreaOverview";
import AreaHighlights from "./AreaHighlights";
import MarketSummary from "./MarketSummary";
import FinancingSummary from "./FinancingSummary";
import AddSections from "./AddSections";
import PreviewCover from "./PreviewCover";
import TableOfContents from "./TableOfContents";
import PreviewSections from "./PreviewSections";
import { MemorandumTab } from "@/types/memorandum-detail";

//========== Memorandum Detail Page Component ===========

const MemorandumDetailPage = () => {
  //========== State Management ===========
  const [activeTab, setActiveTab] = useState<MemorandumTab>("editor");

  //========== Sample Data ===========
  const memorandumData = {
    title: "Offering Memorandum",
    subtitle: "Riverside Shopping Center",
    heroImage:
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1200",
    galleryImages: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800",
      "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800",
    ],
    executiveSummary:
      "Riverside Shopping Center is a 24-unit multifamily investment property located at 789 Commerce Blvd, Miami, FL 33101. The property offers attractive amenities financing at a low through rate of adults, and well-kept apartment floor plans, all within a highly desirable residential neighborhood.",
    propertyOverview: {
      propertyName: "Riverside Shopping Center",
      address: "789 Commerce Blvd, Miami, FL",
      zipCode: "33101",
      yearBuilt: 1985,
      yearRenovated: 2021,
      propertyType: "Retail",
      numberOfUnits: 24,
      rentableArea: 18500,
      occupancy: 95,
      parkingSpaces: 32,
    },
    propertyHighlights: [
      "Majority of the units (12 of 16) have been renovated with modern enhancements such as quartz counter tops, recessed lighting, and shaker-style cabinet",
      "The property is well-positioned in a strong rental market with low vacancy rates and significant rent growth, offering an attractive value-add opportunit",
      "There is attractive upside potential for rents averaging a rate of 8.0% through November 2024",
      "Amenities include private patios and decks (select units), hardwood and tile flooring, second-garage and secured parking on-site laundry, and secure",
    ],
    areaOverview: {
      description:
        "Riverside Shopping Center is located in the highly desirable Bixby Knolls neighborhood of Long Beach, California; an area known for its quaint residential streets, historic homes, and well-maintained lawns. Bixby Knolls boasts a mix of architectural styles including Craftsman, Spanish Revival, and traditional single-family homes.",
      neighborhoodDescription:
        "The neighborhood is family-friendly and offers a strong sense of community, with many local events and activities. There are several parks nearby, including Houghton Park and Virginia Country Club, an area that still offering convenient access to urban amenities.",
      localAmenities:
        "Local shopping and dining options can be found along the Atlantic Avenue corridor, where tenants at a commercial hub for the neighborhood. Residents also enjoy convenient access to the 405 Freeway, which provides a fast connection to other parts of Los Angeles County and beyond, great for commuters.",
    },
    areaHighlights: [
      "Proximity to Virginia Country Club, offering a private and prestigious golfing experience for members, as well as social and recreational amenities",
      "In the vicinity of Bixby—rated with high marks on GreatSchools.org—includes Longfellow Elementary School and Hughes Middle School, making it an attractive location",
      "Convenient access to the 405 Freeway, which provides a fast connection to other parts of Los Angeles County and beyond, great for commuters",
      "Located in Bixby Knolls, a well-established and affluent neighborhood in Long Beach known for its large, historic homes and tree-lined streets",
      "Close to the trendy Atlantic Avenue, which is lined with boutique shops, restaurants, and art galleries, providing a vibrant commercial and cultural scene",
    ],
    marketSummary: {
      description:
        "The Long Beach multifamily market continues to demonstrate strong fundamentals with increasing demand for quality rental housing. The Bixby Knolls submarket has experienced consistent rent growth averaging 4.2% annually over the past five years.",
      keyIndicators: [
        { label: "Average occupancy rate", value: "96.3%" },
        { label: "Average rent per unit", value: "$2,450/month" },
        { label: "Population growth", value: "1.8% annually" },
        { label: "Median household income", value: "$78,500" },
        { label: "Employment growth", value: "2.1% annually" },
      ],
    },
    financingSummary:
      "Financing details and charts will be added based on lender quotes and financial analysis.",
    additionalSections: [
      { id: "financial-analysis", label: "Financial Analysis", icon: "" },
      { id: "sales-comps", label: "Sales Comps", icon: "" },
      { id: "lease-comps", label: "Lease Comps", icon: "" },
      { id: "area-amenities", label: "Area Amenities", icon: "" },
      { id: "sponsorship", label: "Sponsorship", icon: "" },
      { id: "disclaimer", label: "Disclaimer", icon: "" },
    ],
    presentedBy: "Team Ari Capital Partners",
    confidential: true,
    investmentOpportunity: "INVESTMENT OPPORTUNITY",
    propertyName: "Banner Gardens Apartments",
    location: "",
    propertyStats: {
      propertyType: "Multifamily",
      units: 16,
      yearBuilt: 1966,
      occupancy: 94,
    },
    offeringDate: "October 2025",
    tableOfContents: [
      { id: 1, title: "Executive Summary", pageNumber: 3 },
      { id: 2, title: "Property Overview", pageNumber: 4 },
      { id: 3, title: "Property Highlights", pageNumber: 5 },
      { id: 4, title: "Area Overview", pageNumber: 6 },
      { id: 5, title: "Area Highlights", pageNumber: 7 },
      { id: 6, title: "Market Summary", pageNumber: 8 },
      { id: 7, title: "Financing Summary", pageNumber: 9 },
      { id: 8, title: "Financial Analysis", pageNumber: 10 },
      { id: 9, title: "Sales Comparables", pageNumber: 11 },
      { id: 10, title: "Lease Comparables", pageNumber: 12 },
      { id: 11, title: "Area Amenities", pageNumber: 13 },
      { id: 12, title: "Sponsorship", pageNumber: 14 },
      { id: 13, title: "Disclaimer", pageNumber: 15 },
    ],
  };

  //========== Event Handlers ===========
  const handleTabChange = (tab: MemorandumTab) => {
    setActiveTab(tab);
  };

  const handleAddSection = (sectionId: string) => {
    console.log("Adding section:", sectionId);
  };

  return (
    <div className=" mx-auto py-6">
      {/* ====== Back Button ====== */}
      <Link
        href="/memorandum"
        className="flex items-center gap-1 mb-4 text-gray-800 hover:text-blue-700 w-fit"
      >
        <IoIosArrowRoundBack className="text-2xl" />
        <p className="text-sm md:text-base">Back to Memorandums</p>
      </Link>

      {/* ====== Header with Tabs ====== */}
      <MemorandumHeader
        title={memorandumData.title}
        subtitle={memorandumData.subtitle}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* ====== Editor Tab Content ====== */}
      {activeTab === "editor" && (
        <div>
          {/* ====== Hero Section ====== */}
          <HeroSection
            heroImage={memorandumData.heroImage}
            galleryImages={memorandumData.galleryImages}
            title="Prime Location"
          />

          {/* ====== Executive Summary ====== */}
          <ExecutiveSummary
            content={memorandumData.executiveSummary}
            isAiGenerated={true}
            onEdit={() => console.log("Edit executive summary")}
          />

          {/* ====== Property Overview ====== */}
          <PropertyOverview
            data={memorandumData.propertyOverview}
            onEdit={() => console.log("Edit property overview")}
            onAiGenerate={() => console.log("AI generate property overview")}
          />

          {/* ====== Property Highlights ====== */}
          <PropertyHighlights
            highlights={memorandumData.propertyHighlights}
            isAiGenerated={true}
            onEdit={() => console.log("Edit property highlights")}
          />

          {/* ====== Area Overview ====== */}
          <AreaOverview
            data={memorandumData.areaOverview}
            isAiGenerated={true}
            onEdit={() => console.log("Edit area overview")}
          />

          {/* ====== Area Highlights ====== */}
          <AreaHighlights
            highlights={memorandumData.areaHighlights}
            isAiGenerated={true}
            onEdit={() => console.log("Edit area highlights")}
          />

          {/* ====== Market Summary ====== */}
          <MarketSummary
            data={memorandumData.marketSummary}
            isAiGenerated={true}
            onEdit={() => console.log("Edit market summary")}
          />

          {/* ====== Financing Summary ====== */}
          <FinancingSummary
            content={memorandumData.financingSummary}
            onEdit={() => console.log("Edit financing summary")}
            onAiGenerate={() => console.log("AI generate financing summary")}
          />

          {/* ====== Add Additional Sections ====== */}
          <AddSections
            sections={memorandumData.additionalSections}
            onAddSection={handleAddSection}
          />
        </div>
      )}

      {/* ====== Preview Tab Content ====== */}
      {activeTab === "preview" && (
        <div>
          {/* ====== Preview Cover Page ====== */}
          <PreviewCover
            presentedBy={memorandumData.presentedBy}
            confidential={memorandumData.confidential}
            investmentOpportunity={memorandumData.investmentOpportunity}
            propertyName={memorandumData.propertyName}
            location={memorandumData.location}
            stats={memorandumData.propertyStats}
            offeringDate={memorandumData.offeringDate}
          />

          {/* ====== Table of Contents ====== */}
          <TableOfContents items={memorandumData.tableOfContents} />

          {/* ====== Preview Sections ====== */}
          <PreviewSections
            executiveSummary={memorandumData.executiveSummary}
            propertyOverview={memorandumData.propertyOverview}
          />
        </div>
      )}
    </div>
  );
};

export default MemorandumDetailPage;
