import React from "react";
import Link from "next/link";
import { Button } from "../atoms/buttons/button";

interface AuthFormLayoutProps {
  title: string;
  description?: React.ReactNode;
  submitLabel: string;
  loading?: boolean;
  error?: string | null;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  children: React.ReactNode;
  secondaryLink?: { href: string; label: string };
  className?: string;
}

export const AuthFormLayout: React.FC<AuthFormLayoutProps> = ({
  title,
  description,
  submitLabel,
  loading = false,
  error,
  onSubmit,
  children,
  secondaryLink,
  className,
}) => {
  return (
    <div className="min-h-screen bg-background-subtle p-8">
      <main className="mx-auto max-w-[480px] flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-primary mb-2">{title}</h1>
        {description ? (
          <div className="text-sm text-content-secondary mb-4">
            {description}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className={className}>
          <div className="flex flex-col gap-4">{children}</div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {secondaryLink ? (
            <Link
              href={secondaryLink.href}
              className="mt-4 text-sm text-content-secondary cursor-pointer hover:text-content-primary inline-block"
            >
              {secondaryLink.label}
            </Link>
          ) : null}

          <Button type="submit" loading={loading} fullWidth className="mt-4">
            {submitLabel}
          </Button>
        </form>
      </main>
    </div>
  );
};
