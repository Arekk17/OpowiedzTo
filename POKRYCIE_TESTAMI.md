# Raport pokrycia testami jednostkowymi

## Podsumowanie

| Metryka                     | Pokrycie |
| --------------------------- | -------- |
| **Statements (instrukcje)** | 71.76%   |
| **Branches (gałęzie)**      | 42.14%   |
| **Functions (funkcje)**     | 55.42%   |
| **Lines (linie)**           | 72.07%   |

## Wyniki testów

- **Suity testowe**: 25 passed, 25 total
- **Testy jednostkowe**: 144 passed, 144 total
- **Czas wykonania**: ~9s

## Pokrycie według modułów

### Auth (Autoryzacja)

| Plik                           | % Stmts | % Branch | % Funcs | % Lines |
| ------------------------------ | ------- | -------- | ------- | ------- |
| auth.controller.ts             | 100     | 100      | 100     | 100     |
| auth.service.ts                | 98.61   | 60.86    | 100     | 98.57   |
| get-user.decorator.ts          | 100     | 100      | 100     | 100     |
| get-optional-user.decorator.ts | 100     | 100      | 100     | 100     |
| jwt-auth.guard.ts              | 100     | 100      | 100     | 100     |
| refresh-token-auth.guard.ts    | 100     | 100      | 100     | 100     |
| jwt.strategy.ts                | 90      | 75       | 75      | 88.88   |
| refresh-token.strategy.ts      | 92.3    | 90       | 75      | 91.89   |
| cookie-parser.util.ts          | 100     | 100      | 100     | 100     |

### Posts (Posty)

| Plik                    | % Stmts | % Branch | % Funcs | % Lines |
| ----------------------- | ------- | -------- | ------- | ------- |
| comment.controller.ts   | 100     | 75       | 100     | 100     |
| post-like.controller.ts | 100     | 100      | 100     | 100     |
| post-like.service.ts    | 100     | 100      | 100     | 100     |
| posts.controller.ts     | 100     | 100      | 100     | 100     |
| posts.service.ts        | 97.72   | 65.71    | 100     | 98.7    |

### Reports (Zgłoszenia)

| Plik                         | % Stmts | % Branch | % Funcs | % Lines |
| ---------------------------- | ------- | -------- | ------- | ------- |
| comment-report.controller.ts | 100     | 100      | 100     | 100     |
| post-report.controller.ts    | 100     | 100      | 100     | 100     |
| comment-report.service.ts    | 100     | 100      | 100     | 100     |
| post-report.service.ts       | 100     | 100      | 100     | 100     |

### Tags (Tagi)

| Plik               | % Stmts | % Branch | % Funcs | % Lines |
| ------------------ | ------- | -------- | ------- | ------- |
| tags.controller.ts | 100     | 50       | 100     | 100     |
| tags.service.ts    | 96.55   | 33.33    | 92.85   | 95.65   |

### Users (Użytkownicy)

| Plik                 | % Stmts | % Branch | % Funcs | % Lines |
| -------------------- | ------- | -------- | ------- | ------- |
| follow.controller.ts | 100     | 100      | 100     | 100     |
| follow.service.ts    | 100     | 100      | 100     | 100     |
| users.controller.ts  | 79.31   | 50       | 66.66   | 77.77   |
| users.service.ts     | 100     | 100      | 100     | 100     |

### Helpers

| Plik       | % Stmts | % Branch | % Funcs | % Lines |
| ---------- | ------- | -------- | ------- | ------- |
| slugify.ts | 100     | 100      | 100     | 100     |

## Pliki z pełnym pokryciem (100%)

Następujące pliki posiadają 100% pokrycie wszystkimi metrykami:

1. **auth.controller.ts** - Kontroler autoryzacji
2. **get-user.decorator.ts** - Dekorator pobierania użytkownika
3. **get-optional-user.decorator.ts** - Dekorator opcjonalnego użytkownika
4. **jwt-auth.guard.ts** - Guard JWT
5. **refresh-token-auth.guard.ts** - Guard refresh tokenów
6. **cookie-parser.util.ts** - Narzędzie do parsowania ciasteczek
7. **post-like.controller.ts** - Kontroler polubień
8. **post-like.service.ts** - Serwis polubień
9. **posts.controller.ts** - Kontroler postów
10. **comment-report.controller.ts** - Kontroler zgłoszeń komentarzy
11. **post-report.controller.ts** - Kontroler zgłoszeń postów
12. **comment-report.service.ts** - Serwis zgłoszeń komentarzy
13. **post-report.service.ts** - Serwis zgłoszeń postów
14. **follow.controller.ts** - Kontroler obserwujących
15. **follow.service.ts** - Serwis obserwujących
16. **users.service.ts** - Serwis użytkowników
17. **slugify.ts** - Funkcja pomocnicza slugifikacji
18. Wszystkie pliki DTO (Data Transfer Objects)

## Struktura testów

```
opowiedzto-api/
├── src/
│   ├── auth/
│   │   ├── auth.controller.spec.ts
│   │   ├── auth.service.spec.ts
│   │   ├── decorators/
│   │   │   └── get-user.decorator.spec.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.spec.ts
│   │   │   └── refresh-token-auth.guard.spec.ts
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.spec.ts
│   │   │   └── refresh-token.strategy.spec.ts
│   │   └── utils/
│   │       └── cookie-parser.util.spec.ts
│   ├── helpers/
│   │   └── slugify.spec.ts
│   ├── posts/
│   │   ├── comment.controller.spec.ts
│   │   ├── post-like.controller.spec.ts
│   │   ├── post-like.service.spec.ts
│   │   ├── posts.controller.spec.ts
│   │   └── posts.service.spec.ts
│   ├── reports/
│   │   ├── controllers/
│   │   │   ├── comment-report.controller.spec.ts
│   │   │   └── post-report.controller.spec.ts
│   │   └── services/
│   │       ├── comment-report.service.spec.ts
│   │       └── post-report.service.spec.ts
│   ├── seed/
│   │   └── seed.service.spec.ts
│   ├── tags/
│   │   ├── tags.controller.spec.ts
│   │   └── tags.service.spec.ts
│   └── users/
│       ├── follow.controller.spec.ts
│       ├── follow.service.spec.ts
│       ├── users.controller.spec.ts
│       └── users.service.spec.ts
└── test/
    ├── jest.setup.ts
    └── utils/
        ├── create-mock-repository.ts
        ├── create-testing-module.ts
        └── mock-providers.ts
```

## Przykłady testów jednostkowych

### Test kontrolera autoryzacji

```typescript
// auth.controller.spec.ts
describe('AuthController', () => {
  it('register deleguje do AuthService', async () => {
    const dto: RegisterDto = {
      email: 'john@example.com',
      password: 'secret',
      nickname: 'johnny',
      gender: Gender.MALE,
    };
    const result = { accessToken: 'token' } as never;
    service.register.mockResolvedValue(result);

    await expect(controller.register(dto, response, request)).resolves.toBe(result);
    expect(service.register).toHaveBeenCalledWith(dto, response, request);
  });
});
```

### Test serwisu z mockami

```typescript
// posts.service.spec.ts
describe('PostsService', () => {
  it('normalizuje tagi i tworzy post', async () => {
    const user = { id: 'author-1' } as User;
    const createDto = { title: 'Title', content: 'Content', tags: [' Tech ', ''] };
    const tags = [{ slug: 'tech' }] as any;

    tagsService.upsertManyBySlugs.mockResolvedValue();
    tagsService.findBySlugs.mockResolvedValue(tags);
    postsRepository.create.mockResolvedValue(post);

    const result = await service.create(createDto, user);

    expect(tagsService.upsertManyBySlugs).toHaveBeenCalledWith(['tech']);
    expect(result).toBe(post);
  });
});
```

### Test dekoratorów NestJS

```typescript
// get-user.decorator.spec.ts
describe('Auth decorators', () => {
  it('GetUser zwraca użytkownika z requestu', () => {
    const user = { id: 'user-1' };
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    } as unknown as ExecutionContext;

    const factory = getParamDecoratorFactory(GetUser);
    expect(factory.factory(null, context)).toBe(user);
  });
});
```

## Narzędzia testowe

- **Jest** - Framework testowy
- **ts-jest** - Transpilacja TypeScript dla Jest
- **@nestjs/testing** - Narzędzia testowe NestJS
- **Mock Functions** - Mockowanie zależności

## Uruchamianie testów

```bash
# Wszystkie testy
npm run test

# Z pokryciem
npm run test:cov

# Watch mode
npm run test:watch

# Konkretny plik
npm run test -- --testPathPattern="auth.service"
```

## Raport HTML

Szczegółowy raport HTML z pokryciem dostępny jest w:

```
opowiedzto-api/coverage/lcov-report/index.html
```
