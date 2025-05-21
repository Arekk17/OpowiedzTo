// src/app/profile/page.tsx
'use client'; // Dodajemy 'use client', bo używamy useSearchParams
import Header from '../components/Header';
import { useSearchParams } from 'next/navigation';

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

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId') || '1'; // Domyślnie '1', jeśli nie podano userId
  const user = users.find((u) => u.id === userId);
  const userPosts = posts.filter((post) => post.authorId === userId);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-4xl mx-auto pt-20 pb-6">
        {/* Sekcja profilu */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full"></div> {/* Placeholder dla awatara */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.nickname}</h1>
              <p className="text-sm text-gray-600">
                Dołączono: {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex gap-6 text-sm text-gray-600">
            <span>Follows: 25</span> {/* Placeholder dla liczby osób, które ten użytkownik obserwuje */}
            <span>Followers: {user.followers}</span>
          </div>
          <a href="/settings" className="mt-4 inline-block text-blue-600 hover:underline">
            Ustawienia
          </a>
        </div>

        {/* Sekcja postów */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Posty użytkownika</h2>
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-gray-800">{post.content}</p>
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
            ))
          ) : (
            <p className="text-gray-600">Ten użytkownik nie ma jeszcze postów.</p>
          )}
        </div>
      </div>
    </div>
  );
}