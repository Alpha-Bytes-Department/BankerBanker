"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { BsFileEarmarkSpreadsheet } from "react-icons/bs";

type SectionMarkdownProps = {
  content?: string;
  className?: string;
};

const SectionMarkdown: React.FC<SectionMarkdownProps> = ({
  content = "",
  className,
}) => {
  return (
    <div
      className={cn(
        "wrap-break-word [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_h1]:mb-3 [&_h1]:text-xl [&_h1]:font-semibold [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-3 [&_a]:text-blue-600 [&_a]:underline hover:[&_a]:text-blue-700 [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-gray-100 [&_pre]:p-3",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ node: _node, ...props }) => (
            <div className="my-5 overflow-hidden rounded-xl border border-slate-300/80 bg-white shadow-xs">
              <div className="flex items-center justify-between bg-linear-to-r from-[#107C41] to-[#15803d] px-3.5 py-1.5 text-xs text-white">
                <div className="flex items-center gap-2">
                  <BsFileEarmarkSpreadsheet className="text-sm" />
                  <span className="font-semibold tracking-wide text-xs">Worksheet Table</span>
                </div>
                <span className="text-[10px] text-emerald-100 bg-white/10 px-2 py-0.5 rounded-full">
                  Excel View
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs" {...props} />
              </div>
            </div>
          ),
          thead: ({ node: _node, ...props }) => (
            <thead
              className="bg-slate-50 border-b-2 border-slate-300 font-semibold text-slate-700 uppercase tracking-wider text-xs"
              {...props}
            />
          ),
          th: ({ node: _node, ...props }) => (
            <th
              className="border-r border-slate-200 px-3.5 py-2.5 text-left font-semibold text-slate-700 whitespace-nowrap last:border-r-0"
              {...props}
            />
          ),
          td: ({ node: _node, ...props }) => (
            <td
              className="border-t border-r border-slate-200 px-3.5 py-2 text-slate-700 last:border-r-0 hover:bg-emerald-50/20 transition-colors"
              {...props}
            />
          ),
          tr: ({ node: _node, ...props }) => (
            <tr
              className="even:bg-slate-50/50 hover:bg-slate-50/80 transition-colors"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default SectionMarkdown;
