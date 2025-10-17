/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useMemo } from "react";
import { IconButton } from "../../atoms/buttons/IconButton";

export interface ImageUploadProps {
  file?: File | string;
  onChange: (file?: File) => void;
  accept?: string;
  maxSizeMb?: number;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  file,
  onChange,
  accept = "image/*",
  maxSizeMb = 5,
  className = "",
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const openPicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleFile = useCallback(
    (f?: File) => {
      if (!f) return;
      setError(null);
      if (f.size > maxSizeMb * 1024 * 1024) {
        setError(`Maksymalny rozmiar pliku to ${maxSizeMb}MB`);
        return;
      }
      if (!f.type.startsWith("image/")) {
        setError("Nieprawidłowy typ pliku (wymagany obraz)");
        return;
      }
      onChange(f);
    },
    [maxSizeMb, onChange],
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files?.[0];
      if (f) handleFile(f);
    },
    [handleFile],
  );

  const hasPreview = useMemo(() => Boolean(file), [file]);

  const previewURL = useMemo(() => {
    if (typeof file === "string") return file;
    if (file) return URL.createObjectURL(file);
    return undefined;
  }, [file]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFile(e.target.files?.[0]);
    },
    [handleFile],
  );

  const handleRemoveImage = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      onChange(undefined);
    },
    [onChange],
  );

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {!hasPreview && (
        <div
          onClick={openPicker}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={onDrop}
          className={`flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
            dragOver
              ? "border-accent-primary bg-accent-primary/5"
              : "border-ui-border hover:border-accent-primary/50 hover:bg-ui-hover/20"
          }`}
          aria-label="Dodaj zdjęcie"
          role="button"
        >
          <div className="text-2xl mb-2">📷</div>
          <span className="font-jakarta text-sm text-content-primary text-center">
            Dodaj zdjęcie
            <br />
            <span className="text-content-secondary text-xs">(opcjonalne)</span>
          </span>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}

      {hasPreview && previewURL && (
        <div className="relative w-full max-w-[400px] h-[200px] rounded-xl overflow-hidden border border-ui-border">
          <img
            src={previewURL}
            alt="Podgląd"
            className="w-full h-full object-cover"
          />
          <IconButton
            onClick={handleRemoveImage}
            tooltip="Usuń obraz"
            variant="primary"
            size="sm"
            className="absolute top-3 right-3 !w-6 !h-6 text-xs"
          >
            ×
          </IconButton>
        </div>
      )}

      {error && (
        <div className="text-sm text-accent-error bg-accent-error/10 p-2 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};
