# Analiza Projektu OpowiedzTo

## 1. Przegląd Projektu

**OpowiedzTo** to platforma społecznościowa do dzielenia się historiami (storytelling platform), gdzie użytkownicy mogą publikować krótkie historie (anonimowe lub podpisane), reagować polubieniami oraz komentować. Projekt jest zorganizowany jako monorepo zawierający backend (API) i frontend (aplikacja webowa).

### Architektura
- **Backend**: NestJS (Node.js) z PostgreSQL
- **Frontend**: Next.js 15 (React 19) z App Router
- **Komunikacja**: RESTful API z autentykacją JWT
- **Deployment**: Docker Compose dla środowiska deweloperskiego i produkcyjnego

---

## 2. Struktura Projektu

### 2.1. Struktura Backendu (`opowiedzto-api/`)

```
opowiedzto-api/
├── src/
│   ├── app.module.ts              # Główny moduł aplikacji
│   ├── main.ts                    # Punkt wejściowy
│   ├── config/
│   │   └── typeorm.config.ts      # Konfiguracja TypeORM
│   ├── auth/                      # Moduł autentykacji
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── decorators/            # @GetUser(), @GetOptionalUser()
│   │   ├── dto/                   # DTO dla rejestracji, logowania
│   │   ├── entities/              # RefreshToken entity
│   │   ├── guards/                # JwtAuthGuard, OptionalJwtAuthGuard
│   │   ├── strategies/            # JWT Strategy, RefreshToken Strategy
│   │   └── utils/                 # Cookie parser utilities
│   ├── users/                     # Moduł użytkowników
│   │   ├── entities/
│   │   │   ├── user.entity.ts
│   │   │   └── follow.entity.ts
│   │   ├── repositories/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── follow.controller.ts
│   ├── posts/                     # Moduł postów
│   │   ├── entities/
│   │   │   ├── post.entity.ts
│   │   │   ├── comment.entity.ts
│   │   │   └── post-like.entity.ts
│   │   ├── repositories/
│   │   ├── dto/
│   │   ├── posts.controller.ts
│   │   ├── posts.service.ts
│   │   ├── comment.controller.ts
│   │   └── post-like.controller.ts
│   ├── tags/                      # Moduł tagów
│   │   ├── entities/
│   │   │   ├── tag.entity.ts
│   │   │   └── post-tag.entity.ts
│   │   ├── repository/
│   │   ├── tags.controller.ts
│   │   └── tags.service.ts
│   ├── reports/                   # Moduł zgłoszeń
│   │   ├── controllers/
│   │   │   ├── post-report.controller.ts
│   │   │   └── comment-report.controller.ts
│   │   ├── entities/
│   │   │   ├── post-report.entity.ts
│   │   │   └── comment-report.entity.ts
│   │   ├── enums/
│   │   │   └── report-category.enum.ts
│   │   ├── repositories/
│   │   └── services/
│   ├── seed/                      # Moduł inicjalizacji danych
│   ├── common/
│   │   └── constants/
│   │       └── banned-words.ts    # Lista zakazanych słów
│   ├── helpers/
│   │   └── slugify.ts             # Funkcja do tworzenia slugów
│   └── migrations/
│       └── 20250101000000-Initial.ts
├── test/                          # Testy e2e
└── uploads/                       # Przechowywanie plików (avatary)
```

### 2.2. Struktura Frontendu (`web/`)

```
web/
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── layout.tsx             # Główny layout
│   │   ├── page.tsx               # Strona główna
│   │   ├── auth/                  # Strony autentykacji
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/             # Panel użytkownika
│   │   │   ├── page.tsx
│   │   │   ├── profile/
│   │   │   └── admin/
│   │   ├── history/               # Historia postów
│   │   │   ├── create/
│   │   │   └── [id]/[slug]/
│   │   ├── users/                 # Profile użytkowników
│   │   │   └── [id]/
│   │   │       ├── profile/
│   │   │       └── settings/
│   │   └── api/                   # API routes (Next.js)
│   │       └── auth/refresh/
│   ├── components/                # Komponenty React
│   │   ├── atoms/                 # Podstawowe komponenty
│   │   │   ├── buttons/
│   │   │   ├── inputs/
│   │   │   ├── forms/
│   │   │   └── ...
│   │   ├── molecules/             # Złożone komponenty
│   │   │   ├── cards/
│   │   │   ├── forms/
│   │   │   ├── navigation/
│   │   │   └── ...
│   │   ├── organisms/             # Duże sekcje UI
│   │   │   ├── layout/
│   │   │   ├── story/
│   │   │   ├── comments/
│   │   │   └── ...
│   │   └── templates/            # Szablony stron
│   ├── services/                  # Serwisy API
│   │   ├── auth.service.ts
│   │   ├── posts.service.ts
│   │   ├── comments.service.ts
│   │   ├── likes.service.ts
│   │   ├── users.service.ts
│   │   └── reports.service.ts
│   ├── hooks/                     # React hooks
│   │   ├── useAuth.ts
│   │   ├── useComments.ts
│   │   ├── useLike.ts
│   │   └── useTheme.ts
│   ├── lib/                       # Biblioteki pomocnicze
│   │   ├── auth.ts
│   │   ├── auth-ssr.ts            # Autentykacja SSR
│   │   └── config/
│   ├── types/                     # Definicje TypeScript
│   ├── helpers/                   # Funkcje pomocnicze
│   ├── providers/                 # Context providers
│   ├── constants/                 # Stałe
│   ├── middleware.ts              # Middleware Next.js
│   └── stories/                   # Storybook stories
├── public/                        # Statyczne pliki
└── test/                          # Testy
```

---

## 3. Struktura Bazy Danych

### 3.1. Diagram Relacji

```
users (użytkownicy)
├── posts (posty użytkownika)
├── comments (komentarze użytkownika)
├── post_likes (polubienia użytkownika)
├── follows (relacje follow/following)
├── refresh_tokens (tokeny odświeżania)
├── post_reports (zgłoszenia postów)
└── comment_reports (zgłoszenia komentarzy)

posts (posty)
├── comments (komentarze do posta)
├── post_likes (polubienia posta)
├── post_tags (tagi posta)
└── post_reports (zgłoszenia)

tags (tagi)
└── post_tags (relacja many-to-many z postami)

comments (komentarze)
├── comment_reports (zgłoszenia)
└── author (użytkownik)
```

### 3.2. Szczegółowy Opis Tabel

#### **users** (Użytkownicy)
- `id` (UUID, PK) - Unikalny identyfikator
- `email` (VARCHAR, UNIQUE) - Email użytkownika
- `password` (VARCHAR) - Zahashowane hasło (bcrypt)
- `nickname` (VARCHAR, UNIQUE) - Pseudonim użytkownika
- `gender` (ENUM: male/female/other) - Płeć
- `avatar` (VARCHAR, nullable) - Ścieżka do awatara
- `createdAt` (TIMESTAMP) - Data utworzenia
- `updatedAt` (TIMESTAMP) - Data aktualizacji

**Relacje:**
- Jeden do wielu z `posts` (jeden użytkownik może mieć wiele postów)
- Jeden do wielu z `comments` (jeden użytkownik może mieć wiele komentarzy)
- Jeden do wielu z `post_likes` (jeden użytkownik może polubić wiele postów)
- Jeden do wielu z `follows` jako `follower` i `following`
- Jeden do wielu z `refresh_tokens`
- Jeden do wielu z `post_reports` i `comment_reports`

#### **posts** (Posty)
- `id` (UUID, PK)
- `authorId` (UUID, FK → users.id) - Autor posta
- `title` (VARCHAR) - Tytuł posta
- `content` (TEXT) - Treść posta
- `likesCount` (INTEGER, default: 0) - **Denormalizowany licznik polubień**
- `commentsCount` (INTEGER, default: 0) - **Denormalizowany licznik komentarzy**
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

**Relacje:**
- Wiele do jednego z `users` (autor)
- Jeden do wielu z `comments`
- Jeden do wielu z `post_likes`
- Wiele do wielu z `tags` przez `post_tags`
- Jeden do wielu z `post_reports`

**Optymalizacja:** Denormalizowane liczniki (`likesCount`, `commentsCount`) eliminują zapytania N+1 przy pobieraniu feedu.

#### **tags** (Tagi)
- `id` (UUID, PK)
- `name` (VARCHAR(64)) - Nazwa tagu
- `slug` (VARCHAR(64), UNIQUE) - Slug tagu (indeksowany)
- `postCount` (INTEGER, default: 0) - **Denormalizowany licznik postów**
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

**Relacje:**
- Wiele do wielu z `posts` przez `post_tags`

#### **post_tags** (Tabela łącząca posty i tagi)
- `postId` (UUID, FK → posts.id)
- `tagId` (UUID, FK → tags.id)
- Klucz główny złożony: (`postId`, `tagId`)

#### **comments** (Komentarze)
- `id` (UUID, PK)
- `postId` (UUID, FK → posts.id)
- `authorId` (UUID, FK → users.id)
- `content` (TEXT) - Treść komentarza
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

**Relacje:**
- Wiele do jednego z `posts`
- Wiele do jednego z `users` (autor)
- Jeden do wielu z `comment_reports`

#### **post_likes** (Polubienia postów)
- `id` (UUID, PK)
- `userId` (UUID, FK → users.id)
- `postId` (UUID, FK → posts.id)
- `createdAt` (TIMESTAMP)
- **UNIQUE constraint** na (`userId`, `postId`) - użytkownik może polubić post tylko raz

**Relacje:**
- Wiele do jednego z `users`
- Wiele do jednego z `posts`

#### **follows** (Relacje obserwowania)
- `id` (UUID, PK)
- `followerId` (UUID, FK → users.id) - Użytkownik obserwujący
- `followingId` (UUID, FK → users.id) - Użytkownik obserwowany
- `createdAt` (TIMESTAMP)
- **UNIQUE constraint** na (`followerId`, `followingId`) - nie można obserwować dwa razy

**Relacje:**
- Wiele do jednego z `users` jako `follower`
- Wiele do jednego z `users` jako `following`

#### **refresh_tokens** (Tokeny odświeżania)
- `id` (UUID, PK)
- `userId` (UUID, FK → users.id)
- `expiresAt` (TIMESTAMP) - Data wygaśnięcia
- `isRevoked` (BOOLEAN, default: false) - Czy token został unieważniony
- `revokedAt` (TIMESTAMP, nullable) - Data unieważnienia
- `userAgent` (VARCHAR, nullable) - User agent przeglądarki
- `ipAddress` (VARCHAR, nullable) - Adres IP
- `createdAt` (TIMESTAMP)
- **Indeks** na (`userId`, `expiresAt`)

**Relacje:**
- Wiele do jednego z `users`

#### **post_reports** (Zgłoszenia postów)
- `id` (UUID, PK)
- `postId` (UUID, FK → posts.id)
- `reporterId` (UUID, FK → users.id) - Użytkownik zgłaszający
- `category` (ENUM) - Kategoria zgłoszenia (SPAM, OFFENSIVE, FALSE_INFO, INAPPROPRIATE, OTHER)
- `reason` (TEXT) - Powód zgłoszenia
- `createdAt` (TIMESTAMP)
- **UNIQUE constraint** na (`postId`, `reporterId`) - użytkownik może zgłosić post tylko raz

**Relacje:**
- Wiele do jednego z `posts`
- Wiele do jednego z `users` (reporter)

#### **comment_reports** (Zgłoszenia komentarzy)
- `id` (UUID, PK)
- `commentId` (UUID, FK → comments.id)
- `reporterId` (UUID, FK → users.id)
- `category` (ENUM) - Kategoria zgłoszenia
- `reason` (TEXT) - Powód zgłoszenia
- `createdAt` (TIMESTAMP)
- **UNIQUE constraint** na (`commentId`, `reporterId`)

**Relacje:**
- Wiele do jednego z `comments`
- Wiele do jednego z `users` (reporter)

### 3.3. Indeksy i Optymalizacje

- **Indeksy unikalne:**
  - `users.email` (UNIQUE)
  - `users.nickname` (UNIQUE)
  - `tags.slug` (UNIQUE)
  - `post_likes(userId, postId)` (UNIQUE)
  - `follows(followerId, followingId)` (UNIQUE)
  - `post_reports(postId, reporterId)` (UNIQUE)
  - `comment_reports(commentId, reporterId)` (UNIQUE)

- **Indeksy wydajnościowe:**
  - `refresh_tokens(userId, expiresAt)` - dla szybkiego wyszukiwania aktywnych tokenów

- **Denormalizacja:**
  - `posts.likesCount` - eliminuje COUNT() przy każdym zapytaniu
  - `posts.commentsCount` - eliminuje COUNT() przy każdym zapytaniu
  - `tags.postCount` - licznik postów z tagiem

---

## 4. Funkcjonalności

### 4.1. Autentykacja i Autoryzacja

#### Rejestracja użytkownika
- **Endpoint:** `POST /auth/register`
- **Funkcjonalność:**
  - Walidacja emaila (unikalność)
  - Walidacja hasła (minimalna długość)
  - Automatyczne generowanie pseudonimu (jeśli nie podano)
  - Hashowanie hasła (bcrypt, 10 rounds)
  - Generowanie JWT access token (15 minut)
  - Generowanie refresh token (zapisany w bazie)
  - Ustawianie httpOnly cookies

#### Logowanie
- **Endpoint:** `POST /auth/login`
- **Funkcjonalność:**
  - Walidacja emaila i hasła
  - Porównanie hasła z hash w bazie
  - Generowanie tokenów (access + refresh)
  - Zapisanie refresh token z metadanymi (User-Agent, IP)
  - Ustawianie cookies

#### Odświeżanie tokenu
- **Endpoint:** `POST /auth/refresh-token`
- **Funkcjonalność:**
  - Weryfikacja refresh token z cookie
  - Sprawdzenie czy token nie został unieważniony
  - Sprawdzenie daty wygaśnięcia
  - Generowanie nowego access token
  - Opcjonalnie: rotacja refresh token

#### Wylogowanie
- **Endpoint:** `POST /auth/logout`
- **Funkcjonalność:**
  - Unieważnienie refresh token w bazie
  - Usunięcie cookies

#### Pobieranie profilu
- **Endpoint:** `GET /auth/me`
- **Funkcjonalność:**
  - Zwraca dane zalogowanego użytkownika
  - Wymaga ważnego JWT token

### 4.2. Zarządzanie Użytkownikami

#### Pobieranie profilu użytkownika
- **Endpoint:** `GET /users/:id`
- **Funkcjonalność:**
  - Zwraca dane użytkownika (email, nickname, avatar, data rejestracji)
  - Publiczny endpoint (opcjonalna autentykacja)

#### Aktualizacja profilu
- **Endpoint:** `PATCH /users/:id`
- **Funkcjonalność:**
  - Tylko właściciel konta może edytować
  - Możliwość zmiany: nickname, gender, avatar
  - Walidacja unikalności nickname

#### Upload avatara
- **Endpoint:** `POST /users/file`
- **Funkcjonalność:**
  - Upload pliku obrazu (multer)
  - Walidacja typu pliku
  - Zapisywanie w `uploads/avatars/`
  - Zwracanie ścieżki do pliku

### 4.3. System Obserwowania (Follow)

#### Obserwowanie użytkownika
- **Endpoint:** `POST /users/:id/follow`
- **Funkcjonalność:**
  - Dodanie relacji follow
  - Walidacja: nie można obserwować siebie
  - Walidacja: nie można obserwować dwa razy (UNIQUE constraint)

#### Przestanie obserwować
- **Endpoint:** `DELETE /users/:id/unfollow`
- **Funkcjonalność:**
  - Usunięcie relacji follow

#### Lista obserwujących
- **Endpoint:** `GET /users/:id/followers`
- **Funkcjonalność:**
  - Zwraca listę użytkowników obserwujących danego użytkownika

#### Lista obserwowanych
- **Endpoint:** `GET /users/:id/following`
- **Funkcjonalność:**
  - Zwraca listę użytkowników obserwowanych przez danego użytkownika

### 4.4. Zarządzanie Postami

#### Pobieranie listy postów (Feed)
- **Endpoint:** `GET /posts`
- **Query Parameters:**
  - `cursor` - Cursor-based pagination
  - `limit` - Liczba postów (default: 20)
  - `sort` - Sortowanie: `newest`, `popular`, `most_commented`
  - `tag` - Filtrowanie po tagu
  - `authorId` - Filtrowanie po autorze
- **Funkcjonalność:**
  - Cursor-based pagination (optymalizacja dla infinite scroll)
  - Sortowanie po popularności (likesCount) lub liczbie komentarzy
  - Filtrowanie po tagach i autorze
  - Opcjonalna autentykacja (dla personalizacji)
  - Zwraca zdenormalizowane liczniki (likesCount, commentsCount)

#### Pobieranie pojedynczego posta
- **Endpoint:** `GET /posts/:id`
- **Funkcjonalność:**
  - Zwraca szczegóły posta z autorem
  - Opcjonalna autentykacja (dla sprawdzenia czy użytkownik polubił)

#### Tworzenie posta
- **Endpoint:** `POST /posts`
- **Funkcjonalność:**
  - Wymaga autentykacji
  - Walidacja: tytuł, treść
  - Automatyczne tworzenie tagów (jeśli nie istnieją)
  - Tworzenie relacji many-to-many z tagami
  - Aktualizacja `tags.postCount`
  - Filtrowanie zakazanych słów (banned words)

#### Edycja posta
- **Endpoint:** `PATCH /posts/:id`
- **Funkcjonalność:**
  - Tylko autor może edytować
  - Walidacja własności (authorId === userId)
  - Aktualizacja tagów (jeśli zmienione)
  - Filtrowanie zakazanych słów

#### Usuwanie posta
- **Endpoint:** `DELETE /posts/:id`
- **Funkcjonalność:**
  - Tylko autor może usunąć
  - Kaskadowe usunięcie: komentarze, polubienia, relacje z tagami
  - Aktualizacja `tags.postCount`

### 4.5. System Komentarzy

#### Dodawanie komentarza
- **Endpoint:** `POST /posts/:id/comments`
- **Funkcjonalność:**
  - Wymaga autentykacji
  - Walidacja treści komentarza
  - Automatyczna aktualizacja `posts.commentsCount`
  - Filtrowanie zakazanych słów

#### Pobieranie komentarzy
- **Endpoint:** `GET /posts/:id/comments`
- **Query Parameters:**
  - `limit` - Liczba komentarzy (default: wszystkie)
  - `cursor` - Cursor-based pagination
- **Funkcjonalność:**
  - Zwraca komentarze z autorami
  - Sortowanie po dacie (najnowsze)
  - Opcjonalna paginacja

#### Pobieranie liczby komentarzy
- **Endpoint:** `GET /posts/:id/comments/count`
- **Funkcjonalność:**
  - Zwraca liczbę komentarzy (używa zdenormalizowanego `commentsCount`)

#### Usuwanie komentarza
- **Endpoint:** `DELETE /comments/:id`
- **Funkcjonalność:**
  - Tylko autor może usunąć
  - Aktualizacja `posts.commentsCount`

### 4.6. System Polubień

#### Polubienie posta
- **Endpoint:** `POST /posts/:id/like`
- **Funkcjonalność:**
  - Wymaga autentykacji
  - Walidacja: użytkownik może polubić tylko raz (UNIQUE constraint)
  - Automatyczna aktualizacja `posts.likesCount`

#### Cofnięcie polubienia
- **Endpoint:** `DELETE /posts/:id/unlike`
- **Funkcjonalność:**
  - Wymaga autentykacji
  - Aktualizacja `posts.likesCount`

#### Pobieranie polubień
- **Endpoint:** `GET /posts/:id/likes`
- **Funkcjonalność:**
  - Zwraca listę użytkowników, którzy polubili post

#### Liczba polubień
- **Endpoint:** `GET /posts/:id/likes/count`
- **Funkcjonalność:**
  - Zwraca liczbę polubień (używa zdenormalizowanego `likesCount`)

### 4.7. System Tagów

#### Pobieranie tagów
- **Endpoint:** `GET /tags`
- **Query Parameters:**
  - `limit` - Liczba tagów
  - `sort` - Sortowanie (popular, newest)
- **Funkcjonalność:**
  - Zwraca listę tagów z liczbą postów (`postCount`)

#### Sugerowanie tagów
- **Endpoint:** `GET /tags/suggest`
- **Query Parameters:**
  - `q` - Query string (wyszukiwanie)
- **Funkcjonalność:**
  - Wyszukiwanie tagów po nazwie (ILIKE)
  - Zwraca maksymalnie 10 sugestii

#### Popularne tagi
- **Endpoint:** `GET /tags/trending`
- **Funkcjonalność:**
  - Zwraca najpopularniejsze tagi (sortowanie po `postCount`)

### 4.8. System Zgłoszeń (Reports)

#### Zgłoszenie posta
- **Endpoint:** `POST /posts/:id/report`
- **Funkcjonalność:**
  - Wymaga autentykacji
  - Kategorie: SPAM, OFFENSIVE, FALSE_INFO, INAPPROPRIATE, OTHER
  - Walidacja: użytkownik może zgłosić post tylko raz (UNIQUE constraint)
  - Zapisanie powodu zgłoszenia

#### Zgłoszenie komentarza
- **Endpoint:** `POST /comments/:id/report`
- **Funkcjonalność:**
  - Analogicznie do zgłoszenia posta

#### Pobieranie zgłoszeń
- **Endpoint:** `GET /posts/:id/reports` / `GET /comments/:id/reports`
- **Funkcjonalność:**
  - Zwraca listę zgłoszeń (prawdopodobnie dla administratorów)

#### Liczba zgłoszeń
- **Endpoint:** `GET /posts/:id/reports/count` / `GET /comments/:id/reports/count`

### 4.9. Funkcjonalności Frontendu

#### Strony Publiczne
- **Strona główna** (`/`) - Feed postów z sortowaniem i filtrowaniem
- **Szczegóły posta** (`/history/[id]/[slug]`) - Pełny widok posta z komentarzami
- **Profil użytkownika** (`/users/[id]/profile`) - Publiczny profil

#### Strony Wymagające Autentykacji
- **Dashboard** (`/dashboard`) - Panel użytkownika
- **Tworzenie posta** (`/history/create`) - Formularz tworzenia posta
- **Profil użytkownika** (`/dashboard/profile`) - Edycja własnego profilu
- **Ustawienia** (`/users/[id]/settings`) - Ustawienia konta

#### Funkcjonalności UI
- **Infinite Scroll** - Cursor-based pagination dla feedu
- **Prefetching** - Prefetch komentarzy na hover (React Query)
- **Optimistic Updates** - Natychmiastowa aktualizacja UI przy polubieniach
- **Server-Side Rendering (SSR)** - Dla głównego feedu (SEO, performance)
- **Image Optimization** - Next.js Image component
- **Responsive Design** - Tailwind CSS
- **Dark Mode** - (prawdopodobnie przez hook `useTheme`)

---

## 5. Technologie

### 5.1. Backend

#### Framework i Język
- **NestJS 11** - Framework Node.js oparty na Express
- **TypeScript 5.7** - Język programowania
- **Node.js** - Środowisko uruchomieniowe

#### Baza Danych
- **PostgreSQL** - Relacyjna baza danych
- **TypeORM 0.3** - ORM (Object-Relational Mapping)
- **UUID** - Identyfikatory (zamiast auto-increment)

#### Autentykacja
- **Passport.js** - Middleware autentykacji
- **Passport JWT** - Strategia JWT
- **@nestjs/jwt** - Moduł JWT dla NestJS
- **bcryptjs** - Hashowanie haseł

#### Walidacja
- **class-validator** - Dekoratory walidacji
- **class-transformer** - Transformacja obiektów

#### Dokumentacja API
- **Swagger/OpenAPI** - Automatyczna dokumentacja API (`/api`)

#### Testy
- **Jest** - Framework testowy
- **Supertest** - Testy HTTP
- **@nestjs/testing** - Narzędzia testowe NestJS

#### Narzędzia Deweloperskie
- **ESLint** - Linter
- **Prettier** - Formatowanie kodu
- **Docker** - Konteneryzacja

### 5.2. Frontend

#### Framework
- **Next.js 15.3** - React framework z App Router
- **React 19** - Biblioteka UI
- **TypeScript 5** - Język programowania

#### Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **PostCSS** - Przetwarzanie CSS
- **Autoprefixer** - Automatyczne prefiksy CSS

#### State Management
- **Zustand 5** - Lekka biblioteka do zarządzania stanem
- **React Query (TanStack Query) 5** - Zarządzanie danymi serwerowymi
  - Cache'owanie
  - Prefetching
  - Optimistic updates
  - Automatic refetching

#### Formularze
- **React Hook Form 7** - Zarządzanie formularzami
- **Zod 4** - Walidacja schematów
- **@hookform/resolvers** - Integracja z React Hook Form

#### UI Components
- **@headlessui/react** - Bezstylowe komponenty UI
- **@heroicons/react** - Ikony

#### Notyfikacje
- **Sonner** - Toast notifications

#### Testy
- **Vitest** - Framework testowy (alternatywa dla Jest)
- **Jest** - Framework testowy (również używany)
- **@testing-library/react** - Testowanie komponentów React
- **Playwright** - Testy e2e

#### Narzędzia Deweloperskie
- **Storybook** - Dokumentacja komponentów
- **ESLint** - Linter
- **Prettier** - Formatowanie
- **Husky** - Git hooks
- **lint-staged** - Linting przed commit

#### Narzędzia
- **date-fns** - Formatowanie dat
- **clsx** - Warunkowe klasy CSS
- **tailwind-merge** - Merge klas Tailwind

### 5.3. DevOps i Deployment

#### Konteneryzacja
- **Docker** - Konteneryzacja aplikacji
- **Docker Compose** - Orkiestracja kontenerów
  - `docker-compose.dev.yml` - Środowisko deweloperskie
  - `docker-compose.prod.yml` - Środowisko produkcyjne

#### Baza Danych
- **PostgreSQL** - W kontenerze Docker
- **pgAdmin** - Narzędzie do zarządzania bazą (dev)

#### CI/CD
- **GitHub Actions** - (prawdopodobnie, na podstawie struktury `.github/`)
- **Codecov** - Analiza pokrycia testami (`codecov.yml`)

---

## 6. Zabezpieczenia

### 6.1. Autentykacja

#### JWT (JSON Web Tokens)
- **Access Token:**
  - Czas życia: 15 minut (konfigurowalny przez `JWT_EXPIRATION_TIME`)
  - Przechowywany w httpOnly cookie (`accessToken`)
  - Alternatywnie: Bearer token w headerze Authorization
- **Refresh Token:**
  - Przechowywany w bazie danych (`refresh_tokens`)
  - Przechowywany w httpOnly cookie (`refreshToken`)
  - Zawiera metadane: User-Agent, IP address
  - Możliwość unieważnienia (revocation)
  - Indeks na (`userId`, `expiresAt`) dla szybkiego wyszukiwania

#### Hasła
- **Hashowanie:** bcrypt z 10 rounds
- **Walidacja:** Przed zapisaniem (hook `@BeforeInsert`)
- **Porównanie:** Metoda `validatePassword()` w encji User

#### Cookies
- **httpOnly:** Tak (zabezpieczenie przed XSS)
- **Secure:** (prawdopodobnie w produkcji)
- **SameSite:** (prawdopodobnie Lax/Strict)

### 6.2. Autoryzacja

#### Guards (NestJS)
- **JwtAuthGuard:**
  - Wymaga ważnego JWT token
  - Używany dla chronionych endpointów
  - Dekorator: `@UseGuards(JwtAuthGuard)`

- **OptionalJwtAuthGuard:**
  - Opcjonalna autentykacja
  - Nie rzuca błędu jeśli token nieprawidłowy
  - Zwraca `undefined` dla użytkownika
  - Używany dla publicznych endpointów z personalizacją

- **RefreshTokenAuthGuard:**
  - Weryfikacja refresh token
  - Używany dla endpointu `/auth/refresh-token`

#### Dekoratory
- **@GetUser()** - Pobiera zalogowanego użytkownika (wymaga JwtAuthGuard)
- **@GetOptionalUser()** - Pobiera użytkownika lub `undefined` (wymaga OptionalJwtAuthGuard)

#### Własność Zasobów
- **Walidacja własności:**
  - Edycja/usuwanie postów: tylko autor (`post.authorId === user.id`)
  - Edycja/usuwanie komentarzy: tylko autor (`comment.authorId === user.id`)
  - Aktualizacja profilu: tylko właściciel (`user.id === userId`)

### 6.3. Walidacja Danych

#### Backend
- **class-validator:**
  - Walidacja DTO (Data Transfer Objects)
  - Dekoratory: `@IsEmail()`, `@IsString()`, `@MinLength()`, `@IsEnum()`, etc.
  - Global ValidationPipe w `main.ts`:
    - `whitelist: true` - Usuwa nieznane właściwości
    - `transform: true` - Automatyczna transformacja typów

#### Frontend
- **Zod schemas:**
  - Walidacja formularzy
  - Integracja z React Hook Form
  - Type-safe walidacja

### 6.4. Ochrona przed Atakami

#### CORS (Cross-Origin Resource Sharing)
- **Konfiguracja w `main.ts`:**
  - `origin`: `process.env.FRONTEND_URL || 'http://localhost:3000'`
  - `credentials: true` - Wsparcie dla cookies
  - `methods`: GET, POST, PUT, DELETE, PATCH
  - `allowedHeaders`: Content-Type, Authorization

#### XSS (Cross-Site Scripting)
- **httpOnly cookies** - Tokeny nie są dostępne przez JavaScript
- **Sanityzacja danych** - (prawdopodobnie przez React, który automatycznie escapuje)

#### CSRF (Cross-Site Request Forgery)
- **SameSite cookies** - (prawdopodobnie skonfigurowane)
- **CORS** - Ograniczenie do określonych originów

#### SQL Injection
- **TypeORM** - Parametryzowane zapytania
- **Repository pattern** - Abstrakcja nad zapytaniami SQL

#### Rate Limiting
- **Brak** - (możliwa luka, zalecane dodanie)

#### Filtrowanie Treści
- **Banned Words:**
  - Lista zakazanych słów w `common/constants/banned-words.ts`
  - Filtrowanie przy tworzeniu/edycji postów i komentarzy
  - (Prawdopodobnie implementacja w serwisach)

### 6.5. Bezpieczeństwo Bazy Danych

#### Ograniczenia
- **UNIQUE constraints:**
  - Email użytkownika
  - Nickname użytkownika
  - Slug tagu
  - Polubienie (userId, postId)
  - Follow (followerId, followingId)
  - Zgłoszenie (postId/commentId, reporterId)

#### Kaskadowe Usuwanie
- **ON DELETE CASCADE:**
  - Usunięcie użytkownika → usuwa posty, komentarze, polubienia, follow, tokeny, zgłoszenia
  - Usunięcie posta → usuwa komentarze, polubienia, relacje z tagami, zgłoszenia
  - Usunięcie komentarza → usuwa zgłoszenia

#### Indeksy
- **Wydajność i bezpieczeństwo:**
  - Indeksy unikalne zapobiegają duplikatom
  - Indeksy na kluczach obcych przyspieszają zapytania

### 6.6. Middleware (Frontend)

#### Next.js Middleware
- **Ochrona tras:**
  - `protectedRoutes`: `/dashboard`, `/history/create`, `/profile`
  - `authRoutes`: `/auth/login`, `/auth/register`
  - Przekierowanie do logowania jeśli brak autentykacji
  - Przekierowanie z logowania/rejestracji jeśli zalogowany

#### Server-Side Authentication
- **`auth-ssr.ts`:**
  - Pobieranie użytkownika na serwerze (SSR)
  - Automatyczne odświeżanie tokenu jeśli wygasł
  - Używane w Server Components

### 6.7. Bezpieczeństwo Plików

#### Upload Avatara
- **Walidacja typu pliku** - (prawdopodobnie przez multer)
- **Zapisywanie w `uploads/avatars/`**
- **Ograniczenie rozmiaru** - (prawdopodobnie skonfigurowane)

---

## 7. Optymalizacje Wydajności

### 7.1. Backend

#### Denormalizacja
- **`posts.likesCount`** - Eliminuje `COUNT()` przy każdym zapytaniu feedu
- **`posts.commentsCount`** - Eliminuje `COUNT()` przy każdym zapytaniu feedu
- **`tags.postCount`** - Licznik postów z tagiem

#### Cursor-based Pagination
- **Zamiast offset/limit:**
  - Lepsza wydajność dla dużych zbiorów danych
  - Nie ma problemu z "skakaniem" przy dodawaniu nowych rekordów
  - Używane w feedzie postów i komentarzach

#### Indeksy Bazy Danych
- **Indeksy unikalne** - Zapobiegają duplikatom i przyspieszają wyszukiwanie
- **Indeks na `refresh_tokens(userId, expiresAt)`** - Szybkie wyszukiwanie aktywnych tokenów

#### Connection Pooling
- **TypeORM extra config:**
  - `max: 20` - Maksymalna liczba połączeń
  - `connectionTimeoutMillis: 10000`
  - `idleTimeoutMillis: 10000`
  - `maxUses: 7500`

### 7.2. Frontend

#### Server-Side Rendering (SSR)
- **Next.js App Router:**
  - SSR dla głównego feedu (SEO, szybkie pierwsze renderowanie)
  - Short revalidate dla publicznych danych

#### React Query (TanStack Query)
- **Cache'owanie:**
  - Automatyczne cache'owanie odpowiedzi API
  - Redukcja liczby zapytań do serwera
- **Prefetching:**
  - Prefetch komentarzy na hover (ukrywa latency)
- **Optimistic Updates:**
  - Natychmiastowa aktualizacja UI przy polubieniach
  - Rollback w przypadku błędu

#### Code Splitting
- **Next.js:**
  - Automatyczne code splitting
  - Lazy loading komponentów

#### Image Optimization
- **Next.js Image component:**
  - Automatyczna optymalizacja obrazów
  - Lazy loading
  - Responsive images

#### Bundle Optimization
- **Tree shaking** - Usuwanie nieużywanego kodu
- **Minification** - Minifikacja w produkcji

---

## 8. Testy

### 8.1. Backend

#### Framework
- **Jest** - Framework testowy
- **@nestjs/testing** - Narzędzia testowe NestJS
- **Supertest** - Testy HTTP

#### Pokrycie Testami
- **Coverage threshold:**
  - `branches: 80%`
  - `functions: 80%`
  - `lines: 80%`
  - `statements: 80%`

#### Pliki Testowe
- **Unit tests:**
  - `*.spec.ts` - Testy jednostkowe
  - Testy dla: controllers, services, repositories, guards, strategies, decorators, utils
- **E2E tests:**
  - `test/jest-e2e.json` - Konfiguracja testów e2e

### 8.2. Frontend

#### Frameworki
- **Vitest** - Framework testowy (główny)
- **Jest** - Framework testowy (również używany)
- **@testing-library/react** - Testowanie komponentów
- **Playwright** - Testy e2e

#### Pliki Testowe
- **Unit tests:**
  - `__tests__/` - Katalogi z testami
  - Testy dla: komponentów, hooks, services, helpers, middleware
- **Storybook:**
  - Dokumentacja i testy wizualne komponentów

---

## 9. Najważniejsze Informacje dla Pracy Inżynierskiej

### 9.1. Architektura Systemu

#### Wzorce Projektowe
1. **Repository Pattern:**
   - Abstrakcja dostępu do danych
   - Ułatwia testowanie (mockowanie)
   - Używany w modułach: posts, users, tags, reports

2. **Dependency Injection:**
   - NestJS używa DI container
   - Ułatwia testowanie i utrzymanie
   - SOLID principles

3. **Modular Architecture:**
   - Podział na moduły (auth, users, posts, tags, reports)
   - Każdy moduł: controller, service, entities, repositories
   - Loose coupling, high cohesion

4. **DTO Pattern:**
   - Data Transfer Objects dla walidacji i transformacji
   - Separacja warstw (API ↔ Business Logic)

#### Warstwy Aplikacji
1. **Controller Layer** - Obsługa HTTP, walidacja DTO
2. **Service Layer** - Logika biznesowa
3. **Repository Layer** - Dostęp do bazy danych
4. **Entity Layer** - Modele danych (TypeORM)

### 9.2. Kluczowe Decyzje Projektowe

#### Denormalizacja Liczników
- **Problem:** N+1 queries przy pobieraniu feedu
- **Rozwiązanie:** Denormalizowane `likesCount` i `commentsCount` w tabeli `posts`
- **Koszt:** Aktualizacja liczników przy każdej zmianie (like/unlike, comment create/delete)
- **Korzyść:** Eliminacja kosztownych `COUNT()` przy każdym zapytaniu

#### Cursor-based Pagination
- **Problem:** Offset/limit jest nieefektywne dla dużych zbiorów
- **Rozwiązanie:** Cursor-based pagination używając `createdAt` lub `id`
- **Korzyść:** Stała wydajność niezależnie od pozycji w zbiorze

#### JWT z Refresh Tokens
- **Problem:** Bezpieczeństwo długożyjących tokenów
- **Rozwiązanie:** Krótkożyjące access tokens (15 min) + długożyjące refresh tokens
- **Korzyść:** Balance między bezpieczeństwem a UX

#### httpOnly Cookies
- **Problem:** XSS ataki na localStorage
- **Rozwiązanie:** Przechowywanie tokenów w httpOnly cookies
- **Korzyść:** Tokeny niedostępne przez JavaScript

### 9.3. Metryki i Monitoring

#### Potencjalne Metryki
- Liczba użytkowników
- Liczba postów dziennie
- Liczba komentarzy dziennie
- Liczba polubień dziennie
- Średni czas odpowiedzi API
- Wykorzystanie bazy danych

#### Monitoring
- **Brak wdrożonego** - Zalecane: Sentry, DataDog, New Relic

### 9.4. Skalowalność

#### Potencjalne Wąskie Gardła
1. **Baza danych:**
   - Duża liczba postów → wolne zapytania
   - **Rozwiązanie:** Indeksy, denormalizacja, read replicas

2. **Upload plików:**
   - Duże pliki → wolne uploady
   - **Rozwiązanie:** CDN (CloudFront, Cloudflare), object storage (S3)

3. **Feed:**
   - Duża liczba użytkowników → wiele zapytań
   - **Rozwiązanie:** Cache'owanie (Redis), CDN

#### Rekomendacje dla Skalowania
- **Horizontal Scaling:**
  - Load balancer przed API
  - Wiele instancji API
  - Read replicas dla PostgreSQL

- **Cache'owanie:**
  - Redis dla cache'owania feedu
  - CDN dla statycznych plików

- **Queue System:**
  - Background jobs dla ciężkich operacji (np. aktualizacja liczników)

### 9.5. Bezpieczeństwo - Luki i Rekomendacje

#### Zidentyfikowane Luki
1. **Brak Rate Limiting:**
   - Możliwość spamowania endpointów
   - **Rekomendacja:** Implementacja rate limiting (np. `@nestjs/throttler`)

2. **Brak walidacji rozmiaru plików:**
   - Możliwość uploadu bardzo dużych plików
   - **Rekomendacja:** Ograniczenie rozmiaru (np. 5MB)

3. **Brak walidacji typu pliku:**
   - Możliwość uploadu niebezpiecznych plików
   - **Rekomendacja:** Whitelist dozwolonych typów (jpg, png, webp)

4. **Brak HTTPS w produkcji:**
   - (Prawdopodobnie) - **Rekomendacja:** Wymuszenie HTTPS

5. **Brak logowania zdarzeń bezpieczeństwa:**
   - Trudne do wykrycia ataków
   - **Rekomendacja:** Logowanie failed logins, suspicious activity

#### Rekomendacje
- **Input Sanitization:**
  - Sanityzacja HTML w komentarzach/postach (zapobieganie XSS)

- **Content Security Policy (CSP):**
  - Headers CSP w Next.js

- **Helmet.js:**
  - Security headers dla NestJS

- **Audit Logging:**
  - Logowanie ważnych akcji (edycja posta, usunięcie, zgłoszenie)

### 9.6. Dokumentacja

#### API Documentation
- **Swagger/OpenAPI:**
  - Automatyczna dokumentacja pod `/api`
  - Dekoratory `@ApiProperty()`, `@ApiOperation()`

#### Code Documentation
- **TypeScript:**
  - Typy jako dokumentacja
  - JSDoc dla złożonych funkcji

#### README
- **Główny README:**
  - Instrukcje uruchomienia
  - Struktura projektu
  - Endpointy API

---

## 10. Podsumowanie

### 10.1. Mocne Strony Projektu

1. **Nowoczesny Stack:**
   - NestJS - dojrzały framework backendowy
   - Next.js 15 - najnowsza wersja z App Router
   - TypeScript - type safety

2. **Dobra Architektura:**
   - Modular structure
   - Separation of concerns
   - Repository pattern

3. **Bezpieczeństwo:**
   - JWT z refresh tokens
   - httpOnly cookies
   - Hashowanie haseł (bcrypt)
   - Walidacja danych

4. **Wydajność:**
   - Denormalizacja liczników
   - Cursor-based pagination
   - SSR w Next.js
   - React Query cache'owanie

5. **Testy:**
   - Pokrycie testami (80% threshold)
   - Unit tests i e2e tests

### 10.2. Obszary do Poprawy

1. **Rate Limiting** - Brak ochrony przed spamem
2. **Monitoring** - Brak systemu monitoringu
3. **Error Handling** - Możliwe ulepszenie obsługi błędów
4. **Logging** - Brak strukturalnego logowania
5. **Documentation** - Możliwe rozszerzenie dokumentacji

### 10.3. Rekomendacje dla Pracy Inżynierskiej

1. **Opis Architektury:**
   - Szczegółowy opis warstw (Controller, Service, Repository)
   - Diagramy UML (diagram klas, sekwencji)
   - Opis wzorców projektowych

2. **Analiza Wydajności:**
   - Benchmarki zapytań do bazy
   - Analiza denormalizacji vs normalizacji
   - Testy obciążeniowe

3. **Bezpieczeństwo:**
   - Analiza zagrożeń (OWASP Top 10)
   - Implementacja rate limiting
   - Audit security

4. **Testy:**
   - Opis strategii testowania
   - Przykłady testów jednostkowych i integracyjnych
   - Analiza pokrycia testami

5. **Deployment:**
   - Opis procesu deploymentu
   - Konfiguracja CI/CD
   - Monitoring i alerting

---

**Data utworzenia analizy:** 2025-01-XX  
**Wersja projektu:** 0.0.1 (API), 0.1.0 (Web)


