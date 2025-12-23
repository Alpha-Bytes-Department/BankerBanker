"use client";

import React from "react";
import { TopMarket } from "@/types/market-analytics";
import { FiMapPin, FiArrowUp, FiArrowDown } from "react-icons/fi";

//========== Top Markets List Component ===========

interface TopMarketsListProps {
  markets: TopMarket[];
}

const TopMarketsList: React.FC<TopMarketsListProps> = ({ markets }) => {
  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-200 mx-3 md:mx-0">
      {/* ====== Header ====== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
        <div>
          <h3 className="text-base md:text-lg font-medium text-gray-900">
            Top Markets
          </h3>
          <p className="text-xs md:text-sm text-gray-600">
            By loan volume and deal count
          </p>
        </div>
        <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 self-start sm:self-auto">
          <FiMapPin className="w-4 h-4" />
          View Map
        </button>
      </div>

      {/* ====== Markets List ====== */}
      <div className="space-y-3 md:space-y-4">
        {markets.map((market) => (
          <div
            key={market.id}
            className="flex items-center gap-3 md:gap-4 p-3 md:p-4 hover:bg-gray-50 rounded-xl transition-colors min-w-0"
          >
            {/* ====== Rank Badge ====== */}
            <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-sm md:text-base font-semibold text-white">
                #{market.rank}
              </span>
            </div>

            {/* ====== Market Info ====== */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm md:text-base font-medium text-gray-900 truncate">
                {market.city}, {market.state}
              </h4>
              <p className="text-xs md:text-sm text-gray-600">
                {market.deals} deals • {market.volume} volume
              </p>
            </div>

            {/* ====== Change Badge ====== */}
            <div
              className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium ${
                market.changeType === "positive"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {market.changeType === "positive" ? (
                <FiArrowUp className="w-3 h-3 md:w-4 md:h-4" />
              ) : (
                <FiArrowDown className="w-3 h-3 md:w-4 md:h-4" />
              )}
              {market.change}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopMarketsList;
