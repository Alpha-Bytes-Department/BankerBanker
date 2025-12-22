"use client";

import React from "react";
import PreviewSection from "./PreviewSection";
import { LeaseComparablesData } from "@/types/memorandum-detail";
import { FiTrendingUp, FiDollarSign } from "react-icons/fi";
import { BsGraphUp } from "react-icons/bs";

//========== Lease Comparables Component ===========

interface LeaseComparablesProps {
  data: LeaseComparablesData;
}

const LeaseComparables: React.FC<LeaseComparablesProps> = ({ data }) => {
  return (
    <PreviewSection sectionNumber={10} title="Lease Comparables">
      {/* ====== Section Header ====== */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-0.5 w-12 bg-blue-600"></div>
          <span className="text-blue-600 text-xs uppercase tracking-wider">
            Rental Analysis
          </span>
        </div>
        <p className="text-sm text-gray-600">
          Recent comparable leases in the surrounding area
        </p>
      </div>

      {/* ====== Comparables Table ====== */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-left">#</th>
              <th className="border border-gray-300 px-3 py-2 text-left">
                Address
              </th>
              <th className="border border-gray-300 px-3 py-2 text-left">
                Unit Type
              </th>
              <th className="border border-gray-300 px-3 py-2 text-right">
                Square Feet
              </th>
              <th className="border border-gray-300 px-3 py-2 text-right">
                Monthly Rent
              </th>
              <th className="border border-gray-300 px-3 py-2 text-right">
                Rent/SF
              </th>
              <th className="border border-gray-300 px-3 py-2 text-left">
                Lease Date
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
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                    {comp.unitType}
                  </span>
                </td>
                <td className="border border-gray-300 px-3 py-2 text-right">
                  {comp.squareFeet.toLocaleString()} SF
                </td>
                <td className="border border-gray-300 px-3 py-2 text-right">
                  <span className="text-green-600">{comp.monthlyRent}</span>
                </td>
                <td className="border border-gray-300 px-3 py-2 text-right">
                  {comp.rentPsf}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {comp.leaseDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ====== Statistics Cards ====== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ====== Average Rent Card ====== */}
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiDollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <h4 className="text-sm text-gray-700">Average Rent</h4>
          </div>
          <p className="text-2xl md:text-3xl text-blue-600 mt-2">
            {data.stats.averageRent}
          </p>
        </div>

        {/* ====== Avg Rent/SF Card ====== */}
        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <BsGraphUp className="w-5 h-5 text-green-600" />
            </div>
            <h4 className="text-sm text-gray-700">Avg Rent/SF</h4>
          </div>
          <p className="text-2xl md:text-3xl text-green-600 mt-2">
            {data.stats.avgRentPsf}
          </p>
        </div>

        {/* ====== Market Trend Card ====== */}
        <div className="bg-purple-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FiTrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <h4 className="text-sm text-gray-700">Market Trend</h4>
          </div>
          <p className="text-2xl md:text-3xl text-purple-600 mt-2">
            {data.stats.marketTrend}
          </p>
        </div>
      </div>
    </PreviewSection>
  );
};

export default LeaseComparables;
