import { getPost } from "@/services/posts.service";
import { getComments } from "@/services/comments.service";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { StoryDetailHeader } from "@/components/organisms/story/StoryDetailHeader";
import { PageLayout } from "@/components/organisms/layout/PageLayout";
import { StoryStats } from "@/components/molecules/stats/StoryStats";
import type { Metadata } from "next";
import { StoryCommentsSection } from "@/components/organisms/story/StoryCommentsSection";
import { getAuthUser } from "@/lib/auth-ssr";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    const post = await getPost(id, { cookieHeader });

    return {
      title: post.title,
      description: post.content.slice(0, 160),
      openGraph: {
        title: post.title,
        description: post.content.slice(0, 160),
        type: "article",
        authors: [post.author.nickname],
      },
    };
  } catch {
    return {
      title: "Historia nie znaleziona",
    };
  }
}

export default async function HistoryPage({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id, slug } = await params;

  // Sprawdź autentyfikację użytkownika
  const user = await getAuthUser();

  if (!user) {
    // Przekieruj do logowania jeśli użytkownik nie jest zalogowany
    redirect(`/auth/login?redirect=/history/${id}/${slug}`);
  }

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const [post, comments] = await Promise.all([
    getPost(id, { cookieHeader }),
    getComments(id, { cookieHeader }),
  ]).catch((error) => {
    if (error.status === 404) {
      notFound();
    }
    throw error;
  });

  return (
    <PageLayout className="flex-col">
      <StoryDetailHeader
        title={post.title}
        content={post.content}
        tags={post.tags}
        publishedDate={post.createdAt}
        author={post.author.nickname}
      />
      <StoryStats
        postId={post.id}
        likes={post.likesCount}
        comments={post.commentsCount}
        initialLiked={post.isLiked}
      />
      <StoryCommentsSection postId={post.id} initialComments={comments} />
    </PageLayout>
  );
}
