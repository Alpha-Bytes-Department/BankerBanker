"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiFile,
  FiFileText,
  FiDownload,
  FiMessageSquare,
  FiGrid,
  FiUpload,
  FiMousePointer as MouseIcon,
  FiBarChart2,
  FiBell,
  FiChevronLeft,
} from "react-icons/fi";

//========== Document Viewer Animation Component ===========

const ComponentAnimation = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [activeRole, setActiveRole] = useState<"sponsor" | "lender">("sponsor");

  //========== Reset Animation ===========
  const handleMouseEnter = () => {
    setIsHovered(true);
    setAnimationComplete(false);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setAnimationComplete(false);
  };

  return (
    <div className="relative w-full lg:w-3/4 lg:rounded-2xl lg:shadow-2xl mx-auto lg:mt-10 h-screen lg:h-3/4 bg-gray-50 flex overflow-hidden">
      {/* ====== Left Navigation Sidebar - Hidden on mobile/tablet ====== */}
      <div className="hidden xl:flex w-60 bg-black text-white flex-col border-r border-gray-800">
        {/* ====== Logo ====== */}
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold">BANCre</h1>
        </div>

        {/* ====== User Profile ====== */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-sm font-medium">JD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">John Doe</p>
              <p className="text-xs text-gray-400 truncate">john@example.com</p>
            </div>
          </div>
        </div>

        {/* ====== Navigation Menu ====== */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <FiGrid className="w-5 h-5" />
            <span className="text-sm">Sponsor Dashboard</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600 text-white transition-colors"
          >
            <FiFileText className="w-5 h-5" />
            <span className="text-sm">Docview & AI Analyst</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <FiFile className="w-5 h-5" />
            <span className="text-sm">Offering Memorandum</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <FiUpload className="w-5 h-5" />
            <span className="text-sm">Document Processing</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <FiBarChart2 className="w-5 h-5" />
            <span className="text-sm flex items-center justify-between w-full">
              <span>Loan Quotes</span>
              <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                12
              </span>
            </span>
          </a>
        </nav>
      </div>

      {/* ====== Main Content Area ====== */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ====== Top Header Bar ====== */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Document Viewer & AI Analyst
              </h2>
            </div>
            <div className="flex items-center gap-4">
              {/* ====== Role Toggle ====== */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveRole("sponsor")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeRole === "sponsor"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <FiGrid className="inline w-4 h-4 mr-2" />
                  Sponsor
                </button>
                <button
                  onClick={() => setActiveRole("lender")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeRole === "lender"
                      ? "bg-gray-800 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <FiBarChart2 className="inline w-4 h-4 mr-2" />
                  Lender
                </button>
              </div>

              {/* ====== Notification Bell ====== */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FiBell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>

        {/* ====== Breadcrumb ====== */}
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
            <FiChevronLeft className="w-4 h-4" />
            Back to Documents
          </button>
          <div className="mt-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Document Viewer & AI Analyst
            </h3>
            <p className="text-sm text-gray-600">
              Review documents and get AI-powered insights
            </p>
          </div>
        </div>

        {/* ====== Animation Container ====== */}
        <div
          className="flex-1 p-6 overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative w-full h-full bg-linear-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
            {/* ====== Main Container ====== */}
            <div className="flex h-full relative">
              {/* ====== Animated Mouse Cursor ====== */}
              <AnimatePresence>
                {isHovered && !animationComplete && (
                  <motion.div
                    className="absolute z-50 pointer-events-none"
                    initial={{ x: 100, y: 150, opacity: 0 }}
                    animate={{
                      x: [100, 250, 400],
                      y: [150, 200, 250],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      times: [0, 0.5, 1],
                      ease: "easeInOut",
                    }}
                  >
                    <MouseIcon className="w-8 h-8 text-blue-600" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ====== Left Sidebar - Document List (Collapsible on mobile) ====== */}
              <div className="w-full lg:w-80 bg-white border-r border-gray-200 p-3 md:p-4 lg:p-6 overflow-y-auto max-h-60 lg:max-h-none">
                <div className="mb-4 lg:mb-6">
                  <h3 className="text-xs md:text-sm font-semibold text-gray-700 mb-1">
                    Documents
                  </h3>
                  <span className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                    9
                  </span>
                </div>

                {/* ====== Document Items ====== */}
                <div className="space-y-2 md:space-y-3">
                  {[
                    {
                      name: "Financial_Statements_Q3_2024.pdf",
                      pages: 24,
                      date: "10/20/2024",
                      category: "Financial",
                    },
                    {
                      name: "Property_Appraisal_Downtown.pdf",
                      pages: 15,
                      date: "10/19/2024",
                      category: "Appraisal",
                    },
                    {
                      name: "Lease_Agreement_Unit_24.pdf",
                      pages: 8,
                      date: "10/23/2024",
                      category: "Legal",
                    },
                    {
                      name: "Offering_Memorandum.pdf",
                      pages: 24,
                      date: "10/20/2025",
                      category: "Memorandum",
                    },
                  ].map((doc, index) => (
                    <motion.div
                      key={index}
                      className="bg-gray-50 rounded-lg md:rounded-xl p-2 md:p-3 lg:p-4 border border-gray-200 hover:border-blue-300 transition-all cursor-pointer"
                      whileHover={{ scale: 1.02, y: -2 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-start justify-between mb-1 md:mb-2">
                        <div className="flex items-start gap-1 md:gap-2 flex-1 min-w-0">
                          <FiFileText className="w-4 h-4 md:w-5 md:h-5 text-gray-400 shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs md:text-sm font-medium text-gray-900 truncate">
                              {doc.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5 md:mt-1">
                              {doc.pages} pages • {doc.date}
                            </p>
                          </div>
                        </div>
                        <FiDownload className="w-3 h-3 md:w-4 md:h-4 text-gray-400 shrink-0 ml-2" />
                      </div>
                      <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                        {doc.category}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* ====== Center - Document Preview ====== */}
              <div className="flex-1 bg-gray-50 p-8 flex items-center justify-center relative">
                <AnimatePresence mode="wait">
                  {!isHovered ? (
                    <motion.div
                      key="placeholder"
                      className="text-center"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FiFile className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-400 mb-2">
                        Document Preview
                      </h3>
                      <p className="text-gray-400">
                        Hover to see animation in action
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="document"
                      className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
                      initial={{ opacity: 0, scale: 0.5, y: 50 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{
                        delay: 1.5,
                        duration: 0.6,
                        ease: "easeOut",
                      }}
                      onAnimationComplete={() => setAnimationComplete(true)}
                    >
                      {/* ====== Document Header ====== */}
                      <div className="bg-linear-to-r from-blue-600 to-blue-700 p-6 text-white">
                        <div className="flex items-center justify-between mb-3">
                          <FiFileText className="w-8 h-8" />
                          <FiDownload className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform" />
                        </div>
                        <h3 className="text-lg font-semibold">
                          Financial_Statements_Q3_2024.pdf
                        </h3>
                      </div>

                      {/* ====== Document Content ====== */}
                      <motion.div
                        className="p-6 space-y-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.1, duration: 0.4 }}
                      >
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Viewing:</span>
                          <span className="font-medium text-gray-900">
                            Page 1 of 24
                          </span>
                        </div>

                        {/* ====== Simulated Document Lines ====== */}
                        {[...Array(8)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="h-2 bg-gray-200 rounded"
                            style={{ width: `${100 - i * 5}%` }}
                            initial={{ scaleX: 0, originX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{
                              delay: 2.2 + i * 0.05,
                              duration: 0.3,
                            }}
                          />
                        ))}

                        <motion.div
                          className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 2.6, duration: 0.4 }}
                        >
                          <p className="text-xs text-blue-700">
                            ✓ Document analyzed by AI
                          </p>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ====== Right Sidebar - AI Analyst ====== */}
              <div className="w-96 bg-white border-l border-gray-200 p-6 flex flex-col">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <FiMessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      AI Analyst
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500">
                    Ask questions about your documents
                  </p>
                </div>

                {/* ====== Chat Messages ====== */}
                <div className="flex-1 overflow-y-auto space-y-4">
                  <AnimatePresence>
                    {isHovered && animationComplete && (
                      <>
                        {/* ====== Loading Dots ====== */}
                        <motion.div
                          className="flex items-center gap-2 bg-gray-100 rounded-2xl rounded-tl-none p-4 w-fit"
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ delay: 0.3, duration: 0.4 }}
                        >
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 bg-blue-600 rounded-full"
                              animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.5, 1, 0.5],
                              }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2,
                              }}
                            />
                          ))}
                        </motion.div>

                        {/* ====== AI Message ====== */}
                        <motion.div
                          className="bg-linear-to-br from-blue-50 to-purple-50 rounded-2xl rounded-tl-none p-4 border border-blue-200"
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: 1.5, duration: 0.5 }}
                        >
                          <motion.p
                            className="text-sm text-gray-800 leading-relaxed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.8, duration: 0.4 }}
                          >
                            Hello! I'm the Team Ari AI Analyst. I've analyzed
                            all uploaded documents for this deal. You can ask me
                            questions about the property, financials, market
                            conditions, or any specific details from the
                            offering memorandum.
                          </motion.p>

                          <motion.div
                            className="mt-3 flex flex-wrap gap-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 2.2, duration: 0.4 }}
                          >
                            {[
                              "Property Details",
                              "Financial Summary",
                              "Market Analysis",
                            ].map((tag, i) => (
                              <motion.span
                                key={tag}
                                className="text-xs bg-white border border-blue-300 text-blue-700 px-2 py-1 rounded-full cursor-pointer hover:bg-blue-50 transition-colors"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                  delay: 2.4 + i * 0.1,
                                  duration: 0.3,
                                }}
                                whileHover={{ scale: 1.05 }}
                              >
                                {tag}
                              </motion.span>
                            ))}
                          </motion.div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* ====== Input Area ====== */}
                <motion.div
                  className="mt-4 relative"
                  initial={{ opacity: 0.5 }}
                  animate={{
                    opacity: isHovered && animationComplete ? 1 : 0.5,
                  }}
                >
                  <input
                    type="text"
                    placeholder="Ask about the documents..."
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    disabled={!isHovered || !animationComplete}
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                    <FiMessageSquare className="w-4 h-4" />
                  </button>
                </motion.div>
              </div>
            </div>

            {/* ====== Hover Instruction Overlay - Hidden on mobile/touch devices ====== */}
            {!isHovered && (
              <motion.div
                className="hidden lg:flex absolute inset-0 bg-black/5 backdrop-blur-[1px] items-center justify-center pointer-events-none z-40"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="bg-white/90 backdrop-blur-sm px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl shadow-lg border border-gray-200"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <p className="text-sm md:text-base text-gray-700 font-medium flex items-center gap-2">
                    <MouseIcon className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                    Hover to see the magic happen
                  </p>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentAnimation;
