"use client";
import React, { useCallback, useMemo } from "react";
import { Tag } from "../../atoms/tags/Tag";
import { Input } from "../../atoms/inputs/Input";
import { IconButton } from "../../atoms/buttons/IconButton";
import { FormLabel } from "../../atoms/forms/FormLabel";

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

  const normalized = useCallback((t: string) => t.trim(), []);

  const exists = useCallback(
    (t: string) => value.some((v) => v.toLowerCase() === t.toLowerCase()),
    [value],
  );

  const canAdd = useMemo(
    () =>
      allowCustom &&
      query.trim().length > 0 &&
      !exists(query) &&
      value.length < max,
    [allowCustom, query, exists, value.length, max],
  );

  const addTag = useCallback(
    (t: string) => {
      const tag = normalized(t);
      if (!tag || exists(tag) || value.length >= max) return;
      onChange([...value, tag]);
      setQuery("");
    },
    [normalized, exists, value, max, onChange],
  );

  const removeTag = useCallback(
    (t: string) => {
      onChange(value.filter((v) => v.toLowerCase() !== t.toLowerCase()));
    },
    [onChange, value],
  );

  const toggleTag = useCallback(
    (t: string) => {
      if (exists(t)) {
        removeTag(t);
      } else {
        addTag(t);
      }
    },
    [exists, removeTag, addTag],
  );

  const filtered = useMemo(
    () =>
      options.filter(
        (o) => o.toLowerCase().includes(query.toLowerCase()) && !exists(o),
      ),
    [options, query, exists],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (canAdd) addTag(query);
      }
    },
    [canAdd, addTag, query],
  );

  const handleQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
    },
    [],
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {value.length > 0 && (
        <div className="space-y-2">
          <FormLabel size="sm">Wybrane tagi:</FormLabel>
          <div className="flex flex-wrap gap-2">
            {value.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => removeTag(tag)}
                className="group relative"
                aria-label={`Usuń tag ${tag}`}
                title="Kliknij aby usunąć"
              >
                <Tag label={tag} className="pr-6 relative" />
                <span className="absolute right-1 top-1 w-3 h-3 rounded-full bg-content-primary text-background-paper text-[10px] flex items-center justify-center group-hover:scale-110 transition-transform">
                  ×
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {allowCustom && value.length < max && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Wpisz nazwę tagu..."
              value={query}
              onChange={handleQueryChange}
              fullWidth
              size="sm"
              onKeyDown={handleKeyDown}
            />
            <IconButton
              onClick={() => addTag(query)}
              disabled={!canAdd}
              tooltip="Dodaj tag"
              variant={canAdd ? "primary" : "secondary"}
              size="md"
            >
              <span className="text-lg font-bold">+</span>
            </IconButton>
          </div>

          {canAdd && (
            <div className="text-xs text-content-secondary bg-ui-notification/30 p-2 rounded">
              Dodasz:{" "}
              <span className="font-medium text-content-primary">{query}</span>
            </div>
          )}
        </div>
      )}

      {filtered.length > 0 && (
        <div className="space-y-2 pt-2">
          <FormLabel size="sm">Dostępne tagi:</FormLabel>
          <div className="flex flex-wrap gap-2 max-h-24 overflow-auto">
            {filtered.slice(0, 12).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => toggleTag(option)}
                className="transition-all duration-200 hover:scale-105"
              >
                <Tag label={option} />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="text-xs text-content-secondary">
        {value.length}/{max} tagów
      </div>
    </div>
  );
};
