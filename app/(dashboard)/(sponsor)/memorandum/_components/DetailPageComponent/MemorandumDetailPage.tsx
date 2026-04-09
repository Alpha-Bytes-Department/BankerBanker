"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

// Components
import MemorandumHeader from "./MemorandumHeader";
import HeroSection from "./HeroSection";
import PreviewCover from "./PreviewCover";
import TableOfContents from "./TableOfContents";
import DynamicSectionEditorCard from "./DynamicSectionEditorCard";
import DynamicPreviewSections from "./DynamicPreviewSections";
import {
  formatSectionTitle,
  parsePropertyInformationFromSections,
  sanitizeInlineMarkdownText,
} from "./section-utils";
import { MemorandumTab } from "@/types/memorandum-detail";
import api from "@/Provider/api";
import { toast } from "sonner";
import ConfirmActionModal from "@/components/ConfirmActionModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type MemorandumSection = {
  id: number;
  section_type: string;
  content: string;
  image_url?: string | null;
  order: number;
  updated_at?: string;
};

type LoanRequestForm = {
  requestedAmount: string;
  loanTerm: string;
  ltv: string;
};

const MemorandumDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const memorandumId = Array.isArray(id) ? id[0] : id;

  const [activeTab, setActiveTab] = useState<MemorandumTab>("editor");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [isSubmittingLoan, setIsSubmittingLoan] = useState(false);
  const [loanSubmitError, setLoanSubmitError] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [loanForm, setLoanForm] = useState<LoanRequestForm>({
    requestedAmount: "5000000.00",
    loanTerm: "24",
    ltv: "75.00",
  });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/memorandums/${memorandumId}/`);
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching memorandum details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (memorandumId) fetchDetail();
  }, [memorandumId]);

  useEffect(() => {
    const handleScroll = () => {
      if (activeTab !== "preview") {
        setShowBackToTop(false);
        return;
      }

      setShowBackToTop(window.scrollY > 320);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeTab]);

  const sections = useMemo(() => {
    const responseSections = data?.sections || [];
    return [...responseSections].sort(
      (a: MemorandumSection, b: MemorandumSection) => {
        if (a.order === b.order) {
          return a.id - b.id;
        }
        return a.order - b.order;
      },
    );
  }, [data?.sections]);

  const parsedPropertyInformation = useMemo(() => {
    return parsePropertyInformationFromSections(sections);
  }, [sections]);

  const resolvedPropertyName =
    sanitizeInlineMarkdownText(
      data?.property_name ||
        parsedPropertyInformation.propertyName ||
        "Property",
    ) || "Property";
  const resolvedLocation =
    sanitizeInlineMarkdownText(
      data?.property_address || parsedPropertyInformation.address || "",
    ) || "";
  const resolvedPropertyType =
    sanitizeInlineMarkdownText(
      data?.property_type || parsedPropertyInformation.propertyType || "N/A",
    ) || "N/A";
  const resolvedUnits =
    Number(data?.number_of_units) > 0
      ? Number(data?.number_of_units)
      : Number(parsedPropertyInformation.numberOfUnits) || 0;
  const resolvedYearBuilt =
    Number(data?.year_built) > 0
      ? Number(data?.year_built)
      : Number(parsedPropertyInformation.yearBuilt) || 0;
  const resolvedOccupancy =
    Number(data?.occupancy) > 0
      ? Number(data?.occupancy)
      : Number(parsedPropertyInformation.occupancy) || 0;
  const isPublished = String(data?.status || "").toLowerCase() === "published";

  const updateSectionContent = async (sectionId: number, content: string) => {
    if (!memorandumId || !sectionId) {
      alert("Unable to update this section right now.");
      return;
    }

    try {
      await api.patch(
        `/api/memorandums/${memorandumId}/sections/${sectionId}/`,
        {
          content,
        },
      );

      setData((prev: any) => {
        if (!prev?.sections) return prev;
        return {
          ...prev,
          sections: prev.sections.map((item: MemorandumSection) =>
            item.id === sectionId
              ? {
                  ...item,
                  content,
                }
              : item,
          ),
        };
      });

      toast.success("Section updated successfully.");
    } catch (error) {
      console.error("Failed to update section content:", error);
      toast.error("Failed to update section. Please try again.");
    }
  };

  const uploadSectionImage = async (sectionId: number, file: File) => {
    const section = sections.find((item) => item.id === sectionId);

    if (!memorandumId || !sectionId) {
      alert("Unable to upload image for this section right now.");
      return;
    }

    if (section.image_url) {
      toast.error("Only one image can be uploaded for this section.");
      return section.image_url;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await api.post(
        `/api/memorandums/${memorandumId}/sections/${sectionId}/image/`,
        formData,
      );

      const uploadedImageUrl = response?.data?.data?.image;

      if (uploadedImageUrl) {
        setData((prev: any) => {
          if (!prev?.sections) return prev;
          return {
            ...prev,
            sections: prev.sections.map((item: MemorandumSection) =>
              item.id === sectionId
                ? {
                    ...item,
                    image_url: uploadedImageUrl,
                  }
                : item,
            ),
          };
        });
        toast.success("Section image uploaded successfully.");
      }

      return uploadedImageUrl;
    } catch (error) {
      console.error("Failed to upload section image:", error);
      toast.error("Failed to upload section image. Please try again.");
      return;
    }
  };

  const updateMemorandumStatus = async () => {
    if (!memorandumId || !data?.title) {
      toast.error("Unable to publish memorandum right now.");
      return;
    }

    try {
      setIsPublishing(true);
      await api.patch(`/api/memorandums/${memorandumId}/`, {
        title: data.title,
        status: "Published",
        mode: "Preview",
      });

      setData((prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          status: "Published",
          mode: "Preview",
        };
      });

      toast.success("Memorandum published successfully.");
      setIsPublishModalOpen(false);
    } catch (error) {
      console.error("Failed to publish memorandum:", error);
      toast.error("Failed to publish memorandum. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleExport = () => {
    if (!data?.id) {
      return;
    }

    try {
      sessionStorage.setItem(
        `memorandum-download-${data.id}`,
        JSON.stringify(data),
      );
    } catch (error) {
      console.error("Failed to persist memorandum snapshot for export:", error);
    }

    router.push(`/memorandum/${data.id}/download`);
  };

  const handleLoanFormChange = (
    field: keyof LoanRequestForm,
    value: string,
  ) => {
    setLoanForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submitLoanRequest = async () => {
    const propertyId = Number(data?.property);
    const requestedAmountNumber = Number(loanForm.requestedAmount);
    const loanTermNumber = Number(loanForm.loanTerm);
    const ltvNumber = Number(loanForm.ltv);

    if (!Number.isFinite(propertyId) || propertyId <= 0) {
      setLoanSubmitError(
        "Property id is missing in memorandum data. Unable to submit loan request.",
      );
      return;
    }

    if (!Number.isFinite(requestedAmountNumber) || requestedAmountNumber <= 0) {
      setLoanSubmitError("Requested amount must be greater than 0.");
      return;
    }

    if (!Number.isFinite(loanTermNumber) || loanTermNumber <= 0) {
      setLoanSubmitError("Loan term must be a valid number of months.");
      return;
    }

    if (!Number.isFinite(ltvNumber) || ltvNumber <= 0) {
      setLoanSubmitError("LTV must be a valid percentage.");
      return;
    }

    try {
      setIsSubmittingLoan(true);
      setLoanSubmitError("");

      await api.post("/api/loans/requests/", {
        property: propertyId,
        requested_amount: requestedAmountNumber.toFixed(2),
        loan_term: loanTermNumber,
        ltv: ltvNumber.toFixed(2),
      });

      toast.success("Loan request created successfully.");
      setIsLoanModalOpen(false);
    } catch (error: any) {
      const apiMessage =
        error?.response?.data?.message ||
        "Failed to create loan request. Please review the fields and try again.";
      setLoanSubmitError(apiMessage);
    } finally {
      setIsSubmittingLoan(false);
    }
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading)
    return <div className="p-20 text-center">Loading details...</div>;
  if (!data)
    return <div className="p-20 text-center">Memorandum not found.</div>;

  const tableItems = sections.map(
    (section: MemorandumSection, index: number) => ({
      id: index + 1,
      title: formatSectionTitle(section.section_type),
      pageNumber: index + 3,
      anchorId: `preview-section-${section.id}`,
    }),
  );

  return (
    <div className="mx-auto py-6">
      <Link
        href="/memorandum"
        className="flex items-center gap-1 mb-4 text-gray-800 hover:text-blue-700 w-fit"
      >
        <IoIosArrowRoundBack className="text-2xl" />
        <p className="text-sm md:text-base">Back to Memorandums</p>
      </Link>

      <MemorandumHeader
        memorandumId={data?.id}
        title={data?.title || "Offering Memorandum"}
        subtitle={data?.property_name || ""}
        status={data?.status}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        canPublish={activeTab === "preview" && data?.status !== "Published"}
        isPublishing={isPublishing}
        onPublish={() => setIsPublishModalOpen(true)}
        onExport={handleExport}
      />

      {activeTab === "editor" && (
        <div>
          <HeroSection
            heroImage={data?.property_image_url || ""}
            galleryImages={[data?.property_image_url || ""]}
            title={data?.property_name || "Property"}
          />

          {sections.map((section: MemorandumSection) => (
            <DynamicSectionEditorCard
              key={section.id}
              section={section}
              onSave={updateSectionContent}
              onImageUpload={uploadSectionImage}
            />
          ))}
        </div>
      )}

      {activeTab === "preview" && (
        <div className="shadow-xl rounded-lg p-3 md:p-6 lg:p-10 mb-10">
          <div className="mb-4 flex justify-end">
            {isPublished ? (
              <button
                type="button"
                onClick={() => {
                  setLoanSubmitError("");
                  setIsLoanModalOpen(true);
                }}
                className="px-4 py-2 rounded-lg bg-[#0D4DA5] text-white text-sm font-medium hover:bg-[#0A3D84] transition-colors"
              >
                Ask Loan
              </button>
            ) : null}
          </div>

          <PreviewCover
            presentedBy={data?.sponsor_name || "Memorandum Team"}
            confidential={true}
            investmentOpportunity="INVESTMENT OFFERING"
            propertyName={resolvedPropertyName}
            location={resolvedLocation}
            stats={{
              propertyType: resolvedPropertyType,
              units: resolvedUnits,
              yearBuilt: resolvedYearBuilt,
              occupancy: resolvedOccupancy,
            }}
            offeringDate={new Date(
              data?.created_at || Date.now(),
            ).toLocaleDateString()}
          />

          <TableOfContents items={tableItems} />
          <DynamicPreviewSections sections={sections} />
        </div>
      )}

      <ConfirmActionModal
        open={isPublishModalOpen}
        onOpenChange={setIsPublishModalOpen}
        title="Publish memorandum?"
        description="This will update the memorandum status to Published and mode to Preview."
        confirmText="Publish"
        cancelText="Cancel"
        onConfirm={updateMemorandumStatus}
        isLoading={isPublishing}
      />

      <Dialog open={isLoanModalOpen} onOpenChange={setIsLoanModalOpen}>
        <DialogContent
          showCloseButton={!isSubmittingLoan}
          className="max-w-lg rounded-2xl border border-white/40 bg-white/95 p-0 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-md overflow-hidden"
        >
          <div className="h-1.5 bg-linear-to-r from-blue-600 via-blue-500 to-cyan-500" />

          <div className="p-6">
            <DialogHeader className="gap-2">
              <DialogTitle className="text-xl font-semibold text-[#0F172A]">
                Ask Loan
              </DialogTitle>
              <DialogDescription className="text-sm leading-relaxed text-[#475569]">
                Submit a loan request for this memorandum property.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-4">
              <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-700">
                Property: {resolvedPropertyName}
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1">
                  Requested Amount
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={loanForm.requestedAmount}
                  onChange={(e) =>
                    handleLoanFormChange("requestedAmount", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="5000000.00"
                  disabled={isSubmittingLoan}
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1">
                  Loan Term (months)
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={loanForm.loanTerm}
                  onChange={(e) =>
                    handleLoanFormChange("loanTerm", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="24"
                  disabled={isSubmittingLoan}
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1">LTV</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={loanForm.ltv}
                  onChange={(e) => handleLoanFormChange("ltv", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="75.00"
                  disabled={isSubmittingLoan}
                />
              </div>

              {loanSubmitError ? (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {loanSubmitError}
                </div>
              ) : null}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsLoanModalOpen(false)}
                disabled={isSubmittingLoan}
                className="px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitLoanRequest}
                disabled={isSubmittingLoan}
                className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#0D4DA5] hover:bg-[#0A3D84] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingLoan ? "Submitting..." : "Submit Loan Request"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {activeTab === "preview" && showBackToTop ? (
        <button
          type="button"
          onClick={handleBackToTop}
          className="fixed bottom-6 right-26 z-50 h-11 w-11 rounded-full bg-[#0D4DA5] text-white shadow-lg hover:bg-[#0A3D84] transition-colors flex items-center justify-center"
          aria-label="Back to top"
          title="Back to top"
        >
          <IoIosArrowUp className="h-6 w-6" />
        </button>
      ) : null}
    </div>
  );
};

export default MemorandumDetailPage;
