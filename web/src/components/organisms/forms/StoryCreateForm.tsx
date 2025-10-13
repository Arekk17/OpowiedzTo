"use client";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../atoms/inputs/Input";
import { Textarea } from "../../atoms/inputs/Textarea";
import { TagSelector } from "../../molecules/tags/TagSelector";
import { ImageUpload } from "../../molecules/upload/ImageUpload";
import { FormActions } from "../../molecules/forms/FormActions";
import { FormLabel } from "../../atoms/forms/FormLabel";
import { FormField } from "../../atoms/forms/FormField";
import { FormSection } from "../../atoms/forms/FormSection";
import { StoryPreview } from "../../molecules/preview/StoryPreview";

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
  const [tags, setTags] = useState<string[]>(defaultValues?.tags || []);
  const [image, setImage] = useState<File | string | undefined>(
    defaultValues?.image
  );
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<StoryCreateFormValues>({
    title: "",
    content: "",
    tags: [],
    image: undefined,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
  } = useForm<StoryCreateFormValues>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    defaultValues: {
      title: "",
      content: "",
      tags: [],
      ...defaultValues,
    },
  });

  const handleTagChange = useCallback(
    (newTags: string[]) => {
      setTags(newTags);
      setValue("tags", newTags, { shouldValidate: false });
    },
    [setValue]
  );

  const handlePreview = useCallback(() => {
    const formData = getValues();
    setPreviewData(formData);
    setPreviewOpen(true);
  }, [getValues]);

  const handleClosePreview = useCallback(() => {
    setPreviewOpen(false);
  }, []);

  const handleImageChange = useCallback(
    (file?: File) => {
      setImage(file);
      setValue("image", file, { shouldValidate: false });
    },
    [setValue]
  );

  const handleFormSubmit = useCallback(
    async (data: StoryCreateFormValues) => {
      await onSubmit(data);
    },
    [onSubmit]
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="bg-background-paper rounded-2xl border border-ui-border shadow-sm p-8">
        <div className="mb-8">
          <h1 className="font-jakarta font-bold text-3xl text-content-primary mb-2">
            Dodaj nową historię
          </h1>
          <p className="text-content-secondary text-sm">
            Opowiedz swoją historię i podziel się nią z innymi
          </p>
        </div>

        <form
          className="flex flex-col gap-6"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <FormField error={errors.title?.message}>
            <FormLabel>Tytuł historii</FormLabel>
            <div className="bg-background-subtle border border-ui-border rounded-[12px] focus-within:ring-2 focus-within:ring-ui-focus/20 focus-within:border-ui-focus transition-all duration-200">
              <Input
                fullWidth
                placeholder="Wpisz tytuł"
                {...register("title")}
                error={errors.title}
                className="text-lg"
                containerClassName="!p-0"
              />
            </div>
          </FormField>

          <FormField error={errors.content?.message}>
            <FormLabel>Treść</FormLabel>
            <Textarea
              className="min-h-[200px] text-base"
              placeholder="Opowiedz swoją historię..."
              {...register("content")}
              error={errors.content}
              fullWidth
            />
          </FormField>

          <FormField error={errors.tags?.message}>
            <FormLabel>Tagi</FormLabel>
            <FormSection>
              <TagSelector
                options={options}
                value={tags}
                onChange={handleTagChange}
              />
            </FormSection>
          </FormField>

          <FormField>
            <FormLabel>Obrazek (opcjonalny)</FormLabel>
            <FormSection>
              <ImageUpload file={image} onChange={handleImageChange} />
            </FormSection>
          </FormField>

          <div className="pt-4">
            <FormActions
              loading={isSubmitting}
              onPublish={() => handleSubmit(handleFormSubmit)()}
              onPreview={handlePreview}
            />
          </div>
        </form>
      </div>
      <StoryPreview
        open={previewOpen}
        onClose={handleClosePreview}
        formData={previewData}
      />
    </div>
  );
};
