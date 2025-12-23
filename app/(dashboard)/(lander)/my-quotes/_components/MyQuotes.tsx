"use client";

import React, { useState } from "react";
import { Quote, QuoteStat, QuoteFilter } from "@/types/my-quotes";
import StatsCardsQuotes from "./StatsCardsQuotes";
import QuotesList from "./QuotesList";

//========== My Quotes Component ===========

const MyQuotes: React.FC = () => {
  //========== State Management ===========
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  //========== Sample Data - Stats ===========
  const [stats] = useState<QuoteStat[]>([
    {
      id: 1,
      label: "Total Quotes",
      value: "6",
      icon: "file",
      bgColor: "bg-blue-50",
      iconColor: "bg-blue-600 text-white",
      borderColor: "border-blue-200",
    },
    {
      id: 2,
      label: "Under Review",
      value: "2",
      icon: "clock",
      bgColor: "bg-yellow-50",
      iconColor: "bg-yellow-600 text-white",
      borderColor: "border-yellow-200",
    },
    {
      id: 3,
      label: "Accepted",
      value: "2",
      icon: "check",
      bgColor: "bg-green-50",
      iconColor: "bg-green-600 text-white",
      borderColor: "border-green-200",
    },
    {
      id: 4,
      label: "Win Rate",
      value: "50%",
      icon: "trending",
      bgColor: "bg-purple-50",
      iconColor: "bg-purple-600 text-white",
      borderColor: "border-purple-200",
    },
    {
      id: 5,
      label: "Total Value",
      value: "$109.0M",
      icon: "dollar",
      bgColor: "bg-indigo-50",
      iconColor: "bg-indigo-600 text-white",
      borderColor: "border-indigo-200",
    },
  ]);

  //========== Sample Data - Filters ===========
  const filters: QuoteFilter[] = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "under_review", label: "Under Review" },
    { id: "accepted", label: "Accepted" },
    { id: "rejected", label: "Rejected" },
  ];

  //========== Sample Data - Quotes ===========
  const [allQuotes] = useState<Quote[]>([
    {
      id: 1,
      propertyName: "Downtown Office Complex",
      address: "123 Business Ave",
      city: "Chicago",
      state: "IL",
      sponsor: "Johnson Real Estate Group",
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
      status: "under_review",
      priority: "priority",
      propertyType: "Office",
      interestRate: "SOFR + 3.85%",
      term: "30 years",
      ltv: "75%",
      submittedDate: "Jan 15, 2025",
      expiresIn: -251,
      quotedAmount: "$15,500,000",
      competingQuotes: 5,
      avgResponseTime: "3 days",
    },
    {
      id: 2,
      propertyName: "Banner Gardens Apartments",
      address: "456 Residential Dr",
      city: "New York",
      state: "NY",
      sponsor: "Acme Properties LLC",
      image:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
      status: "accepted",
      priority: "normal",
      propertyType: "Multifamily",
      interestRate: "SOFR + 3.95%",
      term: "25 years",
      ltv: "70%",
      submittedDate: "Jan 10, 2025",
      expiresIn: -256,
      quotedAmount: "$8,000,000",
      competingQuotes: 3,
      avgResponseTime: "2 days",
      statusMessage:
        "Sponsor has accepted your quote! Next steps: Schedule closing call.",
    },
    {
      id: 3,
      propertyName: "Riverside Shopping Center",
      address: "789 Commerce Blvd",
      city: "Miami",
      state: "FL",
      sponsor: "Riverside Capital Partners",
      image:
        "https://images.unsplash.com/photo-1555529669-2269763671c0?w=400&h=300&fit=crop",
      status: "rejected",
      priority: "urgent",
      propertyType: "Retail",
      interestRate: "SOFR + 3.75%",
      term: "20 years",
      ltv: "65%",
      submittedDate: "Jan 5, 2025",
      expiresIn: -261,
      quotedAmount: "$22,300,000",
      competingQuotes: 8,
      avgResponseTime: "7 days",
      statusMessage:
        "Sponsor selected another lender with more competitive terms.",
    },
  ]);

  //========== Filter Quotes ===========
  const filteredQuotes = allQuotes.filter((quote) => {
    // Filter by status
    if (activeFilter !== "all" && quote.status !== activeFilter) {
      return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        quote.propertyName.toLowerCase().includes(query) ||
        quote.address.toLowerCase().includes(query) ||
        quote.sponsor.toLowerCase().includes(query) ||
        quote.city.toLowerCase().includes(query)
      );
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden pb-6">
      {/* ====== Header ====== */}
      <header className="bg-white text-start rounded-2xl p-4 md:p-6 mb-4 md:mb-6 mx-3 md:mx-0">
        <h1 className="text-xl md:text-2xl font-normal text-gray-900">
          My Quotes
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Track and manage all your loan quote submissions
        </p>
      </header>

      {/* ====== Stats Cards ====== */}
      <div className="mx-3 md:mx-0">
        <StatsCardsQuotes stats={stats} />
      </div>

      {/* ====== Quotes List with Search and Filters ====== */}
      <div className="mx-3 md:mx-0">
        <QuotesList
          quotes={filteredQuotes}
          filters={filters}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>
    </div>
  );
};

export default MyQuotes;
