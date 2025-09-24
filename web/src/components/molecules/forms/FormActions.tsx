import React from "react";

export interface FormActionsProps {
  loading?: boolean;
  onPublish: () => void;
  onPreview: () => void;
  className?: string;
}

export const FormActions: React.FC<FormActionsProps> = ({
  loading = false,
  onPublish,
  onPreview,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-row justify-end items-center gap-3 px-4 ${className}`}
    >
      <button
        type="button"
        onClick={onPublish}
        disabled={loading}
        className={`h-10 px-4 rounded-full text-background-paper bg-accent-primary disabled:opacity-60`}
      >
        {loading ? "Publikuję..." : "Opublikuj"}
      </button>
      <button
        type="button"
        onClick={onPreview}
        className="h-10 px-4 rounded-full bg-ui-notification text-content-primary"
      >
        Podejrzyj historię
      </button>
    </div>
  );
};
