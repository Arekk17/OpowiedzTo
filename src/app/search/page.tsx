// src/app/search/page.tsx
'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Link from 'next/link';

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

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredPosts = posts.filter(
    (post) =>
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) // Poprawiono z 'query' na 'searchQuery'
  );

  const generateTitle = (content) => {
    const words = content.split(' ').slice(0, 5).join(' ');
    return words.length < content.length ? `${words}...` : words;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-4xl mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Wyszukiwarka historii</h1>
        <input
          type="text"
          placeholder="Szukaj postów..."
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mb-6"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="space-y-12"> {/* Zwiększono do space-y-12 dla większego odstępu */}
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Link href={`/post/${post.id}`} key={post.id}>
                <div className="bg-white p-4 rounded-lg shadow-md hover:bg-gray-50 transition-colors my-4"> {/* Dodano my-4 dla dodatkowego marginesu */}
                  <h2 className="text-lg font-semibold text-gray-900">{generateTitle(post.content)}</h2>
                  <p className="text-gray-800 mt-1">{post.content}</p>
                  <div className="flex gap-2 mt-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <span>Likes: {post.likes}</span> • <span>Komentarze: {post.commentsCount}</span> •{' '}
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-600">Brak wyników dla "{searchQuery}".</p>
          )}
        </div>
      </div>
    </div>
  );
}