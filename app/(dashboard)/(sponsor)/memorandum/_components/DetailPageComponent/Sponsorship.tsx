"use client";

import React from "react";
import PreviewSection from "./PreviewSection";
import { SponsorshipData } from "@/types/memorandum-detail";
import { MdDescription } from "react-icons/md";

//========== Sponsorship Component ===========

interface SponsorshipProps {
  data: SponsorshipData;
}

const Sponsorship: React.FC<SponsorshipProps> = ({ data }) => {
  return (
    <PreviewSection sectionNumber={12} title="Sponsorship">
      {/* ====== Section Header ====== */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-0.5 w-12 bg-blue-600"></div>
          <span className="text-blue-600 text-xs uppercase tracking-wider">
            Team
          </span>
        </div>
      </div>

      {/* ====== Sponsor Card ====== */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8">
        {/* ====== Logo and Company Name ====== */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <MdDescription className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl text-gray-900">
              {data.companyName}
            </h3>
            <p className="text-sm text-gray-600">{data.description}</p>
          </div>
        </div>

        {/* ====== Statistics Grid ====== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* ====== Total Assets ====== */}
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <p className="text-3xl md:text-4xl text-blue-600 mb-2">
              {data.totalAssets}
            </p>
            <p className="text-sm text-gray-700">
              Total Assets
              <br />
              Under
              <br />
              Management
            </p>
          </div>

          {/* ====== Properties Managed ====== */}
          <div className="bg-green-50 rounded-lg p-6 text-center">
            <p className="text-3xl md:text-4xl text-green-600 mb-2">
              {data.propertiesManaged}
            </p>
            <p className="text-sm text-gray-700">Properties Managed</p>
          </div>

          {/* ====== Year Established ====== */}
          <div className="bg-purple-50 rounded-lg p-6 text-center">
            <p className="text-3xl md:text-4xl text-purple-600 mb-2">
              {data.yearEstablished}
            </p>
            <p className="text-sm text-gray-700">Year Established</p>
          </div>
        </div>
      </div>
    </PreviewSection>
  );
};

export default Sponsorship;
