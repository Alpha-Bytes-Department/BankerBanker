"use client";
import Button from "./Button";
import { IoLocationOutline } from "react-icons/io5";
import {
  LuBuilding2,
  LuCalendar,
  LuWrench,
  LuParkingMeter as LuParkingCircle,
  LuFileText,
} from "react-icons/lu";
import { TbRulerMeasure } from "react-icons/tb";
import { MdOutlineOtherHouses } from "react-icons/md";
import Image from "next/image";
import { useRouter } from "next/navigation";

const FALLBACK_IMAGE = "/images/SponsorDashboard.png";

const normalizeImageUrl = (url?: string | null) => {
  if (!url) return FALLBACK_IMAGE;

  const trimmed = url.trim();
  if (!trimmed) return FALLBACK_IMAGE;

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("/")
  ) {
    return trimmed;
  }

  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/+$/, "");
  if (!baseUrl) return trimmed;

  return `${baseUrl}/${trimmed.replace(/^\/+/, "")}`;
};

// ── API shape (full detail response) ────────────────────────────────────────

export interface PropertyDocument {
  id: number;
  file_url: string;
  uploaded_at: string;
}

export interface PropertyDetail {
  id: number;
  property: string;
  title: string;
  property_address: string;
  property_type: string;
  number_of_units?: number;
  rentable_area?: string;
  year_built?: number;
  year_renovated?: number | null;
  occupancy?: string;
  parking_spaces?: number;
  property_image_url: string | null;
  sponsor?: string;
  created_at?: string;
  updated_at?: string;
  documents?: PropertyDocument[];
  // list-only fields (map endpoint) — optional
  latitude?: string;
  longitude?: string;
  location: string;
  status: string;
  link: string;
  link2: string;
}

// ── Component ────────────────────────────────────────────────────────────────

type PropertyCardProps = {
  data: PropertyDetail;
  size?: "small" | "large";
  secondaryButtonText?: string;
  secondaryButtonClassName?: string;
  onSecondaryAction?: () => void;
};

const sizeStyles = {
  small: "w-[380px] lg:w-full xl:w-[438px] h-auto",
  large: "w-full h-auto",
};

// Pill colour per property type
const typePillColor: Record<string, string> = {
  Multifamily: "bg-blue-100 text-blue-700",
  Retail: "bg-orange-100 text-orange-700",
  Industrial: "bg-yellow-100 text-yellow-700",
  Office: "bg-purple-100 text-purple-700",
  Mixed: "bg-teal-100 text-teal-700",
};

const PropertyCard = ({
  data,
  size = "large",
  secondaryButtonText = "View Quotes",
  secondaryButtonClassName = "button-outline",
  onSecondaryAction,
}: PropertyCardProps) => {
  const router = useRouter();
  const propertyImageSrc = normalizeImageUrl(data.property_image_url);

  const pillColor =
    typePillColor[data.property_type?.trim()] ?? "bg-gray-100 text-gray-700";

  const hasDocuments = data.documents && data.documents.length > 0;
  const hasCoordinates = Boolean(data.latitude && data.longitude);

  const formatDate = (value?: string) => {
    if (!value) return "-";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "-";
    return parsed.toLocaleDateString();
  };

  const formatCoordinate = (value?: string) => {
    if (!value) return "-";
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return value;
    return parsed.toFixed(6);
  };

  return (
    <div
      className={`border border-[#E5E7EB] rounded-lg flex flex-col gap-0 ${sizeStyles[size]}`}
    >
      {/* ── Image ── */}
      <div className="w-full h-48 relative">
        <Image
          src={propertyImageSrc}
          alt={"image"}
          fill
          className="rounded-t-lg object-cover object-center"
          unoptimized
        />
        {/* Property type badge overlaid on image */}
        <span
          className={`absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full ${pillColor}`}
        >
          {data.property_type}
        </span>
      </div>

      {/* ── Body ── */}
      <div className="p-3 2xl:p-5 flex flex-col gap-4">
        {/* Title row */}
        <div className="flex justify-between items-start gap-2">
          <h1 className="text-lg font-semibold leading-tight">{data.title}</h1>
        </div>

        {/* Address */}
        <div className="text-[#4A5565] flex items-center gap-1.5 text-sm">
          <IoLocationOutline className="text-base shrink-0" />
          <span>{data.location}</span>
        </div>

        {/* ── Stats grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
          {hasCoordinates && (
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-[#6A7282] flex items-center gap-1">
                <IoLocationOutline className="text-sm" /> Coordinates
              </span>
              <span className="text-sm font-medium">
                {formatCoordinate(data.latitude)},{" "}
                {formatCoordinate(data.longitude)}
              </span>
            </div>
          )}

          {data.created_at !== undefined && (
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-[#6A7282] flex items-center gap-1">
                <LuCalendar className="text-sm" /> Created
              </span>
              <span className="text-sm font-medium">
                {formatDate(data.created_at)}
              </span>
            </div>
          )}

          {data.updated_at !== undefined && (
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-[#6A7282] flex items-center gap-1">
                <LuCalendar className="text-sm" /> Updated
              </span>
              <span className="text-sm font-medium">
                {formatDate(data.updated_at)}
              </span>
            </div>
          )}

          {data.number_of_units !== undefined && (
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-[#6A7282] flex items-center gap-1">
                <MdOutlineOtherHouses className="text-sm" /> Units
              </span>
              <span className="text-sm font-medium">
                {data.number_of_units}
              </span>
            </div>
          )}

          {data.occupancy !== undefined && (
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-[#6A7282] flex items-center gap-1">
                <LuBuilding2 className="text-sm" /> Occupancy
              </span>
              <span className="text-sm font-medium">{data.occupancy}%</span>
            </div>
          )}

          {data.rentable_area !== undefined && (
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-[#6A7282] flex items-center gap-1">
                <TbRulerMeasure className="text-sm" /> Rentable Area
              </span>
              <span className="text-sm font-medium">
                {Number(data.rentable_area).toLocaleString()} sqft
              </span>
            </div>
          )}

          {data.year_built !== undefined && (
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-[#6A7282] flex items-center gap-1">
                <LuCalendar className="text-sm" /> Year Built
              </span>
              <span className="text-sm font-medium">{data.year_built}</span>
            </div>
          )}

          {data.year_renovated != null && (
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-[#6A7282] flex items-center gap-1">
                <LuWrench className="text-sm" /> Renovated
              </span>
              <span className="text-sm font-medium">{data.year_renovated}</span>
            </div>
          )}

          {data.parking_spaces !== undefined && (
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-[#6A7282] flex items-center gap-1">
                <LuParkingCircle className="text-sm" /> Parking
              </span>
              <span className="text-sm font-medium">
                {data.parking_spaces} spaces
              </span>
            </div>
          )}
        </div>

        {/* ── Documents strip (only when detail data is present) ── */}
        {data.documents !== undefined && (
          <div className="flex items-center gap-2 text-sm text-[#4A5565] border-t pt-3 border-[#E5E7EB]">
            <LuFileText className="shrink-0 text-base" />
            {hasDocuments ? (
              <span>
                {data.documents!.length} document
                {data.documents!.length !== 1 ? "s" : ""} attached
              </span>
            ) : (
              <span className="text-[#9CA3AF]">No documents uploaded</span>
            )}
          </div>
        )}

        {/* ── Actions ── */}
        <div className="flex justify-between items-center">
          <Button
            text="View Document"
            size="medium"
            onClick={() => router.push(data.link)}
          />
          <Button
            size="medium"
            text={secondaryButtonText}
            className={secondaryButtonClassName}
            onClick={() => {
              if (onSecondaryAction) {
                onSecondaryAction();
                return;
              }

              router.push(data.link2);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
