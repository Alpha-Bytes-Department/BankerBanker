"use client";
import { useMemo, useState, useEffect, useCallback } from "react";

import PropertyCard from "@/components/PropertyCard";
import StatusCard from "@/components/StatusCard";
import ConfirmActionModal from "@/components/ConfirmActionModal";
import api from "@/Provider/api";
import { toast } from "sonner";

// Define an interface for your API data for better Type Safety
interface Memorandum {
  id: number;
  title: string;
  property: number;
  property_name: string;
  property_image_url: string;
  status: string;
  mode: string;
  created_at: string;
  updated_at?: string;
}

const MemorandamPage = () => {
  const [memorandums, setMemorandums] = useState<Memorandum[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [pendingDeleteMemorandum, setPendingDeleteMemorandum] = useState<{
    id: number;
    title: string;
  } | null>(null);

  const fetchMemorandums = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/memorandums/");
      const apiData: Memorandum[] = response.data?.data ?? [];
      setMemorandums(apiData);
    } catch (error) {
      console.error("Error fetching memorandums:", error);
      toast.error("Unable to load memorandums right now.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMemorandums();
  }, [fetchMemorandums]);

  const handleDeleteMemorandum = async (memorandumId: number) => {
    try {
      setDeletingId(memorandumId);
      await api.delete(`/api/memorandums/${memorandumId}/`);
      setMemorandums((prev) => prev.filter((item) => item.id !== memorandumId));
      toast.success("Memorandum deleted successfully.");
    } catch (error) {
      console.error("Failed to delete memorandum:", error);
      toast.error("Failed to delete memorandum. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const confirmDeleteMemorandum = async () => {
    if (!pendingDeleteMemorandum) return;

    await handleDeleteMemorandum(pendingDeleteMemorandum.id);
    setPendingDeleteMemorandum(null);
  };

  const memorandumStats = useMemo(() => {
    const stats = {
      total: memorandums.length,
      generating: 0,
      draft: 0,
      published: 0,
      previewMode: 0,
    };

    for (const item of memorandums) {
      const status = (item.status || "").toLowerCase();
      const mode = (item.mode || "").toLowerCase();

      if (status === "generating") stats.generating += 1;
      if (status === "draft") stats.draft += 1;
      if (status === "published") stats.published += 1;
      if (mode === "preview") stats.previewMode += 1;
    }

    return stats;
  }, [memorandums]);

  const cardData = useMemo(
    () =>
      memorandums.map((item) => ({
        id: item.id,
        property: String(item.property),
        title: item.title,
        property_address: item.property_name,
        property_type: item.status,
        property_image_url: item.property_image_url,
        created_at: item.created_at,
        updated_at: item.updated_at,
        status: item.status,
        location: item.property_name,
        link: `/memorandum/${item.id}`,
        link2: `/memorandum/${item.id}/download`,
      })),
    [memorandums],
  );

  if (loading) {
    return (
      <div className="text-center py-20 text-lg">
        Loading your memorandums...
      </div>
    );
  }

  return (
    <div className="">
      <h1 className="text-start text-lg md:text-2xl font-semibold py-2">
        Memorandums
      </h1>
      <p className="text-base text-start lg:text-lg md:text-lg">
        Monitor your memorandums and related details below.
      </p>

      <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 2xl:gap-10 my-10">
        <StatusCard
          type="Properties"
          titleOverride="Total Memorandums"
          statusLabelOverride="published"
          data={{
            value: memorandumStats.total,
            status: memorandumStats.published,
          }}
        />
        <StatusCard
          type="quotes"
          titleOverride="Generating"
          statusLabelOverride="currently running"
          data={{
            value: memorandumStats.generating,
            status: memorandumStats.generating,
          }}
        />
        <StatusCard
          type="documents"
          titleOverride="Draft"
          statusLabelOverride="ready to review"
          data={{ value: memorandumStats.draft, status: memorandumStats.draft }}
        />
        <StatusCard
          type="value"
          titleOverride="Published"
          statusLabelOverride="in preview mode"
          data={{
            value: memorandumStats.published,
            status: memorandumStats.previewMode,
          }}
        />
      </div>

      <div className="mb-10">
        {cardData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5 place-items-center">
            {cardData.map((memorandum) => (
              <PropertyCard
                key={memorandum.id}
                data={memorandum}
                size="small"
                secondaryButtonText={
                  deletingId === memorandum.id ? "Deleting..." : "Delete"
                }
                secondaryButtonClassName="bg-red-600 text-white hover:bg-red-700"
                onSecondaryAction={() => {
                  if (deletingId === memorandum.id) return;
                  setPendingDeleteMemorandum({
                    id: memorandum.id,
                    title: memorandum.title,
                  });
                }}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No memorandums available.</p>
        )}
      </div>

      <ConfirmActionModal
        open={Boolean(pendingDeleteMemorandum)}
        onOpenChange={(open) => {
          if (!open && !deletingId) {
            setPendingDeleteMemorandum(null);
          }
        }}
        title="Delete memorandum?"
        description={
          pendingDeleteMemorandum
            ? `This will permanently remove "${pendingDeleteMemorandum.title}".`
            : "This will permanently remove the selected memorandum."
        }
        confirmText="Delete"
        destructive
        isLoading={Boolean(deletingId)}
        onConfirm={confirmDeleteMemorandum}
      />
    </div>
  );
};

export default MemorandamPage;
