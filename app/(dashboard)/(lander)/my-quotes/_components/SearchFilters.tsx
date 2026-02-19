"use client";

import React from "react";
import { QuoteFilter } from "@/types/my-quotes";
import { FiSearch } from "react-icons/fi";

//========== Search Filters Component ===========

interface SearchFiltersProps {
  filters: QuoteFilter[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="mb-4 lg:h-16 md:mb-6 space-y-3 md:space-y-4 grid grid-cols-1 border border-gray-300 rounded-2xl p-2 md:grid-cols-2 lg:grid-cols-3 gap-4  ">
      {/* ====== Search Bar ====== */}
      <div className="relative col-span-2">
        <FiSearch className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
        <input
          type="text"
          placeholder="Search by property name, address, or sponsor..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py- bg-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
        />
      </div>

      {/* ====== Filter Buttons ====== */}
      <div className=" pt-1">
          <div className="flex  flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => onFilterChange(filter.id)}
                className={`px-3 md:px-4  py-1.5  rounded-lg text-xs md:text-sm font-medium transition-all ${
                  activeFilter === filter.id
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
      </div>
    </div>
  );
};

export default SearchFilters;
