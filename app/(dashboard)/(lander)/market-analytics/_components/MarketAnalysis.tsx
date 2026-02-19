"use client";

import React, { useState } from "react";
import {
  MarketStat,
  LoanVolumeData,
  PropertyTypeData,
  InterestRateData,
  LtvDistributionData,
  TopMarket,
  MarketInsight,
} from "@/types/market-analytics";
import StatsCards from "./StatsCards";
import LoanVolumeChart from "./LoanVolumeChart";
import PropertyTypeChart from "./PropertyTypeChart";
import InterestRateChart from "./InterestRateChart";
import LTVDistributionChart from "./LTVDistributionChart";
import TopMarketsList from "./TopMarketsList";
import MarketInsightsCards from "./MarketInsightsCards";

//========== Market Analysis Component ===========

const MarketAnalysis: React.FC = () => {
  //========== Sample Data ===========
  const [stats] = useState<MarketStat[]>([
    {
      id: 1,
      label: "Total Loan Volume",
      value: "$1.68B",
      change: "+12.5%",
      changeType: "positive",
      subtitle: "Last 6 months",
      icon: "dollar",
      bgColor: "bg-blue-50",
      iconColor: "bg-blue-600",
      borderColor: "border-blue-200",
    },
    {
      id: 2,
      label: "Active Deals",
      value: "119",
      change: "+8.3%",
      changeType: "positive",
      subtitle: "Current quarter",
      icon: "briefcase",
      bgColor: "bg-green-50",
      iconColor: "bg-green-600",
      borderColor: "border-green-200",
    },
    {
      id: 3,
      label: "Avg Interest Rate",
      value: "4.10%",
      change: "+0.35%",
      changeType: "positive",
      subtitle: "SOFR + 3.85%",
      icon: "chart",
      bgColor: "bg-orange-50",
      iconColor: "bg-orange-600",
      borderColor: "border-orange-200",
    },
    {
      id: 4,
      label: "Avg Close Time",
      value: "42 days",
      change: "-3 days",
      changeType: "negative",
      subtitle: "Industry avg: 45 days",
      icon: "calendar",
      bgColor: "bg-purple-50",
      iconColor: "bg-purple-600",
      borderColor: "border-purple-200",
    },
  ]);

  const [loanVolumeData] = useState<LoanVolumeData[]>([
    { month: "Jan", volume: 250 },
    { month: "Feb", volume: 310 },
    { month: "Mar", volume: 280 },
    { month: "Apr", volume: 350 },
    { month: "May", volume: 400 },
    { month: "Jun", volume: 380 },
  ]);

  const [propertyTypeData] = useState<PropertyTypeData[]>([
    { name: "Multifamily", value: 42, percentage: 35, color: "#3B82F6" },
    { name: "Office", value: 33, percentage: 28, color: "#10B981" },
    { name: "Retail", value: 26, percentage: 22, color: "#F59E0B" },
    { name: "Mixed-Use", value: 18, percentage: 15, color: "#8B5CF6" },
  ]);

  const [interestRateData] = useState<InterestRateData[]>([
    { month: "Jan", average: 3.8, high: 4.2, low: 3.3 },
    { month: "Feb", average: 3.9, high: 4.3, low: 3.4 },
    { month: "Mar", average: 4.0, high: 4.5, low: 3.5 },
    { month: "Apr", average: 4.1, high: 4.6, low: 3.6 },
    { month: "May", average: 4.2, high: 4.7, low: 3.7 },
    { month: "Jun", average: 4.1, high: 4.6, low: 3.6 },
  ]);

  const [ltvDistributionData] = useState<LtvDistributionData[]>([
    { range: "0-50%", count: 8 },
    { range: "50-60%", count: 15 },
    { range: "60-70%", count: 32 },
    { range: "70-80%", count: 45 },
    { range: "80-90%", count: 19 },
  ]);

  const [topMarkets] = useState<TopMarket[]>([
    {
      id: 1,
      rank: 1,
      city: "New York",
      state: "NY",
      deals: 45,
      volume: "$456M",
      change: "12.5%",
      changeType: "positive",
    },
    {
      id: 2,
      rank: 2,
      city: "Los Angeles",
      state: "CA",
      deals: 38,
      volume: "$389M",
      change: "8.3%",
      changeType: "positive",
    },
    {
      id: 3,
      rank: 3,
      city: "Chicago",
      state: "IL",
      deals: 32,
      volume: "$312M",
      change: "2.1%",
      changeType: "negative",
    },
    {
      id: 4,
      rank: 4,
      city: "Houston",
      state: "TX",
      deals: 28,
      volume: "$278M",
      change: "15.7%",
      changeType: "positive",
    },
    {
      id: 5,
      rank: 5,
      city: "Miami",
      state: "FL",
      deals: 25,
      volume: "$245M",
      change: "22.4%",
      changeType: "positive",
    },
  ]);

  const [insights] = useState<MarketInsight[]>([
    {
      id: 1,
      title: "Growing Demand",
      description:
        "Multifamily properties showing 18% increase in loan requests compared to last quarter.",
      icon: "trending",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-600",
    },
    {
      id: 2,
      title: "Rate Stabilization",
      description:
        "Interest rates have stabilized around 4.10% after a period of volatility.",
      icon: "chart",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      borderColor: "border-orange-600",
    },
    {
      id: 3,
      title: "Emerging Markets",
      description:
        "Miami and Houston showing strong growth with 22% and 16% increases respectively.",
      icon: "location",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      borderColor: "border-green-600",
    },
  ]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ====== Header ====== */}
      <header className="bg-white text-start rounded-2xl p-4 md:p-6 mb-4 md:mb-6 mx-3 md:mx-0">
        <h1 className="text-xl md:text-2xl font-normal text-gray-900">
          Market Analysis
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Commercial real estate lending market insights
        </p>
      </header>

      <section className="space-y-4 md:space-y-6">
        {/* ====== Stats Cards Section ====== */}
        <StatsCards stats={stats} />

        {/* ====== Charts Row 1: Loan Volume Trends & Property Type Distribution ====== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mx-3 md:mx-0">
          <LoanVolumeChart data={loanVolumeData} />
          <PropertyTypeChart data={propertyTypeData} />
        </div>

        {/* ====== Charts Row 2: Interest Rate Trends & LTV Distribution ====== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mx-3 md:mx-0">
          <InterestRateChart data={interestRateData} />
          <LTVDistributionChart data={ltvDistributionData} />
        </div>

        {/* ====== Top Markets Section ====== */}
        <TopMarketsList markets={topMarkets} />

        {/* ====== Market Insights Section ====== */}
        <MarketInsightsCards insights={insights} />
      </section>
    </div>
  );
};

export default MarketAnalysis;
