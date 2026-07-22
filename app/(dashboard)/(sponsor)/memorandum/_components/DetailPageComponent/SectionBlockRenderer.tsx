"use client";

import React, { useCallback } from "react";
import type {
  SectionBlock,
  HeadingBlock,
  ParagraphBlock,
  KeyValueTableBlock,
  BulletListBlock,
} from "@/types/memorandum-detail";

type SectionBlockRendererProps = {
  blocks: SectionBlock[];
  /** When true the very first heading block is hidden (already shown by PreviewSection / EditorCard header). */
  skipFirstHeading?: boolean;
  /** When true, every element becomes inline‑editable (no raw markdown, no textarea). */
  editable?: boolean;
  /** Called whenever any block's content changes. Only fired when editable=true. */
  onBlocksChange?: (updatedBlocks: SectionBlock[]) => void;
};

/* ------------------------------------------------------------------ */
/*  Inline‑markdown helpers                                           */
/* ------------------------------------------------------------------ */

/** Strip wrapping `**` or `*` from a string for clean display. */
const stripBold = (text: string) =>
  text.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1");

/** Remove all * and # characters entirely (useful for raw cleanup) */
const stripAllMarkdown = (text: string) =>
  text.replace(/[*#]/g, "");

/** Render inline **bold** and *italic* as React nodes. */
const renderInline = (text: string): React.ReactNode => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-gray-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
};

/* ------------------------------------------------------------------ */
/*  Editable wrappers                                                  */
/* ------------------------------------------------------------------ */

/** Thin wrapper around an editable text element. Shows a subtle ring on focus when editing. */
const EditableText = ({
  value,
  onChange,
  as: Tag = "p",
  className = "",
  multiline = false,
}: {
  value: string;
  onChange: (v: string) => void;
  as?: "p" | "h3" | "h4" | "span" | "li";
  className?: string;
  multiline?: boolean;
}) => {
  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    const newVal = e.currentTarget.innerText || "";
    if (newVal !== value) {
      onChange(newVal);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    // For single‑line fields, press Enter to blur instead of newline
    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      (e.target as HTMLElement).blur();
    }
  };

  return (
    <Tag
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`outline-none rounded-md focus:ring-2 focus:ring-blue-400/50 focus:bg-blue-50/30 transition-colors px-1 -mx-1 ${className}`}
      dangerouslySetInnerHTML={{ __html: stripBold(value) }}
    />
  );
};

/* ------------------------------------------------------------------ */
/*  Block renderers                                                    */
/* ------------------------------------------------------------------ */

const HeadingRenderer = ({
  block,
  editable,
  onChange,
}: {
  block: HeadingBlock;
  editable?: boolean;
  onChange?: (content: string) => void;
}) => {
  const clean = stripBold(block.content)
    .replace(/^#+\s*/, "")
    .replace(/:$/, "");
  const isH3 = block.level <= 2;

  if (editable && onChange) {
    return (
      <EditableText
        value={clean}
        onChange={onChange}
        as={isH3 ? "h3" : "h4"}
        className={
          isH3
            ? "text-lg font-semibold text-gray-900 mt-6 mb-2 first:mt-0"
            : "text-base font-semibold text-gray-800 mt-5 mb-2 first:mt-0"
        }
      />
    );
  }

  if (isH3) {
    return (
      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2 first:mt-0">
        {clean}
      </h3>
    );
  }
  return (
    <h4 className="text-base font-semibold text-gray-800 mt-5 mb-2 first:mt-0">
      {clean}
    </h4>
  );
};

const ParagraphRenderer = ({
  block,
  editable,
  onChange,
}: {
  block: ParagraphBlock;
  editable?: boolean;
  onChange?: (content: string) => void;
}) => {
  if (editable && onChange) {
    return (
      <EditableText
        value={block.content}
        onChange={onChange}
        as="p"
        className="text-sm md:text-[15px] leading-relaxed text-gray-700 mb-3 last:mb-0"
        multiline
      />
    );
  }

  return (
    <p className="text-sm md:text-[15px] leading-relaxed text-gray-700 mb-3 last:mb-0">
      {renderInline(block.content)}
    </p>
  );
};

const KeyValueTableRenderer = ({
  block,
  editable,
  onRowChange,
}: {
  block: KeyValueTableBlock;
  editable?: boolean;
  onRowChange?: (rowIdx: number, field: "label" | "value", newVal: string) => void;
}) => {
  return (
    <div className="my-4 overflow-hidden rounded-xl border border-gray-200 shadow-xs">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#0D4DA5] text-white">
            <th className="px-4 py-3 text-left font-semibold w-2/5">
              Attribute
            </th>
            <th className="px-4 py-3 text-left font-semibold">Value</th>
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, idx) => (
            <tr
              key={row.key || idx}
              className={`border-t border-gray-100 ${
                idx % 2 === 0 ? "bg-white" : "bg-gray-50/60"
              } ${editable ? "" : "hover:bg-blue-50/40"} transition-colors`}
            >
              <td className="px-4 py-2.5 font-medium text-gray-700">
                {editable && onRowChange ? (
                  <EditableText
                    value={row.label}
                    onChange={(v) => onRowChange(idx, "label", v)}
                    as="span"
                    className="font-medium text-gray-700"
                  />
                ) : (
                  row.label
                )}
              </td>
              <td className="px-4 py-2.5 text-gray-900">
                {editable && onRowChange ? (
                  <EditableText
                    value={row.value}
                    onChange={(v) => onRowChange(idx, "value", v)}
                    as="span"
                    className="text-gray-900"
                  />
                ) : (
                  row.value
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const BulletListRenderer = ({
  block,
  editable,
  onItemChange,
}: {
  block: BulletListBlock;
  editable?: boolean;
  onItemChange?: (itemIdx: number, newVal: string) => void;
}) => {
  // If the first item looks like a **bold:** category header, extract it
  const items = [...block.items];
  let categoryHeader: string | null = null;
  let headerOffset = 0;

  if (
    items.length > 0 &&
    items[0].startsWith("*") &&
    items[0].endsWith(":**")
  ) {
    categoryHeader = stripBold(items.shift()!).replace(/:$/, "");
    headerOffset = 1;
  } else if (
    items.length > 0 &&
    items[0].startsWith("**") &&
    items[0].includes(":**")
  ) {
    categoryHeader = stripBold(items.shift()!).replace(/:$/, "");
    headerOffset = 1;
  }

  // Parse items to see if they are mostly key-value pairs (e.g., "**Key:** Value")
  const parsedItems = items.map((item) => {
    // First, strip all bold markers so we can cleanly split by colon
    // even if the markers were like "**Key:** Value"
    const cleanItem = stripBold(item);
    const match = cleanItem.match(/^([^:]+):\s*(.*)$/);
    if (match) {
      const key = stripAllMarkdown(match[1]).trim();
      const value = stripAllMarkdown(match[2]).trim();
      return { isKv: true, key, value, original: item };
    }
    return { isKv: false, key: stripAllMarkdown(item), value: "", original: item };
  });

  const isKeyValueList =
    items.length > 0 && parsedItems.every((p) => p.isKv);

  return (
    <div className="mb-3 last:mb-0">
      {categoryHeader && (
        editable && onItemChange ? (
          <EditableText
            value={categoryHeader}
            onChange={(v) => onItemChange(0, `**${v}:**`)}
            as="h4"
            className="text-sm font-semibold text-gray-800 mb-1.5 mt-3 first:mt-0"
          />
        ) : (
          <h4 className="text-sm font-semibold text-gray-800 mb-1.5 mt-3 first:mt-0">
            {categoryHeader}
          </h4>
        )
      )}

      {isKeyValueList ? (
        <div className="my-4 overflow-hidden rounded-xl border border-gray-200 shadow-xs">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0D4DA5] text-white">
                <th className="px-4 py-3 text-left font-semibold w-2/5">
                  Attribute
                </th>
                <th className="px-4 py-3 text-left font-semibold">Value</th>
              </tr>
            </thead>
            <tbody>
              {parsedItems.map((p, idx) => (
                <tr
                  key={idx}
                  className={`border-t border-gray-100 ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50/60"
                  } ${editable ? "" : "hover:bg-blue-50/40"} transition-colors`}
                >
                  <td className="px-4 py-2.5 font-medium text-gray-700">
                    {editable && onItemChange ? (
                      <EditableText
                        value={p.key}
                        onChange={(v) =>
                          onItemChange(idx + headerOffset, `**${v}:** ${p.value}`)
                        }
                        as="span"
                        className="font-medium text-gray-700 block"
                      />
                    ) : (
                      p.key
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-gray-900">
                    {editable && onItemChange ? (
                      <EditableText
                        value={p.value}
                        onChange={(v) =>
                          onItemChange(idx + headerOffset, `**${p.key}:** ${v}`)
                        }
                        as="span"
                        className="text-gray-900 block"
                      />
                    ) : (
                      renderInline(p.value)
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <ul className="space-y-1 pl-5 text-sm text-gray-700 list-disc marker:text-blue-500">
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {editable && onItemChange ? (
                <EditableText
                  value={stripBold(item)}
                  onChange={(v) => onItemChange(idx + headerOffset, v)}
                  as="span"
                  className="leading-relaxed"
                />
              ) : (
                renderInline(item)
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Utility: serialize blocks → markdown content string               */
/* ------------------------------------------------------------------ */

export const serializeBlocksToContent = (blocks: SectionBlock[]): string => {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "heading": {
          const prefix = "#".repeat(Math.min(block.level, 6));
          return `${prefix} ${block.content}`;
        }
        case "paragraph":
          return block.content;
        case "key_value_table":
          return block.rows
            .map((r) => `- **${r.label}:** ${r.value}`)
            .join("\n");
        case "bullet_list":
          return block.items.map((item) => `- ${item}`).join("\n");
        default:
          return "";
      }
    })
    .filter(Boolean)
    .join("\n\n");
};

/* ------------------------------------------------------------------ */
/*  Main renderer                                                      */
/* ------------------------------------------------------------------ */

const SectionBlockRenderer: React.FC<SectionBlockRendererProps> = ({
  blocks,
  skipFirstHeading = true,
  editable = false,
  onBlocksChange,
}) => {
  let skippedFirst = false;

  /** Create an updated copy of blocks with one block replaced. */
  const updateBlock = useCallback(
    (blockIndex: number, updatedBlock: SectionBlock) => {
      if (!onBlocksChange) return;
      const updated = blocks.map((b, i) =>
        i === blockIndex ? updatedBlock : b,
      );
      onBlocksChange(updated);
    },
    [blocks, onBlocksChange],
  );

  return (
    <div>
      {blocks.map((block, index) => {
        // Skip the very first heading – it duplicates the section title
        if (
          skipFirstHeading &&
          !skippedFirst &&
          block.type === "heading"
        ) {
          skippedFirst = true;
          return null;
        }

        switch (block.type) {
          case "heading":
            return (
              <HeadingRenderer
                key={index}
                block={block}
                editable={editable}
                onChange={(content) =>
                  updateBlock(index, { ...block, content })
                }
              />
            );
          case "paragraph":
            return (
              <ParagraphRenderer
                key={index}
                block={block}
                editable={editable}
                onChange={(content) =>
                  updateBlock(index, { ...block, content })
                }
              />
            );
          case "key_value_table":
            return (
              <KeyValueTableRenderer
                key={index}
                block={block}
                editable={editable}
                onRowChange={(rowIdx, field, newVal) => {
                  const updatedRows = block.rows.map((r, ri) =>
                    ri === rowIdx ? { ...r, [field]: newVal } : r,
                  );
                  updateBlock(index, { ...block, rows: updatedRows });
                }}
              />
            );
          case "bullet_list":
            return (
              <BulletListRenderer
                key={index}
                block={block}
                editable={editable}
                onItemChange={(itemIdx, newVal) => {
                  const updatedItems = block.items.map((item, ii) =>
                    ii === itemIdx ? newVal : item,
                  );
                  updateBlock(index, { ...block, items: updatedItems });
                }}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

export default SectionBlockRenderer;
