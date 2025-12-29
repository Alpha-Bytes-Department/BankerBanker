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
    financialAnalysis: {
      loanQuotes: [
        {
          lender: "Agency SWF/ Max Leverage",
          leverage: "93.00%",
          dscr: "1.30x",
          amortization: "30 Years",
          loanType: "5 Year Treasury",
          rate: "8.00%",
          indexSpread: "3.42%",
          originationFee: "0.80%",
          prepayment: "4-5",
        },
        {
          lender: "Agency SWF/ Moderate Leverage",
          leverage: "81.13%",
          dscr: "1.30x",
          amortization: "30 Years",
          loanType: "5 Year Treasury",
          rate: "8.00%",
          indexSpread: "3.30%",
          originationFee: "0.80%",
          prepayment: "4-5",
        },
        {
          lender: "Bank",
          leverage: "75.00%",
          dscr: "1.30x",
          amortization: "30 Years",
          loanType: "5 Year Treasury",
          rate: "8.00%",
          indexSpread: "3.47%",
          originationFee: "0.50%",
          prepayment: "N/A",
        },
        {
          lender: "CMBS",
          leverage: "81.13%",
          dscr: "1.30x",
          amortization: "30 Years",
          loanType: "5 Year Treasury",
          rate: "8.00%",
          indexSpread: "3.42%",
          originationFee: "1.25%",
          prepayment: "Def",
        },
        {
          lender: "Life Co 1",
          leverage: "60.00%",
          dscr: "1.25x",
          amortization: "30 Years",
          loanType: "5 Year Treasury",
          rate: "8.00%",
          indexSpread: "3.32%",
          originationFee: "0.75%",
          prepayment: "Yet",
        },
        {
          lender: "Life Co 2",
          leverage: "70.00%",
          dscr: "1.30x",
          amortization: "30 Years",
          loanType: "5 Year Treasury",
          rate: "8.00%",
          indexSpread: "3.37%",
          originationFee: "0.80%",
          prepayment: "Yet",
        },
      ],
      loanRatingNote:
        "Loan Rating (Still in progress, best performance Fannie Mae score is based on 5-year rates as modeled): Tier 1 vs Tier 2 (Great! 1-2 carries lower (5-10 cost savings across similar lenders) DSCR is 1.30x vs 1.25x for certain lenders).",
      loanRequest: {
        loanAmount: "$145.56 per unit / $19,000,000",
        estimatedValue: "$211.11 per unit / $27,000,000",
        ltv: "70.4%",
        financingType: "Fixed to Floating",
        term: "5-10 years",
        interestRate: "Best Available",
        amortization: "Max Interest Only Available",
        prepayment: "Best Available",
        dscrIoi: "1.58",
        dyNoi: "9.64%",
      },
      propertyDetails: {
        propertyName: "One Civic Plaza",
        address: "One Civic Plaza",
        cityState: "Carson, CA 90745",
        yearBuilt: "",
        yearRenovated: "1985",
        rentableArea: "127,890 SF",
        occupancy: "93.3%",
      },
      sources: [
        { source: "Senior Loan", amount: "$19,000,000", psf: "$148" },
        { source: "Mezz Loan", amount: "$0", psf: "$0" },
        { source: "Other 1", amount: "$0", psf: "$0" },
        { source: "Other 2", amount: "$0", psf: "$0" },
        { source: "Other 3", amount: "$0", psf: "$0" },
        { source: "Other 4", amount: "$0", psf: "$0" },
        { source: "Other 5", amount: "$0", psf: "$0" },
        { source: "Cash In", amount: "$0", psf: "$0" },
      ],
      uses: [
        { use: "Purchase/Payoff", amount: "$18,500,000", psf: "$145" },
        { use: "Closing Costs", amount: "$500,000", psf: "$4" },
        { use: "Tax Escrow", amount: "$0", psf: "$0" },
        { use: "Ins Escrow", amount: "$0", psf: "$0" },
        { use: "Immediate Repairs", amount: "$0", psf: "$0" },
        { use: "Remaining as Reserve", amount: "$0", psf: "$0" },
        { use: "HVLC Reserve", amount: "$0", psf: "$0" },
        { use: "Cash Out", amount: "$0", psf: "$0" },
      ],
      totalSources: "$19,000,000",
      totalUses: "$19,000,000",
      financialPerformance: [
        {
          category: "NRA",
          trailing12: "127,890",
          date: "",
          percentage: "",
          underwriting: "",
          inPlace: "",
          psf: "",
        },
        {
          category: "Physical Occupancy",
          trailing12: "93.3%",
          date: "",
          percentage: "93.3%",
          underwriting: "",
          inPlace: "",
          psf: "",
        },
        {
          category: "Economic Occupancy",
          trailing12: "-",
          date: "",
          percentage: "",
          underwriting: "",
          inPlace: "",
          psf: "",
        },
        {
          category: "Revenue",
          trailing12: "",
          date: "",
          percentage: "",
          underwriting: "",
          inPlace: "",
          psf: "",
        },
        {
          category: "Base Rent",
          trailing12: "24.65",
          date: "3,161,745",
          percentage: "99.4%",
          underwriting: "28.18",
          inPlace: "3,216,605",
          psf: "99.7% $ PSF",
        },
        {
          category: "Percentage/Overage Rent",
          trailing12: "0.15",
          date: "18,781",
          percentage: "0.6%",
          underwriting: "0.77",
          inPlace: "98,254",
          psf: "2.8%",
        },
        {
          category: "Rent Steps",
          trailing12: "",
          date: "",
          percentage: "",
          underwriting: "",
          inPlace: "",
          psf: "",
        },
        {
          category: "Recovery Income",
          trailing12: "-",
          date: "-",
          percentage: "-",
          underwriting: "-",
          inPlace: "18,142",
          psf: "0.0%",
        },
        {
          category: "Other Income",
          trailing12: "",
          date: "",
          percentage: "",
          underwriting: "",
          inPlace: "",
          psf: "",
        },
        {
          category: "Gross Potential Income",
          trailing12: "25.02",
          date: "3,200,526",
          percentage: "100.0%",
          underwriting: "27.74",
          inPlace: "3,347,352",
          psf: "100.0% $ PSF",
        },
      ],
    },
    salesComparables: {
      mapImage:
        "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200",
      comparables: [
        {
          id: 1,
          address: "3220 Gale Avenue, Long Beach, CA 90810",
          saleDate: "12/15/2024",
          salePrice: "$3,200,000",
          priceUnit: "$200,000",
          units: 16,
          yearBuilt: 1965,
          squareFeet: 10500,
          capRate: "5.8%",
        },
        {
          id: 2,
          address: "1840 Linden Ave, Long Beach, CA 90813",
          saleDate: "11/03/2024",
          salePrice: "$4,100,000",
          priceUnit: "$205,000",
          units: 20,
          yearBuilt: 1968,
          squareFeet: 13200,
          capRate: "6.1%",
        },
        {
          id: 3,
          address: "2156 Pacific Ave, Long Beach, CA 90806",
          saleDate: "09/22/2024",
          salePrice: "$2,800,000",
          priceUnit: "$233,333",
          units: 12,
          yearBuilt: 1972,
          squareFeet: 8500,
          capRate: "5.5%",
        },
      ],
    },
    leaseComparables: {
      comparables: [
        {
          id: 1,
          address: "2245 Atlantic Ave, Long Beach, CA",
          unitType: "1 BR / 1 BA",
          squareFeet: 650,
          monthlyRent: "$1,850",
          rentPsf: "$2.85",
          leaseDate: "01/2025",
        },
        {
          id: 2,
          address: "2245 Bellflower Blvd, Long Beach, CA",
          unitType: "2 BR / 1 BA",
          squareFeet: 850,
          monthlyRent: "$2,650",
          rentPsf: "$2.87",
          leaseDate: "12/2024",
        },
        {
          id: 3,
          address: "1850 Orange Ave, Long Beach, CA",
          unitType: "2 BR / 2 BA",
          squareFeet: 1050,
          monthlyRent: "$2,850",
          rentPsf: "$2.71",
          leaseDate: "11/2024",
        },
      ],
      stats: {
        averageRent: "$2,367",
        avgRentPsf: "$2.74",
        marketTrend: "+4.2%",
      },
    },
    areaAmenities: {
      heroImage:
        "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200",
      amenities: [
        {
          id: 1,
          name: "Virginia Country Club",
          category: "Recreation",
          distance: "0.5 mi",
          rating: 4.7,
          icon: "golf",
        },
        {
          id: 2,
          name: "Longfellow Elementary School",
          category: "Education",
          distance: "0.3 mi",
          rating: 8,
          icon: "school",
        },
        {
          id: 3,
          name: "Whole Foods Market",
          category: "Shopping",
          distance: "0.8 mi",
          rating: 4.5,
          icon: "shopping",
        },
        {
          id: 4,
          name: "Memorial Medical Center",
          category: "Healthcare",
          distance: "1.2 mi",
          rating: 4.6,
          icon: "hospital",
        },
      ],
    },
    sponsorship: {
      companyName: "Team Ari Capital Partners",
      companyLogo: "",
      description: "25+ years combined experience",
      totalAssets: "$2.4B",
      propertiesManaged: 48,
      yearEstablished: 2015,
    },
    disclaimer: {
      mainNotices: [
        {
          title: "CONFIDENTIALITY NOTICE:",
          content:
            "This Offering Memorandum and the information contained herein are confidential and intended solely for the use of the party to whom it is provided by the owner or its representatives. This Offering Memorandum has been prepared by or on behalf of the owner solely for use by prospective purchasers. The information contained in this Offering Memorandum is confidential and is intended only for the persons to whom it is transmitted by the owner or its representatives.",
        },
        {
          title: "NO WARRANTY:",
          content:
            "The information contained herein is subject to change or withdrawal without notice. While the information presented is believed to be correct, it is not warranted or guaranteed. Prospective purchasers should make their own investigations and form their own opinions.",
        },
        {
          title: "QUALIFIED INVESTORS:",
          content:
            "This investment opportunity is suitable only for sophisticated investors who can afford to lose their entire investment. Securities are offered only to accredited investors or qualified institutional buyers.",
        },
      ],
      cards: [
        {
          id: 1,
          icon: "lock",
          title: "Confidential",
          description: "Information is proprietary and confidential",
        },
        {
          id: 2,
          icon: "shield",
          title: "Accredited Only",
          description: "For accredited investors only",
        },
        {
          id: 3,
          icon: "file",
          title: "Due Diligence",
          description: "Independent verification recommended",
        },
      ],
    },
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
        <div className="shadow-xl rounded-lg p-3 md:p-6 lg:p-10 mb-10 ">
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
            propertyHighlights={memorandumData.propertyHighlights}
            areaOverview={memorandumData.areaOverview}
            areaHighlights={memorandumData.areaHighlights}
            marketSummary={memorandumData.marketSummary}
            financingSummary={memorandumData.financingSummary}
            financialAnalysis={memorandumData.financialAnalysis}
            salesComparables={memorandumData.salesComparables}
            leaseComparables={memorandumData.leaseComparables}
            areaAmenities={memorandumData.areaAmenities}
            sponsorship={memorandumData.sponsorship}
            disclaimer={memorandumData.disclaimer}
          />
        </div>
      )}
    </div>
  );
};

export default MemorandumDetailPage;
