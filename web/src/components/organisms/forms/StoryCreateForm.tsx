"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../atoms/inputs/Input";
import { Textarea } from "../../atoms/inputs/Textarea";
import { TagSelector } from "../../molecules/tags/TagSelector";
import { ImageUpload } from "../../molecules/upload/ImageUpload";
import { FormActions } from "../../molecules/forms/FormActions";

const schema = z.object({
  title: z
    .string()
    .min(3, "Minimum 3 znaki")
    .max(120, "Maksymalnie 120 znaków"),
  content: z.string().min(20, "Minimum 20 znaków"),
  tags: z.array(z.string()).min(1, "Wybierz co najmniej 1 tag").max(5),
  image: z.instanceof(File).optional().or(z.string().url().optional()),
});

export type StoryCreateFormValues = z.infer<typeof schema>;

export interface StoryCreateFormProps {
  options: string[];
  defaultValues?: Partial<StoryCreateFormValues>;
  onSubmit: (data: StoryCreateFormValues) => Promise<void> | void;
}

export const StoryCreateForm: React.FC<StoryCreateFormProps> = ({
  options,
  defaultValues,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<StoryCreateFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
      ...defaultValues,
    },
  });

  const tags = watch("tags");
  const image = watch("image") as File | string | undefined;

  return (
    <form
      className="flex flex-col items-start w-full max-w-[960px] py-5"
      onSubmit={handleSubmit(async (data) => {
        await onSubmit(data);
      })}
    >
      <div className="flex flex-row flex-wrap justify-between items-start content-start gap-3 w-full px-4">
        <h1 className="font-jakarta font-bold text-[32px] leading-10 text-content-primary">
          Dodaj nową historię
        </h1>
      </div>

      <div className="flex flex-row flex-wrap items-end gap-4 px-4 pt-3 w-full max-w-[480px]">
        <div className="flex flex-col w-full">
          <label className="font-jakarta text-base leading-6 text-content-primary pb-2">
            Tytuł historii
          </label>
          <Input
            fullWidth
            placeholder="Wpisz tytuł"
            {...register("title")}
            error={errors.title}
          />
        </div>
      </div>

      <div className="flex flex-row flex-wrap items-end gap-4 px-4 pt-3 w-full max-w-[480px]">
        <div className="flex flex-col w-full">
          <label className="font-jakarta text-base leading-6 text-content-primary pb-2">
            Treść
          </label>
          <Textarea
            className="min-h-[144px]"
            placeholder="Treść"
            {...register("content")}
            error={errors.content}
          />
        </div>
      </div>

      <div className="w-full px-3 pt-3">
        <TagSelector
          options={options}
          value={tags}
          onChange={(next) => setValue("tags", next, { shouldValidate: true })}
        />
        {errors.tags && (
          <div className="text-sm text-accent-error px-1 pt-1">
            {errors.tags.message}
          </div>
        )}
      </div>

      <ImageUpload
        file={image}
        onChange={(f) => setValue("image", f, { shouldValidate: true })}
      />

      <FormActions
        className="mt-3 w-full"
        loading={isSubmitting}
        onPublish={() => handleSubmit(async (data) => onSubmit(data))()}
        onPreview={() => {
          console.log("Podgląd", {
            title: watch("title"),
            content: watch("content"),
            tags: watch("tags"),
            image: watch("image"),
          });
        }}
      />
    </form>
  );
};
