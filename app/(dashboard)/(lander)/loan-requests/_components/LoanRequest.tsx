"use client";

import React, { useState, useRef } from "react";
import { LoanRequestData } from "@/types/loan-request";
import LoanRequestCard from "./LoanRequestCard";
import LoanRequestsMap from "./LoanRequestsMap";
import { FiRefreshCw } from "react-icons/fi";

//========== Loan Request Component ===========

const LoanRequest = () => {
  //========== State ===========
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeRequestsCount] = useState(3);
  const cardRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  //========== Sample Data ===========
  const [loanRequests] = useState<LoanRequestData[]>([
    {
      id: 1,
      propertyName: "Downtown Office Complex",
      address: "123 Business Ave, Chicago, IL 60601",
      location: { lat: 41.8781, lng: -87.6298 },
      propertyType: "Office",
      urgencyLevel: "high",
      isActive: true,
      requestedAmount: 15500000,
      loanTerm: "30 years",
      occupancy: 95,
      yearBuilt: 1985,
      ltv: 75,
      sponsor: "Johnson Real Estate Group",
      propertyImage:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
    },
    {
      id: 2,
      propertyName: "Banner Gardens Apartments",
      address: "456 Residential Dr, New York, NY 10001",
      location: { lat: 40.7484, lng: -73.9857 },
      propertyType: "Multifamily",
      urgencyLevel: "standard",
      isActive: true,
      requestedAmount: 8000000,
      loanTerm: "25 years",
      occupancy: 92,
      yearBuilt: 1992,
      ltv: 70,
      sponsor: "Acme Properties LLC",
      propertyImage:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
    },
    {
      id: 3,
      propertyName: "Riverside Shopping Center",
      address: "789 Commerce Blvd, Miami, FL 33101",
      location: { lat: 25.7617, lng: -80.1918 },
      propertyType: "Retail",
      urgencyLevel: "medium",
      isActive: true,
      requestedAmount: 22300000,
      loanTerm: "20 years",
      occupancy: 88,
      yearBuilt: 2005,
      ltv: 65,
      sponsor: "Riverside Capital Partners",
      propertyImage:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
    },
  ]);

  //========== Event Handlers ===========
  const handleRefresh = () => {
    setIsRefreshing(true);
    console.log("Refreshing loan requests...");
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleMarkerClick = (id: number) => {
    // Scroll to the corresponding card
    const cardElement = cardRefs.current[id];
    if (cardElement) {
      cardElement.scrollIntoView({ behavior: "smooth", block: "center" });
      // Add highlight animation
      cardElement.classList.add("ring-4", "ring-blue-500");
      setTimeout(() => {
        cardElement.classList.remove("ring-4", "ring-blue-500");
      }, 2000);
    }
  };

  const handleSubmitQuote = (id: number) => {
    console.log("Submit quote for loan request:", id);
  };

  const handleViewDetails = (id: number) => {
    console.log("View details for loan request:", id);
  };

  const handleViewDocuments = (id: number) => {
    console.log("View documents for loan request:", id);
  };

  return (
    <div className="w-full">
      {/* ====== Header Section ====== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl text-gray-900 mb-2">
            Loan Requests
          </h1>
          <p className="text-sm text-gray-600">
            All available loan opportunities
          </p>
        </div>

        {/* ====== Right Side: Count and Refresh Button ====== */}
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-lg">
            {activeRequestsCount} Active Requests
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <FiRefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* ====== Map Section ====== */}
      <div className="mb-6">
        <LoanRequestsMap
          loanRequests={loanRequests}
          onMarkerClick={handleMarkerClick}
        />
      </div>

      {/* ====== Loan Request Cards ====== */}
      <div className="space-y-6">
        {loanRequests.map((request) => (
          <div
            key={request.id}
            ref={(el) => {
              cardRefs.current[request.id] = el;
            }}
            className="transition-all duration-300"
          >
            <LoanRequestCard
              loanRequest={request}
              onSubmitQuote={handleSubmitQuote}
              onViewDetails={handleViewDetails}
              onViewDocuments={handleViewDocuments}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoanRequest;
