"use client";

import React, { useState, useMemo, useCallback } from "react";
import { MemorandumTableData } from "@/types/memorandum-detail";
import { toast } from "sonner";
import {
  FiDownload,
  FiCopy,
  FiCheck,
  FiSearch,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import { BsFileEarmarkSpreadsheet } from "react-icons/bs";

interface ExcelTableViewProps {
  tableData: MemorandumTableData;
  title?: string;
  subtitle?: string;
  editable?: boolean;
  onTableDataChange?: (newTableData: MemorandumTableData) => void;
  className?: string;
}

// Helpers to identify financial / accounting rows
const isCategoryHeaderRow = (row: (string | number | null | undefined)[]) => {
  if (!row || row.length === 0) return false;
  const firstVal = String(row[0] ?? "").trim();
  if (!firstVal) return false;

  // Check if first column has text and all other columns are blank
  const otherCellsBlank = row
    .slice(1)
    .every((cell) => String(cell ?? "").trim() === "");

  if (otherCellsBlank) {
    // If it's all uppercase or ends with a colon, it's definitely a category header
    return (
      firstVal === firstVal.toUpperCase() ||
      firstVal.endsWith(":") ||
      firstVal.includes("REVENUE") ||
      firstVal.includes("EXPENSE")
    );
  }
  return false;
};

const isTotalOrSummaryRow = (row: (string | number | null | undefined)[]) => {
  if (!row || row.length === 0) return false;
  const firstVal = String(row[0] ?? "").toUpperCase();
  return (
    firstVal.includes("TOTAL") ||
    firstVal.includes("NET OPERATING INCOME") ||
    firstVal.includes("NET INCOME") ||
    firstVal.includes("CAPITALIZATION") ||
    firstVal.includes("SUBTOTAL") ||
    firstVal.startsWith("NOI")
  );
};

const isNumericOrFinancialValue = (val: string | number | null | undefined) => {
  if (val === null || val === undefined) return false;
  if (typeof val === "number") return true;
  const s = String(val).trim();
  if (!s) return false;

  // Check currency ($1,234.56), percentage (12.5%), multiplier (1.25x), or pure number
  return (
    /^\$?\s*-?[\d,]+(?:\.\d+)?%?$/.test(s) ||
    /^-?[\d,]+(?:\.\d+)?%$/.test(s) ||
    /^-?[\d,]+(?:\.\d+)?\s*(?:x|bps|SF|mo|yr|PSF)?$/i.test(s)
  );
};

// Generate Excel column letters A, B, C, ... AA, AB
const getColumnLetter = (index: number): string => {
  let letter = "";
  let temp = index;
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
};

export const ExcelTableView: React.FC<ExcelTableViewProps> = ({
  tableData,
  title,
  subtitle,
  editable = false,
  onTableDataChange,
  className = "",
}) => {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const columns = useMemo(() => tableData?.columns || [], [tableData?.columns]);
  const rows = useMemo(() => tableData?.rows || [], [tableData?.rows]);

  // Filter rows based on search
  const filteredRowsWithIndices = useMemo(() => {
    if (!searchQuery.trim()) {
      return rows.map((row, index) => ({ row, originalIndex: index }));
    }
    const q = searchQuery.toLowerCase();
    return rows
      .map((row, index) => ({ row, originalIndex: index }))
      .filter(({ row }) =>
        row.some((cell) => String(cell ?? "").toLowerCase().includes(q)),
      );
  }, [rows, searchQuery]);

  // Copy to clipboard formatted for Excel / Sheets paste
  const handleCopyClipboard = useCallback(() => {
    try {
      const headerLine = columns.join("\t");
      const rowsLines = rows
        .map((r) => r.map((c) => String(c ?? "")).join("\t"))
        .join("\n");
      const tsv = `${headerLine}\n${rowsLines}`;
      navigator.clipboard.writeText(tsv);
      setCopied(true);
      toast.success("Table copied to clipboard in Excel-ready format!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy table to clipboard");
    }
  }, [columns, rows]);

  // Export as CSV file
  const handleExportCSV = useCallback(() => {
    try {
      const escapeCsv = (str: string | number | null | undefined) => {
        const val = String(str ?? "");
        if (val.includes(",") || val.includes('"') || val.includes("\n")) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      };

      const csvContent = [
        columns.map(escapeCsv).join(","),
        ...rows.map((r) => r.map(escapeCsv).join(",")),
      ].join("\r\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `${(title || "memorandum_table").toLowerCase().replace(/[^a-z0-9]/g, "_")}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("CSV file exported successfully!");
    } catch {
      toast.error("Failed to export CSV file");
    }
  }, [columns, rows, title]);

  // Edit cell value
  const handleCellChange = (
    rowIndex: number,
    colIndex: number,
    newValue: string,
  ) => {
    if (!onTableDataChange) return;
    const nextRows = rows.map((r, rIdx) => {
      if (rIdx !== rowIndex) return r;
      const nextRow = [...r];
      nextRow[colIndex] = newValue;
      return nextRow;
    });
    onTableDataChange({
      columns,
      rows: nextRows,
    });
  };

  // Add new row
  const handleAddRow = () => {
    if (!onTableDataChange) return;
    const newRow = columns.map(() => "");
    onTableDataChange({
      columns,
      rows: [...rows, newRow],
    });
  };

  // Delete row
  const handleDeleteRow = (rowIndex: number) => {
    if (!onTableDataChange) return;
    const nextRows = rows.filter((_, idx) => idx !== rowIndex);
    onTableDataChange({
      columns,
      rows: nextRows,
    });
  };

  if (!columns.length && !rows.length) {
    return null;
  }

  return (
    <div
      className={`rounded-xl border border-slate-300/80 bg-white shadow-xs overflow-hidden my-4 ${className}`}
    >
      {/* ====== Excel Header / Ribbon Bar ====== */}
      <div className="bg-linear-to-r from-[#107C41] via-[#15803d] to-[#16a34a] text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-7 w-7 rounded-md bg-white/20 flex items-center justify-center backdrop-blur-xs shrink-0">
            <BsFileEarmarkSpreadsheet className="text-white text-base" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold tracking-wide text-white truncate">
              {title || "Data Table"}
            </h4>
            {subtitle ? (
              <p className="text-[11px] text-emerald-100 truncate">{subtitle}</p>
            ) : null}
          </div>
          <span className="ml-2 hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/20 text-emerald-100 border border-white/20">
            {rows.length} rows × {columns.length} cols
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 text-xs">
          {/* Search box */}
          {rows.length > 5 ? (
            <div className="relative">
              <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/70 text-xs" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search table..."
                className="pl-7 pr-2 py-1 rounded-md bg-white/15 text-white placeholder-white/60 text-xs border border-white/20 focus:outline-hidden focus:bg-white/25 focus:ring-1 focus:ring-white/50 w-28 sm:w-36 transition-all"
              />
            </div>
          ) : null}

          {/* Copy Table */}
          <button
            type="button"
            onClick={handleCopyClipboard}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-colors font-medium"
            title="Copy table to paste into Excel / Sheets"
          >
            {copied ? (
              <>
                <FiCheck className="text-emerald-200" />
                <span className="hidden sm:inline">Copied</span>
              </>
            ) : (
              <>
                <FiCopy />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>

          {/* Export CSV */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-colors font-medium"
            title="Export to CSV"
          >
            <FiDownload />
            <span className="hidden sm:inline">CSV</span>
          </button>
        </div>
      </div>

      {/* ====== Excel Grid Container ====== */}
      <div className="overflow-x-auto w-full max-w-full">
        <table className="w-full border-collapse text-left font-sans select-text">
          {/* Table Header Row */}
          <thead>
            {/* Optional Excel column letters banner (A, B, C, ...) */}
            <tr className="bg-slate-100/90 text-slate-400 text-[10px] font-mono border-b border-slate-200">
              <th className="w-10 px-2 py-0.5 text-center font-normal border-r border-slate-200 bg-slate-200/50">
                #
              </th>
              {columns.map((_, colIdx) => (
                <th
                  key={colIdx}
                  className="px-3 py-0.5 text-center font-normal border-r border-slate-200 last:border-r-0"
                >
                  {getColumnLetter(colIdx)}
                </th>
              ))}
              {editable ? (
                <th className="w-10 px-2 py-0.5 text-center font-normal">⚙</th>
              ) : null}
            </tr>

            {/* Column Titles Header */}
            <tr className="bg-slate-50 text-slate-800 text-xs font-semibold uppercase tracking-wider border-b-2 border-slate-300">
              <th className="w-10 px-2 py-2.5 text-center border-r border-slate-300 bg-slate-200/70 font-mono text-[11px] text-slate-500">
                #
              </th>
              {columns.map((colName, colIdx) => (
                <th
                  key={colIdx}
                  className="px-3.5 py-2.5 text-left border-r border-slate-300 last:border-r-0 font-semibold text-slate-700 whitespace-nowrap"
                >
                  {colName}
                </th>
              ))}
              {editable ? (
                <th className="w-12 px-2 py-2.5 text-center font-semibold text-slate-700">
                  Actions
                </th>
              ) : null}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
            {filteredRowsWithIndices.map(({ row, originalIndex }) => {
              const isCategoryHeader = isCategoryHeaderRow(row);
              const isTotalRow = isTotalOrSummaryRow(row);

              if (isCategoryHeader) {
                // Section Category Banner
                return (
                  <tr
                    key={originalIndex}
                    className="bg-slate-100 hover:bg-slate-200/70 transition-colors border-t border-b border-slate-300"
                  >
                    <td className="w-10 px-2 py-2 text-center font-mono text-[11px] text-slate-400 bg-slate-200/60 border-r border-slate-300 select-none">
                      {originalIndex + 1}
                    </td>
                    <td
                      colSpan={columns.length + (editable ? 1 : 0)}
                      className="px-4 py-2 font-bold text-slate-900 tracking-wider text-xs uppercase"
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-600 inline-block" />
                        {String(row[0] ?? "")}
                      </div>
                    </td>
                  </tr>
                );
              }

              // Normal or Summary/Total Row
              return (
                <tr
                  key={originalIndex}
                  className={`group transition-colors ${
                    isTotalRow
                      ? "bg-emerald-50/60 font-bold text-slate-900 border-t-2 border-b-4 border-double border-slate-700"
                      : originalIndex % 2 === 0
                        ? "bg-white hover:bg-emerald-50/30"
                        : "bg-slate-50/60 hover:bg-emerald-50/30"
                  }`}
                >
                  {/* Row Number Index */}
                  <td className="w-10 px-2 py-2 text-center font-mono text-[11px] text-slate-400 bg-slate-100/70 border-r border-slate-200 group-hover:bg-slate-200/60 select-none">
                    {originalIndex + 1}
                  </td>

                  {/* Data Cells */}
                  {columns.map((_, colIdx) => {
                    const cellVal = row[colIdx];
                    const isNumeric = isNumericOrFinancialValue(cellVal);

                    return (
                      <td
                        key={colIdx}
                        className={`px-3.5 py-2 border-r border-slate-200 last:border-r-0 ${
                          isNumeric ? "text-right tabular-nums font-mono" : "text-left"
                        } ${isTotalRow ? "font-bold text-slate-950" : ""}`}
                      >
                        {editable ? (
                          <input
                            type="text"
                            value={String(cellVal ?? "")}
                            onChange={(e) =>
                              handleCellChange(
                                originalIndex,
                                colIdx,
                                e.target.value,
                              )
                            }
                            className={`w-full px-1.5 py-1 text-xs rounded border border-transparent hover:border-slate-300 focus:border-emerald-500 focus:bg-white focus:outline-hidden ${
                              isNumeric ? "text-right font-mono" : "text-left"
                            }`}
                          />
                        ) : (
                          <span>{String(cellVal ?? "")}</span>
                        )}
                      </td>
                    );
                  })}

                  {/* Row Actions (if editable) */}
                  {editable ? (
                    <td className="w-12 px-2 py-1 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(originalIndex)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                        title="Delete row"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </td>
                  ) : null}
                </tr>
              );
            })}

            {filteredRowsWithIndices.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 2}
                  className="px-4 py-8 text-center text-slate-400 text-xs italic"
                >
                  No matching rows found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {/* ====== Footer / Table Controls ====== */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 inline-block" />
            Excel Worksheet View
          </span>
          <span className="text-slate-300">|</span>
          <span>
            Showing {filteredRowsWithIndices.length} of {rows.length} rows
          </span>
        </div>

        {editable ? (
          <button
            type="button"
            onClick={handleAddRow}
            className="flex items-center gap-1 px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-2xs transition-colors text-xs"
          >
            <FiPlus size={14} /> Add Row
          </button>
        ) : (
          <div className="text-[11px] text-slate-400 italic">
            Tip: Click &quot;Copy&quot; to paste directly into Excel or Google Sheets
          </div>
        )}
      </div>
    </div>
  );
};

export default ExcelTableView;
