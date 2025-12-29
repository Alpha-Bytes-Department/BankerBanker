"use client";

import React from "react";
import { InterestRateData } from "@/types/market-analytics";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

//========== Interest Rate Chart Component ===========

interface InterestRateChartProps {
  data: InterestRateData[];
}

const InterestRateChart: React.FC<InterestRateChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-200">
      {/* ====== Header ====== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <div>
          <h3 className="text-base md:text-lg font-medium text-gray-900">
            Interest Rate Trends
          </h3>
          <p className="text-xs md:text-sm text-gray-600">
            Average, high, and low rates (%)
          </p>
        </div>
        <span className="text-xs md:text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full self-start sm:self-auto">
          SOFR + Spread
        </span>
      </div>

      {/* ====== Chart ====== */}
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="month"
            stroke="#6B7280"
            style={{ fontSize: "12px" }}
          />
          <YAxis
            stroke="#6B7280"
            style={{ fontSize: "12px" }}
            domain={[3, 5]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px" }} iconType="circle" />
          <Line
            type="monotone"
            dataKey="average"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ r: 4 }}
            name="Average"
          />
          <Line
            type="monotone"
            dataKey="high"
            stroke="#EF4444"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 4 }}
            name="High"
          />
          <Line
            type="monotone"
            dataKey="low"
            stroke="#10B981"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 4 }}
            name="Low"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InterestRateChart;
