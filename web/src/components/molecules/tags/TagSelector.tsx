import React from "react";
import { Tag } from "../../atoms/tags/Tag";
import { Input } from "../../atoms/inputs/Input";

export interface TagSelectorProps {
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
  allowCustom?: boolean;
  max?: number;
  className?: string;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  options,
  value,
  onChange,
  allowCustom = true,
  max = 5,
  className = "",
}) => {
  const [query, setQuery] = React.useState("");

  const normalized = (t: string) => t.trim();
  const exists = (t: string) =>
    value.some((v) => v.toLowerCase() === t.toLowerCase());

  const canAdd =
    allowCustom &&
    query.trim().length > 0 &&
    !exists(query) &&
    value.length < max;

  const addTag = (t: string) => {
    const tag = normalized(t);
    if (!tag || exists(tag) || value.length >= max) return;
    onChange([...value, tag]);
    setQuery("");
  };

  const removeTag = (t: string) => {
    onChange(value.filter((v) => v.toLowerCase() !== t.toLowerCase()));
  };

  const toggleTag = (t: string) => {
    if (exists(t)) {
      removeTag(t);
    } else {
      addTag(t);
    }
  };

  const filtered = options.filter(
    (o) => o.toLowerCase().includes(query.toLowerCase()) && !exists(o)
  );

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex flex-row flex-wrap items-center gap-2">
        {value.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => removeTag(t)}
            className="group relative"
            aria-label={`Usuń tag ${t}`}
            title="Usuń tag"
          >
            <Tag label={t} className="pr-6 relative" />
            <span className="absolute -right-1 -top-1 w-4 h-4 rounded-full bg-content-primary text-background-paper text-[10px] leading-4 text-center group-hover:scale-110 transition-transform">
              ×
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Input
            placeholder={
              value.length >= max
                ? `Limit ${max} tagów`
                : "Dodaj tag i naciśnij Enter"
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={value.length >= max}
            fullWidth
            size="sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (canAdd) addTag(query);
              }
            }}
          />
          <button
            type="button"
            onClick={() => addTag(query)}
            disabled={!canAdd}
            className={`h-10 px-4 rounded-full transition-colors border ${
              canAdd
                ? "bg-accent-primary border-accent-primary text-background-paper hover:brightness-95"
                : "bg-transparent border-ui-border text-content-secondary cursor-not-allowed"
            }`}
          >
            Dodaj
          </button>
        </div>

        {canAdd && (
          <div className="text-sm text-content-secondary">
            Dodasz nowy tag:{" "}
            <span className="font-medium text-content-primary">{query}</span>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="flex flex-row flex-wrap items-center gap-2">
            {filtered.slice(0, 10).map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => toggleTag(o)}
                className="hover:opacity-90"
              >
                <Tag label={o} />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="text-sm text-content-secondary">
        {value.length}/{max} wybranych
      </div>
    </div>
  );
};
