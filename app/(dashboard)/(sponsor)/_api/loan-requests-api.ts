import api from "@/Provider/api";
import type {
  LoanQuote,
  LoanComparisonSummary,
  LoanQuoteDetail,
} from "../loan/_components/loan-types";

// ── Types ────────────────────────────────────────────────────────────────────

export interface SponsorLoanRequestItem {
  id: number;
  property: number;
  property_name: string;
  property_address: string;
  property_type: string;
  occupancy?: string;
  year_built?: number;
  property_image_url?: string | null;
  thumbnail_url?: string | null;
  property_images?: string[];
  requested_amount: string;
  loan_term: number;
  ltv: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  memorandum_links?: { id: number; title: string; url: string }[];
  document_links?: { id: number; url: string }[];
}

export interface CreateLoanRequestPayload {
  property: number;
  requested_amount: string | number;
  loan_term: number;
  ltv: string | number;
}

export interface UpdateLoanRequestPayload {
  requested_amount?: string | number;
  loan_term?: number;
  ltv?: string | number;
}

export interface SponsorDashboardHeaderStats {
  total_properties: number;
  quotes_received: number;
  documents_count: number;
  portfolio_value: number;
}

export interface SponsorDashboardData {
  header_stats: SponsorDashboardHeaderStats;
  quote_card_view: LoanQuote[];
  quote_comparison: LoanComparisonSummary;
}

// ── API Methods ──────────────────────────────────────────────────────────────

/**
 * Fetch Sponsor Dashboard data
 * Postman: GET /api/v1/loans/dashboard/sponsor/
 */
export async function fetchSponsorDashboard(): Promise<SponsorDashboardData> {
  let response;
  try {
    response = await api.get("/api/v1/loans/dashboard/sponsor/");
  } catch {
    try {
      response = await api.get("/api/loans/dashboard/sponsor/");
    } catch {
      response = await api.get("/api/dashboard/sponsor/");
    }
  }

  const raw = response?.data?.data ?? response?.data ?? {};
  const headerStats = raw.header_stats || raw;

  return {
    header_stats: {
      total_properties: Number(headerStats.total_properties) || 0,
      quotes_received: Number(headerStats.quotes_received) || 0,
      documents_count: Number(headerStats.documents_count) || 0,
      portfolio_value: Number(headerStats.portfolio_value) || 0,
    },
    quote_card_view: Array.isArray(raw.quote_card_view) ? raw.quote_card_view : [],
    quote_comparison: raw.quote_comparison || {
      total_quotes: 0,
      best_rate: 0,
      highest_ltv: 0,
      quotes: [],
    },
  };
}

/**
 * Fetch All Loan Requests
 * Postman: GET /api/v1/loans/requests/
 */
export async function fetchLoanRequests(): Promise<SponsorLoanRequestItem[]> {
  let response;
  try {
    response = await api.get("/api/v1/loans/requests/");
  } catch {
    try {
      response = await api.get("/api/loans/requests/");
    } catch (err) {
      console.error("Failed to fetch loan requests", err);
      return [];
    }
  }

  const raw =
    response?.data?.data ??
    (Array.isArray(response?.data?.results)
      ? response.data.results
      : Array.isArray(response?.data)
        ? response.data
        : []);

  if (!Array.isArray(raw)) return [];

  return raw.map((item: any) => ({
    id: Number(item.id),
    property:
      typeof item.property === "object" && item.property !== null
        ? Number(item.property.id)
        : Number(item.property),
    property_name:
      item.property_name ||
      (typeof item.property === "object" ? item.property.property_name : "") ||
      `Property #${item.property}`,
    property_address:
      item.property_address ||
      (typeof item.property === "object" ? item.property.property_address : "") ||
      "",
    property_type:
      item.property_type ||
      (typeof item.property === "object" ? item.property.property_type : "") ||
      "Commercial",
    occupancy: item.occupancy,
    year_built: item.year_built ? Number(item.year_built) : undefined,
    property_image_url:
      item.thumbnail_url ||
      item.property_image_url ||
      (Array.isArray(item.property_images) ? item.property_images[0] : null) ||
      null,
    thumbnail_url: item.thumbnail_url || item.property_image_url || null,
    property_images: Array.isArray(item.property_images) ? item.property_images : [],
    requested_amount: String(item.requested_amount || "0"),
    loan_term: Number(item.loan_term || 0),
    ltv: String(item.ltv || "0"),
    status: item.status || "Pending",
    created_at: item.created_at,
    updated_at: item.updated_at,
    memorandum_links: Array.isArray(item.memorandum_links) ? item.memorandum_links : [],
    document_links: Array.isArray(item.document_links) ? item.document_links : [],
  }));
}

/**
 * Fetch Details of a Loan Request
 * Postman: GET /api/v1/loans/requests/{{id}}/
 */
export async function fetchLoanRequestDetail(
  id: number,
): Promise<SponsorLoanRequestItem | null> {
  let response;
  try {
    response = await api.get(`/api/v1/loans/requests/${id}/`);
  } catch {
    try {
      response = await api.get(`/api/loans/requests/${id}/`);
    } catch {
      return null;
    }
  }

  const raw = response?.data?.data ?? response?.data;
  if (!raw) return null;

  return {
    id: Number(raw.id),
    property:
      typeof raw.property === "object" && raw.property !== null
        ? Number(raw.property.id)
        : Number(raw.property),
    property_name:
      raw.property_name ||
      (typeof raw.property === "object" ? raw.property.property_name : "") ||
      `Property #${raw.property}`,
    property_address:
      raw.property_address ||
      (typeof raw.property === "object" ? raw.property.property_address : "") ||
      "",
    property_type:
      raw.property_type ||
      (typeof raw.property === "object" ? raw.property.property_type : "") ||
      "Commercial",
    occupancy: raw.occupancy,
    year_built: raw.year_built ? Number(raw.year_built) : undefined,
    property_image_url:
      raw.thumbnail_url ||
      raw.property_image_url ||
      (Array.isArray(raw.property_images) ? raw.property_images[0] : null) ||
      null,
    thumbnail_url: raw.thumbnail_url || raw.property_image_url || null,
    property_images: Array.isArray(raw.property_images) ? raw.property_images : [],
    requested_amount: String(raw.requested_amount || "0"),
    loan_term: Number(raw.loan_term || 0),
    ltv: String(raw.ltv || "0"),
    status: raw.status || "Pending",
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    memorandum_links: Array.isArray(raw.memorandum_links) ? raw.memorandum_links : [],
    document_links: Array.isArray(raw.document_links) ? raw.document_links : [],
  };
}

/**
 * Create a new Loan Request
 * Postman: POST /api/v1/loans/requests/
 */
export async function createLoanRequest(
  payload: CreateLoanRequestPayload,
): Promise<SponsorLoanRequestItem> {
  const formattedBody = {
    property: Number(payload.property),
    requested_amount:
      typeof payload.requested_amount === "number"
        ? payload.requested_amount.toFixed(2)
        : String(payload.requested_amount),
    loan_term: Number(payload.loan_term),
    ltv:
      typeof payload.ltv === "number"
        ? payload.ltv.toFixed(2)
        : String(payload.ltv),
  };

  let response;
  try {
    response = await api.post("/api/v1/loans/requests/", formattedBody);
  } catch (err: any) {
    if (err?.response?.status === 404) {
      response = await api.post("/api/loans/requests/", formattedBody);
    } else {
      throw err;
    }
  }

  const raw = response?.data?.data ?? response?.data;
  return raw;
}

/**
 * Update an existing Loan Request
 * Postman: PATCH /api/v1/loans/requests/{{id}}/
 */
export async function updateLoanRequest(
  id: number,
  payload: UpdateLoanRequestPayload,
): Promise<SponsorLoanRequestItem> {
  const formattedBody: Record<string, any> = {};

  if (payload.requested_amount !== undefined) {
    formattedBody.requested_amount =
      typeof payload.requested_amount === "number"
        ? payload.requested_amount.toFixed(2)
        : String(payload.requested_amount);
  }

  if (payload.ltv !== undefined) {
    formattedBody.ltv =
      typeof payload.ltv === "number"
        ? payload.ltv.toFixed(2)
        : String(payload.ltv);
  }

  if (payload.loan_term !== undefined) {
    formattedBody.loan_term = Number(payload.loan_term);
  }

  let response;
  try {
    response = await api.patch(`/api/v1/loans/requests/${id}/`, formattedBody);
  } catch (err: any) {
    if (err?.response?.status === 404) {
      response = await api.patch(`/api/loans/requests/${id}/`, formattedBody);
    } else {
      throw err;
    }
  }

  const raw = response?.data?.data ?? response?.data;
  return raw;
}

/**
 * Delete an existing Loan Request
 * Postman: DELETE /api/v1/loans/requests/{{id}}/
 */
export async function deleteLoanRequest(id: number): Promise<void> {
  try {
    await api.delete(`/api/v1/loans/requests/${id}/`);
  } catch (err: any) {
    if (err?.response?.status === 404) {
      await api.delete(`/api/loans/requests/${id}/`);
    } else {
      throw err;
    }
  }
}

/**
 * Fetch all quotes for a specific Loan Request ID
 * Postman: GET /api/v1/loans/requests/{{id}}/quotes/
 */
export async function fetchQuotesForLoanRequest(
  loanRequestId: number,
): Promise<LoanQuoteDetail[]> {
  let response;
  try {
    response = await api.get(`/api/v1/loans/requests/${loanRequestId}/quotes/`);
  } catch {
    try {
      response = await api.get(`/api/loans/requests/${loanRequestId}/quotes/`);
    } catch (err) {
      console.error(`Failed to fetch quotes for loan request #${loanRequestId}`, err);
      return [];
    }
  }

  const raw =
    response?.data?.data ??
    (Array.isArray(response?.data?.results)
      ? response.data.results
      : Array.isArray(response?.data)
        ? response.data
        : response?.data
          ? [response.data]
          : []);

  if (!Array.isArray(raw)) return [];

  return raw.map((item: any) => ({
    id: Number(item.id),
    loan_request: Number(item.loan_request ?? loanRequestId),
    lender_name: item.lender_name || "Commercial Lender",
    guarantor: item.guarantor,
    status: item.status || "Pending",
    expires_at: item.expires_at,
    submitted_at: item.submitted_at || item.created_at,
    updated_at: item.updated_at,
    loan_amount: String(item.loan_amount || "0"),
    initial_funding: item.initial_funding ? String(item.initial_funding) : undefined,
    future_funding: item.future_funding ? String(item.future_funding) : undefined,
    sponsor_equity: item.sponsor_equity ? String(item.sponsor_equity) : undefined,
    max_as_is_ltv: item.max_as_is_ltv,
    max_ltc: item.max_ltc,
    max_as_stabilized_ltv: item.max_as_stabilized_ltv,
    min_as_is_dy: item.min_as_is_dy,
    min_stabilized_dy: item.min_stabilized_dy,
    term: item.term,
    interest_rate: item.interest_rate,
    amortization: item.amortization,
    prepayment: item.prepayment,
    origination_fee: item.origination_fee,
    capex_reserve: item.capex_reserve ? String(item.capex_reserve) : undefined,
    ff_and_e_reserve: item.ff_and_e_reserve ? String(item.ff_and_e_reserve) : undefined,
    interest_carry_reserve: item.interest_carry_reserve ? String(item.interest_carry_reserve) : undefined,
    extension_conditions: item.extension_conditions,
    collateral: item.collateral,
    recourse: item.recourse,
    dscr: item.dscr,
  }));
}

/**
 * Fetch Details of a Single Loan Quote
 * Postman: GET /api/v1/loans/quotes/{{id}}/
 */
export async function fetchLoanQuoteDetail(
  quoteId: number,
): Promise<LoanQuoteDetail | null> {
  let response;
  try {
    response = await api.get(`/api/v1/loans/quotes/${quoteId}/`);
  } catch {
    try {
      response = await api.get(`/api/loans/quotes/${quoteId}/`);
    } catch {
      return null;
    }
  }

  const raw = response?.data?.data ?? response?.data;
  if (!raw) return null;

  return {
    id: Number(raw.id),
    loan_request: Number(raw.loan_request),
    lender_name: raw.lender_name || "Commercial Lender",
    guarantor: raw.guarantor,
    status: raw.status || "Pending",
    expires_at: raw.expires_at,
    submitted_at: raw.submitted_at || raw.created_at,
    updated_at: raw.updated_at,
    loan_amount: String(raw.loan_amount || "0"),
    initial_funding: raw.initial_funding ? String(raw.initial_funding) : undefined,
    future_funding: raw.future_funding ? String(raw.future_funding) : undefined,
    sponsor_equity: raw.sponsor_equity ? String(raw.sponsor_equity) : undefined,
    max_as_is_ltv: raw.max_as_is_ltv,
    max_ltc: raw.max_ltc,
    max_as_stabilized_ltv: raw.max_as_stabilized_ltv,
    min_as_is_dy: raw.min_as_is_dy,
    min_stabilized_dy: raw.min_stabilized_dy,
    term: raw.term,
    interest_rate: raw.interest_rate,
    amortization: raw.amortization,
    prepayment: raw.prepayment,
    origination_fee: raw.origination_fee,
    capex_reserve: raw.capex_reserve ? String(raw.capex_reserve) : undefined,
    ff_and_e_reserve: raw.ff_and_e_reserve ? String(raw.ff_and_e_reserve) : undefined,
    interest_carry_reserve: raw.interest_carry_reserve ? String(raw.interest_carry_reserve) : undefined,
    extension_conditions: raw.extension_conditions,
    collateral: raw.collateral,
    recourse: raw.recourse,
    dscr: raw.dscr,
  };
}

/**
 * Accept a Loan Quote
 * Postman: POST /api/v1/loans/quotes/{{id}}/accept/
 */
export async function acceptLoanQuote(quoteId: number): Promise<any> {
  let response;
  try {
    response = await api.post(`/api/v1/loans/quotes/${quoteId}/accept/`);
  } catch (err: any) {
    if (err?.response?.status === 404) {
      response = await api.post(`/api/loans/quotes/${quoteId}/accept/`);
    } else {
      throw err;
    }
  }
  return response?.data;
}

/**
 * Decline a Loan Quote
 * Postman: POST /api/v1/loans/quotes/{{id}}/decline/
 */
export async function declineLoanQuote(quoteId: number): Promise<any> {
  let response;
  try {
    response = await api.post(`/api/v1/loans/quotes/${quoteId}/decline/`);
  } catch (err: any) {
    if (err?.response?.status === 404) {
      response = await api.post(`/api/loans/quotes/${quoteId}/decline/`);
    } else {
      throw err;
    }
  }
  return response?.data;
}
