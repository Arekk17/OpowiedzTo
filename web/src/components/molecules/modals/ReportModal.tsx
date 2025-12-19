"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useMutation } from "@tanstack/react-query";
import { reportPost, reportComment } from "@/services/reports.service";
import { ReportCategory, CreateReportFormData } from "@/types/report";
import { toast } from "sonner";
import { FlagIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  targetType: "post" | "comment";
}

const CATEGORY_LABELS: Record<ReportCategory, string> = {
  [ReportCategory.SPAM]: "Spam",
  [ReportCategory.OFFENSIVE]: "Obraźliwe treści",
  [ReportCategory.FALSE_INFO]: "Fałszywe informacje",
  [ReportCategory.INAPPROPRIATE]: "Nieodpowiednie treści",
  [ReportCategory.OTHER]: "Inne",
};

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  targetId,
  targetType,
}) => {
  const [category, setCategory] = useState<ReportCategory | null>(null);
  const [reason, setReason] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Blokuj scroll body gdy modal jest otwarty
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const { mutate: submitReport, isPending } = useMutation({
    mutationFn: (data: CreateReportFormData) =>
      targetType === "post"
        ? reportPost(targetId, data)
        : reportComment(targetId, data),
    onSuccess: () => {
      toast.success("Zgłoszenie zostało wysłane");
      onClose();
      setCategory(null);
      setReason("");
    },
    onError: () => {
      toast.error("Nie udało się wysłać zgłoszenia");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) {
      toast.error("Wybierz kategorię zgłoszenia");
      return;
    }
    submitReport({ category, reason: reason || undefined });
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ isolation: "isolate" }}
    >
      <div
        className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl"
        style={{ minWidth: "320px" }}
      >
        <div className="sticky top-0 bg-white flex items-center justify-between p-4 border-b border-gray-200 rounded-t-xl">
          <div className="flex items-center gap-2">
            <FlagIcon className="w-5 h-5 text-red-500" />
            <h2 className="font-bold text-lg text-gray-900">
              Zgłoś {targetType === "post" ? "historię" : "komentarz"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            type="button"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Powód zgłoszenia
            </label>
            <div className="space-y-2">
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <label
                  key={key}
                  className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    category === key
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={key}
                    checked={category === key}
                    onChange={() => setCategory(key as ReportCategory)}
                    className="w-4 h-4 text-green-600 mr-3"
                  />
                  <span className="text-sm text-gray-900">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Dodatkowe informacje (opcjonalnie)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Opisz szczegóły zgłoszenia..."
              className="w-full p-3 rounded-lg border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:border-green-500"
              rows={3}
              maxLength={500}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-lg border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={isPending || !category}
              className="flex-1 py-3 px-4 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Wysyłanie..." : "Zgłoś"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
