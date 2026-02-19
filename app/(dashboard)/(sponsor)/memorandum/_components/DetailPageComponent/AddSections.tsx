"use client";

import React, { useState } from "react";
import { AddSectionsProps } from "@/types/memorandum-detail";
import { FiPlus } from "react-icons/fi";
import SectionForm from "./SectionForm";

//========== Add Sections Component ===========

const AddSections: React.FC<AddSectionsProps> = ({
  sections,
  onAddSection,
}) => {
  //========== State ===========
  const [showForm, setShowForm] = useState(false);
  const [selectedSectionType, setSelectedSectionType] = useState<string>("");

  //========== Handlers ===========
  const handleButtonClick = (sectionId: string, sectionLabel: string) => {
    setSelectedSectionType(sectionLabel);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedSectionType("");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6 mb-6">
      {/* ====== Header ====== */}
      <h3 className="text-center text-base md:text-lg text-gray-700 mb-4">
        Add additional sections
      </h3>

      {/* ====== Section Buttons Grid ====== */}
      {!showForm ? (
        <div className="flex flex-wrap gap-3 justify-center">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleButtonClick(section.id, section.label)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              {section.label}
            </button>
          ))}
        </div>
      ) : (
        <SectionForm
          sectionType={selectedSectionType}
          onClose={handleFormClose}
          onSubmit={onAddSection}
        />
      )}
    </div>
  );
};

export default AddSections;
