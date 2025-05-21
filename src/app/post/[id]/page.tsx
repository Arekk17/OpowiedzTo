// src/app/post/[id]/page.tsx
'use client';

import Header from '../../components/Header';
import Link from 'next/link';
import { useState } from 'react';

const users = [
  { id: "1", nickname: "AnonimowyLis", createdAt: "2025-05-01T12:00:00Z", followers: 50 },
  { id: "2", nickname: "CichaSowa", createdAt: "2025-05-03T15:20:00Z", followers: 30 },
  { id: "3", nickname: "DobreSerce", createdAt: "2025-05-05T08:45:00Z", followers: 75 },
  { id: "4", nickname: "MyślącyWilk", createdAt: "2025-05-07T19:10:00Z", followers: 20 },
  { id: "5", nickname: "SkrytyJeż", createdAt: "2025-05-09T10:35:00Z", followers: 45 },
];

const postsData = [
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

export default function PostPage({ params }) {
  const [postsState, setPostsState] = useState(postsData);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showReportPost, setShowReportPost] = useState(false);
  const [showReportComment, setShowReportComment] = useState(null); // ID komentarza do zgłoszenia
  const [reportReason, setReportReason] = useState('');
  const [reportSuccess, setReportSuccess] = useState({ post: false, comment: null });

  const post = postsState.find((p) => p.id === params.id);
  const author = users.find((u) => u.id === post.authorId);

  if (!post) {
    return <div className="min-h-screen bg-gray-100 py-6">Post nie znaleziony.</div>;
  }

  const generateTitle = (content) => {
    const words = content.split(' ').slice(0, 5).join(' ');
    return words.length < content.length ? `${words}...` : words;
  };

  const handleLike = () => {
    setPostsState((prevPosts) =>
      prevPosts.map((p) => (p.id === post.id ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: `c${Date.now()}`,
      authorId: "1", // Zakładamy, że zalogowanym użytkownikiem jest AnonimowyLis
      content: newComment,
      createdAt: new Date().toISOString(),
    };

    setPostsState((prevPosts) =>
      prevPosts.map((p) =>
        p.id === post.id ? { ...p, comments: [...p.comments, newCommentObj] } : p
      )
    );
    setNewComment('');
  };

  const handleReportPost = () => {
    setShowReportPost(true);
  };

  const handleReportComment = (commentId) => {
    setShowReportComment(commentId);
  };

  const handleSubmitReport = (e) => {
    e.preventDefault();
    if (reportReason.trim()) {
      if (showReportComment) {
        setReportSuccess((prev) => ({ ...prev, comment: showReportComment }));
      } else {
        setReportSuccess((prev) => ({ ...prev, post: true }));
      }
      setReportReason('');
      setTimeout(() => {
        setShowReportPost(false);
        setShowReportComment(null);
        setReportSuccess({ post: false, comment: null });
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{generateTitle(post.content)}</h1>
          <p className="text-gray-800 mb-4">{post.content}</p>
          <div className="flex gap-2 mb-2">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex gap-4 text-sm text-gray-600 mb-4">
            <button
              onClick={handleLike}
              className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>Likes: {post.likes}</span>
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>Komentarze: {post.comments.length}</span>
            </button>
            <button
              onClick={handleReportPost}
              className="text-gray-600 hover:text-red-600 transition-colors"
            >
              Zgłoś post
            </button>
          </div>

          {/* Formularz zgłoszenia posta */}
          {showReportPost && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Zgłoś post</h3>
                <form onSubmit={handleSubmitReport}>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mb-4"
                    placeholder="Podaj powód zgłoszenia..."
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowReportPost(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Anuluj
                    </button>
                    <button
                      type="submit"
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                      Wyślij zgłoszenie
                    </button>
                  </div>
                </form>
                {reportSuccess.post && (
                  <p className="text-green-600 mt-4">Zgłoszenie zostało wysłane!</p>
                )}
              </div>
            </div>
          )}

          {/* Sekcja komentarzy */}
          {showComments && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Komentarze</h3>
              {post.comments.length > 0 ? (
                <div className="space-y-3 mb-4">
                  {post.comments.map((comment) => {
                    const commentAuthor = users.find((u) => u.id === comment.authorId);
                    return (
                      <div key={comment.id} className="border-l-2 border-gray-200 pl-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                          <div>
                            <a href={`/profile?userId=${commentAuthor.id}`} className="text-sm font-semibold text-blue-600 hover:underline">
                              {commentAuthor.nickname}
                            </a>
                            <p className="text-xs text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm mt-1">{comment.content}</p>
                        <button
                          onClick={() => handleReportComment(comment.id)}
                          className="text-xs text-gray-600 hover:text-red-600 mt-1"
                        >
                          Zgłoś komentarz
                        </button>

                        {/* Formularz zgłoszenia komentarza */}
                        {showReportComment === comment.id && (
                          <div className="mt-2">
                            <form onSubmit={handleSubmitReport}>
                              <textarea
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mb-2"
                                placeholder="Podaj powód zgłoszenia..."
                                value={reportReason}
                                onChange={(e) => setReportReason(e.target.value)}
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => setShowReportComment(null)}
                                  className="px-2 py-1 text-gray-600 hover:text-gray-800"
                                >
                                  Anuluj
                                </button>
                                <button
                                  type="submit"
                                  className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700 transition-colors"
                                >
                                  Wyślij zgłoszenie
                                </button>
                              </div>
                            </form>
                            {reportSuccess.comment === comment.id && (
                              <p className="text-green-600 mt-2">Zgłoszenie zostało wysłane!</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-600 mb-4">Brak komentarzy. Bądź pierwszy!</p>
              )}

              {/* Formularz dodawania komentarza */}
              <form onSubmit={handleCommentSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Dodaj komentarz..."
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Wyślij
                </button>
              </form>
            </div>
          )}
        </div>
        <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
          Powrót do strony głównej
        </Link>
      </div>
    </div>
  );
}