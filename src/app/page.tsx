// src/app/page.tsx
'use client';

import Header from './components/Header';
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
    comments: [
      { id: "c101", authorId: "2", content: "To brzmi niesamowicie!", createdAt: "2025-05-20T14:30:00Z" },
      { id: "c102", authorId: "3", content: "Gdzie to było?", createdAt: "2025-05-20T14:45:00Z" },
    ],
  },
  {
    id: "102",
    authorId: "2",
    content: "Po latach milczenia napisała do mnie osoba, której bardzo brakowało mi w życiu.",
    createdAt: "2025-05-19T09:47:00Z",
    tags: ["life", "nostalgia", "relationships"],
    likes: 87,
    comments: [
      { id: "c103", authorId: "1", content: "Cieszę się, że się odezwała!", createdAt: "2025-05-19T10:00:00Z" },
    ],
  },
  {
    id: "103",
    authorId: "3",
    content: "Zgubiłem portfel, ale ktoś go zwrócił z karteczką: 'Dobro wraca'.",
    createdAt: "2025-05-18T18:30:00Z",
    tags: ["kindness", "everyday", "hope"],
    likes: 200,
    comments: [],
  },
  {
    id: "104",
    authorId: "4",
    content: "Zrozumiałem, że nie muszę być idealny, żeby być wystarczający.",
    createdAt: "2025-05-17T21:05:00Z",
    tags: ["mental_health", "reflection", "selflove"],
    likes: 173,
    comments: [
      { id: "c104", authorId: "5", content: "To bardzo mądre!", createdAt: "2025-05-17T21:30:00Z" },
    ],
  },
  {
    id: "105",
    authorId: "5",
    content: "Pierwszy raz od lat poczułem, że naprawdę komuś na mnie zależy.",
    createdAt: "2025-05-16T16:50:00Z",
    tags: ["emotions", "support", "healing"],
    likes: 149,
    comments: [],
  },
];

export default function HomePage() {
  const generateTitle = (content) => {
    const words = content.split(' ').slice(0, 5).join(' ');
    return words.length < content.length ? `${words}...` : words;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">OpowiedzTo</h1>
          <p className="text-lg text-gray-600 mt-2">
            Najlepsze miejsce na podzielenie się swoimi przeżyciami i odkrycie historii innych!
          </p>
        </div>
        <div className="space-y-12">
          {posts.map((post) => {
            const author = users.find((u) => u.id === post.authorId);
            return (
              <Link href={`/post/${post.id}`} key={post.id}>
                <div className="bg-white p-6 rounded-lg shadow-md hover:bg-gray-50 transition-colors my-4">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
                    <div>
                      <a href={`/profile?userId=${author.id}`} className="text-lg font-semibold text-blue-600 hover:underline">
                        {author.nickname}
                      </a>
                      <p className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-800 mb-4">{generateTitle(post.content)}</p>
                  <div className="flex gap-2 mb-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span>Likes: {post.likes}</span> • <span>Komentarze: {post.comments.length}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}