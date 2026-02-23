"use client";
import StatCard from "./StatCard";
import { FiCheck, FiEye } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { motion } from 'framer-motion';

//========== Type Definitions ===========

type StatType = "primary" | "success" | "warning" | "info";

type QuoteStat = {
  id: number;
  title: string;
  value: string;
  type: StatType;
};

type LoanRecommendation = {
  id: number;
  lenderName: string;
  rating: number;
  isRecommended: boolean;
  amount: string;
  rate: string;
  ltv: string;
  term: string;
  dscr: string;
};

//========== Sample Data ===========

const quoteStats: QuoteStat[] = [
  {
    id: 1,
    title: "Total Quotes",
    value: "5",
    type: "primary",
  },
  {
    id: 2,
    title: "Best Rate",
    value: "SOFR + 3.85%",
    type: "success",
  },
  {
    id: 3,
    title: "Highest LTV",
    value: "76.0%",
    type: "info",
  },
  {
    id: 4,
    title: "Avg Amount",
    value: "$11.80M",
    type: "warning",
  },
];

const topRecommendations: LoanRecommendation[] = [
  {
    id: 1,
    lenderName: "Argentic Capital",
    rating: 4.5,
    isRecommended: true,
    amount: "$12,000,000",
    rate: "SOFR + 3.95%",
    ltv: "75.0%",
    term: "3 years + 2 ext",
    dscr: "1.25x",
  },
  {
    id: 2,
    lenderName: "Prime Commercial",
    rating: 4.7,
    isRecommended: true,
    amount: "$12,200,000",
    rate: "SOFR + 3.85%",
    ltv: "76.0%",
    term: "3 years + 1 ext",
    dscr: "1.22x",
  },
];

//========== Comparison Component ===========

const Comparison = () => {
  //========== Event Handlers ===========
  const handleAccept = (lenderId: number) => {
    console.log("Accepted loan from lender:", lenderId);
  };

  const handleView = (lenderId: number) => {
    console.log("Viewing details for lender:", lenderId);
  };

  return (
    <div className="p-5 border border-[#0000001A] rounded-lg">
      {/* ====== Quote Comparison Summary Section ====== */}
      <h1 className="text-lg my-5">Quote Comparison Summary</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quoteStats.map((stat, idx) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: idx * 0.06 }}
          >
            <StatCard
              title={stat.title}
              value={stat.value}
              type={stat.type}
            />
          </motion.div>
        ))}
      </div>

      {/* ====== Top Recommendations Section ====== */}
      <div className="mt-10 mb-5">
        <h1 className="text-lg">Top Recommendations</h1>
      </div>

      <div className="space-y-4">
        {topRecommendations.map((recommendation, idx) => (
          <motion.div
            key={recommendation.id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, delay: 0.08 + idx * 0.06 }}
            className="border border-gray-200 rounded-lg p-4 md:p-6"
          >
            {/* ====== Lender Header ====== */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-base md:text-lg text-gray-900">
                  {recommendation.lenderName}
                </h3>

                {/* ====== Star Rating ====== */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      className={`w-4 h-4 ${
                        index < Math.floor(recommendation.rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">
                    {recommendation.rating}
                  </span>
                </div>

                {/* ====== Recommended Badge ====== */}
                {recommendation.isRecommended && (
                  <span className="bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded">
                    Recommended
                  </span>
                )}
              </div>

              {/* ====== Action Buttons ====== */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAccept(recommendation.id)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  <FiCheck className="w-4 h-4" />
                  Accept
                </button>
                <button
                  onClick={() => handleView(recommendation.id)}
                  className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  <FiEye className="w-4 h-4" />
                  View
                </button>
              </div>
            </div>

            {/* ====== Loan Details Grid ====== */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-sm">
              {/* ====== Amount ====== */}
              <div>
                <p className="text-gray-600 mb-1">Amount</p>
                <p className="text-gray-900">{recommendation.amount}</p>
              </div>

              {/* ====== Rate ====== */}
              <div>
                <p className="text-gray-600 mb-1">Rate</p>
                <p className="text-gray-900">{recommendation.rate}</p>
              </div>

              {/* ====== LTV ====== */}
              <div>
                <p className="text-gray-600 mb-1">LTV</p>
                <p className="text-gray-900">{recommendation.ltv}</p>
              </div>

              {/* ====== Term ====== */}
              <div>
                <p className="text-gray-600 mb-1">Term</p>
                <p className="text-gray-900">{recommendation.term}</p>
              </div>

              {/* ====== DSCR ====== */}
              <div>
                <p className="text-gray-600 mb-1">DSCR</p>
                <p className="text-gray-900">{recommendation.dscr}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Comparison;
