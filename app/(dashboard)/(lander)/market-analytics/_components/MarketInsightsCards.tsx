"use client";

import React from "react";
import { MarketInsight } from "@/types/market-analytics";
import { FiTrendingUp, FiBarChart2, FiMapPin } from "react-icons/fi";

//========== Market Insights Cards Component ===========

interface MarketInsightsCardsProps {
  insights: MarketInsight[];
}

const MarketInsightsCards: React.FC<MarketInsightsCardsProps> = ({
  insights,
}) => {
  //========== Get Icon Component ===========
  const getIconComponent = (iconType: string) => {
    const iconMap = {
      trending: FiTrendingUp,
      chart: FiBarChart2,
      location: FiMapPin,
    };
    const IconComponent = iconMap[iconType as keyof typeof iconMap];
    return IconComponent ? <IconComponent className="w-6 h-6" /> : null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mx-3 md:mx-0 pb-6">
      {insights.map((insight) => (
        <div
          key={insight.id}
          className={`${insight.bgColor} rounded-2xl p-4 md:p-6 border-2 ${insight.borderColor}`}
        >
          <div className="flex items-start gap-3 md:gap-4">
            {/* ====== Icon ====== */}
            <div className={`shrink-0 ${insight.iconColor}`}>
              {getIconComponent(insight.icon)}
            </div>

            {/* ====== Content ====== */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm md:text-base font-medium text-gray-900 mb-2">
                {insight.title}
              </h4>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                {insight.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MarketInsightsCards;
