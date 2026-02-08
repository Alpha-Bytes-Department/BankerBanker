"use client";

import React from "react";
import PDFSection from "./PDFSection";
import { SalesComparablesData } from "@/types/memorandum-detail";

/* ========================================
   SALES COMPARABLES — Print-Optimized
   ========================================
   Image + table on one page.
   Table: max 8 columns (#, Address, Date, Price, $/Unit, Units, YrBuilt, Cap).
   Image uses inline style for print background visibility.
======================================== */

interface PDFSalesComparablesProps {
  data: SalesComparablesData;
}

const PDFSalesComparables: React.FC<PDFSalesComparablesProps> = ({ data }) => {
  return (
    <PDFSection sectionNumber={8} title="Sales Comparables">
      <p className="text-[10px] text-gray-500 mb-3">
        Comparable sales data sourced from public records and MLS databases
      </p>

      {/* Map image — inline background for print */}
      <div
        className="w-full rounded-md mb-4 print-avoid-break"
        style={
          {
            height: "180px",
            backgroundImage: `url(${data.mapImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
          } as React.CSSProperties
        }
      >
        <div className="flex items-center justify-center h-full">
          <span
            className="text-white text-[10px] font-semibold px-3 py-1 rounded-full"
            style={{ backgroundColor: "#7C3AED" }}
          >
            Subject Property
          </span>
        </div>
      </div>

      {/* 8-column table */}
      <div className="print-avoid-break">
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
                Sale Date
              </th>
              <th
                className="px-2 py-2 text-right font-semibold"
                style={{ border: "1px solid #D1D5DB" }}
              >
                Sale Price
              </th>
              <th
                className="px-2 py-2 text-right font-semibold"
                style={{ border: "1px solid #D1D5DB" }}
              >
                $/Unit
              </th>
              <th
                className="px-2 py-2 text-right font-semibold"
                style={{ border: "1px solid #D1D5DB" }}
              >
                Units
              </th>
              <th
                className="px-2 py-2 text-right font-semibold"
                style={{ border: "1px solid #D1D5DB" }}
              >
                Year Built
              </th>
              <th
                className="px-2 py-2 text-right font-semibold"
                style={{ border: "1px solid #D1D5DB" }}
              >
                Cap Rate
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
                  {c.saleDate}
                </td>
                <td
                  className="px-2 py-[5px] text-right"
                  style={{ border: "1px solid #E5E7EB", color: "#16A34A" }}
                >
                  {c.salePrice}
                </td>
                <td
                  className="px-2 py-[5px] text-right"
                  style={{ border: "1px solid #E5E7EB" }}
                >
                  {c.priceUnit}
                </td>
                <td
                  className="px-2 py-[5px] text-right"
                  style={{ border: "1px solid #E5E7EB" }}
                >
                  {c.units}
                </td>
                <td
                  className="px-2 py-[5px] text-right"
                  style={{ border: "1px solid #E5E7EB" }}
                >
                  {c.yearBuilt}
                </td>
                <td
                  className="px-2 py-[5px] text-right"
                  style={{ border: "1px solid #E5E7EB" }}
                >
                  <span
                    className="px-1 py-[2px] rounded text-[8px]"
                    style={{ backgroundColor: "#DBEAFE", color: "#1D4ED8" }}
                  >
                    {c.capRate}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PDFSection>
  );
};

export default PDFSalesComparables;
