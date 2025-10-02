import React from "react";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function PageLayout({ children, className = "" }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background-subtle">
      <main className="flex justify-center items-start py-5">
        <div
          className={`mx-auto flex w-full max-w-[1440px] px-6 md:px-10 ${className}`}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
