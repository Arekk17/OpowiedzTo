import { getPost } from "@/services/posts.service";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function HistoryPage({
  params,
}: {
  params: { id: string; slug: string };
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
    const post = await getPost(id);
    return (
      <div>
        <h1>{post.title}</h1>
        <p>{post.content}</p>
      </div>
    );
  } catch (error) {
    console.error("Błąd:", error);
    redirect("/auth/login?message=unauthorized");
  }
}
