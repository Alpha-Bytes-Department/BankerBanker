"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ConfirmActionModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
  destructive?: boolean;
};

const ConfirmActionModal = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  isLoading = false,
  destructive = false,
}: ConfirmActionModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={!isLoading}
        className="max-w-md rounded-2xl border border-white/40 bg-white/95 p-0 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-md overflow-hidden"
      >
        <div className="h-1.5 bg-linear-to-r from-blue-600 via-blue-500 to-cyan-500" />

        <div className="p-6">
          <DialogHeader className="gap-3">
            <DialogTitle className="text-xl font-semibold text-[#0F172A]">
              {title}
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-[#475569]">
              {description}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] text-sm font-medium hover:bg-[#F8FAFC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                destructive
                  ? "bg-[#DC2626] hover:bg-[#B91C1C]"
                  : "bg-[#0D4DA5] hover:bg-[#0A3D84]"
              }`}
            >
              {isLoading ? "Please wait..." : confirmText}
            </button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmActionModal;
