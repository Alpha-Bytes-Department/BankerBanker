import api from "@/Provider/api";
import type {
  LoanRequestData,
  PropertyMapData,
  PropertyMapStats,
  UrgencyLevel,
} from "@/types/loan-request";

type ApiEnvelope<T> = {
  data?: T;
};

type PropertyMapApiItem = {
  id: number;
  property_name: string;
  property_address: string;
  property_type: string;
  latitude: string;
  longitude: string;
  property_image_url: string | null;
};

type LoanRequestApiItem = {
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
};

const FALLBACK_MAP_CENTER = { lat: 39.8283, lng: -98.5795 };
const FALLBACK_PROPERTY_IMAGE = "/images/SponsorDashboard.png";
const API_BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(
  /\/+$/,
  "",
);

const toNumber = (value: string | number | undefined | null) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const normalizeImageUrl = (value?: string | null) => {
  if (!value || value === "null" || value === "undefined") {
    return null;
  }

  const rawValue = String(value).trim();
  if (!rawValue) {
    return null;
  }

  if (/^https?:\/\//i.test(rawValue)) {
    if (!API_BASE_URL) return rawValue;

    return rawValue.replace(
      /^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?/i,
      API_BASE_URL,
    );
  }

  const normalizedPath = rawValue.replace(/^\/+/, "");

  if (rawValue.startsWith("/") || normalizedPath.startsWith("media/")) {
    if (!API_BASE_URL) return `/${normalizedPath}`;
    return `${API_BASE_URL}/${normalizedPath}`;
  }

  return null;
};

const resolveImageUrl = (...values: Array<string | null | undefined>) => {
  for (const value of values) {
    const normalized = normalizeImageUrl(value);
    if (normalized) {
      return normalized;
    }
  }

  return FALLBACK_PROPERTY_IMAGE;
};

const toPropertyType = (
  value: string | undefined,
): LoanRequestData["propertyType"] => {
  const normalized = String(value || "").toLowerCase();

  if (normalized.includes("multi")) return "Multifamily";
  if (normalized.includes("retail")) return "Retail";
  if (normalized.includes("industrial")) return "Industrial";
  if (normalized.includes("mixed")) return "Mixed-Use";
  return "Office";
};

const toLoanTerm = (value: number | string | undefined) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return "-";
  return `${parsed} months`;
};

const toUrgency = (
  status: string | undefined,
  createdAt: string | undefined,
): UrgencyLevel => {
  const normalizedStatus = String(status || "").toLowerCase();
  if (normalizedStatus === "active") return "high";

  const createdDate = createdAt ? new Date(createdAt) : null;
  if (createdDate && !Number.isNaN(createdDate.getTime())) {
    const ageInDays =
      (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
    if (ageInDays <= 3) return "medium";
  }

  return "standard";
};

const getBestRequestByProperty = (loanRequests: LoanRequestApiItem[]) => {
  const requestByProperty = new Map<number, LoanRequestApiItem>();

  for (const request of loanRequests) {
    const existing = requestByProperty.get(request.property);
    if (!existing) {
      requestByProperty.set(request.property, request);
      continue;
    }

    const existingIsActive =
      String(existing.status || "").toLowerCase() === "active";
    const currentIsActive =
      String(request.status || "").toLowerCase() === "active";

    if (currentIsActive && !existingIsActive) {
      requestByProperty.set(request.property, request);
      continue;
    }

    if (currentIsActive === existingIsActive) {
      const existingTs = new Date(existing.created_at || 0).getTime();
      const currentTs = new Date(request.created_at || 0).getTime();
      if (currentTs > existingTs) {
        requestByProperty.set(request.property, request);
      }
    }
  }

  return requestByProperty;
};

export type LenderCombinedData = {
  loanRequests: LoanRequestData[];
  properties: PropertyMapData[];
  stats: PropertyMapStats;
};

export const fetchLenderCombinedData =
  async (): Promise<LenderCombinedData> => {
    const [propertiesResponse, loanRequestsResponse] = await Promise.all([
      api.get<ApiEnvelope<PropertyMapApiItem[]>>("/api/properties/map/"),
      api.get<ApiEnvelope<LoanRequestApiItem[]>>("/api/loans/requests/"),
    ]);

    const propertiesRaw = propertiesResponse.data?.data || [];
    const loanRequestsRaw = loanRequestsResponse.data?.data || [];

    const propertyById = new Map<number, PropertyMapApiItem>(
      propertiesRaw.map((property) => [property.id, property]),
    );

    const bestRequestByProperty = getBestRequestByProperty(loanRequestsRaw);

    const properties: PropertyMapData[] = propertiesRaw.map((property) => {
      const request = bestRequestByProperty.get(property.id);

      const latitude = toNumber(property.latitude) ?? FALLBACK_MAP_CENTER.lat;
      const longitude = toNumber(property.longitude) ?? FALLBACK_MAP_CENTER.lng;

      const requestedAmount = toNumber(request?.requested_amount) ?? 0;
      const ltv = toNumber(request?.ltv) ?? 0;

      return {
        id: property.id,
        loanRequestId: request?.id ?? null,
        propertyName: property.property_name,
        address: property.property_address,
        propertyType: toPropertyType(property.property_type),
        location: {
          lat: latitude,
          lng: longitude,
        },
        urgencyLevel: toUrgency(request?.status, request?.created_at),
        isActive: String(request?.status || "").toLowerCase() === "active",
        requestedAmount,
        loanTerm: toLoanTerm(request?.loan_term),
        occupancy: toNumber(request?.occupancy) ?? 0,
        yearBuilt: request?.year_built ?? 0,
        ltv,
        targetLtv: ltv,
        sponsor: "N/A",
        propertyImage: resolveImageUrl(
          property.property_image_url,
          request?.property_image_url,
        ),
      };
    });

    const loanRequests: LoanRequestData[] = loanRequestsRaw.map((request) => {
      const property = propertyById.get(request.property);

      const latitude = toNumber(property?.latitude) ?? FALLBACK_MAP_CENTER.lat;
      const longitude =
        toNumber(property?.longitude) ?? FALLBACK_MAP_CENTER.lng;
      const requestedAmount = toNumber(request.requested_amount) ?? 0;

      return {
        id: request.id,
        propertyName:
          request.property_name ||
          property?.property_name ||
          `Property #${request.property}`,
        address:
          request.property_address ||
          property?.property_address ||
          "Address unavailable",
        propertyType: toPropertyType(
          request.property_type || property?.property_type,
        ),
        location: {
          lat: latitude,
          lng: longitude,
        },
        urgencyLevel: toUrgency(request.status, request.created_at),
        isActive: String(request.status || "").toLowerCase() === "active",
        requestedAmount,
        loanTerm: toLoanTerm(request.loan_term),
        occupancy: toNumber(request.occupancy) ?? 0,
        yearBuilt: request.year_built ?? 0,
        ltv: toNumber(request.ltv) ?? 0,
        sponsor: "N/A",
        propertyImage: resolveImageUrl(
          property?.property_image_url,
          request.property_image_url,
        ),
      };
    });

    const totalLoanValue = properties.reduce(
      (sum, property) => sum + property.requestedAmount,
      0,
    );
    const nonZeroLoansCount = properties.filter(
      (property) => property.requestedAmount > 0,
    ).length;

    const stats: PropertyMapStats = {
      totalProperties: properties.length,
      totalLoanValue,
      avgLoanSize:
        nonZeroLoansCount > 0
          ? Math.round(totalLoanValue / nonZeroLoansCount)
          : 0,
      urgentRequests: properties.filter(
        (property) => property.urgencyLevel === "high",
      ).length,
    };

    return {
      loanRequests,
      properties,
      stats,
    };
  };
