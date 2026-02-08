"use client";

import React from "react";
import PDFSection from "./PDFSection";
import { FinancialAnalysisData } from "@/types/memorandum-detail";

/* ========================================
   FINANCIAL ANALYSIS — Print-Optimized
   ========================================
   Split across multiple pages:
     Page 1: Loan Quote Matrix (max 8 cols)
     Page 2: Loan Request + Property Details (side-by-side cards)
     Page 3: Sources & Uses (side-by-side tables)
     Page 4: Financial Performance (max 8 cols)
======================================== */

interface PDFFinancialAnalysisProps {
  data: FinancialAnalysisData;
}

const PDFFinancialAnalysis: React.FC<PDFFinancialAnalysisProps> = ({
  data,
}) => {
  return (
    <>
      {/* ====== PAGE: Loan Quote Matrix ====== */}
      <PDFSection
        sectionNumber={7}
        title="Financial Analysis — Loan Quote Matrix"
      >
        <div className="mb-3">
          <p className="text-[10px] text-gray-500 mb-3">
            Permanent Financing Quote Matrix
          </p>
        </div>

        {/* Max 8 columns: Lender, Leverage, DSCR, Amort, Rate, Index+Spread, Orig Fee, Prepay */}
        <div className="print-avoid-break">
          <table
            className="w-full text-[9px] leading-tight"
            style={{ borderCollapse: "collapse" }}
          >
            <thead>
              <tr style={{ backgroundColor: "#F3F4F6" }}>
                <th
                  className="px-2 py-2 text-left font-semibold text-gray-700"
                  style={{ border: "1px solid #D1D5DB" }}
                >
                  Lender
                </th>
                <th
                  className="px-2 py-2 text-right font-semibold text-gray-700"
                  style={{ border: "1px solid #D1D5DB" }}
                >
                  Leverage
                </th>
                <th
                  className="px-2 py-2 text-right font-semibold text-gray-700"
                  style={{ border: "1px solid #D1D5DB" }}
                >
                  DSCR
                </th>
                <th
                  className="px-2 py-2 text-left font-semibold text-gray-700"
                  style={{ border: "1px solid #D1D5DB" }}
                >
                  Amortization
                </th>
                <th
                  className="px-2 py-2 text-right font-semibold text-gray-700"
                  style={{ border: "1px solid #D1D5DB" }}
                >
                  Rate
                </th>
                <th
                  className="px-2 py-2 text-right font-semibold text-gray-700"
                  style={{ border: "1px solid #D1D5DB" }}
                >
                  Index+Spread
                </th>
                <th
                  className="px-2 py-2 text-right font-semibold text-gray-700"
                  style={{ border: "1px solid #D1D5DB" }}
                >
                  Orig Fee
                </th>
                <th
                  className="px-2 py-2 text-center font-semibold text-gray-700"
                  style={{ border: "1px solid #D1D5DB" }}
                >
                  Prepay
                </th>
              </tr>
            </thead>
            <tbody>
              {data.loanQuotes.map((q, i) => (
                <tr
                  key={i}
                  style={{
                    backgroundColor: i % 2 === 0 ? "#FFFFFF" : "#F9FAFB",
                  }}
                >
                  <td
                    className="px-2 py-[5px] text-gray-800"
                    style={{ border: "1px solid #E5E7EB" }}
                  >
                    {q.lender}
                  </td>
                  <td
                    className="px-2 py-[5px] text-right"
                    style={{ border: "1px solid #E5E7EB" }}
                  >
                    {q.leverage}
                  </td>
                  <td
                    className="px-2 py-[5px] text-right"
                    style={{ border: "1px solid #E5E7EB" }}
                  >
                    {q.dscr}
                  </td>
                  <td
                    className="px-2 py-[5px]"
                    style={{ border: "1px solid #E5E7EB" }}
                  >
                    {q.amortization}
                  </td>
                  <td
                    className="px-2 py-[5px] text-right"
                    style={{ border: "1px solid #E5E7EB" }}
                  >
                    {q.rate}
                  </td>
                  <td
                    className="px-2 py-[5px] text-right"
                    style={{ border: "1px solid #E5E7EB" }}
                  >
                    {q.indexSpread}
                  </td>
                  <td
                    className="px-2 py-[5px] text-right"
                    style={{ border: "1px solid #E5E7EB" }}
                  >
                    {q.originationFee}
                  </td>
                  <td
                    className="px-2 py-[5px] text-center"
                    style={{ border: "1px solid #E5E7EB" }}
                  >
                    {q.prepayment}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.loanRatingNote && (
          <p className="mt-3 text-[9px] text-gray-500 italic">
            {data.loanRatingNote}
          </p>
        )}
      </PDFSection>

      {/* ====== PAGE: Loan Request + Property Details ====== */}
      <PDFSection
        sectionNumber={7}
        title="Financial Analysis — Loan Request & Property"
      >
        <div className="flex gap-5 print-avoid-break">
          {/* Loan Request Card */}
          <div
            className="flex-1 rounded-md px-4 py-4"
            style={{ backgroundColor: "#EFF6FF" }}
          >
            <h4 className="text-xs font-semibold text-gray-900 mb-3">
              Loan Request
            </h4>
            <div className="space-y-[6px]">
              {Object.entries(data.loanRequest).map(([key, val]) => (
                <div
                  key={key}
                  className="flex justify-between text-[10px]"
                  style={{ borderBottom: "1px solid #BFDBFE" }}
                >
                  <span className="text-gray-600 py-1 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <span className="text-gray-900 font-medium py-1">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Property Details Card */}
          <div
            className="flex-1 rounded-md px-4 py-4"
            style={{ backgroundColor: "#F0FDF4" }}
          >
            <h4 className="text-xs font-semibold text-gray-900 mb-3">
              Property Details
            </h4>
            <div className="space-y-[6px]">
              {Object.entries(data.propertyDetails).map(([key, val]) => (
                <div
                  key={key}
                  className="flex justify-between text-[10px]"
                  style={{ borderBottom: "1px solid #BBF7D0" }}
                >
                  <span className="text-gray-600 py-1 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <span className="text-gray-900 font-medium py-1">
                    {val || "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PDFSection>

      {/* ====== PAGE: Sources & Uses ====== */}
      <PDFSection sectionNumber={7} title="Financial Analysis — Sources & Uses">
        <div className="flex gap-5 print-avoid-break">
          {/* Sources */}
          <div className="flex-1">
            <h4 className="text-xs font-semibold text-gray-900 mb-2">
              Sources
            </h4>
            <table
              className="w-full text-[9px]"
              style={{ borderCollapse: "collapse" }}
            >
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th
                    className="px-2 py-1 text-left font-semibold"
                    style={{ border: "1px solid #D1D5DB" }}
                  >
                    Source
                  </th>
                  <th
                    className="px-2 py-1 text-right font-semibold"
                    style={{ border: "1px solid #D1D5DB" }}
                  >
                    Amount
                  </th>
                  <th
                    className="px-2 py-1 text-right font-semibold"
                    style={{ border: "1px solid #D1D5DB" }}
                  >
                    PSF
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.sources.map((s, i) => (
                  <tr
                    key={i}
                    style={{
                      backgroundColor: i % 2 === 0 ? "#FFF" : "#F9FAFB",
                    }}
                  >
                    <td
                      className="px-2 py-1"
                      style={{ border: "1px solid #E5E7EB" }}
                    >
                      {s.source}
                    </td>
                    <td
                      className="px-2 py-1 text-right"
                      style={{ border: "1px solid #E5E7EB" }}
                    >
                      {s.amount}
                    </td>
                    <td
                      className="px-2 py-1 text-right"
                      style={{ border: "1px solid #E5E7EB" }}
                    >
                      {s.psf}
                    </td>
                  </tr>
                ))}
                <tr style={{ backgroundColor: "#E5E7EB" }}>
                  <td
                    className="px-2 py-1 font-bold"
                    style={{ border: "1px solid #D1D5DB" }}
                  >
                    Total
                  </td>
                  <td
                    className="px-2 py-1 text-right font-bold"
                    style={{ border: "1px solid #D1D5DB" }}
                  >
                    {data.totalSources}
                  </td>
                  <td
                    className="px-2 py-1 text-right font-bold"
                    style={{ border: "1px solid #D1D5DB" }}
                  >
                    —
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Uses */}
          <div className="flex-1">
            <h4 className="text-xs font-semibold text-gray-900 mb-2">Uses</h4>
            <table
              className="w-full text-[9px]"
              style={{ borderCollapse: "collapse" }}
            >
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th
                    className="px-2 py-1 text-left font-semibold"
                    style={{ border: "1px solid #D1D5DB" }}
                  >
                    Use
                  </th>
                  <th
                    className="px-2 py-1 text-right font-semibold"
                    style={{ border: "1px solid #D1D5DB" }}
                  >
                    Amount
                  </th>
                  <th
                    className="px-2 py-1 text-right font-semibold"
                    style={{ border: "1px solid #D1D5DB" }}
                  >
                    PSF
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.uses.map((u, i) => (
                  <tr
                    key={i}
                    style={{
                      backgroundColor: i % 2 === 0 ? "#FFF" : "#F9FAFB",
                    }}
                  >
                    <td
                      className="px-2 py-1"
                      style={{ border: "1px solid #E5E7EB" }}
                    >
                      {u.use}
                    </td>
                    <td
                      className="px-2 py-1 text-right"
                      style={{ border: "1px solid #E5E7EB" }}
                    >
                      {u.amount}
                    </td>
                    <td
                      className="px-2 py-1 text-right"
                      style={{ border: "1px solid #E5E7EB" }}
                    >
                      {u.psf}
                    </td>
                  </tr>
                ))}
                <tr style={{ backgroundColor: "#E5E7EB" }}>
                  <td
                    className="px-2 py-1 font-bold"
                    style={{ border: "1px solid #D1D5DB" }}
                  >
                    Total
                  </td>
                  <td
                    className="px-2 py-1 text-right font-bold"
                    style={{ border: "1px solid #D1D5DB" }}
                  >
                    {data.totalUses}
                  </td>
                  <td
                    className="px-2 py-1 text-right font-bold"
                    style={{ border: "1px solid #D1D5DB" }}
                  >
                    —
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </PDFSection>

      {/* ====== PAGE: Financial Performance ====== */}
      <PDFSection sectionNumber={7} title="Financial Analysis — Performance">
        <div className="print-avoid-break">
          {/* 8-column table: Category, Trailing12, Date, %, Underwriting, In-Place, %, $PSF */}
          <table
            className="w-full text-[9px] leading-tight"
            style={{ borderCollapse: "collapse" }}
          >
            <thead>
              <tr style={{ backgroundColor: "#F3F4F6" }}>
                <th
                  className="px-2 py-2 text-left font-semibold"
                  style={{ border: "1px solid #D1D5DB" }}
                >
                  Category
                </th>
                <th
                  className="px-2 py-2 text-right font-semibold"
                  style={{ border: "1px solid #D1D5DB" }}
                >
                  Trailing 12
                </th>
                <th
                  className="px-2 py-2 text-right font-semibold"
                  style={{ border: "1px solid #D1D5DB" }}
                >
                  Date
                </th>
                <th
                  className="px-2 py-2 text-right font-semibold"
                  style={{ border: "1px solid #D1D5DB" }}
                >
                  %
                </th>
                <th
                  className="px-2 py-2 text-right font-semibold"
                  style={{ border: "1px solid #D1D5DB" }}
                >
                  Underwriting
                </th>
                <th
                  className="px-2 py-2 text-right font-semibold"
                  style={{ border: "1px solid #D1D5DB" }}
                >
                  In-Place
                </th>
                <th
                  className="px-2 py-2 text-right font-semibold"
                  style={{ border: "1px solid #D1D5DB" }}
                >
                  %
                </th>
                <th
                  className="px-2 py-2 text-right font-semibold"
                  style={{ border: "1px solid #D1D5DB" }}
                >
                  $ PSF
                </th>
              </tr>
            </thead>
            <tbody>
              {data.financialPerformance.map((row, i) => (
                <tr
                  key={i}
                  style={{ backgroundColor: i % 2 === 0 ? "#FFF" : "#F9FAFB" }}
                >
                  <td
                    className="px-2 py-[4px] font-medium text-gray-800"
                    style={{ border: "1px solid #E5E7EB" }}
                  >
                    {row.category}
                  </td>
                  <td
                    className="px-2 py-[4px] text-right"
                    style={{ border: "1px solid #E5E7EB" }}
                  >
                    {row.trailing12 || "—"}
                  </td>
                  <td
                    className="px-2 py-[4px] text-right"
                    style={{ border: "1px solid #E5E7EB" }}
                  >
                    {row.date || "—"}
                  </td>
                  <td
                    className="px-2 py-[4px] text-right"
                    style={{ border: "1px solid #E5E7EB" }}
                  >
                    {row.percentage || "—"}
                  </td>
                  <td
                    className="px-2 py-[4px] text-right"
                    style={{ border: "1px solid #E5E7EB" }}
                  >
                    {row.underwriting || "—"}
                  </td>
                  <td
                    className="px-2 py-[4px] text-right"
                    style={{ border: "1px solid #E5E7EB" }}
                  >
                    {row.inPlace || "—"}
                  </td>
                  <td
                    className="px-2 py-[4px] text-right"
                    style={{ border: "1px solid #E5E7EB" }}
                  >
                    {row.percentage || "—"}
                  </td>
                  <td
                    className="px-2 py-[4px] text-right"
                    style={{ border: "1px solid #E5E7EB" }}
                  >
                    {row.psf || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-[9px] text-gray-500 italic">
          * Based on an assumption of a 9.5% mortgage interest rate and interest
          only
        </p>
      </PDFSection>
    </>
  );
};

export default PDFFinancialAnalysis;
