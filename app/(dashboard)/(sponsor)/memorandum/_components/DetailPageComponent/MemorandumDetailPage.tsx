"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { IoIosArrowRoundBack } from "react-icons/io";

// Components
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
import api from "@/Provider/api";

const MemorandumDetailPage = () => {
  const params = useParams();
  const id = params.id;

  const [activeTab, setActiveTab] = useState<MemorandumTab>("editor");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/memorandums/${id}/`);
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching memorandum details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  // Helper to find content by section_type
  const getSection = (type: string) => {
    const section = data?.sections?.find((s: any) => s.section_type === type);
    return section ? section.content : "";
  };

  // Helper to parse Markdown list items into an array (for highlights components)
  const parseList = (content: string) => {
    return content
      .split("\n")
      .filter(
        (line) => line.trim().startsWith("-") || line.trim().startsWith("*"),
      )
      .map((line) =>
        line
          .replace(/^[-*]\s+/, "")
          .replace(/\*\*/g, "")
          .trim(),
      );
  };

  if (loading)
    return <div className="p-20 text-center">Loading details...</div>;
  if (!data)
    return <div className="p-20 text-center">Memorandum not found.</div>;

  // Mapping API response to your component structure
  const mappedData = {
    title: data.title,
    subtitle: data.property_name,
    heroImage: data.property_image_url,
    executiveSummary: getSection("executive_summary"),
    propertyOverview: getSection("property_overview"), // You can pass this string or parse further
    propertyHighlights: parseList(getSection("property_highlights")),
    areaOverview: { description: getSection("area_overview") },
    areaHighlights: parseList(getSection("area_highlights")),
    marketSummary: { description: getSection("market_summary") },
    financingSummary: getSection("financing_summary"),
    // Add other fields as needed for Preview
  };
  console.log(data);
  return (
    <div className="mx-auto py-6">
      <Link
        href="/memorandum"
        className="flex items-center gap-1 mb-4 text-gray-800 hover:text-blue-700 w-fit"
      >
        <IoIosArrowRoundBack className="text-2xl" />
        <p className="text-sm md:text-base">Back to Memorandums</p>
      </Link>

      <MemorandumHeader
        title={mappedData.title}
        subtitle={mappedData.subtitle}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === "editor" && (
        <div>
          <HeroSection
            heroImage={mappedData.heroImage}
            galleryImages={[mappedData.heroImage]}
            title={data.property_name}
          />

          <ExecutiveSummary
            content={mappedData.executiveSummary}
            isAiGenerated={true}
            onEdit={() => {}}
          />

          <PropertyOverview
            data={mappedData.propertyOverview}
            onEdit={() => {}}
            onAiGenerate={() => {}}
          />

          <PropertyHighlights
            highlights={mappedData.propertyHighlights}
            isAiGenerated={true}
            onEdit={() => {}}
          />

          <AreaOverview
            data={mappedData.areaOverview}
            isAiGenerated={true}
            onEdit={() => {}}
          />

          <AreaHighlights
            highlights={mappedData.areaHighlights}
            isAiGenerated={true}
            onEdit={() => {}}
          />

          <MarketSummary
            data={mappedData.marketSummary}
            isAiGenerated={true}
            onEdit={() => {}}
          />

          <FinancingSummary
            content={mappedData.financingSummary}
            onEdit={() => {}}
            onAiGenerate={() => {}}
          />

          <AddSections sections={[]} onAddSection={() => {}} />
        </div>
      )}

      {activeTab === "preview" && (
        <div className="shadow-xl rounded-lg p-3 md:p-6 lg:p-10 mb-10">
          <PreviewCover
            presentedBy="TruAmerica Multifamily"
            confidential={true}
            investmentOpportunity="INVESTMENT OFFERING"
            propertyName={data.property_name}
            location="Los Angeles, CA"
            stats={{
              propertyType: "Multifamily",
              units: 24,
              yearBuilt: 2005,
              occupancy: 95,
            }}
            offeringDate="March 2026"
          />
          {/* Note: You may need to pass the dynamic sections to TableOfContents and PreviewSections too */}
          <TableOfContents items={[]} />
          <PreviewSections {...mappedData} />
        </div>
      )}
    </div>
  );
};

export default MemorandumDetailPage;
