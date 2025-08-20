<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>


# OpowiedzTo API

API do zarządzania postami użytkowników zbudowane w NestJS z TypeORM i PostgreSQL.

## Technologie

- NestJS (framework)
- TypeScript
- TypeORM (ORM)
- PostgreSQL (baza danych)
- Swagger (dokumentacja API)
- Docker & Docker Compose

## Struktura projektu

```
src/
├── config/              # Konfiguracja aplikacji
├── posts/               # Moduł postów
│   ├── dto/             # Obiekty transferu danych
│   ├── entities/        # Encje bazy danych
│   ├── posts.controller.ts
│   ├── posts.module.ts
│   └── posts.service.ts
├── seed/                # Moduł inicjalizacji danych
├── app.module.ts        # Główny moduł aplikacji
└── main.ts              # Punkt wejściowy aplikacji
```

## Funkcjonalności

- Tworzenie, edycja, usuwanie i pobieranie postów
- Filtrowanie postów po tagach i autorze
- Pobieranie wszystkich postów konkretnego autora
- Zabezpieczenie edycji/usuwania postów (tylko przez autora)
- Inicjalizacja bazy danych przykładowymi danymi

## Endpointy API

- `GET /posts` - Pobierz wszystkie posty z opcjonalną filtracją
  - Query params: `tag`, `authorId`
- `GET /posts/:id` - Pobierz post po ID
- `GET /posts/author/:authorId` - Pobierz wszystkie posty danego autora
- `POST /posts` - Dodaj nowy post
- `PATCH /posts/:id` - Edytuj post (tylko autor)
- `DELETE /posts/:id` - Usuń post (tylko autor)

## Konfiguracja Docker

Projekt zawiera konfigurację Docker dla środowisk deweloperskiego i produkcyjnego.

### Uruchomienie środowiska deweloperskiego

```bash
docker compose -f docker-compose.dev.yml up --build
```

### Uruchomienie środowiska produkcyjnego

```bash
docker compose -f docker-compose.prod.yml up --build
```

### Dane dostępowe do bazy danych

- Host: `localhost` (lub `db` z poziomu kontenera)
- Port: `5432`
- Użytkownik: `postgres`
- Hasło: `postgres`
- Baza danych: `opowiedzto`

### Ważne informacje

#### Środowisko deweloperskie

- Aplikacja działa z hot-reloadem
- Kod źródłowy jest montowany do kontenera
- Baza danych jest dostępna na porcie 5432
- Dane są przechowywane w volume `postgres_data_dev`

#### Środowisko produkcyjne

- Aplikacja jest zbudowana i uruchomiona w trybie produkcyjnym
- Używa Alpine Linux dla mniejszego rozmiaru obrazu
- Baza danych jest dostępna na porcie 5432
- Dane są przechowywane w volume `postgres_data_prod`

#### Bezpieczeństwo

- W produkcji należy zmienić hasła i klucze JWT
- Dane dostępowe do bazy danych powinny być zmienione w plikach `.env`
- W produkcji zaleca się użycie silnego hasła do bazy danych

#### Połączenie z bazą danych

- Z poziomu hosta: `localhost:5432`
- Z poziomu kontenera: `db:5432`
- Można użyć dowolnego klienta PostgreSQL (np. pgAdmin, DBeaver)

#### Migracje

- W środowisku deweloperskim synchronizacja schematu jest włączona
- W produkcji należy używać migracji (synchronizacja jest wyłączona)

## Dokumentacja API

Dokumentacja API w formacie Swagger dostępna jest pod adresem:

```
http://localhost:3000/api
```

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
