"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const [activeRole, setActiveRole] = useState<"sponsor" | "lender">("sponsor");
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [userMessage, setUserMessage] = useState("");
  const [aiMessages, setAiMessages] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const documents = [
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
  ];

  const userMessages = [
    "What's the total property value?",
    "Show me the occupancy rate",
    "What are the key risks?",
  ];

  const aiResponses = [
    "Based on the Property Appraisal document, the total property value is $15.2M. The appraisal was completed on 10/19/2024 using comparable sales analysis.",
    "According to the Financial Statements Q3 2024, the current occupancy rate is 94.5%, which is above the market average of 89% for similar properties in this area.",
    "Key risks identified include: 1) Lease expiration for major tenant in Q2 2025 (23% of revenue), 2) Rising interest rates affecting refinancing, 3) Market saturation in the downtown area.",
  ];

  //========== Animation Sequence ===========
  useEffect(() => {
    if (!isHovered) return;

    const sequence = [
      // Step 1: Select first document (1s)
      { time: 1000, action: () => setSelectedDocIndex(0) },

      // Step 2: Show document loading (1.5s)
      { time: 2500, action: () => setCurrentPage(1) },

      // Step 3: Change pages (3s, 4s, 5s)
      { time: 3000, action: () => setCurrentPage(2) },
      { time: 4000, action: () => setCurrentPage(3) },
      { time: 5000, action: () => setCurrentPage(4) },

      // Step 4: Select second document (6s)
      {
        time: 6000,
        action: () => {
          setSelectedDocIndex(1);
          setCurrentPage(1);
        },
      },

      // Step 5: Start typing first message (7s)
      {
        time: 7000,
        action: () => {
          setIsTyping(true);
          setUserMessage("");
        },
      },
      { time: 7100, action: () => setUserMessage("W") },
      { time: 7200, action: () => setUserMessage("Wh") },
      { time: 7300, action: () => setUserMessage("Wha") },
      { time: 7400, action: () => setUserMessage("What") },
      { time: 7500, action: () => setUserMessage("What'") },
      { time: 7600, action: () => setUserMessage("What's") },
      { time: 7700, action: () => setUserMessage("What's ") },
      { time: 7800, action: () => setUserMessage("What's t") },
      { time: 7900, action: () => setUserMessage("What's th") },
      { time: 8000, action: () => setUserMessage("What's the") },
      { time: 8100, action: () => setUserMessage("What's the ") },
      { time: 8200, action: () => setUserMessage("What's the t") },
      { time: 8300, action: () => setUserMessage("What's the to") },
      { time: 8400, action: () => setUserMessage("What's the tot") },
      { time: 8500, action: () => setUserMessage("What's the tota") },
      { time: 8600, action: () => setUserMessage("What's the total") },
      { time: 8700, action: () => setUserMessage("What's the total ") },
      { time: 8800, action: () => setUserMessage("What's the total p") },
      { time: 8900, action: () => setUserMessage("What's the total pr") },
      { time: 9000, action: () => setUserMessage("What's the total pro") },
      { time: 9100, action: () => setUserMessage("What's the total prop") },
      { time: 9200, action: () => setUserMessage("What's the total prope") },
      { time: 9300, action: () => setUserMessage("What's the total proper") },
      { time: 9400, action: () => setUserMessage("What's the total propert") },
      { time: 9500, action: () => setUserMessage("What's the total property") },
      {
        time: 9600,
        action: () => setUserMessage("What's the total property "),
      },
      {
        time: 9700,
        action: () => setUserMessage("What's the total property v"),
      },
      {
        time: 9800,
        action: () => setUserMessage("What's the total property va"),
      },
      {
        time: 9900,
        action: () => setUserMessage("What's the total property val"),
      },
      {
        time: 10000,
        action: () => setUserMessage("What's the total property valu"),
      },
      {
        time: 10100,
        action: () => setUserMessage("What's the total property value"),
      },
      {
        time: 10200,
        action: () => setUserMessage("What's the total property value?"),
      },

      // Step 6: Send message and show AI typing (10.5s)
      {
        time: 10500,
        action: () => {
          setUserMessage("");
          setIsTyping(true);
          setAiMessages([]);
        },
      },

      // Step 7: Show AI response (12s)
      {
        time: 12000,
        action: () => {
          setIsTyping(false);
          setAiMessages([aiResponses[0]]);
        },
      },

      // Step 8: Select third document and change pages (14s)
      {
        time: 14000,
        action: () => {
          setSelectedDocIndex(2);
          setCurrentPage(1);
        },
      },
      { time: 15000, action: () => setCurrentPage(2) },

      // Step 9: Type second message (16s)
      {
        time: 16000,
        action: () => {
          setIsTyping(true);
          setUserMessage("");
        },
      },
      { time: 16100, action: () => setUserMessage("S") },
      { time: 16200, action: () => setUserMessage("Sh") },
      { time: 16300, action: () => setUserMessage("Sho") },
      { time: 16400, action: () => setUserMessage("Show") },
      { time: 16500, action: () => setUserMessage("Show ") },
      { time: 16600, action: () => setUserMessage("Show m") },
      { time: 16700, action: () => setUserMessage("Show me") },
      { time: 16800, action: () => setUserMessage("Show me ") },
      { time: 16900, action: () => setUserMessage("Show me t") },
      { time: 17000, action: () => setUserMessage("Show me th") },
      { time: 17100, action: () => setUserMessage("Show me the") },
      { time: 17200, action: () => setUserMessage("Show me the ") },
      { time: 17300, action: () => setUserMessage("Show me the o") },
      { time: 17400, action: () => setUserMessage("Show me the oc") },
      { time: 17500, action: () => setUserMessage("Show me the occ") },
      { time: 17600, action: () => setUserMessage("Show me the occu") },
      { time: 17700, action: () => setUserMessage("Show me the occup") },
      { time: 17800, action: () => setUserMessage("Show me the occupa") },
      { time: 17900, action: () => setUserMessage("Show me the occupan") },
      { time: 18000, action: () => setUserMessage("Show me the occupanc") },
      { time: 18100, action: () => setUserMessage("Show me the occupancy") },
      { time: 18200, action: () => setUserMessage("Show me the occupancy ") },
      { time: 18300, action: () => setUserMessage("Show me the occupancy r") },
      { time: 18400, action: () => setUserMessage("Show me the occupancy ra") },
      {
        time: 18500,
        action: () => setUserMessage("Show me the occupancy rat"),
      },
      {
        time: 18600,
        action: () => setUserMessage("Show me the occupancy rate"),
      },

      // Step 10: Show second AI response (19s)
      {
        time: 19000,
        action: () => {
          setUserMessage("");
          setIsTyping(true);
        },
      },
      {
        time: 20500,
        action: () => {
          setIsTyping(false);
          setAiMessages([aiResponses[0], aiResponses[1]]);
        },
      },

      // Step 11: Select fourth document (22s)
      {
        time: 22000,
        action: () => {
          setSelectedDocIndex(3);
          setCurrentPage(1);
        },
      },
      { time: 23000, action: () => setCurrentPage(5) },
      { time: 24000, action: () => setCurrentPage(10) },

      // Step 12: Reset and loop (26s)
      {
        time: 26000,
        action: () => {
          setSelectedDocIndex(0);
          setCurrentPage(1);
          setUserMessage("");
          setAiMessages([]);
          setIsTyping(false);
          setAnimationStep(0);
        },
      },
    ];

    const timeouts: NodeJS.Timeout[] = [];

    sequence.forEach(({ time, action }) => {
      const timeout = setTimeout(action, time);
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [isHovered]);

  //========== Auto-scroll chat to bottom when new messages appear ===========
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [aiMessages, isTyping]);

  //========== Reset Animation ===========
  const handleMouseEnter = () => {
    setIsHovered(true);
    setSelectedDocIndex(0);
    setCurrentPage(1);
    setUserMessage("");
    setAiMessages([]);
    setIsTyping(false);
    setAnimationStep(0);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setSelectedDocIndex(0);
    setCurrentPage(1);
    setUserMessage("");
    setAiMessages([]);
    setIsTyping(false);
    setAnimationStep(0);
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
                {isHovered && (
                  <motion.div
                    className="absolute z-50 pointer-events-none"
                    initial={{ x: 50, y: 100 }}
                    animate={{
                      x: [
                        50, // Start
                        150, // Move to first doc
                        150, // Stay on first doc
                        250, // Move around document
                        150, // Move to second doc
                        150, // Stay
                        400, // Move to chat input
                        400, // Stay while typing
                        150, // Move to third doc
                        250, // Browse document
                        400, // Back to chat
                        400, // Stay
                        150, // Fourth doc
                        250, // Browse
                        50, // Reset
                      ],
                      y: [
                        100, // Start
                        150, // First doc
                        150, // Stay
                        200, // Document area
                        250, // Second doc
                        250, // Stay
                        550, // Chat input
                        550, // Typing
                        350, // Third doc
                        200, // Browse
                        550, // Chat
                        550, // Typing
                        450, // Fourth doc
                        200, // Browse
                        100, // Reset
                      ],
                    }}
                    transition={{
                      duration: 26,
                      times: [
                        0, 0.04, 0.08, 0.12, 0.23, 0.27, 0.31, 0.42, 0.54, 0.58,
                        0.62, 0.77, 0.85, 0.92, 1,
                      ],
                      ease: "easeInOut",
                      repeat: Infinity,
                    }}
                  >
                    <MouseIcon className="w-6 h-6 text-blue-600 drop-shadow-lg" />
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
                  {documents.map((doc, index) => (
                    <motion.div
                      key={index}
                      className={`bg-gray-50 rounded-lg md:rounded-xl p-2 md:p-3 lg:p-4 border transition-all ${
                        selectedDocIndex === index && isHovered
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200"
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        scale:
                          selectedDocIndex === index && isHovered ? 1.02 : 1,
                      }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-start justify-between mb-1 md:mb-2">
                        <div className="flex items-start gap-1 md:gap-2 flex-1 min-w-0">
                          <FiFileText
                            className={`w-4 h-4 md:w-5 md:h-5 shrink-0 mt-0.5 ${
                              selectedDocIndex === index && isHovered
                                ? "text-blue-600"
                                : "text-gray-400"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-xs md:text-sm font-medium truncate ${
                                selectedDocIndex === index && isHovered
                                  ? "text-blue-900"
                                  : "text-gray-900"
                              }`}
                            >
                              {doc.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5 md:mt-1">
                              {doc.pages} pages • {doc.date}
                            </p>
                          </div>
                        </div>
                        <FiDownload className="w-3 h-3 md:w-4 md:h-4 text-gray-400 shrink-0 ml-2" />
                      </div>
                      <span
                        className={`inline-block text-xs px-2 py-1 rounded ${
                          selectedDocIndex === index && isHovered
                            ? "bg-blue-600 text-white"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {doc.category}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* ====== Center - Document Preview ====== */}
              <div className="flex-1 bg-gray-50 p-8 flex items-center justify-center relative">
                <AnimatePresence mode="wait">
                  {isHovered ? (
                    <motion.div
                      key={`document-${selectedDocIndex}`}
                      className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* ====== Document Header ====== */}
                      <div className="bg-linear-to-r from-blue-600 to-blue-700 p-6 text-white">
                        <div className="flex items-center justify-between mb-3">
                          <FiFileText className="w-8 h-8" />
                          <FiDownload className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold truncate">
                          {documents[selectedDocIndex].name}
                        </h3>
                      </div>

                      {/* ====== Document Content ====== */}
                      <motion.div
                        className="p-6 space-y-3"
                        key={`page-${currentPage}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Viewing:</span>
                          <motion.span
                            className="font-medium text-gray-900"
                            key={currentPage}
                            initial={{ scale: 1.2, color: "#2563EB" }}
                            animate={{ scale: 1, color: "#111827" }}
                            transition={{ duration: 0.3 }}
                          >
                            Page {currentPage} of{" "}
                            {documents[selectedDocIndex].pages}
                          </motion.span>
                        </div>

                        {/* ====== Simulated Document Lines ====== */}
                        {[...Array(8)].map((_, i) => (
                          <motion.div
                            key={`${currentPage}-${i}`}
                            className="h-2 bg-gray-200 rounded"
                            style={{ width: `${100 - (i + currentPage) * 3}%` }}
                            initial={{ scaleX: 0, originX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{
                              delay: i * 0.05,
                              duration: 0.2,
                            }}
                          />
                        ))}

                        <motion.div
                          className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4, duration: 0.3 }}
                        >
                          <p className="text-xs text-blue-700">
                            ✓ Document analyzed by AI
                          </p>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  ) : (
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
                  )}
                </AnimatePresence>
              </div>

              {/* ====== Right Sidebar - AI Analyst ====== */}
              <div className="w-96 bg-white border-l border-gray-200 p-6 flex flex-col h-full">
                <div className="mb-6 flex-shrink-0">
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
                <div
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto space-y-4 min-h-0 scroll-smooth"
                  style={{ maxHeight: "calc(100% - 180px)" }}
                >
                  <AnimatePresence>
                    {isHovered && (
                      <>
                        {/* ====== AI Greeting ====== */}
                        <motion.div
                          className="bg-linear-to-br from-blue-50 to-purple-50 rounded-2xl rounded-tl-none p-4 border border-blue-200"
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{
                            delay: 0.5,
                            duration: 0.7,
                            ease: "easeOut",
                          }}
                        >
                          <p className="text-sm text-gray-800 leading-relaxed">
                            Hello! I'm the Team Ari AI Analyst. I've analyzed
                            all uploaded documents for this deal. You can ask me
                            questions about the property, financials, market
                            conditions, or any specific details from the
                            offering memorandum.
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {[
                              "Property Details",
                              "Financial Summary",
                              "Market Analysis",
                            ].map((tag, i) => (
                              <span
                                key={tag}
                                className="text-xs bg-white border border-blue-300 text-blue-700 px-2 py-1 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </motion.div>

                        {/* ====== User Messages & AI Responses ====== */}
                        {aiMessages.map((aiMsg, index) => (
                          <React.Fragment key={index}>
                            {/* User Message */}
                            <motion.div
                              className="flex justify-end"
                              initial={{ opacity: 0, x: 15 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                            >
                              <div className="bg-blue-600 text-white rounded-2xl rounded-tr-none p-4 max-w-[80%]">
                                <p className="text-sm">{userMessages[index]}</p>
                              </div>
                            </motion.div>

                            {/* AI Response */}
                            <motion.div
                              className="bg-linear-to-br from-blue-50 to-purple-50 rounded-2xl rounded-tl-none p-4 border border-blue-200"
                              initial={{ opacity: 0, scale: 0.95, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              transition={{
                                delay: 0.3,
                                duration: 0.7,
                                ease: "easeOut",
                              }}
                            >
                              <p className="text-sm text-gray-800 leading-relaxed">
                                {aiMsg}
                              </p>
                            </motion.div>
                          </React.Fragment>
                        ))}

                        {/* ====== AI Typing Indicator ====== */}
                        {isTyping && aiMessages.length < 2 && (
                          <motion.div
                            className="flex items-center gap-2 bg-gray-100 rounded-2xl rounded-tl-none p-4 w-fit"
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
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
                        )}
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* ====== Input Area ====== */}
                <motion.div className="mt-4 relative flex-shrink-0">
                  <div className="relative">
                    <input
                      type="text"
                      value={userMessage}
                      placeholder="Ask about the documents..."
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm pointer-events-none"
                      readOnly
                    />
                    {userMessage && (
                      <motion.div
                        className="absolute left-4 top-3 text-sm text-gray-900"
                        initial={{ width: 0 }}
                        animate={{ width: "auto" }}
                      >
                        {userMessage}
                      </motion.div>
                    )}
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg pointer-events-none">
                      <FiMessageSquare className="w-4 h-4" />
                    </button>
                  </div>
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
