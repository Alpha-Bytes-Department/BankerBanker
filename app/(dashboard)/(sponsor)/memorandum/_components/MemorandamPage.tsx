"use client";
import { useMemo, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import PropertyCard from "@/components/PropertyCard";
import StatusCard from "@/components/StatusCard";
import ConfirmActionModal from "@/components/ConfirmActionModal";
import api from "@/Provider/api";
import { toast } from "sonner";

// ── Types ────────────────────────────────────────────────────────────────────

interface Property {
  id: number;
  property_name: string;
  property_address: string;
  property_type: string;
  latitude?: string;
  longitude?: string;
  property_image_url?: string | null;
  thumbnail_url?: string | null;
  property_images?: string[];
  number_of_units?: number;
  rentable_area?: string;
  year_built?: number;
  occupancy?: string;
  created_at?: string;
  updated_at?: string;
}

interface Memorandum {
  id: number;
  title: string;
  property: number;
  property_name: string;
  property_image_url?: string;
  thumbnail_url?: string;
  property_images?: string[];
  status: string;
  mode: string;
  created_at: string;
  updated_at?: string;
}

// ── API Fetchers ─────────────────────────────────────────────────────────────

async function fetchProperties(): Promise<Property[]> {
  let response;
  try {
    response = await api.get("/api/v1/properties/");
  } catch {
    try {
      response = await api.get("/api/properties/");
    } catch {
      return [];
    }
  }

  const raw = response?.data?.data ?? response?.data;
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.results)) return raw.results;
  return [];
}

async function fetchMemorandums(): Promise<Memorandum[]> {
  let response;
  try {
    response = await api.get("/api/v1/memorandums/");
  } catch (err: any) {
    if (err?.response?.status === 404) {
      response = await api.get("/api/memorandums/");
    } else {
      throw err;
    }
  }

  const raw = response?.data?.data ?? response?.data?.results ?? response?.data;
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.results)) return raw.results;
  return [];
}

// ── Component ────────────────────────────────────────────────────────────────

const MemorandamPage = () => {
  const queryClient = useQueryClient();

  // Fetch properties (cached with TanStack Query, shared across pages)
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ["properties"],
    queryFn: fetchProperties,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch memorandums
  const {
    data: memorandums = [],
    isLoading: memorandumsLoading,
  } = useQuery<Memorandum[]>({
    queryKey: ["memorandums"],
    queryFn: fetchMemorandums,
    staleTime: 60 * 1000,
  });

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [pendingDeleteMemorandum, setPendingDeleteMemorandum] = useState<{
    id: number;
    title: string;
  } | null>(null);

  // Fallback thumbnails fetched from property files if property.thumbnail_url is missing
  const [fileThumbnails, setFileThumbnails] = useState<Record<number, string>>({});

  useEffect(() => {
    const missingProps = properties.filter(
      (p) => !p.thumbnail_url && (!p.property_images || p.property_images.length === 0)
    );
    if (missingProps.length === 0) return;

    let isMounted = true;
    const fetchMissing = async () => {
      for (const p of missingProps) {
        try {
          const res = await api.get(`/api/v1/properties/${p.id}/files/`).catch(() => null);
          const rawFiles = res?.data?.data ?? res?.data ?? [];
          const files = Array.isArray(rawFiles) ? rawFiles : [];
          const img = files.find((f: any) => {
            const url = f.file_url || f.file || f.url || "";
            return /\.(jpe?g|png|webp|gif|svg)(\?.*)?$/i.test(url);
          });
          if (img && isMounted) {
            const imgUrl = img.file_url || img.file || img.url;
            setFileThumbnails((prev) => ({ ...prev, [p.id]: imgUrl }));
          }
        } catch {
          // ignore error
        }
      }
    };
    fetchMissing();

    return () => {
      isMounted = false;
    };
  }, [properties]);

  const handleDeleteMemorandum = async (memorandumId: number) => {
    try {
      setDeletingId(memorandumId);
      try {
        await api.delete(`/api/v1/memorandums/${memorandumId}/`);
      } catch (err: any) {
        if (err?.response?.status === 404) {
          await api.delete(`/api/memorandums/${memorandumId}/`);
        } else {
          throw err;
        }
      }
      queryClient.setQueryData<Memorandum[]>(["memorandums"], (prev = []) =>
        prev.filter((item) => item.id !== memorandumId),
      );
      toast.success("Memorandum deleted successfully.");
    } catch (error) {
      console.error("Failed to delete memorandum:", error);
      toast.error("Failed to delete memorandum. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const confirmDeleteMemorandum = async () => {
    if (!pendingDeleteMemorandum) return;

    await handleDeleteMemorandum(pendingDeleteMemorandum.id);
    setPendingDeleteMemorandum(null);
  };

  const memorandumStats = useMemo(() => {
    const stats = {
      total: memorandums.length,
      generating: 0,
      draft: 0,
      published: 0,
      previewMode: 0,
    };

    for (const item of memorandums) {
      const status = (item.status || "").toLowerCase();
      const mode = (item.mode || "").toLowerCase();

      if (status === "generating") stats.generating += 1;
      if (status === "draft" || status === "ready") stats.draft += 1;
      if (status === "published") stats.published += 1;
      if (mode === "preview") stats.previewMode += 1;
    }

    return stats;
  }, [memorandums]);

  // Lookup maps to correlate memorandum to property
  const propertyMap = useMemo(() => {
    const map = new Map<number, Property>();
    for (const p of properties) {
      if (p.id) map.set(Number(p.id), p);
    }
    return map;
  }, [properties]);

  const propertyByNameMap = useMemo(() => {
    const map = new Map<string, Property>();
    for (const p of properties) {
      if (p.property_name) {
        map.set(p.property_name.trim().toLowerCase(), p);
      }
    }
    return map;
  }, [properties]);

  // Build card data exactly as dashboard page does with thumbnail and property details
  const cardData = useMemo(
    () =>
      memorandums.map((item) => {
        const propId =
          typeof item.property === "object" && item.property !== null
            ? Number((item.property as any).id)
            : Number(item.property || (item as any).property_id);

        const matchedProperty =
          (Number.isFinite(propId) ? propertyMap.get(propId) : undefined) ||
          propertyByNameMap.get((item.property_name || "").trim().toLowerCase());

        const matchedPropId =
          matchedProperty?.id || (Number.isFinite(propId) ? propId : undefined);
        const fallbackThumb = matchedPropId ? fileThumbnails[matchedPropId] : null;

        const resolvedThumbnail =
          item.thumbnail_url ||
          matchedProperty?.thumbnail_url ||
          (Array.isArray(matchedProperty?.property_images) && matchedProperty.property_images.length > 0
            ? matchedProperty.property_images[0]
            : null) ||
          matchedProperty?.property_image_url ||
          fallbackThumb ||
          (Array.isArray(item.property_images) && item.property_images.length > 0
            ? item.property_images[0]
            : null) ||
          item.property_image_url ||
          null;

        const resolvedImages =
          (Array.isArray(matchedProperty?.property_images) && matchedProperty.property_images.length > 0
            ? matchedProperty.property_images
            : null) ||
          (Array.isArray(item.property_images) && item.property_images.length > 0
            ? item.property_images
            : resolvedThumbnail
              ? [resolvedThumbnail]
              : []);

        const resolvedAddress =
          matchedProperty?.property_address || item.property_name || "N/A";

        const resolvedType =
          matchedProperty?.property_type || item.status || "Other";

        return {
          id: item.id,
          property: String(matchedProperty?.id || item.property || ""),
          title: item.title || item.property_name || "Offering Memorandum",
          property_address: resolvedAddress,
          property_type: resolvedType,
          thumbnail_url: resolvedThumbnail,
          property_image_url: resolvedThumbnail,
          property_images: resolvedImages,
          number_of_units: matchedProperty?.number_of_units,
          rentable_area: matchedProperty?.rentable_area,
          year_built: matchedProperty?.year_built,
          occupancy: matchedProperty?.occupancy,
          latitude: matchedProperty?.latitude,
          longitude: matchedProperty?.longitude,
          created_at: item.created_at || matchedProperty?.created_at,
          updated_at: item.updated_at || matchedProperty?.updated_at,
          status: item.status,
          location: resolvedAddress,
          link: `/memorandum/${item.id}`,
          link2: `/memorandum/${item.id}/download`,
        };
      }),
    [memorandums, propertyMap, propertyByNameMap, fileThumbnails],
  );

  const isLoading = memorandumsLoading && memorandums.length === 0;

  if (isLoading) {
    return (
      <div className="">
        <h1 className="text-start text-lg md:text-2xl font-semibold py-2">
          Memorandums
        </h1>
        <p className="text-base text-start lg:text-lg md:text-lg text-[#4A5565]">
          Monitor your memorandums and related details below.
        </p>

        <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 2xl:gap-10 my-10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 w-44 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-72 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <h1 className="text-start text-lg md:text-2xl font-semibold py-2">
        Memorandums
      </h1>
      <p className="text-base text-start lg:text-lg md:text-lg text-[#4A5565]">
        Monitor your memorandums and related details below.
      </p>

      <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 2xl:gap-10 my-10">
        <StatusCard
          type="Properties"
          titleOverride="Total Memorandums"
          statusLabelOverride="published"
          data={{
            value: memorandumStats.total,
            status: memorandumStats.published,
          }}
        />
        <StatusCard
          type="quotes"
          titleOverride="Generating"
          statusLabelOverride="currently running"
          data={{
            value: memorandumStats.generating,
            status: memorandumStats.generating,
          }}
        />
        <StatusCard
          type="documents"
          titleOverride="Draft"
          statusLabelOverride="ready to review"
          data={{ value: memorandumStats.draft, status: memorandumStats.draft }}
        />
        <StatusCard
          type="value"
          titleOverride="Published"
          statusLabelOverride="in preview mode"
          data={{
            value: memorandumStats.published,
            status: memorandumStats.previewMode,
          }}
        />
      </div>

      <div className="mb-10">
        {cardData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5 place-items-center">
            {cardData.map((memorandum) => (
              <PropertyCard
                key={memorandum.id}
                data={memorandum}
                size="large"
                secondaryButtonText={
                  deletingId === memorandum.id ? "Deleting..." : "Delete"
                }
                secondaryButtonClassName="bg-red-600 text-white hover:bg-red-700"
                onSecondaryAction={() => {
                  if (deletingId === memorandum.id) return;
                  setPendingDeleteMemorandum({
                    id: memorandum.id,
                    title: memorandum.title,
                  });
                }}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-10">No memorandums available.</p>
        )}
      </div>

      <ConfirmActionModal
        open={Boolean(pendingDeleteMemorandum)}
        onOpenChange={(open) => {
          if (!open && !deletingId) {
            setPendingDeleteMemorandum(null);
          }
        }}
        title="Delete memorandum?"
        description={
          pendingDeleteMemorandum
            ? `This will permanently remove "${pendingDeleteMemorandum.title}".`
            : "This will permanently remove the selected memorandum."
        }
        confirmText="Delete"
        destructive
        isLoading={Boolean(deletingId)}
        onConfirm={confirmDeleteMemorandum}
      />
    </div>
  );
};

export default MemorandamPage;

