export const formatSectionTitle = (sectionType: string): string => {
  return sectionType
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

type SectionLike = {
  section_type?: string;
  section_key?: string;
  label?: string;
  title?: string;
  content?: string;
};

export type ParsedPropertyInformation = {
  propertyName?: string;
  address?: string;
  propertyType?: string;
  numberOfUnits?: number;
  yearBuilt?: number;
  occupancy?: number;
};

export const sanitizeInlineMarkdownText = (value?: string): string => {
  if (!value) {
    return "";
  }

  let sanitized = value.trim();

  sanitized = sanitized.replace(/`/g, "");
  sanitized = sanitized.replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1");
  sanitized = sanitized.replace(/^(\*\*|__|\*|_)+\s*/, "");
  sanitized = sanitized.replace(/\s*(\*\*|__|\*|_)+$/, "");
  sanitized = sanitized.replace(/^[:\-|\s]+/, "").trim();

  return sanitized;
};

const normalizeForMatch = (value: string): string => {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const escapeForRegex = (value: string): string => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const extractLabeledValue = (
  content: string,
  labels: string[],
): string | undefined => {
  if (!content) {
    return undefined;
  }

  const labelGroup = labels.map(escapeForRegex).join("|");
  const regex = new RegExp(
    `(?:^|\\n)\\s*(?:[-*]\\s*)?(?:\\*\\*|__)?(?:${labelGroup})(?:\\*\\*|__)?\\s*:?\\s*(.+)$`,
    "im",
  );
  const match = content.match(regex);

  if (!match?.[1]) {
    return undefined;
  }

  return sanitizeInlineMarkdownText(match[1]);
};

const parseNumericValue = (value?: string): number | undefined => {
  if (!value) {
    return undefined;
  }

  const numeric = Number(value.replace(/[^0-9.-]/g, ""));
  if (!Number.isFinite(numeric)) {
    return undefined;
  }

  return numeric;
};

export const parsePropertyInformationFromSections = (
  sections: SectionLike[] = [],
): ParsedPropertyInformation => {
  const propertyInformationSection = sections.find(
    (section) =>
      section.section_key === "property_information" ||
      section.section_type === "property_information",
  );

  const content = propertyInformationSection?.content || "";
  if (!content) {
    return {};
  }

  const propertyName = extractLabeledValue(content, ["Property Name"]);
  const address = extractLabeledValue(content, ["Address", "Property Address"]);
  const propertyType = extractLabeledValue(content, ["Type", "Property Type"]);

  const unitsRaw = extractLabeledValue(content, [
    "Number of Units / Keys",
    "Number of Units",
    "Units",
    "No\\. of Units",
    "Keys",
  ]);
  const yearBuiltRaw = extractLabeledValue(content, ["Year Built"]);
  const occupancyRaw = extractLabeledValue(content, [
    "Occupancy Rate",
    "Occupancy",
  ]);

  return {
    propertyName: sanitizeInlineMarkdownText(propertyName),
    address: sanitizeInlineMarkdownText(address),
    propertyType: sanitizeInlineMarkdownText(propertyType),
    numberOfUnits: parseNumericValue(unitsRaw),
    yearBuilt: parseNumericValue(yearBuiltRaw),
    occupancy: parseNumericValue(occupancyRaw),
  };
};

export const parseKeyValueContentToTable = (
  content?: string,
): { columns: string[]; rows: string[][] } | null => {
  if (!content) return null;
  const lines = content.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length < 3) return null;

  const parsedRows: string[][] = [];
  for (const line of lines) {
    // Skip if line looks like markdown header or table or list
    if (
      line.startsWith("#") ||
      line.startsWith("|") ||
      line.startsWith("---") ||
      line.startsWith("```")
    ) {
      return null;
    }
    const cleanLine = line.replace(/^[-*•]\s+/, "");
    const colonIndex = cleanLine.indexOf(":");
    if (colonIndex <= 0) {
      return null;
    }
    const key = cleanLine.slice(0, colonIndex).trim().replace(/\*\*/g, "");
    const value = cleanLine.slice(colonIndex + 1).trim().replace(/\*\*/g, "");
    if (!key || !value) return null;
    parsedRows.push([key, value]);
  }

  if (parsedRows.length >= 3) {
    return {
      columns: ["Property Metric", "Specification / Value"],
      rows: parsedRows,
    };
  }
  return null;
};

const extractHeadingText = (line: string): string | null => {
  const markdownHeadingMatch = line.match(/^#{1,6}\s+(.+)$/);
  if (markdownHeadingMatch) {
    return markdownHeadingMatch[1].trim();
  }

  const boldHeadingMatch = line.match(/^(?:\*\*|__)(.+?)(?:\*\*|__)$/);
  if (boldHeadingMatch) {
    return boldHeadingMatch[1].trim();
  }

  return null;
};

export const stripLeadingSectionHeading = (
  content: string,
  sectionTitle: string,
): string => {
  if (!content || !sectionTitle) {
    return content;
  }

  const lines = content.split(/\r?\n/);
  const firstContentLineIndex = lines.findIndex(
    (line) => line.trim().length > 0,
  );

  if (firstContentLineIndex === -1) {
    return content;
  }

  const firstContentLine = lines[firstContentLineIndex].trim();
  const extractedHeading = extractHeadingText(firstContentLine);

  if (!extractedHeading) {
    return content;
  }

  const normalizedTitle = normalizeForMatch(sectionTitle);
  const normalizedHeading = normalizeForMatch(extractedHeading);

  const shouldStripHeading =
    normalizedHeading === normalizedTitle ||
    normalizedHeading.startsWith(`${normalizedTitle} `) ||
    normalizedHeading.startsWith(normalizedTitle);

  if (!shouldStripHeading) {
    return content;
  }

  let contentStartIndex = firstContentLineIndex + 1;
  while (
    contentStartIndex < lines.length &&
    lines[contentStartIndex].trim().length === 0
  ) {
    contentStartIndex += 1;
  }

  return [
    ...lines.slice(0, firstContentLineIndex),
    ...lines.slice(contentStartIndex),
  ].join("\n");
};
