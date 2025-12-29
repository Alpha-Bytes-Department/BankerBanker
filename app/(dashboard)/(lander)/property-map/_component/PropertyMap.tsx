"use client";

import React, { useState } from "react";
import { PropertyMapData, PropertyMapStats } from "@/types/loan-request";
import PropertyDetailsPanel from "./PropertyDetailsPanel";
import PropertyMapComponent from "./PropertyMapComponent";
import PropertyList from "./PropertyList";
import {
  FiSearch,
  FiRefreshCw,
  FiDollarSign,
  FiTrendingUp,
  FiAlertCircle,
} from "react-icons/fi";
import { HiOutlineOfficeBuilding } from "react-icons/hi";

//========== Property Map Page ===========

const PropertyMap: React.FC = () => {
  //========== Sample Data ===========
  const [properties] = useState<PropertyMapData[]>([
    {
      id: 1,
      propertyName: "Harbor Point Plaza",
      propertyType: "Office",
      address: "123 Harbor Blvd, Los Angeles, CA 90017",
      location: { lat: 34.0522, lng: -118.2437 },
      requestedAmount: 8500000,
      loanTerm: "5 years",
      occupancy: 92,
      yearBuilt: 2015,
      ltv: 65,
      targetLtv: 65,
      sponsor: "Pacific Commercial Group",
      urgencyLevel: "high",
      isActive: true,
      units: 24,
      squareFeet: 85000,
      propertyImage:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
    },
    {
      id: 2,
      propertyName: "Riverside Apartments",
      propertyType: "Multifamily",
      address: "456 River St, San Diego, CA 92101",
      location: { lat: 32.7157, lng: -117.1611 },
      requestedAmount: 12000000,
      loanTerm: "7 years",
      occupancy: 88,
      yearBuilt: 2018,
      ltv: 70,
      targetLtv: 70,
      sponsor: "Urban Living Partners",
      urgencyLevel: "medium",
      isActive: true,
      units: 156,
      squareFeet: 145000,
      propertyImage:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
    },
    {
      id: 3,
      propertyName: "Gateway Shopping Center",
      propertyType: "Retail",
      address: "789 Commerce Way, San Francisco, CA 94102",
      location: { lat: 37.7749, lng: -122.4194 },
      requestedAmount: 6750000,
      loanTerm: "10 years",
      occupancy: 95,
      yearBuilt: 2012,
      ltv: 60,
      targetLtv: 60,
      sponsor: "Retail Ventures LLC",
      urgencyLevel: "standard",
      isActive: true,
      squareFeet: 125000,
      propertyImage:
        "https://images.unsplash.com/photo-1567449303183-434ac2ea8c2c?w=800&h=600&fit=crop",
    },
    {
      id: 4,
      propertyName: "Tech Hub Tower",
      propertyType: "Office",
      address: "321 Innovation Dr, San Jose, CA 95110",
      location: { lat: 37.3382, lng: -121.8863 },
      requestedAmount: 15000000,
      loanTerm: "5 years",
      occupancy: 98,
      yearBuilt: 2020,
      ltv: 65,
      targetLtv: 65,
      sponsor: "Silicon Valley Properties",
      urgencyLevel: "high",
      isActive: true,
      squareFeet: 200000,
      propertyImage:
        "https://images.unsplash.com/photo-1577415124269-fc1140a69e91?w=800&h=600&fit=crop",
    },
    {
      id: 5,
      propertyName: "Warehouse District Complex",
      propertyType: "Industrial",
      address: "555 Logistics Ln, Oakland, CA 94607",
      location: { lat: 37.8044, lng: -122.2712 },
      requestedAmount: 9200000,
      loanTerm: "7 years",
      occupancy: 85,
      yearBuilt: 2016,
      ltv: 70,
      targetLtv: 70,
      sponsor: "Industrial Realty Group",
      urgencyLevel: "medium",
      isActive: true,
      squareFeet: 180000,
      propertyImage:
        "https://images.unsplash.com/photo-1553268643-e7d3b51b2c0c?w=800&h=600&fit=crop",
    },
  ]);

  const [stats] = useState<PropertyMapStats>({
    totalProperties: 5,
    totalLoanValue: 51450000,
    avgLoanSize: 10290000,
    urgentRequests: 2,
  });

  //========== State ===========
  const [selectedProperty, setSelectedProperty] =
    useState<PropertyMapData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  //========== Filter Properties ===========
  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === "all" || property.propertyType === selectedFilter;

    return matchesSearch && matchesFilter;
  });

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
  const propertyTypes = [
    "all",
    "Office",
    "Multifamily",
    "Retail",
    "Industrial",
    "Mixed-Use",
  ];

  //========== Handle Actions ===========
  const handleSubmitQuote = (id: number) => {
    console.log("Submit quote for property:", id);
    // TODO: Implement quote submission logic
  };

  const handleViewFullDetails = (id: number) => {
    console.log("View full details for property:", id);
    // TODO: Implement navigation to details page
  };

  const handleRefresh = () => {
    console.log("Refreshing property data...");
    // TODO: Implement data refresh logic
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
            className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-xl text-sm hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center"
          >
            <FiRefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* ====== Stats Cards Section ====== */}
      <div className="bg-white rounded-2xl mx-3 md:mx-6 mb-3 md:mb-6 max-w-full overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {/* ====== Total Properties ====== */}
          <div className="flex items-center rounded-2xl p-3 md:p-4 border-2 border-blue-200 gap-3 md:gap-5 min-w-0">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
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
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
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
            <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
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
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
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
                <PropertyMapComponent
                  properties={filteredProperties}
                  selectedProperty={selectedProperty}
                  onPropertySelect={setSelectedProperty}
                />
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
                <PropertyList
                  properties={filteredProperties}
                  selectedProperty={selectedProperty}
                  onPropertySelect={setSelectedProperty}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyMap;
