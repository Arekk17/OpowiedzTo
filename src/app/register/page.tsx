// src/app/register/page.tsx
import Header from '../components/Header';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">Zarejestruj się</h1>
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm text-gray-900">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Twój email"
                className="p-2 bg-white border border-gray-400 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm text-gray-900">Hasło</label>
              <input
                type="password"
                id="password"
                placeholder="Twoje hasło"
                className="p-2 bg-white border border-gray-400 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="confirm-password" className="text-sm text-gray-900">Potwierdź hasło</label>
              <input
                type="password"
                id="confirm-password"
                placeholder="Potwierdź hasło"
                className="p-2 bg-white border border-gray-400 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Zarejestruj się
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-900">
            Masz konto?{' '}
            <a href="/login" className="text-blue-600 hover:underline font-bold">
              Zaloguj się
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}