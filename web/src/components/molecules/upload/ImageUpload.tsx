import React from "react";

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

  const openPicker = () => inputRef.current?.click();

  const handleFile = (f?: File) => {
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
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const hasPreview = Boolean(file);
  const previewURL =
    typeof file === "string"
      ? file
      : file
      ? URL.createObjectURL(file)
      : undefined;

  return (
    <div className={`flex flex-col gap-2 size-[288px] ${className}`}>
      <div
        onClick={openPicker}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`flex items-center justify-center h-10 px-4 rounded-full cursor-pointer transition-colors border ${
          dragOver
            ? "bg-accent-primary/10 border-accent-primary"
            : "bg-ui-notification border-ui-border hover:bg-ui-hover"
        }`}
        aria-label="Dodaj zdjęcie"
        role="button"
      >
        <span className="font-jakarta font-bold text-sm text-content-primary">
          Dodaj zdjęcie (opcjonalne)
        </span>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      {hasPreview && previewURL && (
        <div className="relative w-full max-w-[480px] h-[180px] rounded-xl overflow-hidden">
          <img
            src={previewURL}
            alt="Podgląd"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            className="absolute top-2 right-2 bg-content-primary text-background-paper text-xs rounded px-2 py-1"
            onClick={(e) => {
              e.stopPropagation();
              onChange(undefined);
            }}
          >
            Usuń
          </button>
        </div>
      )}

      {error && <div className="text-sm text-accent-error">{error}</div>}
    </div>
  );
};
