"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { SectionFormData } from "@/types/memorandum-detail";
import { FiX } from "react-icons/fi";

//========== Section Form Component ===========

interface SectionFormProps {
  sectionType: string;
  onClose: () => void;
  onSubmit: (sectionId: string) => void;
}

const SectionForm: React.FC<SectionFormProps> = ({
  sectionType,
  onClose,
  onSubmit,
}) => {
  //========== Form Setup ===========
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SectionFormData>({
    defaultValues: {
      sectionTitle: "",
      sectionContent: "",
      sectionType: sectionType,
    },
  });

  //========== Submit Handler ===========
  const onFormSubmit = (data: SectionFormData) => {
    console.log("Form Data:", {
      ...data,
      timestamp: new Date().toISOString(),
    });
    onSubmit(sectionType);
    onClose();
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-4 md:p-6 border border-gray-300">
      {/* ====== Form Header ====== */}
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg text-gray-900">Add {sectionType}</h4>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          type="button"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      {/* ====== Form ====== */}
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        {/* ====== Section Title Field ====== */}
        <div>
          <label
            htmlFor="sectionTitle"
            className="block text-sm text-gray-700 mb-1"
          >
            Section Title
          </label>
          <input
            id="sectionTitle"
            type="text"
            {...register("sectionTitle", {
              required: "Section title is required",
              minLength: {
                value: 3,
                message: "Title must be at least 3 characters",
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Enter section title"
          />
          {errors.sectionTitle && (
            <p className="text-red-500 text-xs mt-1">
              {errors.sectionTitle.message}
            </p>
          )}
        </div>

        {/* ====== Section Content Field ====== */}
        <div>
          <label
            htmlFor="sectionContent"
            className="block text-sm text-gray-700 mb-1"
          >
            Section Content
          </label>
          <textarea
            id="sectionContent"
            {...register("sectionContent", {
              required: "Section content is required",
              minLength: {
                value: 10,
                message: "Content must be at least 10 characters",
              },
            })}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
            placeholder="Enter section content"
          />
          {errors.sectionContent && (
            <p className="text-red-500 text-xs mt-1">
              {errors.sectionContent.message}
            </p>
          )}
        </div>

        {/* ====== Form Actions ====== */}
        <div className="flex gap-3 justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            Add Section
          </button>
        </div>
      </form>
    </div>
  );
};

export default SectionForm;
