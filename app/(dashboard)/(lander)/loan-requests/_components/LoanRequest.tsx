"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { LoanRequestData } from "@/types/loan-request";
import LoanRequestCard from "./LoanRequestCard";
import LoanRequestsMap from "./LoanRequestsMap";
import { FiRefreshCw } from "react-icons/fi";
import { toast } from "sonner";
import { fetchLenderCombinedData } from "../../_utils/lenderLoanData";
import {
  getSubmitQuotePath,
  saveLoanQuotePrefillState,
} from "@/lib/quote-submit-state";

//========== Loan Request Component ===========

const LoanRequest = () => {
  const router = useRouter();
  //========== State ===========
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loanRequests, setLoanRequests] = useState<LoanRequestData[]>([]);
  const cardRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const loadLoanRequests = useCallback(async (manualRefresh = false) => {
    if (manualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const { loanRequests: mergedLoanRequests } =
        await fetchLenderCombinedData();
      setLoanRequests(mergedLoanRequests);
    } catch (error) {
      console.error("Failed to load lender loan requests", error);
      toast.error("Unable to load loan requests right now.");
      setLoanRequests([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadLoanRequests();
  }, [loadLoanRequests]);

  const activeRequestsCount = useMemo(
    () => loanRequests.filter((request) => request.isActive).length,
    [loanRequests],
  );

  //========== Event Handlers ===========
  const handleRefresh = () => {
    loadLoanRequests(true);
  };

  const handleMarkerClick = (id: number) => {
    // Scroll to the corresponding card
    const cardElement = cardRefs.current[id];
    if (cardElement) {
      cardElement.scrollIntoView({ behavior: "smooth", block: "center" });
      // Add highlight animation
      cardElement.classList.add("ring-4", "ring-blue-500");
      setTimeout(() => {
        cardElement.classList.remove("ring-4", "ring-blue-500");
      }, 2000);
    }
  };

  const handleSubmitQuote = (id: number) => {
    const selectedRequest = loanRequests.find((request) => request.id === id);

    if (selectedRequest) {
      saveLoanQuotePrefillState(id, {
        requestId: selectedRequest.id,
        propertyName: selectedRequest.propertyName,
        propertyAddress: selectedRequest.address,
        propertyType: selectedRequest.propertyType,
        requestedAmount: selectedRequest.requestedAmount,
        loanTerm: Number(selectedRequest.loanTerm),
        ltv: selectedRequest.ltv,
        occupancy: selectedRequest.occupancy,
        yearBuilt: selectedRequest.yearBuilt,
        propertyImageUrl: selectedRequest.propertyImage,
      });
    }

    router.push(getSubmitQuotePath(id));
  };

  const handleViewDetails = (id: number) => {
    router.push(`/loan-requests/${id}`);
  };

  const handleViewDocuments = (id: number) => {
    router.push(`/loan-requests/${id}#documents`);
  };

  return (
    <div className="w-full pt-5 pb-16">
      {/* ====== Header Section ====== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl text-gray-900 mb-2">
            Loan Requests
          </h1>
          <p className="text-sm text-gray-600">
            All available loan opportunities
          </p>
        </div>

        {/* ====== Right Side: Count and Refresh Button ====== */}
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-lg">
            {activeRequestsCount} Active Requests
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <FiRefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* ====== Map Section ====== */}
      <div className="mb-6">
        {isLoading ? (
          <div className="h-[400px] md:h-[500px] rounded-lg border border-gray-200 bg-gray-50 animate-pulse" />
        ) : (
          <LoanRequestsMap
            loanRequests={loanRequests}
            onMarkerClick={handleMarkerClick}
          />
        )}
      </div>

      {/* ====== Loan Request Cards ====== */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, index) => (
            <div
              key={index}
              className="h-64 rounded-lg border border-gray-200 bg-gray-50 animate-pulse"
            />
          ))}
        </div>
      ) : loanRequests.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-600">
          No loan requests available.
        </div>
      ) : (
        <div className="space-y-6">
          {loanRequests.map((request) => (
            <div
              key={request.id}
              ref={(el) => {
                cardRefs.current[request.id] = el;
              }}
              className="transition-all duration-300"
            >
              <LoanRequestCard
                loanRequest={request}
                onSubmitQuote={handleSubmitQuote}
                onViewDetails={handleViewDetails}
                onViewDocuments={handleViewDocuments}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LoanRequest;
