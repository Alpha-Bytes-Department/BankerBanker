//========== Market Analytics Type Definitions ===========

export interface LoanVolumeData {
  month: string;
  volume: number;
}

export interface PropertyTypeData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface InterestRateData {
  month: string;
  average: number;
  high: number;
  low: number;
}

export interface LTVData {
  range: string;
  count: number;
}

export interface TopMarket {
  rank: number;
  city: string;
  state: string;
  deals: number;
  volume: string;
  change: string;
  changeType: string;
}

export interface MarketInsight {
  id: number;
  title: string;
  description: string;
  icon: string;
  bgColor: string;
  iconColor: string;
  borderColor: string;
}

export interface LtvDistributionData {
  range: string;
  count: number;
}

export interface MarketStat {
  id: number;
  title?: string;
  label?: string;
  value: string;
  change: string;
  isPositive?: boolean;
  changeType?: "positive" | "negative" | "neutral";
  subtitle: string;
  icon: "dollar" | "briefcase" | "chart" | "calendar" ;
  bgColor: string;
  iconBg?: string;
  iconColor: string;
  borderColor?: string;
}

export interface LoanVolumeData {
  month: string;
  volume: number;
}

export interface PropertyTypeData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface InterestRateData {
  month: string;
  average: number;
  high: number;
  low: number;
}

export interface LtvDistributionData {
  range: string;
  count: number;
}

export interface TopMarket {
  id: number;
  rank: number;
  city: string;
  state: string;
  deals: number;
  volume: string;
  change: string;
  changeType: "positive" | "negative"| string;
}

export interface MarketInsight {
  id: number;
  title: string;
  description: string;
  icon: "trending" | "chart" | "location" | string;
  bgColor: string;
  iconColor: string;
  borderColor: string;
}
