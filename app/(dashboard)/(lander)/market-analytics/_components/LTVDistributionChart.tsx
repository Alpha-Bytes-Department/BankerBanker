"use client";

import React from "react";
import { LtvDistributionData } from "@/types/market-analytics";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

//========== LTV Distribution Chart Component ===========

interface LTVDistributionChartProps {
  data: LtvDistributionData[];
}

const LTVDistributionChart: React.FC<LTVDistributionChartProps> = ({
  data,
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-200">
      {/* ====== Header ====== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <div>
          <h3 className="text-base md:text-lg font-medium text-gray-900">
            LTV Distribution
          </h3>
          <p className="text-xs md:text-sm text-gray-600">
            Loan-to-Value ratio breakdown
          </p>
        </div>
        <span className="text-xs md:text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full self-start sm:self-auto">
          Current Portfolio
        </span>
      </div>

      {/* ====== Chart ====== */}
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="range"
            stroke="#6B7280"
            style={{ fontSize: "12px" }}
          />
          <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
            }}
          />
          <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LTVDistributionChart;
