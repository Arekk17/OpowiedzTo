// src/app/settings/page.tsx
import Header from '../components/Header';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Ustawienia</h1>
          <form className="space-y-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="nickname" className="text-sm text-gray-900">
                Zmień nazwę
              </label>
              <input
                type="text"
                id="nickname"
                placeholder="Nowa nazwa"
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Zapisz nazwę
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm text-gray-900">
                Zmień hasło
              </label>
              <input
                type="password"
                id="password"
                placeholder="Nowe hasło"
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Zapisz hasło
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Usuń konto
              </button>
            </div>
          </form>
          <a href="/profile" className="mt-4 inline-block text-blue-600 hover:underline">
            Powrót do profilu
          </a>
        </div>
      </div>
    </div>
  );
}