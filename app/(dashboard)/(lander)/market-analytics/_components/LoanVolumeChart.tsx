"use client";

import React from "react";
import { LoanVolumeData } from "@/types/market-analytics";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

//========== Loan Volume Chart Component ===========

interface LoanVolumeChartProps {
  data: LoanVolumeData[];
}

const LoanVolumeChart: React.FC<LoanVolumeChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-200">
      {/* ====== Header ====== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <div>
          <h3 className="text-base md:text-lg font-medium text-gray-900">
            Loan Volume Trends
          </h3>
          <p className="text-xs md:text-sm text-gray-600">
            Monthly origination volume (Millions)
          </p>
        </div>
        <span className="text-xs md:text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full self-start sm:self-auto">
          Last 6 Months
        </span>
      </div>

      {/* ====== Chart ====== */}
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="month"
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
          <Area
            type="monotone"
            dataKey="volume"
            stroke="#3B82F6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorVolume)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LoanVolumeChart;
