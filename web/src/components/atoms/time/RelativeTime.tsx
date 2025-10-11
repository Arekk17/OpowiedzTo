"use client";

import { useEffect, useState } from "react";
import { formatRelativeTime } from "@/helpers/formatDate";

interface RelativeTimeProps {
  date: string | Date;
  className?: string;
}

export const RelativeTime: React.FC<RelativeTimeProps> = ({
  date,
  className = "",
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // SSR - pokaż placeholder
  if (!mounted) {
    return <span className={className}>...</span>;
  }

  // Client - pokaż "2 godziny temu"
  return <span className={className}>{formatRelativeTime(date)}</span>;
};
