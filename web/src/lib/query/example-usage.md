# Przykład użycia TanStack Query z SSR

## 1. Prefetching danych na serwerze (Server Component)

```tsx
import { HydrationBoundary, prefetchQuery } from "@/lib/query";

// Przykład funkcji pobierania danych
async function fetchPosts() {
  const response = await fetch('http://localhost:3001/api/posts');
  return response.json();
}

export default async function PostsPage() {
  // Prefetch danych na serwerze
  const dehydratedState = await prefetchQuery(
    ['posts'],
    fetchPosts
  );

  return (
    <HydrationBoundary state={dehydratedState}>
      <PostsList />
    </HydrationBoundary>
  );
}
```

## 2. Użycie w komponencie klienckim

```tsx
"use client";

import { useQuery } from "@tanstack/react-query";

function PostsList() {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3001/api/posts');
      return response.json();
    },
  });

  if (isLoading) return <div>Ładowanie...</div>;
  if (error) return <div>Błąd: {error.message}</div>;

  return (
    <div>
      {posts?.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

## 3. Prefetching wielu zapytań

```tsx
import { getServerQueryClient, HydrationBoundary, dehydrate } from "@/lib/query";

export default async function DashboardPage() {
  const queryClient = getServerQueryClient();

  // Prefetch wielu zapytań równolegle
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['posts'],
      queryFn: fetchPosts,
    }),
    queryClient.prefetchQuery({
      queryKey: ['user'],
      queryFn: fetchUser,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Dashboard />
    </HydrationBoundary>
  );
}
```
