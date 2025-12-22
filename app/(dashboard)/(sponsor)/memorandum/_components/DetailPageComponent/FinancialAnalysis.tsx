"use client";

import React from "react";
import PreviewSection from "./PreviewSection";
import { FinancialAnalysisData } from "@/types/memorandum-detail";

//========== Financial Analysis Component ===========

interface FinancialAnalysisProps {
  data: FinancialAnalysisData;
}

const FinancialAnalysis: React.FC<FinancialAnalysisProps> = ({ data }) => {
  return (
    <PreviewSection sectionNumber={8} title="Financial Analysis">
      {/* ====== Permanent Financing Quote Matrix ====== */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h4 className="text-base md:text-lg text-gray-900">
            Permanent Financing Quote Matrix
          </h4>
          <p className="text-sm text-gray-600">As of 7/10/2025</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left">
                  Lender
                </th>
                <th className="border border-gray-300 px-3 py-2 text-left">
                  Leverage
                </th>
                <th className="border border-gray-300 px-3 py-2 text-left">
                  DSCR
                </th>
                <th className="border border-gray-300 px-3 py-2 text-left">
                  Amortization
                </th>
                <th className="border border-gray-300 px-3 py-2 text-left">
                  Loan Type
                </th>
                <th className="border border-gray-300 px-3 py-2 text-left">
                  Rate
                </th>
                <th className="border border-gray-300 px-3 py-2 text-left">
                  Index + Spread
                </th>
                <th className="border border-gray-300 px-3 py-2 text-left">
                  Origination Fee
                </th>
                <th className="border border-gray-300 px-3 py-2 text-left">
                  Prepayment
                </th>
              </tr>
            </thead>
            <tbody>
              {data.loanQuotes.map((quote, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="border border-gray-300 px-3 py-2">
                    {quote.lender}
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    {quote.leverage}
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    {quote.dscr}
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    {quote.amortization}
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                      {quote.loanType}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    {quote.rate}
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    {quote.indexSpread}
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    {quote.originationFee}
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    {quote.prepayment}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ====== Loan Rating Note ====== */}
        <div className="mt-4 text-xs text-gray-600">
          <p>{data.loanRatingNote}</p>
        </div>
      </div>

      {/* ====== Loan Request and Property Overview Grid ====== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* ====== Loan Request ====== */}
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 text-white rounded flex items-center justify-center text-sm">
              $
            </div>
            <h4 className="text-base text-gray-900">Loan Request</h4>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-blue-200">
              <span className="text-gray-700">Loan Amount:</span>
              <span className="text-gray-900">
                {data.loanRequest.loanAmount}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-blue-200">
              <span className="text-gray-700">Estimated Value:</span>
              <span className="text-gray-900">
                {data.loanRequest.estimatedValue}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-blue-200">
              <span className="text-gray-700">LTV:</span>
              <span className="text-gray-900">{data.loanRequest.ltv}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-blue-200">
              <span className="text-gray-700">Financing Type:</span>
              <span className="text-gray-900">
                {data.loanRequest.financingType}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-blue-200">
              <span className="text-gray-700">Term:</span>
              <span className="text-gray-900">{data.loanRequest.term}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-blue-200">
              <span className="text-gray-700">Interest Rate:</span>
              <span className="text-gray-900">
                {data.loanRequest.interestRate}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-blue-200">
              <span className="text-gray-700">Amortization:</span>
              <span className="text-gray-900">
                {data.loanRequest.amortization}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-blue-200">
              <span className="text-gray-700">Prepayment:</span>
              <span className="text-gray-900">
                {data.loanRequest.prepayment}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-blue-200">
              <span className="text-gray-700">DSCR (IOI):</span>
              <span className="text-gray-900">{data.loanRequest.dscrIoi}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-700">DY (NOI):</span>
              <span className="text-gray-900">{data.loanRequest.dyNoi}</span>
            </div>
          </div>
        </div>

        {/* ====== Property Overview ====== */}
        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-green-600 text-white rounded flex items-center justify-center text-sm">
              📋
            </div>
            <h4 className="text-base text-gray-900">Property Overview</h4>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-green-200">
              <span className="text-gray-700">Property Name:</span>
              <span className="text-gray-900">
                {data.propertyDetails.propertyName}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-green-200">
              <span className="text-gray-700">Address:</span>
              <span className="text-gray-900">
                {data.propertyDetails.address}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-green-200">
              <span className="text-gray-700">City, State:</span>
              <span className="text-gray-900">
                {data.propertyDetails.cityState}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-green-200">
              <span className="text-gray-700">Year Built:</span>
              <span className="text-gray-900">
                {data.propertyDetails.yearBuilt}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-green-200">
              <span className="text-gray-700">Year Built / Renovated:</span>
              <span className="text-gray-900">
                {data.propertyDetails.yearRenovated}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-green-200">
              <span className="text-gray-700">
                Rentable Area (square feet):
              </span>
              <span className="text-gray-900">
                {data.propertyDetails.rentableArea}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-700">Occupancy:</span>
              <span className="text-gray-900">
                {data.propertyDetails.occupancy}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ====== Sources & Uses ====== */}
      <div className="mb-8">
        <h4 className="text-base md:text-lg text-gray-900 mb-4">
          Sources & Uses
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ====== Sources Table ====== */}
          <div>
            <h5 className="text-sm text-gray-900 mb-3">Sources</h5>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">
                    Source
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-right">
                    Amount
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-right">
                    PSF / Unit
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.sources.map((source, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="border border-gray-300 px-3 py-2">
                      {source.source}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right">
                      {source.amount}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right">
                      {source.psf}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-200">
                  <td className="border border-gray-300 px-3 py-2">
                    <strong>Total Sources</strong>
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right">
                    <strong>{data.totalSources}</strong>
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right">
                    <strong>$148</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ====== Uses Table ====== */}
          <div>
            <h5 className="text-sm text-gray-900 mb-3">Uses</h5>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">
                    Use
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-right">
                    Amount
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-right">
                    PSF / Unit
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.uses.map((use, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="border border-gray-300 px-3 py-2">
                      {use.use}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right">
                      {use.amount}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right">
                      {use.psf}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-200">
                  <td className="border border-gray-300 px-3 py-2">
                    <strong>Total Uses</strong>
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right">
                    <strong>{data.totalUses}</strong>
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right">
                    <strong>$148</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ====== Financial Performance ====== */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-blue-600 text-white rounded flex items-center justify-center text-xs">
            📊
          </div>
          <h4 className="text-base md:text-lg text-gray-900">
            Financial Performance
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left">
                  Category
                </th>
                <th className="border border-gray-300 px-3 py-2 text-right">
                  Trailing 12
                </th>
                <th className="border border-gray-300 px-3 py-2 text-right">
                  Date
                </th>
                <th className="border border-gray-300 px-3 py-2 text-right">
                  %
                </th>
                <th className="border border-gray-300 px-3 py-2 text-right">
                  Underwriting
                </th>
                <th className="border border-gray-300 px-3 py-2 text-right">
                  In-Place
                </th>
                <th className="border border-gray-300 px-3 py-2 text-right">
                  %
                </th>
                <th className="border border-gray-300 px-3 py-2 text-right">
                  $ PSF
                </th>
              </tr>
            </thead>
            <tbody>
              {data.financialPerformance.map((item, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="border border-gray-300 px-3 py-2">
                    {item.category}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right">
                    {item.trailing12}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right">
                    {item.date}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right">
                    {item.percentage}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right">
                    {item.underwriting}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right">
                    {item.inPlace}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right">
                    {item.percentage}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right">
                    {item.psf}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-xs text-gray-600">
          <p>
            * Based on an assumption of a 9.5% mortgage interest rate and
            interest only
          </p>
        </div>
      </div>
    </PreviewSection>
  );
};

export default FinancialAnalysis;
