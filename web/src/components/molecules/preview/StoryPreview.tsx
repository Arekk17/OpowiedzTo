import { StoryCreateFormValues } from "@/components/organisms/forms/StoryCreateForm";
import { StoryDetailHeader } from "@/components/organisms/story/StoryDetailHeader";
import { useAuth } from "@/hooks/useAuth";
import { useMemo } from "react";
import { PreviewDialog } from "../dialogs/PreviewDialog";

export interface StoryPreviewProps {
  open: boolean;
  onClose: () => void;
  formData: StoryCreateFormValues;
}
export const StoryPreview: React.FC<StoryPreviewProps> = ({
  open,
  onClose,
  formData,
}) => {
  const { user } = useAuth();

  const previewData = useMemo(
    () => ({
      title: formData.title || "Przykładowy tytuł",
      content: formData.content || "Treść historii...",
      tags: formData.tags.map((name) => ({
        name,
        id: name,
        slug: name,
        postCount: 0,
        createdAt: "",
        updatedAt: "",
      })),
      publishedDate: new Date().toISOString(),
      author: user?.nickname || "Ty",
      imageSrc:
        typeof formData.image === "string"
          ? formData.image
          : formData.image
          ? URL.createObjectURL(formData.image)
          : undefined,
      imageAlt: formData.title || "Obrazek historii",
    }),
    [formData, user]
  );

  if (!open) return null;

  return (
    <PreviewDialog open={open} onClose={onClose}>
      <div className="pt-8">
        <StoryDetailHeader {...previewData} />
      </div>
    </PreviewDialog>
  );
};
