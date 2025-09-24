import React from "react";

export interface PreviewDialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const PreviewDialog: React.FC<PreviewDialogProps> = ({
  open,
  onClose,
  children,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-background-paper rounded-xl shadow-lg max-w-[960px] w-full max-h-[85vh] overflow-auto p-4">
        <button
          type="button"
          className="absolute top-3 right-3 text-content-secondary hover:text-content-primary"
          onClick={onClose}
        >
          Zamknij
        </button>
        {children}
      </div>
    </div>
  );
};
