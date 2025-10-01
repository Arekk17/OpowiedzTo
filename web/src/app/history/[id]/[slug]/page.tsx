import { getPost } from "@/services/posts.service";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ApiError } from "@/lib/api/client";

export default async function HistoryPage({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id, slug } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken");

  if (!token) {
    redirect(
      `/auth/login?redirect=/history/${id}/${slug}&message=login_required`
    );
  }

  try {
    const cookieHeader = cookieStore.toString();
    const post = await getPost(id, { cookieHeader });

    return (
      <div>
        <h1>{post.title}</h1>
        <p>{post.content}</p>
      </div>
    );
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        redirect("/404");
      }
      if (error.status === 401) {
        redirect("/auth/login?message=unauthorized");
      }
    }
    redirect("/auth/login?message=error");
  }
}
