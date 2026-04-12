//========== Loan Request Types ===========

export type UrgencyLevel = "high" | "medium" | "standard";

export interface LoanRequestLocation {
  lat: number;
  lng: number;
}

export interface LoanRequestData {
  id: number;
  propertyName: string;
  address: string;
  location: LoanRequestLocation;
  propertyType:
    | "Office"
    | "Multifamily"
    | "Retail"
    | "Industrial"
    | "Mixed-Use";
  urgencyLevel: UrgencyLevel;
  isActive: boolean;
  requestedAmount: number;
  loanTerm: string;
  occupancy: number;
  yearBuilt: number;
  ltv: number;
  sponsor: string;
  propertyImage: string;
}

export interface LoanRequestsPageProps {
  activeRequestsCount: number;
  loanRequests: LoanRequestData[];
}

export interface LoanRequestCardProps {
  loanRequest: LoanRequestData;
  onSubmitQuote: (id: number) => void;
  onViewDetails: (id: number) => void;
  onViewDocuments: (id: number) => void;
}

export interface LoanRequestMemorandumLink {
  id: number;
  title: string;
  url: string;
}

export interface LoanRequestDocumentLink {
  id: number;
  url: string;
}

export interface LoanRequestDetail {
  id: number;
  property: number;
  property_name: string;
  property_address: string;
  property_type: string;
  occupancy?: string;
  year_built?: number;
  property_image_url?: string | null;
  requested_amount: string;
  loan_term: number;
  ltv: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  memorandum_links?: LoanRequestMemorandumLink[];
  document_links?: LoanRequestDocumentLink[];
}

//========== Property Map Types ===========

export interface PropertyMapStats {
  totalProperties: number;
  totalLoanValue: number;
  avgLoanSize: number;
  urgentRequests: number;
}

export interface PropertyMapData extends LoanRequestData {
  units?: number;
  squareFeet?: number;
  targetLtv?: number;
}
