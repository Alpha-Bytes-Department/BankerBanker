"use client";

import React from "react";
import GMAP from "@/app/(dashboard)/_components/GMAP";
import Button from "@/components/Button";
import api from "@/Provider/api";
import { toast } from "sonner";
import type { PlaceData } from "./place-types";

type PickPropertyLocationProps = {
  id: number;
  title?: string;
  description?: string;
  setCurrentStep?: React.Dispatch<React.SetStateAction<number>>;
  setPlaceData: React.Dispatch<React.SetStateAction<PlaceData | null>>;
};

const PickPropertyLocation = ({
  id,
  title,
  description,
  setCurrentStep,
  setPlaceData,
}: PickPropertyLocationProps) => {
  const [selectedPlace, setSelectedPlace] = React.useState<PlaceData | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleContinue = async () => {
    if (!selectedPlace) {
      toast.error("Please search for a location or select one from the map.");
      return;
    }

    if (!selectedPlace.place_id) {
      toast.error("Please choose a specific place from the search results.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        place_id: selectedPlace.place_id,
        name: selectedPlace.name,
        address: selectedPlace.address,
        lat: selectedPlace.lat,
        lng: selectedPlace.lng,
        photos: selectedPlace.photos || [],
        types: selectedPlace.types || [],
      };

      const response = await api.post("/api/v1/properties/places/", payload);
      const extracted = (response?.data?.data ?? response?.data ?? {}) as Record<
        string,
        unknown
      >;

      const mergedPlaceData: PlaceData = {
        ...selectedPlace,
        ...extracted,
        place_id: String(
          extracted.place_id || selectedPlace.place_id || "",
        ),
        name: String(
          extracted.property_name ||
            extracted.name ||
            selectedPlace.name ||
            "",
        ),
        address: String(
          extracted.property_address ||
            extracted.address ||
            selectedPlace.address ||
            "",
        ),
        lat:
          typeof extracted.latitude === "number"
            ? extracted.latitude
            : typeof extracted.lat === "number"
              ? extracted.lat
              : selectedPlace.lat,
        lng:
          typeof extracted.longitude === "number"
            ? extracted.longitude
            : typeof extracted.lng === "number"
              ? extracted.lng
              : selectedPlace.lng,
        photos:
          Array.isArray(extracted.photos) && extracted.photos.length > 0
            ? (extracted.photos as string[])
            : selectedPlace.photos,
        types: extracted.types
          ? (extracted.types as string[] | string)
          : selectedPlace.types,
      };

      setPlaceData(mergedPlaceData);
      toast.success(response?.data?.message || "Location and property info extracted.");
      setCurrentStep?.((prev) => prev + 1);
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string; errors?: unknown } };
      };
      const apiError = err?.response?.data?.errors;
      const message =
        err?.response?.data?.message ||
        (apiError ? JSON.stringify(apiError) : "Unable to validate this location.");

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-xl">
            Step {id + 1} : {title}
          </h1>
          <p className="text-[#4A5565]">{description}</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-[#99A1AF] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">
          Select Property Address
        </h2>
        <p className="mt-1 text-sm text-[#4A5565]">
          Search for the property address or click the map to pin the location.
        </p>

        <GMAP onPlaceSelect={(place) => {
          console.log("Details from map:", place);
          setSelectedPlace(place);
        }} />

        {selectedPlace ? (
          <div className="mt-5 rounded-xl border border-[#DDE3EA] bg-[#F8FAFC] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6A7282]">
              Selected address
            </p>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {selectedPlace.name || "Unnamed place"}
            </p>
            <p className="mt-1 text-sm text-[#4A5565]">
              {selectedPlace.address || "No address available"}
            </p>
            <p className="mt-2 text-xs text-[#6A7282]">
              {selectedPlace.lat.toFixed(6)}, {selectedPlace.lng.toFixed(6)}
            </p>
          </div>
        ) : null}

        <div className="mt-6 flex justify-end border-t border-[#E5E7EB] pt-5">
          <Button
            text={isSubmitting ? "Saving..." : "Continue"}
            onClick={handleContinue}
            isDisabled={isSubmitting}
            arrow={!isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default PickPropertyLocation;

