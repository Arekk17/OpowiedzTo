# Storybook - OpowiedzTo

Storybook zostało skonfigurowane dla projektu OpowiedzTo, umożliwiając interaktywne tworzenie i testowanie komponentów UI.

## Uruchamianie

```bash
npm run storybook
```

Storybook będzie dostępne pod adresem: http://localhost:6006

## Budowanie dla produkcji

```bash
npm run build-storybook
```

## Skonfigurowane addony

- **@chromatic-com/storybook** - Integracja z Chromatic dla visual testing
- **@storybook/addon-docs** - Automatyczna dokumentacja komponentów
- **@storybook/addon-onboarding** - Przewodnik dla nowych użytkowników
- **@storybook/addon-a11y** - Testowanie dostępności (a11y)
- **@storybook/addon-vitest** - Integracja z Vitest dla testów

## Istniejące komponenty

### Atomy

- **IconButton** - Przycisk z ikoną (warianty: notification, profile)
- **Logo** - Logo aplikacji OpowiedzTo
- **NavLink** - Link nawigacyjny
- **ProfileAvatar** - Avatar użytkownika (rozmiary: sm, md, lg)
- **NotificationIcon** - Ikona powiadomień

### Molekuły

- **StoryCard** - Karta historii (kategorie: anonymous, featured, trending, new)

## Konfiguracja

### Tailwind CSS

Storybook jest skonfigurowany do użycia z Tailwind CSS oraz custom zmiennymi CSS zdefiniowanymi w `globals.css`.

### Tła

Dostępne są dwa predefiniowane tła:

- **light** - `#fefefe` (domyślne)
- **dark** - `#1f2937`

### Testowanie dostępności

Addon a11y jest skonfigurowany w trybie 'todo', co oznacza, że naruszenia a11y są wyświetlane w UI testowym, ale nie powodują niepowodzenia CI.

## Dodawanie nowych stories

1. Utwórz plik `NazwaKomponentu.stories.tsx` obok komponentu
2. Użyj szablonu:

```typescript
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NazwaKomponentu } from './NazwaKomponentu';

const meta = {
  title: 'Kategoria/NazwaKomponentu',
  component: NazwaKomponentu,
  parameters: {
    layout: 'centered', // lub 'padded', 'fullscreen'
  },
  tags: ['autodocs'],
  argTypes: {
    // definicje kontrolek
  },
} satisfies Meta<typeof NazwaKomponentu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // props domyślne
  },
};
```

## Kategorie komponentów

- **Atoms** - Podstawowe, niepodzielne komponenty
- **Molecules** - Komponenty złożone z atomów
- **Organisms** - Złożone sekcje interfejsu
- **Templates** - Szablony stron
- **Pages** - Kompletne strony
