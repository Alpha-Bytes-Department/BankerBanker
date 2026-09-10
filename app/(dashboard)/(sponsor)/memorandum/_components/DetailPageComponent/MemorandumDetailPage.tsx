"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { createLoanRequest } from "../../../_api/loan-requests-api";

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
import type {
  SectionBlock,
  MemorandumSection,
  MemorandumTableData,
} from "@/types/memorandum-detail";
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

type LoanRequestForm = {
  requestedAmount: string;
  loanTerm: string;
  ltv: string;
};

const MemorandumDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
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
  const [isRegeneratingAll, setIsRegeneratingAll] = useState(false);
  const [loanForm, setLoanForm] = useState<LoanRequestForm>({
    requestedAmount: "5000000.00",
    loanTerm: "24",
    ltv: "75.00",
  });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        let response;

        
        try {
          response = await api.get(`/api/v1/memorandums/${memorandumId}/`);
        } catch (err: any) {
          if (err?.response?.status === 404) {
            response = await api.get(`/api/memorandums/${memorandumId}/`);
          } else {
            throw err;
          }
        }
        const fetchedData = response.data?.data ?? response.data;

        // Enrich with property images/thumbnail if missing from memorandum detail
        if (
          fetchedData?.property &&
          (!fetchedData.thumbnail_url ||
            !Array.isArray(fetchedData.property_images) ||
            fetchedData.property_images.length === 0)
        ) {
          try {
            const propId =
              typeof fetchedData.property === "object"
                ? fetchedData.property.id
                : fetchedData.property;
            const propRes = await api
              .get(`/api/v1/properties/${propId}/`)
              .catch(() => api.get(`/api/properties/${propId}/`))
              .catch(() => null);
            const propData = propRes?.data?.data ?? propRes?.data;
            if (propData) {
              if (!fetchedData.thumbnail_url && propData.thumbnail_url) {
                fetchedData.thumbnail_url = propData.thumbnail_url;
              }
              if (
                (!fetchedData.property_images ||
                  fetchedData.property_images.length === 0) &&
                Array.isArray(propData.property_images) &&
                propData.property_images.length > 0
              ) {
                fetchedData.property_images = propData.property_images;
              } else if (
                (!fetchedData.property_images ||
                  fetchedData.property_images.length === 0) &&
                propData.thumbnail_url
              ) {
                fetchedData.property_images = [propData.thumbnail_url];
              }
            }
          } catch {
            // Ignore error
          }
        }

        setData(fetchedData);
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

  const propertyImages = useMemo(() => {
    if (!data) return [];
    const images: string[] = [];

    // 1. Check array fields
    if (Array.isArray(data.property_images) && data.property_images.length > 0) {
      images.push(...data.property_images);
    }
    if (Array.isArray(data.images) && data.images.length > 0) {
      images.push(...data.images);
    }
    if (Array.isArray(data.property_image_url) && data.property_image_url.length > 0) {
      images.push(...data.property_image_url);
    }

    // 2. Check string fields
    if (typeof data.thumbnail_url === "string" && data.thumbnail_url) {
      images.push(data.thumbnail_url);
    }
    if (typeof data.property_image_url === "string" && data.property_image_url) {
      images.push(data.property_image_url);
    }
    if (typeof data.image_url === "string" && data.image_url) {
      images.push(data.image_url);
    }
    if (typeof data.heroImage === "string" && data.heroImage) {
      images.push(data.heroImage);
    }

    // Filter valid strings and remove duplicates
    return Array.from(
      new Set(
        images.filter(
          (img): img is string => typeof img === "string" && img.trim().length > 0,
        ),
      ),
    );
  }, [data]);

  const resolvedHeroImage =
    propertyImages[0] ||
    data?.thumbnail_url ||
    (typeof data?.property_image_url === "string" ? data?.property_image_url : "") ||
    "";

  const updateSectionContent = async (
    sectionId: number,
    content: string,
    tableData?: MemorandumTableData | null,
  ) => {
    if (!memorandumId || !sectionId) {
      alert("Unable to update this section right now.");
      return;
    }

    const payload: Record<string, any> = { content };
    if (tableData !== undefined) {
      payload.table_data = tableData;
    }

    try {
      try {
        await api.patch(
          `/api/v1/memorandums/${memorandumId}/sections/${sectionId}/`,
          payload,
        );
      } catch (err: any) {
        if (err?.response?.status === 404) {
          await api.patch(
            `/api/memorandums/${memorandumId}/sections/${sectionId}/`,
            payload,
          );
        } else {
          throw err;
        }
      }

      setData((prev: any) => {
        if (!prev?.sections) return prev;
        return {
          ...prev,
          sections: prev.sections.map((item: MemorandumSection) =>
            item.id === sectionId
              ? {
                  ...item,
                  content,
                  ...(tableData !== undefined ? { table_data: tableData } : {}),
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
    const section = sections.find((item: MemorandumSection) => item.id === sectionId);

    if (!memorandumId || !sectionId) {
      alert("Unable to upload image for this section right now.");
      return;
    }

    const currentImage = section?.image_url || section?.image;
    if (currentImage) {
      toast.error("Only one image can be uploaded for this section.");
      return currentImage;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      let response;
      try {
        response = await api.post(
          `/api/v1/memorandums/${memorandumId}/sections/${sectionId}/image/`,
          formData,
        );
      } catch (err: any) {
        if (err?.response?.status === 404) {
          response = await api.post(
            `/api/memorandums/${memorandumId}/sections/${sectionId}/image/`,
            formData,
          );
        } else {
          throw err;
        }
      }

      const uploadedImageUrl =
        response?.data?.data?.image ?? response?.data?.image;

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

  const handleRegenerateSection = async (
    sectionId: number,
    sectionKey?: string,
  ) => {
    if (!memorandumId || !sectionId) {
      toast.error("Unable to regenerate this section right now.");
      return;
    }

    const toastId = toast.loading("Regenerating section with AI...");

    try {
      let response;
      try {
        response = await api.post(
          `/api/v1/memorandums/${memorandumId}/sections/${sectionId}/regenerate/`,
          { section_key: sectionKey },
        );
      } catch (err: any) {
        if (err?.response?.status === 404) {
          try {
            response = await api.post(
              `/api/memorandums/${memorandumId}/sections/${sectionId}/regenerate/`,
              { section_key: sectionKey },
            );
          } catch {
            response = await api.post(
              `/api/v1/memorandums/${memorandumId}/regenerate/`,
              { section_id: sectionId, section_key: sectionKey },
            );
          }
        } else {
          throw err;
        }
      }

      const resData = response?.data?.data ?? response?.data;

      if (resData?.sections && Array.isArray(resData.sections)) {
        setData(resData);
      } else if (
        resData?.id === sectionId ||
        resData?.content !== undefined ||
        resData?.table_data !== undefined
      ) {
        setData((prev: any) => {
          if (!prev?.sections) return prev;
          return {
            ...prev,
            sections: prev.sections.map((item: MemorandumSection) =>
              item.id === sectionId
                ? {
                    ...item,
                    content: resData.content ?? item.content,
                    table_data:
                      resData.table_data !== undefined
                        ? resData.table_data
                        : item.table_data,
                    is_regeneratable:
                      resData.is_regeneratable !== undefined
                        ? resData.is_regeneratable
                        : item.is_regeneratable,
                    blocks: resData.blocks ?? item.blocks,
                    updated_at: resData.updated_at ?? new Date().toISOString(),
                  }
                : item,
            ),
          };
        });
      } else {
        try {
          let refetchRes;
          try {
            refetchRes = await api.get(`/api/v1/memorandums/${memorandumId}/`);
          } catch {
            refetchRes = await api.get(`/api/memorandums/${memorandumId}/`);
          }
          const freshData = refetchRes?.data?.data ?? refetchRes?.data;
          if (freshData) {
            setData(freshData);
          }
        } catch {
          // ignore refetch err
        }
      }

      toast.success("Section regenerated successfully!", { id: toastId });
    } catch (error: any) {
      console.error("Failed to regenerate section:", error);
      const apiMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to regenerate section with AI. Please try again.";
      toast.error(apiMsg, { id: toastId });
    }
  };

  const handleRegenerateAll = async () => {
    if (!memorandumId) {
      toast.error("Unable to regenerate memorandum right now.");
      return;
    }

    const toastId = toast.loading("Regenerating all AI sections...");
    setIsRegeneratingAll(true);

    try {
      let response;
      try {
        response = await api.post(
          `/api/v1/memorandums/${memorandumId}/regenerate/`,
        );
      } catch (err: any) {
        if (err?.response?.status === 404) {
          response = await api.post(
            `/api/memorandums/${memorandumId}/regenerate/`,
          );
        } else {
          throw err;
        }
      }

      const resData = response?.data?.data ?? response?.data;
      if (resData?.sections && Array.isArray(resData.sections)) {
        setData(resData);
      } else {
        let refetchRes;
        try {
          refetchRes = await api.get(`/api/v1/memorandums/${memorandumId}/`);
        } catch {
          refetchRes = await api.get(`/api/memorandums/${memorandumId}/`);
        }
        const freshData = refetchRes?.data?.data ?? refetchRes?.data;
        if (freshData) setData(freshData);
      }

      toast.success("Memorandum regenerated successfully!", { id: toastId });
    } catch (error: any) {
      console.error("Failed to regenerate memorandum:", error);
      const apiMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to regenerate memorandum. Please try again.";
      toast.error(apiMsg, { id: toastId });
    } finally {
      setIsRegeneratingAll(false);
    }
  };

  const updateMemorandumStatus = async () => {
    if (!memorandumId || !data?.title) {
      toast.error("Unable to publish memorandum right now.");
      return;
    }

    try {
      setIsPublishing(true);
      const payload = {
        title: data.title,
        status: "Published",
        mode: "Preview",
      };

      try {
        await api.patch(`/api/v1/memorandums/${memorandumId}/`, payload);
      } catch (err: any) {
        if (err?.response?.status === 404) {
          await api.patch(`/api/memorandums/${memorandumId}/`, payload);
        } else {
          throw err;
        }
      }

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

      await createLoanRequest({
        property: propertyId,
        requested_amount: requestedAmountNumber.toFixed(2),
        loan_term: loanTermNumber,
        ltv: ltvNumber.toFixed(2),
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["loan-requests"] }),
        queryClient.invalidateQueries({ queryKey: ["sponsor-dashboard"] }),
      ]);

      toast.success("Loan request created successfully.");
      setIsLoanModalOpen(false);
    } catch (error: any) {
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to create loan request. Please review the fields and try again.";
      setLoanSubmitError(
        typeof apiMessage === "string" ? apiMessage : JSON.stringify(apiMessage),
      );
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
      title:
        section.label ||
        section.title ||
        formatSectionTitle(section.section_key || section.section_type),
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
        onRegenerateAll={handleRegenerateAll}
        isRegeneratingAll={isRegeneratingAll}
      />

      {activeTab === "editor" && (
        <div>
          <HeroSection
            heroImage={resolvedHeroImage}
            galleryImages={propertyImages}
            title={data?.property_name || resolvedPropertyName}
          />

          {sections.map((section: MemorandumSection) => (
            <DynamicSectionEditorCard
              key={section.id}
              section={section}
              onSave={updateSectionContent}
              onImageUpload={uploadSectionImage}
              onRegenerate={handleRegenerateSection}
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
            coverImage={resolvedHeroImage}
          />

          {propertyImages.length > 1 && (
            <div className="mb-8 bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  Property Photos & Assets ({propertyImages.length})
                </h3>
                <span className="text-xs text-slate-500">
                  Included in offering package
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {propertyImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative h-28 sm:h-36 rounded-lg overflow-hidden border border-slate-200 shadow-2xs group"
                  >
                    <Image
                      src={img}
                      alt={`${resolvedPropertyName} photo ${idx + 1}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

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
