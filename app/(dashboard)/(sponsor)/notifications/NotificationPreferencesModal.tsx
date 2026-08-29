"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getNotificationPreferences,
  updateNotificationPreferences,
  NotificationPreferences,
} from "./notificationApi";
import { toast } from "sonner";
import { LuMail, LuSparkles, LuLoader } from "react-icons/lu";
import { IoCheckmark } from "react-icons/io5";

interface NotificationPreferencesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NotificationPreferencesModal({
  open,
  onOpenChange,
}: NotificationPreferencesModalProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    quote_emails_enabled: true,
    marketing_emails_enabled: true,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchPreferences = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getNotificationPreferences();
      setPreferences(data);
    } catch (err) {
      console.error("Failed to load notification preferences", err);
      toast.error("Failed to load preferences");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchPreferences();
    }
  }, [open, fetchPreferences]);

  const handleToggle = async (key: keyof NotificationPreferences) => {
    const updated = {
      ...preferences,
      [key]: !preferences[key],
    };
    setPreferences(updated);
    setSaving(true);
    try {
      const result = await updateNotificationPreferences(updated);
      setPreferences(result);
      toast.success("Preferences updated successfully");
    } catch (err) {
      console.error("Failed to update notification preferences", err);
      toast.error("Failed to update preferences");
      // Rollback on failure
      setPreferences(preferences);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl border border-white/40 bg-white/95 p-0 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-md overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500" />

        <div className="p-6">
          <DialogHeader className="gap-2">
            <DialogTitle className="text-xl font-semibold text-[#0F172A] flex items-center justify-between">
              <span>Notification Preferences</span>
              {saving && (
                <span className="flex items-center gap-1 text-xs font-normal text-blue-600">
                  <LuLoader className="animate-spin text-sm" /> Saving...
                </span>
              )}
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-[#475569]">
              Choose which email notifications and alerts you would like to receive.
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            <div className="py-10 flex flex-col items-center justify-center gap-2 text-[#64748B]">
              <LuLoader className="animate-spin text-2xl text-blue-600" />
              <p className="text-sm">Loading preferences...</p>
            </div>
          ) : (
            <div className="mt-6 flex flex-col gap-4">
              {/* Quote Emails Setting */}
              <div
                onClick={() => !saving && handleToggle("quote_emails_enabled")}
                className="flex items-start justify-between gap-4 p-3.5 rounded-xl border border-[#E2E8F0] hover:border-blue-300 hover:bg-[#F8FAFC] transition-all cursor-pointer select-none"
              >
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 text-blue-600 mt-0.5">
                    <LuMail className="text-lg" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#0F172A]">
                      Quote & Loan Notifications
                    </h4>
                    <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">
                      Receive email updates for new quotes, loan requests, and memorandum events.
                    </p>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={preferences.quote_emails_enabled}
                    disabled={saving}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      preferences.quote_emails_enabled ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        preferences.quote_emails_enabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Marketing Emails Setting */}
              <div
                onClick={() => !saving && handleToggle("marketing_emails_enabled")}
                className="flex items-start justify-between gap-4 p-3.5 rounded-xl border border-[#E2E8F0] hover:border-blue-300 hover:bg-[#F8FAFC] transition-all cursor-pointer select-none"
              >
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center shrink-0 text-purple-600 mt-0.5">
                    <LuSparkles className="text-lg" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#0F172A]">
                      Marketing & Announcements
                    </h4>
                    <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">
                      Stay informed about new platform features, industry news, and product newsletters.
                    </p>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={preferences.marketing_emails_enabled}
                    disabled={saving}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      preferences.marketing_emails_enabled ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        preferences.marketing_emails_enabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white text-sm font-medium transition-colors flex items-center gap-1.5"
            >
              <IoCheckmark className="text-base" /> Done
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
