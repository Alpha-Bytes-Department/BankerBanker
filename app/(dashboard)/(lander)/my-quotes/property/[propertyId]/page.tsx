"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ArrowLeft, MapPin } from "lucide-react";
import { toast } from "sonner";
import api from "@/Provider/api";
import type { LenderPropertyMapItem } from "@/types/my-quotes";

type ApiEnvelope<T> = {
  data?: T;
};

const FALLBACK_PROPERTY_IMAGE = "/images/SponsorDashboard.png";

const resolveImageUrl = (value?: string | null) => {
  if (!value) return FALLBACK_PROPERTY_IMAGE;
  const raw = String(value).trim();
  if (!raw || raw === "null" || raw === "undefined") {
    return FALLBACK_PROPERTY_IMAGE;
  }

  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/+$/, "");

  if (raw.startsWith("/")) {
    return baseUrl ? `${baseUrl}${raw}` : raw;
  }

  if (/^https?:\/\//i.test(raw)) {
    if (!baseUrl) return raw;
    return raw.replace(/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?/i, baseUrl);
  }

  return FALLBACK_PROPERTY_IMAGE;
};

const toCoordinate = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed.toFixed(6) : "-";
};

const Page = () => {
  const params = useParams();
  const propertyId = Array.isArray(params.propertyId)
    ? params.propertyId[0]
    : params.propertyId;

  const numericPropertyId = Number(propertyId);

  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState<LenderPropertyMapItem | null>(null);
  const [imageSrc, setImageSrc] = useState(FALLBACK_PROPERTY_IMAGE);

  const fetchProperty = useCallback(async () => {
    if (!Number.isFinite(numericPropertyId) || numericPropertyId <= 0) {
      setLoading(false);
      setProperty(null);
      return;
    }

    setLoading(true);

    try {
      const response = await api.get<ApiEnvelope<LenderPropertyMapItem[]>>(
        "/api/properties/map/",
      );
      const properties = response.data?.data || [];
      const found =
        properties.find((item) => item.id === numericPropertyId) || null;

      setProperty(found);
      setImageSrc(resolveImageUrl(found?.property_image_url));
    } catch (error) {
      console.error("Failed to load property details", error);
      toast.error("Unable to load property details.");
      setProperty(null);
      setImageSrc(FALLBACK_PROPERTY_IMAGE);
    } finally {
      setLoading(false);
    }
  }, [numericPropertyId]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  const mapLink = useMemo(() => {
    if (!property) return "";
    const lat = Number(property.latitude);
    const lng = Number(property.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return "";
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }, [property]);

  if (loading) {
    return (
      <div className="py-10 text-sm text-[#6A7282]">
        Loading property details...
      </div>
    );
  }

  if (!property) {
    return (
      <div className="py-10 text-sm text-[#6A7282]">Property not found.</div>
    );
  }

  return (
    <div className="space-y-5 pb-10">
      <Link
        href="/my-quotes"
        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to My Quotes
      </Link>

      <div className="rounded-xl overflow-hidden border border-[#0000001A] bg-white">
        <div className="relative h-56 md:h-72">
          <Image
            src={imageSrc}
            alt={property.property_name}
            fill
            className="object-cover"
            unoptimized
            onError={() => setImageSrc(FALLBACK_PROPERTY_IMAGE)}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/15 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur-sm">
              {property.property_type}
            </p>
            <h1 className="mt-2 text-2xl font-semibold">
              {property.property_name}
            </h1>
            <p className="mt-1 text-sm text-white/90 flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {property.property_address}
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-[#6A7282]">Property ID</p>
            <p className="font-medium">{property.id}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-[#6A7282]">Property Type</p>
            <p className="font-medium">{property.property_type}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-[#6A7282]">Latitude</p>
            <p className="font-medium">{toCoordinate(property.latitude)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-[#6A7282]">Longitude</p>
            <p className="font-medium">{toCoordinate(property.longitude)}</p>
          </div>
        </div>

        <div className="border-t border-slate-200 px-4 sm:px-5 py-4 text-sm text-slate-700">
          <p className="font-medium text-slate-900">Address</p>
          <p className="mt-1">{property.property_address}</p>

          {mapLink ? (
            <a
              href={mapLink}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex rounded-full border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
            >
              Open In Maps
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Page;
