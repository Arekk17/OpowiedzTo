"use client";
import {
  StoryCreateForm,
  StoryCreateFormValues,
} from "@/components/organisms/forms/StoryCreateForm";
import { PageLayout } from "@/components/organisms/layout/PageLayout";
import { useAuth } from "@/hooks/useAuth";
import { createPost, getTags } from "@/services/posts.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function CreateStoryPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace("/auth/login?redirect=/history/create");
    }
  }, [isAuthenticated, router]);

  const { data: tagsData } = useQuery({
    queryKey: ["tags"],
    queryFn: () => getTags({ limit: 50 }),
  });

  const { mutate: create } = useMutation({
    mutationFn: (data: StoryCreateFormValues) =>
      createPost({
        title: data.title,
        content: data.content,
        tags: data.tags,
      }),
    onSuccess: (post) => {
      toast.success("Historia została opublikowana!");
      router.push(
        `/history/${post.id}/${post.title.toLowerCase().replace(/\s+/g, "-")}`
      );
    },
    onError: (error: Error) => {
      toast.error("Nie udało się opublikować historii", {
        description: error.message,
      });
    },
  });

  if (isAuthenticated === false) return null;

  const tagOptions = tagsData?.data.map((tag) => tag.name) || [];

  return (
    <PageLayout className="flex-col items-center">
      <StoryCreateForm options={tagOptions} onSubmit={(data) => create(data)} />
    </PageLayout>
  );
}
