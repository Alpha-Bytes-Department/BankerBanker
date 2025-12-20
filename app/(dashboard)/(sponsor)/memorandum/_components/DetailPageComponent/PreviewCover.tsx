"use client";

import React from "react";
import { PreviewCoverProps } from "@/types/memorandum-detail";
import { FiLock } from "react-icons/fi";
import { MdDescription } from "react-icons/md";
import { AiOutlineHome } from "react-icons/ai";
import { BsCalendar, BsBuilding } from "react-icons/bs";
import { TbChartBar } from "react-icons/tb";

//========== Preview Cover Component ===========

const PreviewCover: React.FC<PreviewCoverProps> = ({
  presentedBy,
  confidential,
  investmentOpportunity,
  propertyName,
  location,
  stats,
  offeringDate,
}) => {
  return (
    <div className="relative bg-linear-to-br from-blue-600 via-blue-700 to-blue-900 rounded-2xl p-6 md:p-12 mb-6 min-h-[600px] md:min-h-[700px] flex flex-col justify-between overflow-hidden">
      {/* ====== Background Pattern Overlay ====== */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      {/* ====== Header Section ====== */}
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-4">
        {/* ====== Presented By ====== */}
        <div className="flex items-start gap-3 text-white">
          <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
            <MdDescription className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs md:text-sm text-blue-200">Presented by</p>
            <p className="text-sm md:text-base">{presentedBy}</p>
          </div>
        </div>

        {/* ====== Confidential Badge ====== */}
        {confidential && (
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <FiLock className="w-4 h-4 text-white" />
            <span className="text-white text-sm">Confidential</span>
          </div>
        )}
      </div>

      {/* ====== Main Content Section ====== */}
      <div className="relative z-10 space-y-8">
        {/* ====== Investment Opportunity Label ====== */}
        <div className="inline-block">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-0.5 w-12 bg-blue-300"></div>
            <span className="text-blue-200 text-xs md:text-sm uppercase tracking-wider">
              {investmentOpportunity}
            </span>
          </div>
        </div>

        {/* ====== Property Name ====== */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
          {propertyName}
        </h1>

        {/* ====== Location ====== */}
        <div className="flex items-center gap-2 text-white text-base md:text-lg">
          <AiOutlineHome className="w-5 h-5" />
          <span>{location}</span>
        </div>

        {/* ====== Property Stats Grid ====== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          {/* ====== Property Type ====== */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <AiOutlineHome className="w-5 h-5 text-blue-200" />
              <p className="text-blue-200 text-xs">Property Type</p>
            </div>
            <p className="text-white text-lg md:text-xl">
              {stats.propertyType}
            </p>
          </div>

          {/* ====== Units ====== */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <BsBuilding className="w-5 h-5 text-blue-200" />
              <p className="text-blue-200 text-xs">Units</p>
            </div>
            <p className="text-white text-lg md:text-xl">{stats.units}</p>
          </div>

          {/* ====== Year Built ====== */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <BsCalendar className="w-5 h-5 text-blue-200" />
              <p className="text-blue-200 text-xs">Year Built</p>
            </div>
            <p className="text-white text-lg md:text-xl">{stats.yearBuilt}</p>
          </div>

          {/* ====== Occupancy ====== */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <TbChartBar className="w-5 h-5 text-blue-200" />
              <p className="text-blue-200 text-xs">Occupancy</p>
            </div>
            <p className="text-white text-lg md:text-xl">{stats.occupancy}%</p>
          </div>
        </div>
      </div>

      {/* ====== Footer Section ====== */}
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 text-white text-xs md:text-sm">
        <p className="text-blue-200">Offering Memorandum | {offeringDate}</p>
        <p className="text-blue-200">FOR QUALIFIED INVESTORS ONLY</p>
      </div>
    </div>
  );
};

export default PreviewCover;
