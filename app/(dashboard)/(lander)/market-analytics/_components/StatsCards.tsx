"use client";

import React from "react";
import { MarketStat } from "@/types/market-analytics";
import {
  FiDollarSign,
  FiTrendingUp,
  FiCalendar,
  FiMapPin,
} from "react-icons/fi";
import { IoMdTrendingDown, IoMdTrendingUp } from "react-icons/io";
import { LuBuilding2 } from "react-icons/lu";
import { FaChartColumn } from "react-icons/fa6";

//========== Stats Cards Component ===========

interface StatsCardsProps {
  stats: MarketStat[];
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  //========== Get Icon Component ===========
  const getIconComponent = (iconType: string) => {
    const iconMap = {
      dollar: FiDollarSign,
      briefcase: LuBuilding2,
      chart: FaChartColumn,
      calendar: FiCalendar,
      trending: FiTrendingUp,
      location: FiMapPin,
    };
    const IconComponent = iconMap[iconType as keyof typeof iconMap];
    return IconComponent ? (
      <IconComponent className="w-6 h-6 text-white" />
    ) : null;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4 mx-3 md:mx-0">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className={`${stat.bgColor} rounded-2xl p-4 md:p-6 border-2 ${stat.borderColor} min-w-0 overflow-hidden`}
        >
          {/* ====== Icon and Change ====== */}
          <div className="flex items-start justify-between mb-4">
            <div className={`${stat.iconColor} rounded-2xl p-3 md:p-4`}>
              {getIconComponent(stat.icon)}
            </div>
            <div
              className={`flex items-center gap-1 text-sm md:text-base font-medium ${
                stat.changeType === "positive"
                  ? "text-green-600"
                  : stat.changeType === "negative"
                  ? "text-red-600"
                  : "text-gray-600"
              }`}
            >
              {stat.changeType === "positive" ? (
                <IoMdTrendingUp size={28} className=" " />
              ) : stat.changeType === "negative" ? (
                <IoMdTrendingDown size={28} className=" " />
              ) : null}
              {stat.change}
            </div>
          </div>
          <div className=" flex flex-col gap-6">
            {/* ====== Label ====== */}
            <p className="text-sm md:text-base text-gray-600 mb-2">
              {stat.label}
            </p>

            {/* ====== Value ====== */}
            <p className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2  ">
              {stat.value}
            </p>

            {/* ====== Subtitle ====== */}
            <p className="text-xs md:text-sm text-gray-500">{stat.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
