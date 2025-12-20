//========== Memorandum Detail Page Types ===========

export interface MemorandumDetailData {
  title: string;
  subtitle: string;
  heroImage: string;
  galleryImages: string[];
  executiveSummary: string;
  propertyOverview: PropertyOverviewData;
  propertyHighlights: string[];
  areaOverview: AreaOverviewData;
  areaHighlights: string[];
  marketSummary: MarketSummaryData;
  financingSummary: string;
  presentedBy: string;
  confidential: boolean;
  investmentOpportunity: string;
  propertyName: string;
  location: string;
  propertyStats: PropertyStats;
  offeringDate: string;
}

//========== Property Overview Types ===========

export interface PropertyOverviewData {
  propertyName: string;
  address: string;
  zipCode: string;
  yearBuilt: number;
  yearRenovated?: number;
  propertyType: string;
  numberOfUnits: number;
  rentableArea: number;
  occupancy: number;
  parkingSpaces: number;
}

//========== Property Stats Types ===========

export interface PropertyStats {
  propertyType: string;
  units: number;
  yearBuilt: number;
  occupancy: number;
}

//========== Area Overview Types ===========

export interface AreaOverviewData {
  description: string;
  neighborhoodDescription: string;
  localAmenities: string;
}

//========== Market Summary Types ===========

export interface MarketSummaryData {
  description: string;
  keyIndicators: MarketIndicator[];
}

export interface MarketIndicator {
  label: string;
  value: string;
}

//========== Table of Contents Types ===========

export interface TableOfContentsItem {
  id: number;
  title: string;
  pageNumber: number;
}

//========== Additional Section Types ===========

export interface AdditionalSection {
  id: string;
  label: string;
  icon: string;
}

//========== Tab Types ===========

export type MemorandumTab = "editor" | "preview";

//========== Component Props Types ===========

export interface MemorandumHeaderProps {
  title: string;
  subtitle: string;
  activeTab: MemorandumTab;
  onTabChange: (tab: MemorandumTab) => void;
}

export interface HeroSectionProps {
  heroImage: string;
  galleryImages: string[];
  title: string;
}

export interface ExecutiveSummaryProps {
  content: string;
  isAiGenerated: boolean;
  onEdit?: () => void;
}

export interface PropertyOverviewProps {
  data: PropertyOverviewData;
  onEdit?: () => void;
  onAiGenerate?: () => void;
}

export interface PropertyHighlightsProps {
  highlights: string[];
  isAiGenerated: boolean;
  onEdit?: () => void;
}

export interface AreaOverviewProps {
  data: AreaOverviewData;
  isAiGenerated: boolean;
  onEdit?: () => void;
}

export interface AreaHighlightsProps {
  highlights: string[];
  isAiGenerated: boolean;
  onEdit?: () => void;
}

export interface MarketSummaryProps {
  data: MarketSummaryData;
  isAiGenerated: boolean;
  onEdit?: () => void;
}

export interface FinancingSummaryProps {
  content: string;
  onEdit?: () => void;
  onAiGenerate?: () => void;
}

export interface AddSectionsProps {
  sections: AdditionalSection[];
  onAddSection: (sectionId: string) => void;
}

//========== Section Form Data Types ===========

export interface SectionFormData {
  sectionTitle: string;
  sectionContent: string;
  sectionType: string;
}

export interface PreviewCoverProps {
  presentedBy: string;
  confidential: boolean;
  investmentOpportunity: string;
  propertyName: string;
  location: string;
  stats: PropertyStats;
  offeringDate: string;
}

export interface TableOfContentsProps {
  items: TableOfContentsItem[];
}

export interface PreviewSectionProps {
  sectionNumber: number;
  title: string;
  children: React.ReactNode;
}
