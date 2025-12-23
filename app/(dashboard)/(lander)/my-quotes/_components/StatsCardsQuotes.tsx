"use client";

import React from "react";
import { QuoteStat } from "@/types/my-quotes";
import {
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiTrendingUp,
  FiDollarSign,
} from "react-icons/fi";

//========== Stats Cards Quotes Component ===========

interface StatsCardsQuotesProps {
  stats: QuoteStat[];
}

const StatsCardsQuotes: React.FC<StatsCardsQuotesProps> = ({ stats }) => {
  //========== Get Icon Component ===========
  const getIconComponent = (iconType: string) => {
    const iconMap = {
      file: FiFileText,
      clock: FiClock,
      check: FiCheckCircle,
      trending: FiTrendingUp,
      dollar: FiDollarSign,
    };
    const IconComponent = iconMap[iconType as keyof typeof iconMap];
    return IconComponent ? (
      <IconComponent className="w-5 h-5 md:w-6 md:h-6" />
    ) : null;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-4 md:mb-6">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className={`${stat.bgColor} rounded-xl p-3 md:p-4 border ${stat.borderColor} min-w-0`}
        >
          {/* ====== Icon ====== */}
          <div
            className={`${stat.iconColor} w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center mb-2 md:mb-3`}
          >
            {getIconComponent(stat.icon)}
          </div>

          {/* ====== Label ====== */}
          <p className="text-xs md:text-sm text-gray-600 mb-1">{stat.label}</p>

          {/* ====== Value ====== */}
          <p className="text-lg md:text-2xl font-semibold text-gray-900 break-words">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatsCardsQuotes;
