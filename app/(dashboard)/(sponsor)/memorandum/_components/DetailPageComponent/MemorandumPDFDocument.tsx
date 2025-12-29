import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

//========== PDF Styles (Matching Preview Components) ===========
const styles = StyleSheet.create({
  page: {
    padding: 0,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
  },

  //========== Cover Page Styles ===========
  coverPage: {
    position: "relative",
    padding: 40,
    minHeight: "100%",
    backgroundColor: "#1E3A8A", // Blue background
    color: "#ffffff",
  },
  coverHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 60,
  },
  presentedByBox: {
    flexDirection: "row",
    gap: 12,
  },
  presentedByIcon: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.1)",
    border: "2 solid rgba(255,255,255,0.2)",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  presentedByText: {
    fontSize: 10,
    color: "#BFDBFE",
  },
  presentedByName: {
    fontSize: 12,
    color: "#ffffff",
  },
  confidentialBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: "8 16",
    borderRadius: 20,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  confidentialText: {
    fontSize: 12,
    color: "#ffffff",
  },
  coverMainContent: {
    marginTop: 100,
  },
  investmentLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  investmentLine: {
    width: 48,
    height: 2,
    backgroundColor: "#93C5FD",
  },
  investmentText: {
    fontSize: 11,
    color: "#BFDBFE",
    letterSpacing: 1.5,
  },
  propertyNameTitle: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 24,
    lineHeight: 1.2,
  },
  locationText: {
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 16,
    marginTop: 40,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
    border: "1 solid rgba(255,255,255,0.2)",
    borderRadius: 8,
    padding: 16,
  },
  statLabel: {
    fontSize: 10,
    color: "#BFDBFE",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  coverFooter: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    borderTop: "2 solid rgba(255,255,255,0.2)",
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  coverFooterText: {
    fontSize: 10,
    color: "#BFDBFE",
  },

  //========== Table of Contents Styles ===========
  tocPage: {
    padding: 40,
    backgroundColor: "#F9FAFB",
  },
  tocHeader: {
    marginBottom: 24,
  },
  tocLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  tocLabelLine: {
    width: 48,
    height: 4,
    backgroundColor: "#2563EB",
    borderRadius: 2,
  },
  tocLabelText: {
    fontSize: 10,
    color: "#2563EB",
    letterSpacing: 1.5,
  },
  tocTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
  },
  tocContainer: {
    backgroundColor: "#ffffff",
    border: "1 solid #E5E7EB",
    borderRadius: 8,
  },
  tocItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottom: "1 solid #E5E7EB",
  },
  tocItemNumber: {
    width: 40,
    height: 40,
    backgroundColor: "#DBEAFE",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  tocItemNumberText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2563EB",
  },
  tocItemTitle: {
    fontSize: 14,
    color: "#111827",
    flex: 1,
  },
  tocPageNumber: {
    fontSize: 14,
    color: "#6B7280",
  },

  //========== Section Styles ===========
  sectionPage: {
    padding: 40,
  },
  sectionContainer: {
    backgroundColor: "#ffffff",
    border: "1 solid #E5E7EB",
    borderRadius: 8,
    padding: 32,
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 24,
  },
  sectionLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  sectionLabelLine: {
    width: 48,
    height: 4,
    backgroundColor: "#2563EB",
    borderRadius: 2,
  },
  sectionLabelText: {
    fontSize: 10,
    color: "#2563EB",
    letterSpacing: 1.5,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  sectionUnderline: {
    width: 80,
    height: 4,
    backgroundColor: "#2563EB",
    borderRadius: 2,
  },
  contentBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 24,
  },
  paragraph: {
    fontSize: 11,
    lineHeight: 1.7,
    color: "#374151",
    marginBottom: 12,
    textAlign: "justify",
  },
  bulletList: {
    gap: 12,
  },
  bulletItem: {
    flexDirection: "row",
    gap: 12,
  },
  bulletDot: {
    fontSize: 16,
    color: "#111827",
  },
  bulletText: {
    fontSize: 11,
    lineHeight: 1.7,
    color: "#374151",
    flex: 1,
  },

  //========== Property Overview Grid ===========
  propertyGrid: {
    flexDirection: "row",
    gap: 24,
    marginTop: 24,
  },
  propertyCard: {
    flex: 1,
    backgroundColor: "#EFF6FF",
    border: "2 solid #DBEAFE",
    borderRadius: 8,
    padding: 24,
  },
  performanceCard: {
    flex: 1,
    backgroundColor: "#F0FDF4",
    border: "2 solid #D1FAE5",
    borderRadius: 8,
    padding: 24,
  },
  cardHeader: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottom: "1 solid #BFDBFE",
  },
  cardLabel: {
    fontSize: 11,
    color: "#374151",
  },
  cardValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#111827",
  },
  occupancyBadge: {
    backgroundColor: "#D1FAE5",
    color: "#059669",
    padding: "4 12",
    borderRadius: 4,
    fontSize: 11,
    fontWeight: "bold",
  },

  //========== Market Summary Styles ===========
  marketSummaryBox: {
    backgroundColor: "#FAF5FF",
    border: "2 solid #E9D5FF",
    borderRadius: 8,
    padding: 24,
  },
  marketKeyIndicators: {
    marginTop: 16,
  },
  marketIndicatorLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  marketIndicatorList: {
    gap: 8,
  },
  marketIndicatorItem: {
    flexDirection: "row",
    gap: 8,
  },
  marketIndicatorText: {
    fontSize: 10,
    color: "#374151",
  },

  //========== Image Styles ===========
  imageColumn: {
    width: "100%",
    marginBottom: 24,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "auto",
    maxHeight: 200,
    objectFit: "contain",
    borderRadius: 8,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: "#DBEAFE",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2563EB",
  },

  //========== Table Styles ===========
  table: {
    marginTop: 16,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #E5E7EB",
    paddingVertical: 12,
  },
  tableHeader: {
    backgroundColor: "#F3F4F6",
    fontWeight: "bold",
    paddingVertical: 16,
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    color: "#374151",
    padding: 4,
  },
  tableCellBold: {
    fontWeight: "bold",
    color: "#111827",
  },

  //========== Financial Analysis Styles ===========
  financialTable: {
    marginTop: 16,
    fontSize: 8,
  },
  financialTableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #E5E7EB",
    paddingVertical: 8,
  },
  financialTableCell: {
    flex: 1,
    fontSize: 8,
    color: "#374151",
    padding: 2,
  },

  //========== Sales/Lease Comparables Styles ===========
  comparablesHeader: {
    marginBottom: 12,
  },
  comparablesSubtext: {
    fontSize: 10,
    color: "#6B7280",
    marginTop: 4,
  },
  comparableMapImage: {
    width: "100%",
    height: 150,
    objectFit: "contain",
    borderRadius: 8,
    marginBottom: 16,
  },

  //========== Area Amenities Styles ===========
  amenitiesGrid: {
    gap: 12,
    marginTop: 16,
  },
  amenityCard: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 8,
    border: "1 solid #E5E7EB",
  },
  amenityIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#DBEAFE",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  amenityContent: {
    flex: 1,
  },
  amenityName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  amenityCategory: {
    fontSize: 10,
    color: "#6B7280",
  },

  //========== Sponsorship Styles ===========
  sponsorCard: {
    backgroundColor: "#F0F9FF",
    border: "2 solid #DBEAFE",
    borderRadius: 8,
    padding: 24,
  },
  sponsorHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  sponsorName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 12,
  },
  sponsorDescription: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 16,
  },
  sponsorStatsGrid: {
    flexDirection: "row",
    gap: 16,
  },
  sponsorStatItem: {
    flex: 1,
    alignItems: "center",
  },
  sponsorStatValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563EB",
  },
  sponsorStatLabel: {
    fontSize: 10,
    color: "#6B7280",
    marginTop: 4,
  },

  //========== Disclaimer Styles ===========
  disclaimerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  disclaimerLine: {
    width: 48,
    height: 2,
    backgroundColor: "#DC2626",
  },
  disclaimerLabelText: {
    fontSize: 10,
    color: "#DC2626",
    letterSpacing: 1.5,
  },
  disclaimerBox: {
    backgroundColor: "#FEF2F2",
    border: "2 solid #FECACA",
    borderRadius: 8,
    padding: 24,
    marginBottom: 16,
  },
  disclaimerNotice: {
    marginBottom: 16,
  },
  disclaimerNoticeTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  disclaimerNoticeText: {
    fontSize: 10,
    color: "#374151",
    lineHeight: 1.6,
  },
  disclaimerCardsGrid: {
    flexDirection: "row",
    gap: 16,
  },
  disclaimerCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    border: "1 solid #E5E7EB",
    borderRadius: 8,
    padding: 16,
  },
  disclaimerCardIconBox: {
    width: 48,
    height: 48,
    backgroundColor: "#DBEAFE",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  disclaimerCardTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  disclaimerCardDescription: {
    fontSize: 10,
    color: "#6B7280",
  },
});

//========== PDF Document Component ===========
interface MemorandumPDFProps {
  data: any;
}

const MemorandumPDFDocument: React.FC<MemorandumPDFProps> = ({ data }) => {
  return (
    <Document>
      {/* ====== Cover Page (Matching PreviewCover) ====== */}
      <Page size="A4" style={styles.coverPage}>
        {/* Header Section */}
        <View style={styles.coverHeader}>
          <View style={styles.presentedByBox}>
            <View style={styles.presentedByIcon}>
              <Text style={{ color: "#ffffff", fontSize: 20 }}>🏢</Text>
            </View>
            <View>
              <Text style={styles.presentedByText}>Presented by</Text>
              <Text style={styles.presentedByName}>{data.presentedBy}</Text>
            </View>
          </View>

          {data.confidential && (
            <View style={styles.confidentialBadge}>
              <Text style={styles.confidentialText}>🔒 Confidential</Text>
            </View>
          )}
        </View>

        {/* Main Content */}
        <View style={styles.coverMainContent}>
          <View style={styles.investmentLabel}>
            <View style={styles.investmentLine} />
            <Text style={styles.investmentText}>
              {data.investmentOpportunity}
            </Text>
          </View>

          <Text style={styles.propertyNameTitle}>
            {data.propertyName || data.subtitle}
          </Text>

          {data.location && (
            <Text style={styles.locationText}>📍 {data.location}</Text>
          )}

          {/* Stats Grid */}
          {data.propertyStats && (
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Property Type</Text>
                <Text style={styles.statValue}>
                  {data.propertyStats.propertyType}
                </Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Units</Text>
                <Text style={styles.statValue}>{data.propertyStats.units}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Year Built</Text>
                <Text style={styles.statValue}>
                  {data.propertyStats.yearBuilt}
                </Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Occupancy</Text>
                <Text style={styles.statValue}>
                  {data.propertyStats.occupancy}%
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.coverFooter}>
          <Text style={styles.coverFooterText}>
            Offering Memorandum | {data.offeringDate}
          </Text>
          <Text style={styles.coverFooterText}>
            FOR QUALIFIED INVESTORS ONLY
          </Text>
        </View>
      </Page>

      {/* ====== Table of Contents (Matching TableOfContents) ====== */}
      <Page size="A4" style={styles.tocPage}>
        <View style={styles.tocHeader}>
          <View style={styles.tocLabelRow}>
            <View style={styles.tocLabelLine} />
            <Text style={styles.tocLabelText}>CONTENTS</Text>
          </View>
          <Text style={styles.tocTitle}>Table of Contents</Text>
        </View>

        <View style={styles.tocContainer}>
          {data.tableOfContents?.map((item: any, index: number) => (
            <View
              key={item.id}
              style={[
                styles.tocItem,
                index === data.tableOfContents.length - 1
                  ? { borderBottom: "none" }
                  : {},
              ]}
            >
              <View style={{ flexDirection: "row", flex: 1 }}>
                <View style={styles.tocItemNumber}>
                  <Text style={styles.tocItemNumberText}>{item.id}</Text>
                </View>
                <Text style={styles.tocItemTitle}>{item.title}</Text>
              </View>
              <Text style={styles.tocPageNumber}>{item.pageNumber}</Text>
            </View>
          ))}
        </View>
      </Page>

      {/* ====== Executive Summary (Matching PreviewSection 1) ====== */}
      <Page size="A4" style={styles.sectionPage} wrap>
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionLabelRow}>
              <View style={styles.sectionLabelLine} />
              <Text style={styles.sectionLabelText}>SECTION 1</Text>
            </View>
            <Text style={styles.sectionTitle}>Executive Summary</Text>
            <View style={styles.sectionUnderline} />
          </View>

          <View style={styles.contentBox}>
            <Text style={styles.paragraph}>{data.executiveSummary}</Text>
          </View>
        </View>
      </Page>

      {/* ====== Property Overview (Matching PreviewSection 2) ====== */}
      <Page size="A4" style={styles.sectionPage} wrap>
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionLabelRow}>
              <View style={styles.sectionLabelLine} />
              <Text style={styles.sectionLabelText}>SECTION 2</Text>
            </View>
            <Text style={styles.sectionTitle}>Property Overview</Text>
            <View style={styles.sectionUnderline} />
          </View>

          {data.heroImage && (
            <View style={styles.imageColumn}>
              <Image
                src={data.heroImage}
                style={[styles.image, { maxHeight: 180 }]}
              />
            </View>
          )}

          <View style={styles.contentBox}>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCell, styles.tableCellBold]}>
                  Property Details
                </Text>
                <Text style={[styles.tableCell, styles.tableCellBold]}>
                  Information
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Property Name</Text>
                <Text style={[styles.tableCell, styles.tableCellBold]}>
                  {data.propertyOverview?.propertyName}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Address</Text>
                <Text style={[styles.tableCell, styles.tableCellBold]}>
                  {data.propertyOverview?.address},{" "}
                  {data.propertyOverview?.zipCode}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Year Built/Renovated</Text>
                <Text style={[styles.tableCell, styles.tableCellBold]}>
                  {data.propertyOverview?.yearBuilt}/
                  {data.propertyOverview?.yearRenovated}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Property Type</Text>
                <Text style={[styles.tableCell, styles.tableCellBold]}>
                  {data.propertyOverview?.propertyType}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Number of Units</Text>
                <Text style={[styles.tableCell, styles.tableCellBold]}>
                  {data.propertyOverview?.numberOfUnits}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Rentable Area</Text>
                <Text style={[styles.tableCell, styles.tableCellBold]}>
                  {data.propertyOverview?.rentableArea?.toLocaleString()} SF
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Occupancy</Text>
                <Text style={[styles.tableCell, styles.tableCellBold]}>
                  {data.propertyOverview?.occupancy}%
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Parking Spaces</Text>
                <Text style={[styles.tableCell, styles.tableCellBold]}>
                  {data.propertyOverview?.parkingSpaces}
                </Text>
              </View>
            </View>
          </View>

          {/* Property Details and Performance Cards */}
          <View style={styles.propertyGrid}>
            <View style={styles.propertyCard}>
              <View style={styles.cardHeader}>
                <Text style={{ fontSize: 18 }}>🏢</Text>
                <Text style={styles.cardTitle}>Property Details</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Property Type:</Text>
                <Text style={styles.cardValue}>
                  {data.propertyOverview?.propertyType}
                </Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Number of Units:</Text>
                <Text style={styles.cardValue}>
                  {data.propertyOverview?.numberOfUnits}
                </Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Rentable Area:</Text>
                <Text style={styles.cardValue}>
                  {data.propertyOverview?.rentableArea?.toLocaleString()} SF
                </Text>
              </View>
              <View style={[styles.cardRow, { borderBottom: "none" }]}>
                <Text style={styles.cardLabel}>Parking Spaces:</Text>
                <Text style={styles.cardValue}>
                  {data.propertyOverview?.parkingSpaces}
                </Text>
              </View>
            </View>

            <View style={styles.performanceCard}>
              <View style={styles.cardHeader}>
                <Text style={{ fontSize: 18 }}>📈</Text>
                <Text style={styles.cardTitle}>Performance Metrics</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Current Occupancy:</Text>
                <Text style={styles.occupancyBadge}>
                  {data.propertyOverview?.occupancy}%
                </Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Year Built:</Text>
                <Text style={styles.cardValue}>
                  {data.propertyOverview?.yearBuilt}
                </Text>
              </View>
              <View style={[styles.cardRow, { borderBottom: "none" }]}>
                <Text style={styles.cardLabel}>Year Renovated:</Text>
                <Text style={styles.cardValue}>
                  {data.propertyOverview?.yearRenovated || "N/A"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Page>

      {/* ====== Gallery Images (Combined) ====== */}
      {data.galleryImages && data.galleryImages.length > 0 && (
        <Page size="A4" style={styles.sectionPage} wrap>
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>
              Property Gallery
            </Text>
            {data.galleryImages.map((image: string, index: number) => (
              <View
                key={index}
                style={[styles.imageColumn, { marginBottom: 12 }]}
              >
                <Image src={image} style={[styles.image, { maxHeight: 160 }]} />
              </View>
            ))}
          </View>
        </Page>
      )}

      {/* ====== Property Highlights (Matching PreviewSection 3) ====== */}
      <Page size="A4" style={styles.sectionPage} wrap>
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionLabelRow}>
              <View style={styles.sectionLabelLine} />
              <Text style={styles.sectionLabelText}>SECTION 3</Text>
            </View>
            <Text style={styles.sectionTitle}>Property Highlights</Text>
            <View style={styles.sectionUnderline} />
          </View>

          <View style={styles.contentBox}>
            <View style={styles.bulletList}>
              {data.propertyHighlights?.map(
                (highlight: string, index: number) => (
                  <View key={index} style={styles.bulletItem}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{highlight}</Text>
                  </View>
                )
              )}
            </View>
          </View>
        </View>
      </Page>

      {/* ====== Area Overview (Matching PreviewSection 4) ====== */}
      <Page size="A4" style={styles.sectionPage} wrap>
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionLabelRow}>
              <View style={styles.sectionLabelLine} />
              <Text style={styles.sectionLabelText}>SECTION 4</Text>
            </View>
            <Text style={styles.sectionTitle}>Area Overview</Text>
            <View style={styles.sectionUnderline} />
          </View>

          <View style={styles.contentBox}>
            <Text style={styles.paragraph}>
              {data.areaOverview?.description}
            </Text>
            <Text style={styles.paragraph}>
              {data.areaOverview?.neighborhoodDescription}
            </Text>
            <Text style={styles.paragraph}>
              {data.areaOverview?.localAmenities}
            </Text>
          </View>
        </View>
      </Page>

      {/* ====== Area Highlights (Matching PreviewSection 5) ====== */}
      <Page size="A4" style={styles.sectionPage} wrap>
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionLabelRow}>
              <View style={styles.sectionLabelLine} />
              <Text style={styles.sectionLabelText}>SECTION 5</Text>
            </View>
            <Text style={styles.sectionTitle}>Area Highlights</Text>
            <View style={styles.sectionUnderline} />
          </View>

          <View style={styles.contentBox}>
            <View style={styles.bulletList}>
              {data.areaHighlights?.map((highlight: string, index: number) => (
                <View key={index} style={styles.bulletItem}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>{highlight}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Page>

      {/* ====== Market Summary (Matching PreviewSection 6) ====== */}
      <Page size="A4" style={styles.sectionPage} wrap>
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionLabelRow}>
              <View style={styles.sectionLabelLine} />
              <Text style={styles.sectionLabelText}>SECTION 6</Text>
            </View>
            <Text style={styles.sectionTitle}>Market Summary</Text>
            <View style={styles.sectionUnderline} />
          </View>

          <View style={styles.marketSummaryBox}>
            <Text style={styles.paragraph}>
              {data.marketSummary?.description}
            </Text>

            {data.marketSummary?.keyIndicators && (
              <View style={styles.marketKeyIndicators}>
                <Text style={styles.marketIndicatorLabel}>
                  Key market indicators:
                </Text>
                <View style={styles.marketIndicatorList}>
                  {data.marketSummary.keyIndicators.map(
                    (indicator: any, index: number) => (
                      <View key={index} style={styles.marketIndicatorItem}>
                        <Text style={styles.bulletDot}>•</Text>
                        <Text style={styles.marketIndicatorText}>
                          {indicator.label}: {indicator.value}
                        </Text>
                      </View>
                    )
                  )}
                </View>
              </View>
            )}
          </View>
        </View>
      </Page>

      {/* ====== Financing Summary (Matching PreviewSection 7) ====== */}
      <Page size="A4" style={styles.sectionPage} wrap>
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionLabelRow}>
              <View style={styles.sectionLabelLine} />
              <Text style={styles.sectionLabelText}>SECTION 7</Text>
            </View>
            <Text style={styles.sectionTitle}>Financing Summary</Text>
            <View style={styles.sectionUnderline} />
          </View>

          <View style={styles.contentBox}>
            <Text style={styles.paragraph}>{data.financingSummary}</Text>
          </View>
        </View>
      </Page>

      {/* ====== Financial Analysis (Section 8 - Conditional) ====== */}
      {data.financialAnalysis && data.financialAnalysis.loanQuotes && (
        <>
          <Page size="A4" style={styles.sectionPage} wrap>
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionLabelRow}>
                  <View style={styles.sectionLabelLine} />
                  <Text style={styles.sectionLabelText}>SECTION 8</Text>
                </View>
                <Text style={styles.sectionTitle}>Financial Analysis</Text>
                <View style={styles.sectionUnderline} />
              </View>

              {/* Permanent Financing Quote Matrix */}
              <View style={{ marginBottom: 16 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 12,
                  }}
                >
                  <Text style={[styles.cardTitle, { fontSize: 13 }]}>
                    Permanent Financing Quote Matrix
                  </Text>
                  <Text style={styles.comparablesSubtext}>As of 7/10/2025</Text>
                </View>

                <View style={styles.financialTable}>
                  <View style={[styles.financialTableRow, styles.tableHeader]}>
                    <Text
                      style={[
                        styles.financialTableCell,
                        { fontWeight: "bold" },
                      ]}
                    >
                      Lender
                    </Text>
                    <Text
                      style={[
                        styles.financialTableCell,
                        { fontWeight: "bold" },
                      ]}
                    >
                      Leverage
                    </Text>
                    <Text
                      style={[
                        styles.financialTableCell,
                        { fontWeight: "bold" },
                      ]}
                    >
                      DSCR
                    </Text>
                    <Text
                      style={[
                        styles.financialTableCell,
                        { fontWeight: "bold" },
                      ]}
                    >
                      Amort
                    </Text>
                    <Text
                      style={[
                        styles.financialTableCell,
                        { fontWeight: "bold" },
                      ]}
                    >
                      Rate
                    </Text>
                    <Text
                      style={[
                        styles.financialTableCell,
                        { fontWeight: "bold" },
                      ]}
                    >
                      Spread
                    </Text>
                    <Text
                      style={[
                        styles.financialTableCell,
                        { fontWeight: "bold" },
                      ]}
                    >
                      Orig Fee
                    </Text>
                  </View>
                  {data.financialAnalysis.loanQuotes
                    .slice(0, 6)
                    .map((quote: any, index: number) => (
                      <View key={index} style={styles.financialTableRow}>
                        <Text style={styles.financialTableCell}>
                          {quote.lender}
                        </Text>
                        <Text style={styles.financialTableCell}>
                          {quote.leverage}
                        </Text>
                        <Text style={styles.financialTableCell}>
                          {quote.dscr}
                        </Text>
                        <Text style={styles.financialTableCell}>
                          {quote.amortization}
                        </Text>
                        <Text style={styles.financialTableCell}>
                          {quote.rate}
                        </Text>
                        <Text style={styles.financialTableCell}>
                          {quote.indexSpread}
                        </Text>
                        <Text style={styles.financialTableCell}>
                          {quote.originationFee}
                        </Text>
                      </View>
                    ))}
                </View>
              </View>

              {/* Loan Request Summary */}
              {data.financialAnalysis.loanRequest && (
                <View style={styles.contentBox}>
                  <Text style={[styles.cardTitle, { marginBottom: 12 }]}>
                    Loan Request Summary
                  </Text>
                  <View style={styles.table}>
                    <View style={styles.tableRow}>
                      <Text style={styles.tableCell}>Loan Amount</Text>
                      <Text style={[styles.tableCell, styles.tableCellBold]}>
                        {data.financialAnalysis.loanRequest.loanAmount}
                      </Text>
                    </View>
                    <View style={styles.tableRow}>
                      <Text style={styles.tableCell}>Estimated Value</Text>
                      <Text style={[styles.tableCell, styles.tableCellBold]}>
                        {data.financialAnalysis.loanRequest.estimatedValue}
                      </Text>
                    </View>
                    <View style={styles.tableRow}>
                      <Text style={styles.tableCell}>LTV</Text>
                      <Text style={[styles.tableCell, styles.tableCellBold]}>
                        {data.financialAnalysis.loanRequest.ltv}
                      </Text>
                    </View>
                    <View style={styles.tableRow}>
                      <Text style={styles.tableCell}>Financing Type</Text>
                      <Text style={[styles.tableCell, styles.tableCellBold]}>
                        {data.financialAnalysis.loanRequest.financingType}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </Page>
        </>
      )}

      {/* ====== Sales Comparables (Section 9 - Conditional) ====== */}
      {data.salesComparables && data.salesComparables.comparables && (
        <Page size="A4" style={styles.sectionPage} wrap>
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionLabelRow}>
                <View style={styles.sectionLabelLine} />
                <Text style={styles.sectionLabelText}>SECTION 9</Text>
              </View>
              <Text style={styles.sectionTitle}>Sales Comparables</Text>
              <View style={styles.sectionUnderline} />
            </View>

            <View style={styles.comparablesHeader}>
              <Text style={styles.comparablesSubtext}>
                Comparable sales data sourced from public records and MLS
                databases
              </Text>
            </View>

            {/* Map Image */}
            {data.salesComparables.mapImage && (
              <Image
                src={data.salesComparables.mapImage}
                style={styles.comparableMapImage}
              />
            )}

            {/* Comparables Table */}
            <View style={styles.financialTable}>
              <View style={[styles.financialTableRow, styles.tableHeader]}>
                <Text
                  style={[
                    styles.financialTableCell,
                    { fontWeight: "bold", flex: 0.3 },
                  ]}
                >
                  #
                </Text>
                <Text
                  style={[
                    styles.financialTableCell,
                    { fontWeight: "bold", flex: 2 },
                  ]}
                >
                  Address
                </Text>
                <Text
                  style={[styles.financialTableCell, { fontWeight: "bold" }]}
                >
                  Sale Date
                </Text>
                <Text
                  style={[styles.financialTableCell, { fontWeight: "bold" }]}
                >
                  Price
                </Text>
                <Text
                  style={[styles.financialTableCell, { fontWeight: "bold" }]}
                >
                  Units
                </Text>
                <Text
                  style={[styles.financialTableCell, { fontWeight: "bold" }]}
                >
                  Cap Rate
                </Text>
              </View>
              {data.salesComparables.comparables.map((comp: any) => (
                <View key={comp.id} style={styles.financialTableRow}>
                  <Text style={[styles.financialTableCell, { flex: 0.3 }]}>
                    {comp.id}
                  </Text>
                  <Text style={[styles.financialTableCell, { flex: 2 }]}>
                    {comp.address}
                  </Text>
                  <Text style={styles.financialTableCell}>{comp.saleDate}</Text>
                  <Text style={styles.financialTableCell}>
                    {comp.salePrice}
                  </Text>
                  <Text style={styles.financialTableCell}>{comp.units}</Text>
                  <Text style={styles.financialTableCell}>{comp.capRate}</Text>
                </View>
              ))}
            </View>
          </View>
        </Page>
      )}

      {/* ====== Lease Comparables (Section 10 - Conditional) ====== */}
      {data.leaseComparables && data.leaseComparables.comparables && (
        <Page size="A4" style={styles.sectionPage} wrap>
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionLabelRow}>
                <View style={styles.sectionLabelLine} />
                <Text style={styles.sectionLabelText}>SECTION 10</Text>
              </View>
              <Text style={styles.sectionTitle}>Lease Comparables</Text>
              <View style={styles.sectionUnderline} />
            </View>

            <View style={styles.comparablesHeader}>
              <Text style={styles.comparablesSubtext}>
                Rental market analysis and comparable lease rates
              </Text>
            </View>

            {/* Comparables Table */}
            <View style={styles.financialTable}>
              <View style={[styles.financialTableRow, styles.tableHeader]}>
                <Text
                  style={[
                    styles.financialTableCell,
                    { fontWeight: "bold", flex: 0.3 },
                  ]}
                >
                  #
                </Text>
                <Text
                  style={[
                    styles.financialTableCell,
                    { fontWeight: "bold", flex: 2 },
                  ]}
                >
                  Address
                </Text>
                <Text
                  style={[styles.financialTableCell, { fontWeight: "bold" }]}
                >
                  Unit Type
                </Text>
                <Text
                  style={[styles.financialTableCell, { fontWeight: "bold" }]}
                >
                  SF
                </Text>
                <Text
                  style={[styles.financialTableCell, { fontWeight: "bold" }]}
                >
                  Monthly Rent
                </Text>
                <Text
                  style={[styles.financialTableCell, { fontWeight: "bold" }]}
                >
                  $/SF
                </Text>
              </View>
              {data.leaseComparables.comparables.map((comp: any) => (
                <View key={comp.id} style={styles.financialTableRow}>
                  <Text style={[styles.financialTableCell, { flex: 0.3 }]}>
                    {comp.id}
                  </Text>
                  <Text style={[styles.financialTableCell, { flex: 2 }]}>
                    {comp.address}
                  </Text>
                  <Text style={styles.financialTableCell}>{comp.unitType}</Text>
                  <Text style={styles.financialTableCell}>
                    {comp.squareFeet}
                  </Text>
                  <Text style={styles.financialTableCell}>
                    {comp.monthlyRent}
                  </Text>
                  <Text style={styles.financialTableCell}>{comp.rentPsf}</Text>
                </View>
              ))}
            </View>

            {/* Market Stats */}
            {data.leaseComparables.stats && (
              <View style={[styles.propertyGrid, { marginTop: 16 }]}>
                <View style={styles.propertyCard}>
                  <Text style={styles.cardTitle}>Average Rent</Text>
                  <Text
                    style={[styles.cardValue, { fontSize: 16, marginTop: 8 }]}
                  >
                    {data.leaseComparables.stats.averageRent}
                  </Text>
                </View>
                <View style={styles.propertyCard}>
                  <Text style={styles.cardTitle}>Avg $/SF</Text>
                  <Text
                    style={[styles.cardValue, { fontSize: 16, marginTop: 8 }]}
                  >
                    {data.leaseComparables.stats.avgRentPsf}
                  </Text>
                </View>
                <View style={styles.performanceCard}>
                  <Text style={styles.cardTitle}>Market Trend</Text>
                  <Text style={[styles.occupancyBadge, { marginTop: 8 }]}>
                    {data.leaseComparables.stats.marketTrend}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </Page>
      )}

      {/* ====== Area Amenities (Section 11 - Conditional) ====== */}
      {data.areaAmenities && data.areaAmenities.amenities && (
        <Page size="A4" style={styles.sectionPage} wrap>
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionLabelRow}>
                <View style={styles.sectionLabelLine} />
                <Text style={styles.sectionLabelText}>SECTION 11</Text>
              </View>
              <Text style={styles.sectionTitle}>Area Amenities</Text>
              <View style={styles.sectionUnderline} />
            </View>

            {/* Hero Image */}
            {data.areaAmenities.heroImage && (
              <Image
                src={data.areaAmenities.heroImage}
                style={[styles.image, { maxHeight: 150, marginBottom: 16 }]}
              />
            )}

            {/* Amenities List */}
            <View style={styles.amenitiesGrid}>
              {data.areaAmenities.amenities.map((amenity: any) => (
                <View key={amenity.id} style={styles.amenityCard}>
                  <View style={styles.amenityIcon}>
                    <Text style={{ fontSize: 16 }}>📍</Text>
                  </View>
                  <View style={styles.amenityContent}>
                    <Text style={styles.amenityName}>{amenity.name}</Text>
                    <Text style={styles.amenityCategory}>
                      {amenity.category} • {amenity.distance}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </Page>
      )}

      {/* ====== Sponsorship (Section 12 - Conditional) ====== */}
      {data.sponsorship && data.sponsorship.companyName && (
        <Page size="A4" style={styles.sectionPage} wrap>
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionLabelRow}>
                <View style={styles.sectionLabelLine} />
                <Text style={styles.sectionLabelText}>SECTION 12</Text>
              </View>
              <Text style={styles.sectionTitle}>Sponsorship</Text>
              <View style={styles.sectionUnderline} />
            </View>

            <View style={styles.sponsorCard}>
              <View style={styles.sponsorHeader}>
                <View style={styles.logoPlaceholder}>
                  <Text style={styles.logoText}>🏢</Text>
                </View>
                <Text style={styles.sponsorName}>
                  {data.sponsorship.companyName}
                </Text>
                <Text style={styles.sponsorDescription}>
                  {data.sponsorship.description}
                </Text>
              </View>

              {/* Sponsor Stats */}
              <View style={styles.sponsorStatsGrid}>
                {data.sponsorship.totalAssets && (
                  <View style={styles.sponsorStatItem}>
                    <Text style={styles.sponsorStatValue}>
                      {data.sponsorship.totalAssets}
                    </Text>
                    <Text style={styles.sponsorStatLabel}>Total Assets</Text>
                  </View>
                )}
                {data.sponsorship.propertiesManaged && (
                  <View style={styles.sponsorStatItem}>
                    <Text style={styles.sponsorStatValue}>
                      {data.sponsorship.propertiesManaged}
                    </Text>
                    <Text style={styles.sponsorStatLabel}>Properties</Text>
                  </View>
                )}
                {data.sponsorship.yearEstablished && (
                  <View style={styles.sponsorStatItem}>
                    <Text style={styles.sponsorStatValue}>
                      {data.sponsorship.yearEstablished}
                    </Text>
                    <Text style={styles.sponsorStatLabel}>Established</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </Page>
      )}

      {/* ====== Disclaimer (Section 13 - Conditional) ====== */}
      {data.disclaimer && data.disclaimer.mainNotices && (
        <Page size="A4" style={styles.sectionPage} wrap>
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <View style={styles.disclaimerHeader}>
                <View style={styles.disclaimerLine} />
                <Text style={styles.disclaimerLabelText}>IMPORTANT NOTICE</Text>
              </View>
              <Text style={styles.sectionTitle}>Disclaimer & Disclosures</Text>
              <View style={styles.sectionUnderline} />
            </View>

            {/* Disclaimer Box */}
            <View style={styles.disclaimerBox}>
              {data.disclaimer.mainNotices.map((notice: any, index: number) => (
                <View key={index} style={styles.disclaimerNotice}>
                  <Text style={styles.disclaimerNoticeTitle}>
                    {notice.title}
                  </Text>
                  <Text style={styles.disclaimerNoticeText}>
                    {notice.content}
                  </Text>
                </View>
              ))}
            </View>

            {/* Disclaimer Cards */}
            {data.disclaimer.cards && (
              <View style={styles.disclaimerCardsGrid}>
                {data.disclaimer.cards.map((card: any) => (
                  <View key={card.id} style={styles.disclaimerCard}>
                    <View style={styles.disclaimerCardIconBox}>
                      <Text style={{ fontSize: 20 }}>
                        {card.icon === "lock"
                          ? "🔒"
                          : card.icon === "shield"
                          ? "🛡️"
                          : "📄"}
                      </Text>
                    </View>
                    <Text style={styles.disclaimerCardTitle}>{card.title}</Text>
                    <Text style={styles.disclaimerCardDescription}>
                      {card.description}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </Page>
      )}
    </Document>
  );
};

export default MemorandumPDFDocument;
