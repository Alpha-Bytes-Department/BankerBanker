"use client";
import PropertyCard from "@/components/PropertyCard";
import StatusCard from "@/components/StatusCard";
import { FaPlus } from "react-icons/fa6";
import GMAP from "../../_components/GMAP";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import api from "@/Provider/api";

// ── Types ────────────────────────────────────────────────────────────────────

interface SponsorStats {
  total_properties: number;
  quotes_received: number;
  documents_count: number;
  portfolio_value: number;
}

interface Property {
  id: number;
  property_name: string;
  property_address: string;
  property_type: string;
  latitude: string;
  longitude: string;
  property_image_url: string | null;
  created_at: string;
  updated_at: string;
}

interface MemorandumSummary {
  id: number;
  property: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

interface PropertyCardData extends Property {
  property: string;
  title: string;
  location: string;
  status: string;
  link?: string;
  link2?: string;
}

interface Marker {
  id: number;
  position: { lat: number; lng: number };
  title: string;
  icon: string;
  color: string;
}

// ── Constants ────────────────────────────────────────────────────────────────

const MARKER_ICON = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";

const getTimestamp = (value?: string) => {
  if (!value) return 0;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const isPublished = (status?: string) =>
  (status || "").trim().toLowerCase() === "published";

const pickPreferredMemorandum = (
  current: MemorandumSummary | undefined,
  candidate: MemorandumSummary,
) => {
  if (!current) return candidate;

  const currentPublished = isPublished(current.status);
  const candidatePublished = isPublished(candidate.status);

  if (candidatePublished !== currentPublished) {
    return candidatePublished ? candidate : current;
  }

  const currentStamp = getTimestamp(current.updated_at || current.created_at);
  const candidateStamp = getTimestamp(
    candidate.updated_at || candidate.created_at,
  );

  return candidateStamp > currentStamp ? candidate : current;
};

// ── Skeleton helpers ─────────────────────────────────────────────────────────

const StatsSkeleton = () => (
  <div className="flex flex-wrap items-center justify-center xl:justify-start gap-5 lg:gap-7 xl:gap-10 my-10">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="h-28 w-44 rounded-xl bg-gray-100 animate-pulse" />
    ))}
  </div>
);

const PropertySkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="h-28 rounded-xl bg-gray-100 animate-pulse" />
    ))}
  </div>
);

// ── Page ─────────────────────────────────────────────────────────────────────

const Page = () => {
  const [stats, setStats] = useState<SponsorStats | null>(null);
  const [properties, setProperties] = useState<PropertyCardData[]>([]);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [propertiesLoading, setPropertiesLoading] = useState(true);

  // Fetch sponsor dashboard stats
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await api.get("/api/dashboard/sponsor/");
      setStats(res.data?.data ?? null);
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch properties + derive map markers from them
  const fetchProperties = useCallback(async () => {
    setPropertiesLoading(true);
    try {
      const [propertyRes, memorandumRes] = await Promise.all([
        api.get("/api/properties/"),
        api.get("/api/memorandums/"),
      ]);

      const propertyData: Property[] = propertyRes.data?.data ?? [];
      const memorandumData: MemorandumSummary[] =
        memorandumRes.data?.data ?? [];

      const memorandumByProperty = new Map<number, MemorandumSummary>();
      for (const memorandum of memorandumData) {
        const propertyId = Number(memorandum.property);
        if (!Number.isFinite(propertyId) || propertyId <= 0) continue;

        const current = memorandumByProperty.get(propertyId);
        const preferred = pickPreferredMemorandum(current, memorandum);
        memorandumByProperty.set(propertyId, preferred);
      }

      const enrichedProperties: PropertyCardData[] = propertyData.map(
        (property) => {
          const matchedMemorandum = memorandumByProperty.get(property.id);

          return {
            ...property,
            property: String(property.id),
            title: property.property_name,
            location: property.property_address,
            status: property.property_type,
            link: matchedMemorandum
              ? `/memorandum/${matchedMemorandum.id}`
              : undefined,
          };
        },
      );

      setProperties(enrichedProperties);

      // Build markers from property coordinates
      const derived: Marker[] = enrichedProperties
        .filter((p) => p.latitude && p.longitude)
        .map((p) => ({
          id: p.id,
          position: {
            lat: parseFloat(p.latitude),
            lng: parseFloat(p.longitude),
          },
          title: p.property_name,
          icon: MARKER_ICON,
          color: "red",
        }));
      setMarkers(derived);
    } catch (err) {
      console.error("Failed to fetch properties", err);
    } finally {
      setPropertiesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchProperties();
  }, [fetchStats, fetchProperties]);

  const visibleProperties = properties.slice(0, 4);
  const hasMoreProperties = properties.length > 4;

  return (
    <div>
      <h1 className="text-xl lg:text-2xl my-2">Sponsor Dashboard</h1>
      <p className="text-[#4A5565] my-2">
        Manage your commercial real estate portfolio and generate professional
        offering memorandums
      </p>

      {/* ── Status Cards ── */}
      {statsLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="flex flex-wrap items-center justify-center xl:justify-start gap-5 lg:gap-7 xl:gap-10 my-10">
          <StatusCard
            type="Properties"
            data={{ value: stats?.total_properties ?? 0 }}
          />
          <StatusCard
            type="quotes"
            data={{ value: stats?.quotes_received ?? 0 }}
          />
          <StatusCard
            type="documents"
            data={{ value: stats?.documents_count ?? 0 }}
          />
          <StatusCard
            type="value"
            data={{ value: stats?.portfolio_value ?? 0 }}
          />
        </div>
      )}

      {/* ── Google Map ── */}
      <div className="my-5">
        <GMAP markersList={markers} />
      </div>

      {/* ── Property Portfolio ── */}
      <div className="flex flex-col-reverse xl:flex-row gap-5">
        <div className="rounded-xl bg-white p-3 lg:p-5 border border-[#0000001A] flex-1">
          <div className="flex items-center gap-2 lg:justify-between">
            <div className="grow">
              <h1 className="text-lg">Property Portfolio</h1>
              <p className="text-[#6A7282]">Manage and track your properties</p>
            </div>
            <Link
              href="/processing"
              className="flex gap-2 button-primary rounded-full py-2 px-2 md:px-3 min-w-24 cursor-pointer justify-center items-center"
            >
              <FaPlus className="hidden md:flex" />
              <p className="text-xs sm:text-sm lg:text-base">Add property</p>
            </Link>
          </div>

          <div className="my-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {propertiesLoading ? (
              <PropertySkeleton />
            ) : properties.length === 0 ? (
              <div className="text-center py-16 text-[#6A7282]">
                <p className="text-lg mb-2">No properties yet</p>
                <p className="text-sm">
                  Add your first property to get started.
                </p>
              </div>
            ) : (
              visibleProperties.map((property) => (
                <PropertyCard key={property.id} data={property} />
              ))
            )}
          </div>

          {!propertiesLoading && hasMoreProperties ? (
            <div className="flex justify-center">
              <Link
                href="/memorandum"
                className="button-outline rounded-full px-5 py-2 text-sm font-medium"
              >
                Show More
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Page;
