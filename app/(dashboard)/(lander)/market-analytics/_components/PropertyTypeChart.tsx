"use client";

import React from "react";
import { PropertyTypeData } from "@/types/market-analytics";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

//========== Property Type Chart Component ===========

interface PropertyTypeChartProps {
  data: PropertyTypeData[];
}

const PropertyTypeChart: React.FC<PropertyTypeChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-200">
      {/* ====== Header ====== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <div>
          <h3 className="text-base md:text-lg font-medium text-gray-900">
            Property Type Distribution
          </h3>
          <p className="text-xs md:text-sm text-gray-600">By loan count</p>
        </div>
        <span className="text-xs md:text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full self-start sm:self-auto">
          119 Total Deals
        </span>
      </div>

      {/* ====== Chart and Legend ====== */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data as any}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        {/* ====== Legend ====== */}
        <div className="flex flex-col gap-3 w-full md:w-auto">
          {data.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-xs md:text-sm text-gray-700">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm md:text-base font-semibold text-gray-900">
                  {item.value}
                </span>
                <span className="text-xs text-gray-500">
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyTypeChart;
