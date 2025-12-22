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
