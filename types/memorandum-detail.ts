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

//========== Financial Analysis Types ===========

export interface LoanQuote {
  lender: string;
  leverage: string;
  dscr: string;
  amortization: string;
  loanType: string;
  rate: string;
  indexSpread: string;
  originationFee: string;
  prepayment: string;
}

export interface LoanRequest {
  loanAmount: string;
  estimatedValue: string;
  ltv: string;
  financingType: string;
  term: string;
  interestRate: string;
  amortization: string;
  prepayment: string;
  dscrIoi: string;
  dyNoi: string;
}

export interface PropertyDetails {
  propertyName: string;
  address: string;
  cityState: string;
  yearBuilt: string;
  yearRenovated: string;
  rentableArea: string;
  occupancy: string;
}

export interface SourceItem {
  source: string;
  amount: string;
  psf: string;
}

export interface UseItem {
  use: string;
  amount: string;
  psf: string;
}

export interface FinancialPerformance {
  category: string;
  trailing12: string;
  date: string;
  percentage: string;
  underwriting: string;
  inPlace: string;
  psf: string;
}

export interface FinancialAnalysisData {
  loanQuotes: LoanQuote[];
  loanRequest: LoanRequest;
  propertyDetails: PropertyDetails;
  sources: SourceItem[];
  uses: UseItem[];
  totalSources: string;
  totalUses: string;
  financialPerformance: FinancialPerformance[];
  loanRatingNote: string;
}

//========== Sales Comparables Types ===========

export interface SalesComparable {
  id: number;
  address: string;
  saleDate: string;
  salePrice: string;
  priceUnit: string;
  units: number;
  yearBuilt: number;
  squareFeet: number;
  capRate: string;
}

export interface SalesComparablesData {
  comparables: SalesComparable[];
  mapImage: string;
}

//========== Lease Comparables Types ===========

export interface LeaseComparable {
  id: number;
  address: string;
  unitType: string;
  squareFeet: number;
  monthlyRent: string;
  rentPsf: string;
  leaseDate: string;
}

export interface LeaseStats {
  averageRent: string;
  avgRentPsf: string;
  marketTrend: string;
}

export interface LeaseComparablesData {
  comparables: LeaseComparable[];
  stats: LeaseStats;
}

//========== Area Amenities Types ===========

export interface Amenity {
  id: number;
  name: string;
  category: string;
  distance: string;
  rating?: number;
  icon: string;
}

export interface AreaAmenitiesData {
  heroImage: string;
  amenities: Amenity[];
}

//========== Sponsorship Types ===========

export interface SponsorshipData {
  companyName: string;
  companyLogo: string;
  description: string;
  totalAssets: string;
  propertiesManaged: number;
  yearEstablished: number;
}

//========== Disclaimer Types ===========

export interface DisclaimerNotice {
  title: string;
  content: string;
}

export interface DisclaimerCard {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface DisclaimerData {
  mainNotices: DisclaimerNotice[];
  cards: DisclaimerCard[];
}

//========== Preview Cover Types ===========

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
