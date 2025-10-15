import { getUser } from "@/services/users.service";
import { ProfilePage } from "@/components/organisms/profile/ProfilePage";

export default async function UserPublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser(id).catch(() => null);

  return <ProfilePage userId={id} initialUser={user ?? undefined} />;
}
