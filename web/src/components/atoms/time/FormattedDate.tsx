"use client";

import { useEffect, useState } from "react";
import { formatDateTime } from "@/helpers/formatDate";

interface FormattedDateProps {
  date: string | Date;
  className?: string;
}

/**
 * Client-only komponent do wyświetlania pełnej daty
 * Zapobiega hydration errors przez opóźnione renderowanie
 *
 * Pokazuje lokalny czas użytkownika (nie UTC)
 */
export const FormattedDate: React.FC<FormattedDateProps> = ({
  date,
  className = "",
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // SSR - placeholder (zapobiega hydration error)
  if (!mounted) {
    return <span className={className}>...</span>;
  }

  // Client - lokalny czas użytkownika
  return <span className={className}>{formatDateTime(date)}</span>;
};
