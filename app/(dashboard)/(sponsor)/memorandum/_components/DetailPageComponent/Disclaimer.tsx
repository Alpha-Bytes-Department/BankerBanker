"use client";

import React from "react";
import PreviewSection from "./PreviewSection";
import { DisclaimerData } from "@/types/memorandum-detail";
import { FiAlertTriangle, FiLock, FiShield, FiFileText } from "react-icons/fi";

//========== Disclaimer Component ===========

interface DisclaimerProps {
  data: DisclaimerData;
}

const Disclaimer: React.FC<DisclaimerProps> = ({ data }) => {
  //========== Icon Mapping ===========
  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      lock: <FiLock className="w-6 h-6" />,
      shield: <FiShield className="w-6 h-6" />,
      file: <FiFileText className="w-6 h-6" />,
    };
    return iconMap[iconName] || <FiAlertTriangle className="w-6 h-6" />;
  };

  //========== Icon Color Mapping ===========
  const getIconColor = (iconName: string) => {
    const colorMap: { [key: string]: string } = {
      lock: "bg-blue-100 text-blue-600",
      shield: "bg-purple-100 text-purple-600",
      file: "bg-green-100 text-green-600",
    };
    return colorMap[iconName] || "bg-gray-100 text-gray-600";
  };

  return (
    <PreviewSection sectionNumber={13} title="Disclaimer & Disclosures">
      {/* ====== Important Notice Header ====== */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-0.5 w-12 bg-red-600"></div>
          <span className="text-red-600 text-xs uppercase tracking-wider">
            Important Notice
          </span>
        </div>
      </div>

      {/* ====== Main Disclaimer Box ====== */}
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 md:p-8 mb-6">
        {/* ====== Alert Icon ====== */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
            <FiAlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        </div>

        {/* ====== Disclaimer Notices ====== */}
        <div className="space-y-4">
          {data.mainNotices.map((notice, index) => (
            <div key={index}>
              <h4 className="text-base text-gray-900 mb-2">{notice.title}</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {notice.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ====== Information Cards Grid ====== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.cards.map((card) => (
          <div
            key={card.id}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            {/* ====== Card Icon ====== */}
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${getIconColor(
                card.icon
              )}`}
            >
              {getIcon(card.icon)}
            </div>

            {/* ====== Card Content ====== */}
            <h4 className="text-base text-gray-900 mb-2">{card.title}</h4>
            <p className="text-sm text-gray-600">{card.description}</p>
          </div>
        ))}
      </div>
    </PreviewSection>
  );
};

export default Disclaimer;
