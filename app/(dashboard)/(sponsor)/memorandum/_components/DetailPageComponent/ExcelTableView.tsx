"use client";

import React, { useState, useMemo, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MemorandumTableData } from "@/types/memorandum-detail";
import { toast } from "sonner";
import {
  FiDownload,
  FiCopy,
  FiCheck,
  FiSearch,
  FiPlus,
  FiTrash2,
  FiMaximize2,
  FiMinimize2,
  FiArrowUp,
  FiArrowDown,
  FiX,
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
const isBlankRow = (row: (string | number | null | undefined)[]) => {
  if (!row || row.length === 0) return true;
  return row.every((cell) => String(cell ?? "").trim() === "");
};

const isCategoryHeaderRow = (row: (string | number | null | undefined)[]) => {
  if (!row || row.length === 0) return false;
  const firstVal = String(row[0] ?? "").trim();
  if (!firstVal) return false;

  // Check if first column has text and all other columns are blank
  const otherCellsBlank = row
    .slice(1)
    .every((cell) => String(cell ?? "").trim() === "");

  if (otherCellsBlank) {
    return (
      firstVal === firstVal.toUpperCase() ||
      firstVal.endsWith(":") ||
      firstVal.includes("REVENUE") ||
      firstVal.includes("EXPENSE") ||
      firstVal.includes("HIGHLIGHT") ||
      firstVal.includes("OVERVIEW")
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
    firstVal.startsWith("NOI") ||
    firstVal.includes("DEBT SERVICE") ||
    firstVal.includes("DEBT / EQUITY")
  );
};

const isNumericOrFinancialValue = (val: string | number | null | undefined) => {
  if (val === null || val === undefined) return false;
  if (typeof val === "number") return true;
  const s = String(val).trim();
  if (!s) return false;

  return (
    /^\$?\s*-?[\d,]+(?:\.\d+)?%?$/.test(s) ||
    /^-?[\d,]+(?:\.\d+)?%$/.test(s) ||
    /^-?[\d,]+(?:\.\d+)?\s*(?:x|bps|SF|mo|yr|PSF|Keys)?$/i.test(s)
  );
};

const hasMarkdownSyntax = (str: string) => {
  if (!str || str.length < 3) return false;
  return (
    str.includes("\n") ||
    str.includes("**") ||
    str.includes("##") ||
    str.includes("- ") ||
    str.includes("|") ||
    str.includes("• ") ||
    str.length > 100
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
  const [sortColIndex, setSortColIndex] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const columns = useMemo(() => tableData?.columns || [], [tableData?.columns]);
  const rawRows = useMemo(() => tableData?.rows || [], [tableData?.rows]);

  // Is this a 2-column Topic / Details or Attribute / Value table?
  const isTwoColumnNarrative = useMemo(() => {
    if (columns.length !== 2) return false;
    const col0 = (columns[0] || "").toLowerCase();
    const col1 = (columns[1] || "").toLowerCase();
    return (
      (col0.includes("topic") ||
        col0.includes("attribute") ||
        col0.includes("metric") ||
        col0.includes("property")) &&
      (col1.includes("detail") ||
        col1.includes("value") ||
        col1.includes("description"))
    );
  }, [columns]);

  // Handle column sorting
  const handleSort = (colIndex: number) => {
    if (sortColIndex === colIndex) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortColIndex(null);
        setSortDirection("asc");
      }
    } else {
      setSortColIndex(colIndex);
      setSortDirection("asc");
    }
  };

  // Filter & sort rows
  const processedRows = useMemo(() => {
    let list = rawRows.map((row, index) => ({ row, originalIndex: index }));

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(({ row }) =>
        row.some((cell) => String(cell ?? "").toLowerCase().includes(q)),
      );
    }

    // Sort
    if (sortColIndex !== null) {
      list = [...list].sort((a, b) => {
        const valA = String(a.row[sortColIndex] ?? "").trim();
        const valB = String(b.row[sortColIndex] ?? "").trim();

        // Check if numeric
        const numA = Number(valA.replace(/[^0-9.-]/g, ""));
        const numB = Number(valB.replace(/[^0-9.-]/g, ""));

        if (!isNaN(numA) && !isNaN(numB) && valA !== "" && valB !== "") {
          return sortDirection === "asc" ? numA - numB : numB - numA;
        }

        return sortDirection === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      });
    }

    return list;
  }, [rawRows, searchQuery, sortColIndex, sortDirection]);

  // Copy to clipboard formatted for Excel / Sheets paste
  const handleCopyClipboard = useCallback(() => {
    try {
      const headerLine = columns.join("\t");
      const rowsLines = rawRows
        .map((r) =>
          r
            .map((c) =>
              String(c ?? "")
                .replace(/\r?\n/g, " ")
                .replace(/\t/g, " "),
            )
            .join("\t"),
        )
        .join("\n");
      const tsv = `${headerLine}\n${rowsLines}`;
      navigator.clipboard.writeText(tsv);
      setCopied(true);
      toast.success("Table copied to clipboard in Excel-ready format!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy table to clipboard");
    }
  }, [columns, rawRows]);

  // Export as CSV file
  const handleExportCSV = useCallback(() => {
    try {
      const escapeCsv = (str: string | number | null | undefined) => {
        const val = String(str ?? "");
        if (
          val.includes(",") ||
          val.includes('"') ||
          val.includes("\n") ||
          val.includes("\r")
        ) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      };

      const csvContent = [
        columns.map(escapeCsv).join(","),
        ...rawRows.map((r) => r.map(escapeCsv).join(",")),
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
  }, [columns, rawRows, title]);

  // Edit cell value
  const handleCellChange = (
    rowIndex: number,
    colIndex: number,
    newValue: string,
  ) => {
    if (!onTableDataChange) return;
    const nextRows = rawRows.map((r, rIdx) => {
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
      rows: [...rawRows, newRow],
    });
  };

  // Delete row
  const handleDeleteRow = (rowIndex: number) => {
    if (!onTableDataChange) return;
    const nextRows = rawRows.filter((_, idx) => idx !== rowIndex);
    onTableDataChange({
      columns,
      rows: nextRows,
    });
  };

  if (!columns.length && !rawRows.length) {
    return null;
  }

  const tableComponent = (
    <div
      className={`rounded-xl border border-slate-300/80 bg-white shadow-xs overflow-hidden ${
        isFullscreen
          ? "fixed inset-4 z-50 flex flex-col shadow-2xl border-2 border-emerald-600 animate-in fade-in zoom-in-95 duration-200"
          : "my-4"
      } ${className}`}
    >
      {/* ====== Excel Header / Ribbon Bar ====== */}
      <div className="bg-linear-to-r from-[#107C41] via-[#15803d] to-[#16a34a] text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-7 w-7 rounded-md bg-white/20 flex items-center justify-center backdrop-blur-xs shrink-0 shadow-inner">
            <BsFileEarmarkSpreadsheet className="text-white text-base" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold tracking-wide text-white truncate">
                {title || "Worksheet Table"}
              </h4>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-900/40 text-emerald-100 border border-emerald-400/30">
                Excel View
              </span>
            </div>
            {subtitle ? (
              <p className="text-[11px] text-emerald-100/90 truncate">{subtitle}</p>
            ) : null}
          </div>
          <span className="ml-2 hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono bg-black/20 text-emerald-100 border border-white/20">
            {rawRows.length}R × {columns.length}C
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs">
          {/* Search box */}
          {rawRows.length > 3 ? (
            <div className="relative">
              <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/70 text-xs" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="pl-7 pr-6 py-1 rounded-md bg-white/15 text-white placeholder-white/60 text-xs border border-white/20 focus:outline-hidden focus:bg-white/25 focus:ring-1 focus:ring-white/50 w-24 sm:w-36 transition-all"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                >
                  <FiX size={12} />
                </button>
              ) : null}
            </div>
          ) : null}

          {/* Copy Table */}
          <button
            type="button"
            onClick={handleCopyClipboard}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-colors font-medium shadow-2xs"
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
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-colors font-medium shadow-2xs"
            title="Export to CSV file"
          >
            <FiDownload />
            <span className="hidden sm:inline">CSV</span>
          </button>

          {/* Fullscreen toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1 p-1 sm:px-2 sm:py-1 rounded-md bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-colors font-medium"
            title={isFullscreen ? "Exit fullscreen" : "Maximize spreadsheet"}
          >
            {isFullscreen ? <FiMinimize2 size={13} /> : <FiMaximize2 size={13} />}
          </button>
        </div>
      </div>

      {/* ====== Excel Grid Container ====== */}
      <div className="overflow-auto w-full max-w-full flex-1 bg-white">
        <table className="w-full border-collapse text-left font-sans select-text">
          {/* Table Header Row */}
          <thead className="sticky top-0 z-10 bg-white">
            {/* Excel column letters banner (A, B, C, ...) */}
            <tr className="bg-slate-100 text-slate-400 text-[10px] font-mono border-b border-slate-200">
              <th className="w-10 px-2 py-0.5 text-center font-normal border-r border-slate-200 bg-slate-200/60 select-none">
                #
              </th>
              {columns.map((_, colIdx) => (
                <th
                  key={colIdx}
                  onClick={() => handleSort(colIdx)}
                  className="px-3 py-0.5 text-center font-normal border-r border-slate-200 last:border-r-0 cursor-pointer hover:bg-slate-200/50 transition-colors select-none"
                  title={`Sort by column ${getColumnLetter(colIdx)}`}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>{getColumnLetter(colIdx)}</span>
                    {sortColIndex === colIdx ? (
                      sortDirection === "asc" ? (
                        <FiArrowUp className="text-emerald-700" size={10} />
                      ) : (
                        <FiArrowDown className="text-emerald-700" size={10} />
                      )
                    ) : null}
                  </div>
                </th>
              ))}
              {editable ? (
                <th className="w-12 px-2 py-0.5 text-center font-normal select-none">
                  ⚙
                </th>
              ) : null}
            </tr>

            {/* Column Titles Header */}
            <tr className="bg-slate-50 text-slate-800 text-xs font-semibold uppercase tracking-wider border-b-2 border-slate-300">
              <th className="w-10 px-2 py-2.5 text-center border-r border-slate-300 bg-slate-200/70 font-mono text-[11px] text-slate-500 select-none">
                #
              </th>
              {columns.map((colName, colIdx) => (
                <th
                  key={colIdx}
                  onClick={() => handleSort(colIdx)}
                  className={`px-3.5 py-2.5 border-r border-slate-300 last:border-r-0 font-bold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors select-none ${
                    isTwoColumnNarrative && colIdx === 0
                      ? "w-1/4 sm:w-1/5 min-w-[160px] max-w-[260px]"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="truncate">{colName}</span>
                    {sortColIndex === colIdx ? (
                      sortDirection === "asc" ? (
                        <FiArrowUp className="text-emerald-600 shrink-0" size={12} />
                      ) : (
                        <FiArrowDown className="text-emerald-600 shrink-0" size={12} />
                      )
                    ) : null}
                  </div>
                </th>
              ))}
              {editable ? (
                <th className="w-12 px-2 py-2.5 text-center font-semibold text-slate-700 select-none">
                  Act
                </th>
              ) : null}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
            {processedRows.map(({ row, originalIndex }) => {
              // 1. Check if blank row
              if (isBlankRow(row)) {
                return (
                  <tr key={originalIndex} className="bg-slate-50/50 h-5">
                    <td className="w-10 px-2 py-1 text-center font-mono text-[10px] text-slate-300 bg-slate-100/50 border-r border-slate-200 select-none">
                      {originalIndex + 1}
                    </td>
                    <td
                      colSpan={columns.length + (editable ? 1 : 0)}
                      className="px-3 py-1 bg-slate-100/30 border-r border-slate-200"
                    />
                  </tr>
                );
              }

              // 2. Check if Category Header row
              const isCategoryHeader = isCategoryHeaderRow(row);
              if (isCategoryHeader) {
                return (
                  <tr
                    key={originalIndex}
                    className="bg-emerald-50/70 hover:bg-emerald-100/70 transition-colors border-t border-b border-emerald-300"
                  >
                    <td className="w-10 px-2 py-2 text-center font-mono text-[11px] text-emerald-800/60 bg-emerald-100/50 border-r border-emerald-300 select-none font-bold">
                      {originalIndex + 1}
                    </td>
                    <td
                      colSpan={columns.length + (editable ? 1 : 0)}
                      className="px-4 py-2 font-bold text-emerald-950 tracking-wider text-xs uppercase"
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-600 inline-block shadow-xs" />
                        <span>{String(row[0] ?? "")}</span>
                      </div>
                    </td>
                  </tr>
                );
              }

              // 3. Check if Total / Summary row
              const isTotalRow = isTotalOrSummaryRow(row);

              return (
                <tr
                  key={originalIndex}
                  className={`group transition-colors ${
                    isTotalRow
                      ? "bg-emerald-50/80 font-bold text-slate-900 border-t-2 border-b-4 border-double border-slate-800"
                      : originalIndex % 2 === 0
                        ? "bg-white hover:bg-emerald-50/30"
                        : "bg-slate-50/50 hover:bg-emerald-50/30"
                  }`}
                >
                  {/* Row Number Index */}
                  <td className="w-10 px-2 py-2 text-center font-mono text-[11px] text-slate-400 bg-slate-100/70 border-r border-slate-200 group-hover:bg-slate-200/60 select-none align-top">
                    {originalIndex + 1}
                  </td>

                  {/* Data Cells */}
                  {columns.map((_, colIdx) => {
                    const cellVal = row[colIdx];
                    const valStr = String(cellVal ?? "");
                    const isNumeric = isNumericOrFinancialValue(cellVal);
                    const isProseCell =
                      isTwoColumnNarrative && colIdx === 1
                        ? true
                        : hasMarkdownSyntax(valStr);

                    return (
                      <td
                        key={colIdx}
                        className={`px-3.5 py-2.5 border-r border-slate-200 last:border-r-0 ${
                          isTwoColumnNarrative && colIdx === 0
                            ? "w-1/4 sm:w-1/5 min-w-[160px] max-w-[260px] bg-slate-50/40 font-semibold text-slate-900 align-top"
                            : isNumeric
                              ? "text-right tabular-nums font-mono align-middle"
                              : "text-left align-top leading-relaxed"
                        } ${isTotalRow ? "font-bold text-slate-950" : ""}`}
                      >
                        {editable ? (
                          isProseCell || valStr.length > 80 ? (
                            <textarea
                              rows={3}
                              value={valStr}
                              onChange={(e) =>
                                handleCellChange(
                                  originalIndex,
                                  colIdx,
                                  e.target.value,
                                )
                              }
                              className="w-full px-2 py-1 text-xs rounded border border-slate-300 focus:border-emerald-500 focus:bg-white focus:outline-hidden resize-y font-sans leading-relaxed"
                            />
                          ) : (
                            <input
                              type="text"
                              value={valStr}
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
                          )
                        ) : isProseCell ? (
                          <div className="prose prose-xs max-w-none text-slate-800 leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:my-1.5 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:my-1.5 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:mb-1 [&_strong]:font-semibold [&_strong]:text-slate-950 [&_table]:my-2 [&_table]:border-collapse [&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-100 [&_th]:px-2 [&_th]:py-1 [&_td]:border [&_td]:border-slate-200 [&_td]:px-2 [&_td]:py-1">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {valStr}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <span
                            className={
                              isNumeric && valStr.startsWith("-")
                                ? "text-rose-600 font-semibold"
                                : ""
                            }
                          >
                            {valStr}
                          </span>
                        )}
                      </td>
                    );
                  })}

                  {/* Row Actions (if editable) */}
                  {editable ? (
                    <td className="w-12 px-2 py-1 text-center align-top">
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

            {processedRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (editable ? 2 : 1)}
                  className="px-4 py-8 text-center text-slate-400 text-xs italic"
                >
                  No matching rows found in worksheet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {/* ====== Footer / Table Controls ====== */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 shrink-0 gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-semibold text-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 inline-block" />
            Excel Worksheet
          </span>
          <span className="text-slate-300">|</span>
          <span>
            Showing {processedRows.length} of {rawRows.length} rows
          </span>
          {sortColIndex !== null ? (
            <>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={() => setSortColIndex(null)}
                className="text-emerald-700 hover:underline flex items-center gap-1 text-[11px]"
              >
                Reset sort ({columns[sortColIndex]} {sortDirection.toUpperCase()})
              </button>
            </>
          ) : null}
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

  return (
    <>
      {tableComponent}
      {isFullscreen ? (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40"
          onClick={() => setIsFullscreen(false)}
        />
      ) : null}
    </>
  );
};

export default ExcelTableView;
