// src/app/components/Header.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo/Nazwa aplikacji */}
        <Link href="/" className="text-xl font-bold text-gray-900">
          OpowiedzTo
        </Link>

        {/* Burger menu dla małych ekranów */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>

        {/* Menu na większych ekranach */}
        <nav className="hidden md:flex gap-4">
          <Link href="/profile" className="text-gray-600 hover:text-blue-600">
            Profil
          </Link>
          <Link href="/settings" className="text-gray-600 hover:text-blue-600">
            Ustawienia
          </Link>
          <Link href="/search" className="text-gray-600 hover:text-blue-600">
            Wyszukiwarka
          </Link>
          <Link href="/login" className="text-gray-600 hover:text-blue-600">
            Zaloguj się
          </Link>
        </nav>
      </div>

      {/* Menu mobilne */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white shadow-md">
          <div className="flex flex-col gap-2 px-4 py-2">
            <Link
              href="/profile"
              className="text-gray-600 hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Profil
            </Link>
            <Link
              href="/settings"
              className="text-gray-600 hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Ustawienia
            </Link>
            <Link
              href="/search"
              className="text-gray-600 hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Wyszukiwarka
            </Link>
            <Link
              href="/login"
              className="text-gray-600 hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Zaloguj się
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}