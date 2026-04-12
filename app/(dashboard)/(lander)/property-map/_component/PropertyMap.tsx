"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/Provider/api";
import { PropertyMapData, PropertyMapStats } from "@/types/loan-request";
import PropertyDetailsPanel from "./PropertyDetailsPanel";
import PropertyMapComponent from "./PropertyMapComponent";
import PropertyList from "./PropertyList";
import { toast } from "sonner";
import {
  FiSearch,
  FiRefreshCw,
  FiDollarSign,
  FiTrendingUp,
  FiAlertCircle,
} from "react-icons/fi";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { fetchLenderCombinedData } from "../../_utils/lenderLoanData";
import {
  getSubmitQuotePath,
  saveLoanQuotePrefillState,
} from "@/lib/quote-submit-state";

type ApiEnvelope<T> = {
  data?: T;
};

type LoanRequestDetailApi = {
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

const FALLBACK_PROPERTY_IMAGE = "/images/SponsorDashboard.png";
const STATIC_STATS: PropertyMapStats = {
  totalProperties: 0,
  totalLoanValue: 0,
  avgLoanSize: 0,
  urgentRequests: 0,
};

const toNumber = (value: string | number | undefined | null) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const toLoanTerm = (value: number | string | undefined) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return "-";
  return `${parsed} months`;
};

const toPropertyType = (
  value: string | undefined,
): PropertyMapData["propertyType"] => {
  const normalized = String(value || "").toLowerCase();

  if (normalized.includes("multi")) return "Multifamily";
  if (normalized.includes("retail")) return "Retail";
  if (normalized.includes("industrial")) return "Industrial";
  if (normalized.includes("mixed")) return "Mixed-Use";
  return "Office";
};

const toUrgency = (
  status: string | undefined,
  createdAt: string | undefined,
): PropertyMapData["urgencyLevel"] => {
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

const resolveImageUrl = (value?: string | null) => {
  if (!value) return FALLBACK_PROPERTY_IMAGE;

  const raw = String(value).trim();
  if (!raw || raw === "null" || raw === "undefined") {
    return FALLBACK_PROPERTY_IMAGE;
  }

  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/+$/, "");

  if (/^https?:\/\//i.test(raw)) {
    if (!baseUrl) return raw;
    return raw.replace(/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?/i, baseUrl);
  }

  const normalizedPath = raw.replace(/^\/+/, "");
  if (raw.startsWith("/") || normalizedPath.startsWith("media/")) {
    return baseUrl ? `${baseUrl}/${normalizedPath}` : `/${normalizedPath}`;
  }

  return FALLBACK_PROPERTY_IMAGE;
};

//========== Property Map Page ===========

const PropertyMap: React.FC = () => {
  const router = useRouter();
  const [properties, setProperties] = useState<PropertyMapData[]>([]);
  const [stats] = useState<PropertyMapStats>(STATIC_STATS);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  //========== State ===========
  const [selectedProperty, setSelectedProperty] =
    useState<PropertyMapData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const loadPropertyData = useCallback(async (manualRefresh = false) => {
    if (manualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const mergedData = await fetchLenderCombinedData();
      setProperties(mergedData.properties);
      setSelectedProperty((previousSelection) => {
        if (!previousSelection) return null;
        return (
          mergedData.properties.find(
            (property) => property.id === previousSelection.id,
          ) || null
        );
      });
    } catch (error) {
      console.error("Failed to load property map data", error);
      toast.error("Unable to load property map data right now.");
      setProperties([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPropertyData();
  }, [loadPropertyData]);

  //========== Filter Properties ===========
  const filteredProperties = useMemo(
    () =>
      properties.filter((property) => {
        const matchesSearch =
          property.propertyName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          property.address.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter =
          selectedFilter === "all" || property.propertyType === selectedFilter;

        return matchesSearch && matchesFilter;
      }),
    [properties, searchQuery, selectedFilter],
  );

  useEffect(() => {
    if (!selectedProperty) return;

    const isVisible = filteredProperties.some(
      (property) => property.id === selectedProperty.id,
    );

    if (!isVisible) {
      setSelectedProperty(null);
    }
  }, [filteredProperties, selectedProperty]);

  //========== Format Currency ===========
  const formatCurrency = (amount: number): string => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  //========== Property Type Filters ===========
  const propertyTypes = useMemo(
    () => [
      "all",
      ...new Set(properties.map((property) => property.propertyType)),
    ],
    [properties],
  );

  //========== Handle Actions ===========
  const handleSubmitQuote = (property: PropertyMapData) => {
    if (!property.loanRequestId) {
      toast.error("No active loan request found for this property.");
      return;
    }

    saveLoanQuotePrefillState(property.loanRequestId, {
      requestId: property.loanRequestId,
      propertyName: property.propertyName,
      propertyAddress: property.address,
      propertyType: property.propertyType,
      requestedAmount: property.requestedAmount,
      loanTerm: Number.parseInt(property.loanTerm, 10) || 0,
      ltv: property.targetLtv || property.ltv,
      occupancy: property.occupancy,
      yearBuilt: property.yearBuilt,
      propertyImageUrl: property.propertyImage,
    });

    router.push(getSubmitQuotePath(property.loanRequestId));
  };

  const handleViewFullDetails = (property: PropertyMapData) => {
    if (!property.loanRequestId) {
      toast.error("Loan request details are unavailable for this property.");
      return;
    }

    router.push(`/loan-requests/${property.loanRequestId}`);
  };

  const handlePropertySelect = useCallback(
    async (property: PropertyMapData) => {
      setSelectedProperty(property);

      if (!property.loanRequestId) return;

      try {
        const response = await api.get<ApiEnvelope<LoanRequestDetailApi>>(
          `/api/loans/requests/${property.loanRequestId}/`,
        );

        const detail = response.data?.data;
        if (!detail) return;

        const mergedProperty: PropertyMapData = {
          ...property,
          propertyName: detail.property_name || property.propertyName,
          address: detail.property_address || property.address,
          propertyType: detail.property_type
            ? toPropertyType(detail.property_type)
            : property.propertyType,
          requestedAmount:
            toNumber(detail.requested_amount) ?? property.requestedAmount,
          loanTerm: toLoanTerm(detail.loan_term),
          occupancy: toNumber(detail.occupancy) ?? property.occupancy,
          yearBuilt: detail.year_built ?? property.yearBuilt,
          ltv: toNumber(detail.ltv) ?? property.ltv,
          targetLtv: toNumber(detail.ltv) ?? property.targetLtv ?? property.ltv,
          isActive: String(detail.status || "").toLowerCase() === "active",
          urgencyLevel: toUrgency(detail.status, detail.created_at),
          propertyImage: detail.property_image_url
            ? resolveImageUrl(detail.property_image_url)
            : property.propertyImage,
        };

        setProperties((previous) =>
          previous.map((item) =>
            item.id === property.id ? { ...item, ...mergedProperty } : item,
          ),
        );
        setSelectedProperty((current) =>
          current && current.id === property.id
            ? { ...current, ...mergedProperty }
            : current,
        );
      } catch (error) {
        console.error("Failed to load property detail", error);
        toast.error("Unable to load property details right now.");
      }
    },
    [],
  );

  const handleRefresh = () => {
    loadPropertyData(true);
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ====== Header Section ====== */}
      <div className="bg-white rounded-2xl shadow-sm mx-3 md:mx-6 mt-3 md:mt-6 mb-3 md:mb-6 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl text-gray-900 mb-1">
              Property Map
            </h1>
            <p className="text-xs md:text-sm text-gray-600">
              Track and manage all property loan requests on the map
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-xl text-sm hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center"
          >
            <FiRefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* ====== Stats Cards Section ====== */}
      <div className="bg-white rounded-2xl mx-3 md:mx-6 mb-3 md:mb-6 max-w-full overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {/* ====== Total Properties ====== */}
          <div className="flex items-center rounded-2xl p-3 md:p-4 border-2 border-blue-200 gap-3 md:gap-5 min-w-0">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
              <HiOutlineOfficeBuilding
                size={24}
                className="md:w-7 md:h-7 text-blue-600"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm md:text-base text-gray-600">
                Total Properties
              </p>
              <p className="text-xl md:text-2xl text-gray-900">
                {stats.totalProperties}
              </p>
            </div>
          </div>

          {/* ====== Total Loan Value ====== */}

          <div className="flex items-center rounded-2xl p-3 md:p-4 border-2 border-green-200 gap-3 md:gap-5 min-w-0">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
              <FiDollarSign
                size={24}
                className="md:w-7 md:h-7 text-green-600"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm md:text-base text-gray-600">
                Total Loan Value
              </p>
              <p className="text-xl md:text-2xl text-gray-900">
                {formatCurrency(stats.totalLoanValue)}
              </p>
            </div>
          </div>

          {/* ====== Avg Loan Size ====== */}
          <div className="flex items-center rounded-2xl p-3 md:p-4 border-2 border-blue-200 gap-3 min-w-0">
            <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center shrink-0">
              <FiTrendingUp
                size={24}
                className="md:w-7 md:h-7 text-violet-600"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs md:text-sm text-gray-600">Avg Loan Size</p>
              <p className="text-xl md:text-2xl text-gray-900">
                {formatCurrency(stats.avgLoanSize)}
              </p>
            </div>
          </div>

          {/* ====== Urgent Requests ====== */}
          <div className="flex items-center rounded-2xl p-3 md:p-4 border-2 border-red-200 gap-3 min-w-0">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
              <FiAlertCircle size={24} className="md:w-7 md:h-7 text-red-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs md:text-sm text-gray-600">
                Urgent Requests
              </p>
              <p className="text-xl md:text-2xl text-gray-900">
                {stats.urgentRequests}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ====== Search and Filters Section ====== */}

      {/* ====== Map Section ====== */}
      <div className="mx-3 md:mx-6 mb-3 md:mb-6 max-w-full overflow-hidden">
        <div className="bg-white overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-3 md:gap-5">
            {/* ====== Map ====== */}
            <div className="flex-1 relative">
              <div className="rounded-2xl border-2 border-gray-200 mb-3 md:mb-6 p-3 md:p-4">
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  {/* ====== Search Bar ====== */}
                  <div className="flex-1 relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search properties..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* ====== Property Type Filters ====== */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 -mx-3 px-3 sm:mx-0 sm:px-0">
                    {propertyTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedFilter(type)}
                        className={`px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm whitespace-nowrap border border-gray-300 transition-colors ${
                          selectedFilter === type
                            ? "bg-blue-600 text-white"
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {type === "all" ? "All" : type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="h-100 sm:h-[500px] lg:h-[700px]">
                {isLoading ? (
                  <div className="h-full rounded-2xl border-2 border-gray-200 bg-gray-50 animate-pulse" />
                ) : (
                  <PropertyMapComponent
                    properties={filteredProperties}
                    selectedProperty={selectedProperty}
                    onPropertySelect={handlePropertySelect}
                  />
                )}
              </div>
            </div>

            {/* ====== Right Sidebar (Property Details + All Properties) ====== */}
            <div className="w-full lg:w-96 flex flex-col gap-3">
              {/* ====== Property Details Section ====== */}
              <div className="rounded-lg border-gray-200 border-2 p-3">
                <h3 className="text-lg text-gray-900 mb-2 border-b-2 border-gray-200 text-center py-2">
                  Property Details
                </h3>

                <PropertyDetailsPanel
                  property={selectedProperty}
                  onClose={() => setSelectedProperty(null)}
                  onSubmitQuote={handleSubmitQuote}
                  onViewFullDetails={handleViewFullDetails}
                />
              </div>

              {/* ====== All Properties List Section ====== */}
              <div className="flex-1 border-2 border-gray-200 rounded-lg p-3 max-h-[300px] sm:max-h-[400px] lg:max-h-[500px] overflow-y-auto">
                {isLoading ? (
                  <div className="h-full rounded-lg bg-gray-50 animate-pulse" />
                ) : (
                  <PropertyList
                    properties={filteredProperties}
                    selectedProperty={selectedProperty}
                    onPropertySelect={handlePropertySelect}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyMap;
