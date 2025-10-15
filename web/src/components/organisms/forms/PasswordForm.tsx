"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/atoms/buttons/button";
import { Input } from "@/components/atoms/inputs/Input";
import { FormField } from "@/components/atoms/forms/FormField";
import { FormLabel } from "@/components/atoms/forms/FormLabel";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Podaj obecne hasło"),
    newPassword: z.string().min(8, "Hasło musi mieć co najmniej 8 znaków"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Hasła nie są identyczne",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

interface PasswordFormProps {
  onSubmit: (data: PasswordFormData) => void;
}

export const PasswordForm: React.FC<PasswordFormProps> = ({ onSubmit }) => {
  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="max-w-2xl">
        <h2 className="font-jakarta font-semibold text-lg text-content-primary mb-4">
          Zmień hasło
        </h2>

        <FormField error={form.formState.errors.currentPassword?.message}>
          <FormLabel>Obecne hasło</FormLabel>
          <Input
            fullWidth
            type="password"
            placeholder="Wpisz obecne hasło"
            {...form.register("currentPassword")}
            error={form.formState.errors.currentPassword}
          />
        </FormField>

        <FormField error={form.formState.errors.newPassword?.message}>
          <FormLabel>Nowe hasło</FormLabel>
          <Input
            fullWidth
            type="password"
            placeholder="Wpisz nowe hasło"
            {...form.register("newPassword")}
            error={form.formState.errors.newPassword}
          />
        </FormField>

        <FormField error={form.formState.errors.confirmPassword?.message}>
          <FormLabel>Potwierdź nowe hasło</FormLabel>
          <Input
            fullWidth
            type="password"
            placeholder="Potwierdź nowe hasło"
            {...form.register("confirmPassword")}
            error={form.formState.errors.confirmPassword}
          />
        </FormField>

        <Button
          type="submit"
          loading={form.formState.isSubmitting}
          className="mt-6"
        >
          Zmień hasło
        </Button>
      </div>
    </form>
  );
};
