"use client";

import React from "react";
import Image from "next/image";
import PreviewSection from "./PreviewSection";
import { SalesComparablesData } from "@/types/memorandum-detail";

//========== Sales Comparables Component ===========

interface SalesComparablesProps {
  data: SalesComparablesData;
}

const SalesComparables: React.FC<SalesComparablesProps> = ({ data }) => {
  return (
    <PreviewSection sectionNumber={9} title="Sales Comparables">
      {/* ====== Section Header ====== */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-0.5 w-12 bg-blue-600"></div>
          <span className="text-blue-600 text-xs uppercase tracking-wider">
            Market Analysis
          </span>
        </div>
        <p className="text-sm text-gray-600">
          Comparable sales data sourced from public records and MLS databases
        </p>
      </div>

      {/* ====== Map Visualization ====== */}
      <div className="mb-6 relative h-64 md:h-80 rounded-lg overflow-hidden">
        <Image
          src={data.mapImage}
          alt="Sales Comparables Map"
          fill
          className="object-cover"
        />
        {/* ====== Map Overlay Markers ====== */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg">
            Subject Property
          </div>
        </div>
      </div>

      {/* ====== Comparables Table ====== */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-left">#</th>
              <th className="border border-gray-300 px-3 py-2 text-left">
                Address
              </th>
              <th className="border border-gray-300 px-3 py-2 text-left">
                Sale Date
              </th>
              <th className="border border-gray-300 px-3 py-2 text-right">
                Sale Price
              </th>
              <th className="border border-gray-300 px-3 py-2 text-right">
                Price/Unit
              </th>
              <th className="border border-gray-300 px-3 py-2 text-right">
                Units
              </th>
              <th className="border border-gray-300 px-3 py-2 text-right">
                Year Built
              </th>
              <th className="border border-gray-300 px-3 py-2 text-right">
                Square Feet
              </th>
              <th className="border border-gray-300 px-3 py-2 text-right">
                Cap Rate
              </th>
            </tr>
          </thead>
          <tbody>
            {data.comparables.map((comp, index) => (
              <tr
                key={comp.id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="border border-gray-300 px-3 py-2">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">
                    {comp.id}
                  </div>
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {comp.address}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {comp.saleDate}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-right">
                  <span className="text-green-600">{comp.salePrice}</span>
                </td>
                <td className="border border-gray-300 px-3 py-2 text-right">
                  {comp.priceUnit}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-right">
                  {comp.units}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-right">
                  {comp.yearBuilt}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-right">
                  {comp.squareFeet.toLocaleString()}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-right">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                    {comp.capRate}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PreviewSection>
  );
};

export default SalesComparables;
