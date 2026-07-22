"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
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
  FiSend,
} from "react-icons/fi";

//========== Document Viewer Animation Component ===========

const ComponentAnimation = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [activeRole, setActiveRole] = useState<"sponsor" | "lender">("sponsor");

  const [messages, setMessages] = useState<
    { id: string; sender: "user" | "ai"; text: string; tags?: string[] }[]
  >([
    {
      id: "welcome-1",
      sender: "ai",
      text: "Hello! I'm the BANCre AI Analyst. I've analyzed all uploaded documents for this deal. You can ask me questions about the property, financials, or market conditions.",
      tags: ["Property Details", "Financial Summary", "Market Analysis"],
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSubmitting]);

  const handleSendMessage = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || inputValue;
    if (!textToSend.trim() || isSubmitting) return;

    const userMsgId = Date.now().toString();
    setMessages((prev) => [
      ...prev,
      { id: userMsgId, sender: "user", text: textToSend.trim() },
    ]);
    setInputValue("");
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: "Welcome to BANCre! We make Commercial Real Estate financing faster, cheaper, and smarter. Experience seamless loan origination, AI document processing, and direct access to top lenders. Sign up for free today to get started!",
        },
      ]);
    }, 1000);
  };

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
    <div className="relative w-full lg:w-[94%] xl:w-[90%] max-w-[1400px] lg:rounded-2xl lg:shadow-2xl mx-auto my-6 lg:my-10 h-[600px] lg:h-[650px] bg-gray-50 flex overflow-hidden">
      {/* ====== Left Navigation Sidebar - Hidden on mobile/tablet ====== */}
      <div className="hidden xl:flex w-48 bg-black text-white flex-col border-r border-gray-800 shrink-0">
        {/* ====== Logo ====== */}
        <div className="px-6 py-4 border-b border-gray-800 flex items-center">
          <Image
            src="/logo/White_BANCre.png"
            alt="logo"
            width={100}
            height={40}
            className="h-auto w-auto"
          />
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
              <div className="w-full lg:w-60 bg-white border-r border-gray-200 p-3 md:p-4 overflow-y-auto max-h-60 lg:max-h-none shrink-0">
                <div className="mb-4 lg:mb-6 flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-gray-700">
                    Documents
                  </h3>
                  <span className="inline-block bg-gray-200 text-gray-700 text-[10px] px-2 py-0.5 rounded-full font-medium">
                    9
                  </span>
                </div>

                {/* ====== Document Items ====== */}
                <div className="space-y-2">
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
                      className="bg-gray-50 rounded-lg p-2.5 border border-gray-200 hover:border-blue-300 transition-all cursor-pointer"
                      whileHover={{ scale: 1.02, y: -2 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-start gap-1.5 flex-1 min-w-0">
                          <FiFileText className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-medium text-gray-900 truncate" title={doc.name}>
                              {doc.name}
                            </p>
                            <p className="text-[10px] text-gray-500 mt-0.5">
                              {doc.pages} pages • {doc.date}
                            </p>
                          </div>
                        </div>
                        <FiDownload className="w-3 h-3 text-gray-400 shrink-0 ml-1" />
                      </div>
                      <span className="inline-block bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded font-medium">
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
              <div className="w-96 lg:w-[430px] bg-white border-l border-gray-200 p-6 flex flex-col shrink-0">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
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

                {/* ====== Chat Messages Container ====== */}
                <div
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto space-y-4 pr-1 scroll-smooth"
                >
                  <AnimatePresence>
                    {isHovered && animationComplete && (
                      <>
                        {messages.map((msg) => (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`flex flex-col ${
                              msg.sender === "user" ? "items-end" : "items-start"
                            }`}
                          >
                            <div
                              className={`p-3.5 rounded-2xl max-w-[85%] text-xs md:text-sm leading-relaxed ${
                                msg.sender === "user"
                                  ? "bg-blue-600 text-white rounded-tr-none shadow-xs"
                                  : "bg-linear-to-br from-blue-50 to-purple-50 text-gray-800 border border-blue-200 rounded-tl-none shadow-xs"
                              }`}
                            >
                              <p>{msg.text}</p>
                              {msg.tags && msg.tags.length > 0 && (
                                <div className="mt-2.5 flex flex-wrap gap-1.5">
                                  {msg.tags.map((tag) => (
                                    <button
                                      key={tag}
                                      type="button"
                                      onClick={() =>
                                        handleSendMessage(
                                          undefined,
                                          `Tell me about ${tag}`
                                        )
                                      }
                                      className="text-xs bg-white border border-blue-300 text-blue-700 px-2 py-0.5 rounded-full hover:bg-blue-100 transition-colors cursor-pointer"
                                    >
                                      {tag}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}

                        {/* ====== Submitting Loader Dots ====== */}
                        {isSubmitting && (
                          <motion.div
                            key="loader"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2 bg-gray-100 rounded-2xl rounded-tl-none p-3.5 w-fit"
                          >
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                className="w-2 h-2 bg-blue-600 rounded-full"
                                animate={{
                                  scale: [1, 1.3, 1],
                                  opacity: [0.4, 1, 0.4],
                                }}
                                transition={{
                                  duration: 0.8,
                                  repeat: Infinity,
                                  delay: i * 0.2,
                                }}
                              />
                            ))}
                          </motion.div>
                        )}
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* ====== Input Area ====== */}
                <form
                  onSubmit={(e) => handleSendMessage(e)}
                  className="mt-4 relative"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about the documents..."
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs md:text-sm"
                    disabled={!isHovered || !animationComplete || isSubmitting}
                  />
                  <button
                    type="submit"
                    disabled={
                      !isHovered ||
                      !animationComplete ||
                      isSubmitting ||
                      !inputValue.trim()
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    <FiSend className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>

            {/* ====== Hover Instruction Overlay - Hidden on mobile/touch devices ====== */}
            {!isHovered && (
              <motion.div
                className="hidden lg:flex absolute inset-0 bg-black/5 backdrop-blur-[1px] items-center justify-center pointer-events-none z-30"
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
