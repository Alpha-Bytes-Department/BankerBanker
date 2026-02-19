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

export interface Quote {
  id: number;
  propertyName: string;
  address: string;
  city: string;
  state: string;
  sponsor: string;
  image: string;
  status: "under_review" | "accepted" | "rejected";
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
  statusMessage?: string;
}

export interface QuoteFilter {
  id: string;
  label: string;
  count?: number;
}
