import Link from "next/link";
import React from "react";
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}
export const NavLink: React.FC<NavLinkProps> = ({
  href,
  children,
  className = "",
}) => (
  <Link
    href={href}
    className={`font-jakarta font-medium text-sm leading-[21px] text-content-primary hover:text-primary-accent transition-colors ${className}`}
  >
    {children}
  </Link>
);
