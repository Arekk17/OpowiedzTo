// src/app/post/[id]/page.tsx
import Header from '../../components/Header';
import Link from 'next/link';

const users = [
  { id: "1", nickname: "AnonimowyLis", createdAt: "2025-05-01T12:00:00Z", followers: 50 },
  { id: "2", nickname: "CichaSowa", createdAt: "2025-05-03T15:20:00Z", followers: 30 },
  { id: "3", nickname: "DobreSerce", createdAt: "2025-05-05T08:45:00Z", followers: 75 },
  { id: "4", nickname: "MyślącyWilk", createdAt: "2025-05-07T19:10:00Z", followers: 20 },
  { id: "5", nickname: "SkrytyJeż", createdAt: "2025-05-09T10:35:00Z", followers: 45 },
];

const posts = [
  {
    id: "101",
    authorId: "1",
    content: "Nigdy nie zapomnę, jak przypadkiem poznałem swojego najlepszego przyjaciela, gdy zgubiłem się w obcym mieście.",
    createdAt: "2025-05-20T14:12:00Z",
    tags: ["friendship", "life", "unexpected"],
    likes: 125,
    commentsCount: 8,
  },
  {
    id: "102",
    authorId: "2",
    content: "Po latach milczenia napisała do mnie osoba, której bardzo brakowało mi w życiu.",
    createdAt: "2025-05-19T09:47:00Z",
    tags: ["life", "nostalgia", "relationships"],
    likes: 87,
    commentsCount: 5,
  },
  {
    id: "103",
    authorId: "3",
    content: "Zgubiłem portfel, ale ktoś go zwrócił z karteczką: 'Dobro wraca'.",
    createdAt: "2025-05-18T18:30:00Z",
    tags: ["kindness", "everyday", "hope"],
    likes: 200,
    commentsCount: 14,
  },
  {
    id: "104",
    authorId: "4",
    content: "Zrozumiałem, że nie muszę być idealny, żeby być wystarczający.",
    createdAt: "2025-05-17T21:05:00Z",
    tags: ["mental_health", "reflection", "selflove"],
    likes: 173,
    commentsCount: 12,
  },
  {
    id: "105",
    authorId: "5",
    content: "Pierwszy raz od lat poczułem, że naprawdę komuś na mnie zależy.",
    createdAt: "2025-05-16T16:50:00Z",
    tags: ["emotions", "support", "healing"],
    likes: 149,
    commentsCount: 9,
  },
];

export default function PostPage({ params }) {
  const post = posts.find((p) => p.id === params.id);
  const author = users.find((u) => u.id === post.authorId);

  if (!post) {
    return <div className="min-h-screen bg-gray-100 py-6">Post nie znaleziony.</div>;
  }

  const generateTitle = (content) => {
    const words = content.split(' ').slice(0, 5).join(' ');
    return words.length < content.length ? `${words}...` : words;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{generateTitle(post.content)}</h1>
          <p className="text-gray-800 mb-4">{post.content}</p>
          <p className="text-sm text-gray-600 mb-2">
            Autor: <Link href={`/profile?userId=${author.id}`} className="text-blue-600 hover:underline">{author.nickname}</Link>
          </p>
          <div className="flex gap-2 mb-2">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <div className="text-sm text-gray-600">
            <span>Likes: {post.likes}</span> • <span>Komentarze: {post.commentsCount}</span> •{' '}
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <Link href="/search" className="mt-4 inline-block text-blue-600 hover:underline">
          Powrót do wyszukiwarki
        </Link>
      </div>
    </div>
  );
}