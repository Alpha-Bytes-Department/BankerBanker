"use client";

import React, { useState } from "react";
import { GoogleMap, LoadScript, OverlayView } from "@react-google-maps/api";
import { PropertyMapData } from "@/types/loan-request";
import { FaMapMarkedAlt, FaGlobeAmericas } from "react-icons/fa";
//========== Property Map Component ===========

interface PropertyMapComponentProps {
  properties: PropertyMapData[];
  selectedProperty: PropertyMapData | null;
  onPropertySelect: (property: PropertyMapData) => void;
}

const PropertyMapComponent: React.FC<PropertyMapComponentProps> = ({
  properties,
  selectedProperty,
  onPropertySelect,
}) => {
  const [mapType, setMapType] = useState<"roadmap" | "satellite">("roadmap");

  //========== Map Styling ===========
  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

  //========== Calculate Map Center ===========
  const center = React.useMemo(() => {
    if (properties.length === 0) {
      return { lat: 40.7128, lng: -74.006 }; // Default to NYC
    }

    const avgLat =
      properties.reduce((sum, prop) => sum + prop.location.lat, 0) /
      properties.length;
    const avgLng =
      properties.reduce((sum, prop) => sum + prop.location.lng, 0) /
      properties.length;

    return { lat: avgLat, lng: avgLng };
  }, [properties]);

  //========== Marker Color Based on Urgency ===========
  const getMarkerColor = (urgency: PropertyMapData["urgencyLevel"]): string => {
    const colorMap = {
      high: "#EF4444", // Red
      medium: "#F97316", // Orange
      standard: "#3B82F6", // Blue
    };
    return colorMap[urgency];
  };

  //========== Custom Marker Component ===========
  const CustomMarker: React.FC<{
    property: PropertyMapData;
    isSelected: boolean;
  }> = ({ property, isSelected }) => {
    const color = getMarkerColor(property.urgencyLevel);
    const scale = isSelected ? 1.2 : 1;

    return (
      <div
        onClick={() => onPropertySelect(property)}
        className="cursor-pointer transform transition-transform  hover:scale-110"
        style={{ transform: `scale(${scale})` }}
      >
        <div
          className="relative flex items-center justify-center"
          style={{ width: "32px", height: "40px" }}
        >
          {/* ====== Marker Pin ====== */}
          <svg
            width="32"
            height="40"
            viewBox="0 0 32 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 0C7.163 0 0 7.163 0 16C0 24.837 16 40 16 40C16 40 32 24.837 32 16C32 7.163 24.837 0 16 0Z"
              fill={color}
            />
            <circle cx="16" cy="16" r="6" fill="white" />
          </svg>

          {/* ====== Selected Ring ====== */}
          {isSelected && (
            <div
              className="absolute -inset-1 rounded-full animate-ping"
              style={{
                backgroundColor: color,
                opacity: 0.3,
              }}
            />
          )}
        </div>
      </div>
    );
  };

  //========== Map Options ===========
  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    gestureHandling: "greedy",
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={12}
          mapTypeId={mapType}
          options={mapOptions}
        >
          {/* ====== Property Markers ====== */}
          {properties.map((property) => (
            <OverlayView
              key={property.id}
              position={property.location}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <CustomMarker
                property={property}
                isSelected={selectedProperty?.id === property.id}
              />
            </OverlayView>
          ))}
        </GoogleMap>
      </LoadScript>

      {/* ====== Map Controls ====== */}
      <div className="absolute top-2 md:top-4 left-2 md:left-4 flex flex-col gap-2">
        {/* ====== Map Type Toggle ====== */}
        <div className="bg-white rounded-full flex gap-1 md:gap-2 p-1 shadow-md overflow-hidden">
          <button
            onClick={() => setMapType("roadmap")}
            className={`px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm ${
              mapType === "roadmap"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            } transition-colors flex items-center justify-center rounded-full`}
          >
            <FaMapMarkedAlt size={16} className="inline-block md:mr-2" />
            <span className="hidden md:inline">Map</span>
          </button>
          <button
            onClick={() => setMapType("satellite")}
            className={`px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm ${
              mapType === "satellite"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            } transition-colors flex items-center justify-center rounded-full`}
          >
            <FaGlobeAmericas size={16} className="inline-block md:mr-2" />
            <span className="hidden md:inline">Satellite</span>
          </button>
        </div>
      </div>

      {/* ====== Urgency Level Legend ====== */}
      <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 bg-white rounded-lg shadow-md p-2 md:p-4">
        <h4 className="text-xs md:text-sm text-gray-900 mb-1 md:mb-2">
          Urgency Level
        </h4>
        <div className="space-y-1 md:space-y-2">
          <div className="flex items-center gap-1 md:gap-2">
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-500"></div>
            <span className="text-xs text-gray-700">High Priority</span>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-orange-500"></div>
            <span className="text-xs text-gray-700">Medium Priority</span>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs text-gray-700">Standard</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyMapComponent;
