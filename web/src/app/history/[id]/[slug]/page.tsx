import { getPost } from "@/services/posts.service";
import { cookies } from "next/headers";
import { StoryDetailHeader } from "@/components/organisms/story/StoryDetailHeader";
import { PageLayout } from "@/components/organisms/layout/PageLayout";
import { StoryStats } from "@/components/molecules/stats/StoryStats";

export default async function HistoryPage({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id } = await params;

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    const post = await getPost(id, { cookieHeader });

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
      </PageLayout>
    );
  } catch {}
}
