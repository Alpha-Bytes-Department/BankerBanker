export interface SponsorLoanHeaderStats {
  total_properties: number;
  quotes_received: number;
  documents_count: number;
  portfolio_value: number;
}

export interface LoanQuote {
  id: number;
  lender_name: string;
  loan_amount: string;
  max_as_is_ltv: string | number;
  interest_rate: string | number;
  term: string | number;
  origination_fee: string | number;
  dscr: string | number;
  expires_at?: string;
  status?: string;
  loan_request?: number;
}

export interface LoanComparisonSummary {
  total_quotes: number;
  best_rate: string | number;
  highest_ltv: string | number;
  quotes: LoanQuote[];
}

export interface SponsorLoanDashboardData {
  header_stats: SponsorLoanHeaderStats;
  quote_card_view: LoanQuote[];
  quote_comparison: LoanComparisonSummary;
}

export interface LoanMemorandumLink {
  id: number;
  title: string;
  url: string;
}

export interface LoanDocumentLink {
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
  property_image_url?: string;
  requested_amount: string;
  loan_term: number;
  ltv: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  memorandum_links?: LoanMemorandumLink[];
  document_links?: LoanDocumentLink[];
}

export interface LoanQuoteDetail {
  id: number;
  loan_request: number;
  lender_name: string;
  guarantor?: string;
  status?: string;
  expires_at?: string;
  submitted_at?: string;
  updated_at?: string;
  loan_amount: string;
  initial_funding?: string;
  future_funding?: string;
  sponsor_equity?: string;
  max_as_is_ltv?: string | number;
  max_ltc?: string | number;
  max_as_stabilized_ltv?: string | number;
  min_as_is_dy?: string | number;
  min_stabilized_dy?: string | number;
  term?: string | number;
  interest_rate?: string | number;
  amortization?: string;
  prepayment?: string;
  origination_fee?: string | number;
  capex_reserve?: string;
  ff_and_e_reserve?: string;
  interest_carry_reserve?: string;
  extension_conditions?: string;
  collateral?: string;
  recourse?: string;
  dscr?: string | number;
}
