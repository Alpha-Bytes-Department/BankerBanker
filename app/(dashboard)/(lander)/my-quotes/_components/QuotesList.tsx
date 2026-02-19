"use client";

import React from "react";
import { Quote, QuoteFilter } from "@/types/my-quotes";
import SearchFilters from "./SearchFilters";
import QuoteCard from "./QuoteCard";

//========== Quotes List Component ===========

interface QuotesListProps {
  quotes: Quote[];
  filters: QuoteFilter[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const QuotesList: React.FC<QuotesListProps> = ({
  quotes,
  filters,
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div>
      {/* ====== Search and Filters ====== */}
      <SearchFilters
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />

      {/* ====== Quotes List ====== */}
      <div className="space-y-4">
        {quotes.length > 0 ? (
          quotes.map((quote) => <QuoteCard key={quote.id} quote={quote} />)
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12 text-center">
            <p className="text-gray-500 text-sm md:text-base">
              No quotes found matching your criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuotesList;
