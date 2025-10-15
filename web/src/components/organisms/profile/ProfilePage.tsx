"use client";

import { useQuery } from "@tanstack/react-query";
import { getUser, getFollowers, getFollowing } from "@/services/users.service";
import { ProfileHeader } from "./ProfileHeader";
import { User } from "@/types/user";
import { UserFeed } from "./UserFeed";
import { getPosts } from "@/services/posts.service";

export function ProfilePage({
  userId,
  initialUser,
}: {
  userId: string;
  initialUser?: User;
}) {
  const { data: user } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId),
    initialData: initialUser,
    staleTime: 60_000,
  });

  const { data: followers } = useQuery({
    queryKey: ["user", userId, "followers"],
    queryFn: () => getFollowers(userId),
    staleTime: 60_000,
  });

  const { data: following } = useQuery({
    queryKey: ["user", userId, "following"],
    queryFn: () => getFollowing(userId),
    staleTime: 60_000,
  });

  const { data: postsPage } = useQuery({
    queryKey: ["user", userId, "posts"],
    queryFn: () => getPosts({ authorId: userId, page: 1, limit: 10 }),
    staleTime: 60_000,
  });

  const storiesCount = postsPage?.meta.total ?? 0;
  const userPosts = postsPage?.data ?? [];

  if (!user) return null;

  return (
    <div className="flex flex-col items-center w-full">
      <ProfileHeader
        name={user.nickname ?? user.email}
        avatarSrc={user.avatar}
        followers={followers?.length ?? 0}
        following={following?.length ?? 0}
        stories={storiesCount}
      />
      <div className="mt-4 w-full flex justify-center">
        <UserFeed posts={userPosts} isSearching={false} />
      </div>
    </div>
  );
}
