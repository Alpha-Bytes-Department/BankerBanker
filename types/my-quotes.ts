//========== My Quotes Type Definitions ===========

export interface QuoteStat {
  id: number;
  label: string;
  value: string;
  icon: string;
  bgColor: string;
  iconColor: string;
  borderColor: string;
}

export type QuoteStatus =
  | "submitted"
  | "under_review"
  | "accepted"
  | "rejected";

export interface Quote {
  id: number;
  quoteId: number;
  loanRequestId: number;
  propertyId: number | null;
  propertyName: string;
  address: string;
  city: string;
  state: string;
  sponsor: string;
  image: string;
  status: QuoteStatus;
  statusLabel: string;
  priority: "priority" | "urgent" | "normal";
  propertyType: string;
  interestRate: string;
  term: string;
  ltv: string;
  submittedDate: string;
  expiresIn: number;
  quotedAmount: string;
  competingQuotes: number;
  avgResponseTime: string;
  lenderName: string;
  guarantor: string;
  rawLoanAmount: string;
  rawInterestRate: string;
  rawExpiresAt: string;
  raw: LenderQuoteApiItem;
  statusMessage?: string;
}

export interface QuoteFilter {
  id: string;
  label: string;
  count?: number;
}

export interface LenderDashboardStats {
  active_requests: number;
  quotes_provided: number;
  pending_review: number;
  accepted_quotes: number;
}

export interface LenderDashboardApiData {
  header_stats: LenderDashboardStats;
  available_loan_requests: LenderDashboardLoanRequest[];
}

export interface LenderQuoteStatsData {
  total_quotes: number;
  under_review_quotes: number;
  accepted_quotes: number;
  total_value: number;
}

export interface LenderDashboardLoanRequest {
  id: number;
  property_name: string;
  property_address: string;
  property_type: string;
  occupancy?: string;
  year_built?: number;
  property_image_url?: string | null;
  requested_amount: string;
  loan_term: number;
  ltv: string;
}

export interface LenderQuoteApiItem {
  id: number;
  loan_request: number;
  lender: number;
  lender_name: string;
  guarantor: string;
  status: string;
  expires_at: string;
  submitted_at: string;
  updated_at: string;
  loan_amount: string;
  initial_funding: string;
  future_funding: string;
  sponsor_equity: string;
  max_as_is_ltv: string;
  max_ltc: string;
  max_as_stabilized_ltv: string;
  min_as_is_dy: string;
  min_stabilized_dy: string;
  term: number;
  interest_rate: string;
  amortization: string;
  prepayment: string;
  origination_fee: string;
  capex_reserve: string;
  ff_and_e_reserve: string;
  interest_carry_reserve: string;
  extension_conditions: string;
  collateral: string;
  recourse: string;
  dscr?: number;
}

export interface LoanRequestMinimal {
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
}

export interface LenderPropertyMapItem {
  id: number;
  property_name: string;
  property_address: string;
  property_type: string;
  latitude: string;
  longitude: string;
  property_image_url: string | null;
}
