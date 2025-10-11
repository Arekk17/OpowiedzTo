import { pl } from "date-fns/locale";
import { format, formatDistanceToNow } from "date-fns";

/**
 * Formatuje datę jako pełną datę i czas w lokalnej strefie użytkownika
 * Przykład: "15.10.2025 22:05"
 *
 * ⚠️ UWAGA: Używaj tylko w Client Components lub przez <FormattedDate>
 * Bezpośrednie użycie w Server Components spowoduje hydration errors!
 */
export const formatDateTime = (
  dateTime: string | Date | undefined | null
): string => {
  if (!dateTime) return "";

  const date = typeof dateTime === "string" ? new Date(dateTime) : dateTime;

  if (isNaN(date.getTime())) {
    console.warn("Invalid date:", dateTime);
    return String(dateTime);
  }

  // Formatuj w lokalnym czasie przeglądarki
  return format(date, "dd.MM.yyyy HH:mm");
};

/**
 * Formatuje datę jako czas względny w stylu Facebook
 * Przykład: "2 godziny temu", "5 minut temu"
 *
 * ⚠️ UWAGA: Używaj tylko w Client Components lub przez <RelativeTime>
 */
export const formatRelativeTime = (
  dateTime: string | Date | undefined | null
): string => {
  if (!dateTime) return "";

  const date = typeof dateTime === "string" ? new Date(dateTime) : dateTime;

  if (isNaN(date.getTime())) {
    console.warn("Invalid date:", dateTime);
    return String(dateTime);
  }

  return formatDistanceToNow(date, { addSuffix: true, locale: pl });
};
