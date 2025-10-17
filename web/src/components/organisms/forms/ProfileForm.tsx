"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/atoms/buttons/button";
import { Input } from "@/components/atoms/inputs/Input";
import { FormField } from "@/components/atoms/forms/FormField";
import { FormLabel } from "@/components/atoms/forms/FormLabel";
import { User } from "@/types/user";

const profileSchema = z.object({
  nickname: z.string().min(2, "Nick musi mieć co najmniej 2 znaki"),
  email: z.string().email("Nieprawidłowy adres email"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  user: Pick<User, "nickname" | "email">;
  onSubmit: (data: ProfileFormData) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ user, onSubmit }) => {
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nickname: user?.nickname || "",
      email: user?.email || "",
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="max-w-2xl">
        <h2 className="font-jakarta font-semibold text-lg text-content-primary mb-4">
          Dane osobowe
        </h2>

        <FormField error={form.formState.errors.nickname?.message}>
          <FormLabel>Nick</FormLabel>
          <Input
            fullWidth
            placeholder="Wpisz swój nick"
            {...form.register("nickname")}
            error={form.formState.errors.nickname}
          />
        </FormField>

        <FormField error={form.formState.errors.email?.message}>
          <FormLabel>Email</FormLabel>
          <Input
            fullWidth
            type="email"
            placeholder="Wpisz swój email"
            {...form.register("email")}
            error={form.formState.errors.email}
          />
        </FormField>

        <Button
          type="submit"
          loading={form.formState.isSubmitting}
          className="mt-6"
        >
          Zapisz zmiany
        </Button>
      </div>
    </form>
  );
};
