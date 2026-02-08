"use client";

import React from "react";
import PDFSection from "./PDFSection";
import { LeaseComparablesData } from "@/types/memorandum-detail";

/* ========================================
   LEASE COMPARABLES — Print-Optimized
   ========================================
   Table (7 cols) + stat cards in flex row on one page.
======================================== */

interface PDFLeaseComparablesProps {
  data: LeaseComparablesData;
}

const PDFLeaseComparables: React.FC<PDFLeaseComparablesProps> = ({ data }) => {
  return (
    <PDFSection sectionNumber={9} title="Lease Comparables">
      <p className="text-[10px] text-gray-500 mb-3">
        Recent comparable leases in the surrounding area
      </p>

      {/* Table — 7 columns */}
      <div className="print-avoid-break mb-5">
        <table
          className="w-full text-[9px]"
          style={{ borderCollapse: "collapse" }}
        >
          <thead>
            <tr style={{ backgroundColor: "#F3F4F6" }}>
              <th
                className="px-2 py-2 text-left font-semibold"
                style={{ border: "1px solid #D1D5DB" }}
              >
                #
              </th>
              <th
                className="px-2 py-2 text-left font-semibold"
                style={{ border: "1px solid #D1D5DB" }}
              >
                Address
              </th>
              <th
                className="px-2 py-2 text-left font-semibold"
                style={{ border: "1px solid #D1D5DB" }}
              >
                Unit Type
              </th>
              <th
                className="px-2 py-2 text-right font-semibold"
                style={{ border: "1px solid #D1D5DB" }}
              >
                Sq Ft
              </th>
              <th
                className="px-2 py-2 text-right font-semibold"
                style={{ border: "1px solid #D1D5DB" }}
              >
                Monthly Rent
              </th>
              <th
                className="px-2 py-2 text-right font-semibold"
                style={{ border: "1px solid #D1D5DB" }}
              >
                Rent/SF
              </th>
              <th
                className="px-2 py-2 text-left font-semibold"
                style={{ border: "1px solid #D1D5DB" }}
              >
                Lease Date
              </th>
            </tr>
          </thead>
          <tbody>
            {data.comparables.map((c, i) => (
              <tr
                key={c.id}
                style={{ backgroundColor: i % 2 === 0 ? "#FFF" : "#F9FAFB" }}
              >
                <td
                  className="px-2 py-[5px]"
                  style={{ border: "1px solid #E5E7EB" }}
                >
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[8px] font-bold"
                    style={{ backgroundColor: "#DBEAFE", color: "#0D4DA5" }}
                  >
                    {c.id}
                  </span>
                </td>
                <td
                  className="px-2 py-[5px]"
                  style={{ border: "1px solid #E5E7EB" }}
                >
                  {c.address}
                </td>
                <td
                  className="px-2 py-[5px]"
                  style={{ border: "1px solid #E5E7EB" }}
                >
                  <span
                    className="px-1 py-[1px] rounded text-[8px]"
                    style={{ backgroundColor: "#F3F4F6" }}
                  >
                    {c.unitType}
                  </span>
                </td>
                <td
                  className="px-2 py-[5px] text-right"
                  style={{ border: "1px solid #E5E7EB" }}
                >
                  {c.squareFeet.toLocaleString()} SF
                </td>
                <td
                  className="px-2 py-[5px] text-right"
                  style={{ border: "1px solid #E5E7EB", color: "#16A34A" }}
                >
                  {c.monthlyRent}
                </td>
                <td
                  className="px-2 py-[5px] text-right"
                  style={{ border: "1px solid #E5E7EB" }}
                >
                  {c.rentPsf}
                </td>
                <td
                  className="px-2 py-[5px]"
                  style={{ border: "1px solid #E5E7EB" }}
                >
                  {c.leaseDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stat cards — flex row */}
      <div className="flex gap-4 print-avoid-break">
        <div
          className="flex-1 rounded-md px-4 py-4 text-center"
          style={{ backgroundColor: "#EFF6FF" }}
        >
          <p className="text-[10px] text-gray-500 mb-1">Average Rent</p>
          <p className="text-lg font-bold" style={{ color: "#0D4DA5" }}>
            {data.stats.averageRent}
          </p>
        </div>
        <div
          className="flex-1 rounded-md px-4 py-4 text-center"
          style={{ backgroundColor: "#F0FDF4" }}
        >
          <p className="text-[10px] text-gray-500 mb-1">Avg Rent/SF</p>
          <p className="text-lg font-bold" style={{ color: "#16A34A" }}>
            {data.stats.avgRentPsf}
          </p>
        </div>
        <div
          className="flex-1 rounded-md px-4 py-4 text-center"
          style={{ backgroundColor: "#FAF5FF" }}
        >
          <p className="text-[10px] text-gray-500 mb-1">Market Trend</p>
          <p className="text-lg font-bold" style={{ color: "#7C3AED" }}>
            {data.stats.marketTrend}
          </p>
        </div>
      </div>
    </PDFSection>
  );
};

export default PDFLeaseComparables;
