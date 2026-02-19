"use client";

import React, { useState } from "react";
import { GoogleMap, LoadScript, OverlayView } from "@react-google-maps/api";
import { LoanRequestData, UrgencyLevel } from "@/types/loan-request";
import { FiMap, FiLayers } from "react-icons/fi";

//========== Loan Requests Map Component ===========

interface LoanRequestsMapProps {
  loanRequests: LoanRequestData[];
  onMarkerClick?: (id: number) => void;
}

const LoanRequestsMap: React.FC<LoanRequestsMapProps> = ({
  loanRequests,
  onMarkerClick,
}) => {
  //========== State ===========
  const [mapType, setMapType] = useState<"roadmap" | "satellite">("roadmap");

  //========== Configuration ===========
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  //========== Calculate Center and Bounds ===========
  const calculateCenter = () => {
    if (loanRequests.length === 0) {
      return { lat: 39.8283, lng: -98.5795 }; // Center of USA
    }

    const totalLat = loanRequests.reduce(
      (sum, req) => sum + req.location.lat,
      0
    );
    const totalLng = loanRequests.reduce(
      (sum, req) => sum + req.location.lng,
      0
    );

    return {
      lat: totalLat / loanRequests.length,
      lng: totalLng / loanRequests.length,
    };
  };

  //========== Get Marker Color ===========
  const getMarkerColor = (urgencyLevel: UrgencyLevel): string => {
    const colorMap: { [key in UrgencyLevel]: string } = {
      high: "#ef4444", // red-500
      medium: "#f97316", // orange-500
      standard: "#3b82f6", // blue-500
    };
    return colorMap[urgencyLevel];
  };

  //========== Get Urgency Label ===========
  const getUrgencyLabel = (urgencyLevel: UrgencyLevel): string => {
    const labelMap: { [key in UrgencyLevel]: string } = {
      high: "High Priority",
      medium: "Medium Priority",
      standard: "Standard",
    };
    return labelMap[urgencyLevel];
  };

  const center = calculateCenter();

  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden border border-gray-200">
      <LoadScript
        googleMapsApiKey={apiKey || ""}
        libraries={["geometry", "drawing"]}
      >
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={center}
          zoom={4}
          mapTypeId={mapType}
        >
          {/* ====== Location Markers ====== */}
          {loanRequests.map((request) => (
            <OverlayView
              key={request.id}
              position={request.location}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <div
                style={{
                  backgroundColor: getMarkerColor(request.urgencyLevel),
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
                  border: "3px solid white",
                  cursor: "pointer",
                  transform: "translate(-50%, -50%)",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform =
                    "translate(-50%, -50%) scale(1.15)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translate(-50%, -50%)")
                }
                onClick={() => onMarkerClick?.(request.id)}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
            </OverlayView>
          ))}
        </GoogleMap>
      </LoadScript>

      {/* ====== Map Controls ====== */}
      <div className="absolute top-4 left-4 flex gap-2">
        <button
          onClick={() => setMapType("roadmap")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm shadow-md transition-colors ${
            mapType === "roadmap"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <FiMap className="w-4 h-4" />
          Map
        </button>
        <button
          onClick={() => setMapType("satellite")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm shadow-md transition-colors ${
            mapType === "satellite"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <FiLayers className="w-4 h-4" />
          Satellite
        </button>
      </div>

      {/* ====== Urgency Level Legend ====== */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-sm text-gray-900 mb-3">Urgency Level</h3>
        <div className="space-y-2">
          {(["high", "medium", "standard"] as UrgencyLevel[]).map((level) => (
            <div key={level} className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: getMarkerColor(level) }}
              ></div>
              <span className="text-sm text-gray-700">
                {getUrgencyLabel(level)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ====== Scale Indicator ====== */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="w-20 h-1 bg-gray-900"></div>
          <span className="text-xs text-gray-700">100 mi</span>
        </div>
      </div>
    </div>
  );
};

export default LoanRequestsMap;
