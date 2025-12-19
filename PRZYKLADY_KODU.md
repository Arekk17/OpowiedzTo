# Przykłady kodu do pracy inżynierskiej

## 1. Schemat walidacji Zod dla formularza rejestracji

```typescript
// web/src/types/auth.ts

export const registerSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, "Email jest wymagany")
      .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
        message: "Nieprawidłowy format email",
      }),
    password: z
      .string()
      .min(8, "Hasło musi mieć minimum 8 znaków")
      .regex(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        "Hasło musi zawierać małe i wielkie litery, cyfry lub znaki specjalne",
      ),
    confirmPassword: z
      .string()
      .min(1, "Hasło jest wymagane")
      .min(8, "Hasło musi mieć minimum 8 znaków"),
    nickname: z
      .string()
      .trim()
      .regex(
        /^[a-zA-Z0-9_-]{3,20}$/,
        "Nickname może zawierać tylko litery, cyfry, podkreślenia i myślniki (3-20 znaków)",
      )
      .optional(),
    gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER]).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są identyczne",
    path: ["confirmPassword"],
  });
```

---

## 2. Komponent formularza z użyciem React Hook Form

```tsx
// web/src/app/auth/register/page.tsx

export default function RegisterPage() {
  const { signup, isSigningUp, signupError } = useAuth();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
  });

  const onSubmit = (data: RegisterForm) => {
    const apiData: RegisterApiData = {
      email: data.email,
      password: data.password,
      nickname: data.nickname || "",
    };
    signup(apiData);
  };

  return (
    <AuthFormLayout
      title="Zarejestruj się"
      submitLabel="Zarejestruj się"
      loading={isSigningUp}
      onSubmit={handleSubmit(onSubmit)}
    >
      {signupError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{signupError.message}</p>
        </div>
      )}

      <Input
        label="Email"
        showLabel
        type="email"
        placeholder="Email"
        error={errors.email}
        fullWidth
        {...register("email")}
      />
      <Input
        label="Hasło"
        showLabel
        type="password"
        placeholder="Hasło"
        error={errors.password}
        fullWidth
        {...register("password")}
      />
      <Input
        label="Potwierdź hasło"
        showLabel
        type="password"
        placeholder="Potwierdź hasło"
        error={errors.confirmPassword}
        fullWidth
        {...register("confirmPassword")}
      />
    </AuthFormLayout>
  );
}
```

---

## 3. Komponent UI stylizowany z użyciem klas Tailwind CSS

```tsx
// web/src/components/atoms/inputs/Input.tsx

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ type = "text", size = "md", error, disabled, fullWidth, ... }, ref) => {

    // Dynamiczne style według rozmiaru komponentu
    const sizeStyles = (() => {
      switch (size) {
        case "sm":
          return {
            container: "h-10 rounded-lg px-3",
            input: "text-sm",
            icon: "w-4 h-4",
          };
        case "lg":
          return {
            container: "h-14 rounded-[12px] px-[15px]",
            input: "text-lg",
            icon: "w-6 h-6",
          };
        default:
          return {
            container: "h-14 rounded-[12px] px-[15px]",
            input: "text-base",
            icon: "w-5 h-5",
          };
      }
    })();

    return (
      <div className={clsx("flex flex-col", containerClassName)}>
        {showLabel && label && (
          <label className="block text-sm font-medium text-content-primary mb-1">
            {label}
          </label>
        )}

        {/* Kontener inputa z warunkowym stylowaniem */}
        <div
          className={clsx(
            "flex items-center box-border transition-all duration-200",
            "bg-background-subtle border border-ui-border",
            "focus-within:ring-2 focus-within:ring-ui-focus/20 focus-within:border-ui-focus",
            sizeStyles.container,
            disabled && "cursor-not-allowed opacity-60",
            fullWidth ? "w-full" : "w-[288px] min-w-[160px]",
          )}
        >
          <input
            ref={ref}
            type={type}
            disabled={disabled}
            className={clsx(
              "flex-1 bg-transparent outline-none",
              "font-jakarta font-normal leading-6",
              "placeholder-content-secondary text-content-primary",
              sizeStyles.input,
            )}
            aria-invalid={error ? "true" : "false"}
          />

          {/* Spinner ładowania */}
          {loading && (
            <div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
          )}
        </div>

        {/* Komunikat błędu walidacji */}
        {error && (
          <p className="mt-1 text-sm text-accent-error">
            {error.message}
          </p>
        )}
      </div>
    );
  },
);
```

---

## 4. Mutacja useMutation z TanStack Query do obsługi polubień posta

```typescript
// web/src/hooks/useLike.ts

export const useLike = (
  postId: string,
  initialLiked: boolean,
  initialCount: number,
) => {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  const { mutate, isPending } = useMutation({
    // Funkcja wykonująca request do API
    mutationFn: async ({ nextLiked }: { nextLiked: boolean }) => {
      if (nextLiked) {
        return likePost(postId);
      }
      return unlikePost(postId);
    },

    // Optimistic update - aktualizacja UI przed odpowiedzią serwera
    onMutate: ({ nextLiked }) => {
      const prevLiked = liked;
      const prevCount = count;

      setLiked(nextLiked);
      setCount((prev) => (nextLiked ? prev + 1 : prev - 1));

      // Zwracamy poprzedni stan do ewentualnego rollbacku
      return { prevLiked, prevCount };
    },

    // Obsługa błędów z rollbackiem stanu
    onError: (error, _variables, ctx) => {
      const apiError = error as ApiError;
      const status = apiError?.statusCode;

      // Obsługa edge case: już polubiono
      if (status === 400 && apiError?.message?.includes("polubiłeś")) {
        setLiked(true);
        return;
      }

      // Rollback do poprzedniego stanu
      if (ctx) {
        setLiked(ctx.prevLiked);
        setCount(ctx.prevCount);
      }
    },
  });

  const toggle = useCallback(() => {
    mutate({ nextLiked: !liked });
  }, [liked, mutate]);

  return { liked, count, toggle, isPending };
};
```

---

## 5. Główny moduł aplikacji NestJS (app.module.ts)

```typescript
// opowiedzto-api/src/app.module.ts

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dataSource.options),
    UsersModule,
    AuthModule,
    PostsModule,
    ReportsModule,
  ],
})
export class AppModule {}
```

---

## 6. Struktura katalogów backendu (wzorzec modułowy NestJS)

```
src/
├── auth/
│   ├── decorators/       # @GetUser(), @GetOptionalUser()
│   ├── dto/              # login.dto.ts, register.dto.ts
│   ├── guards/           # jwt-auth.guard.ts
│   ├── strategies/       # jwt.strategy.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/
│   ├── entities/         # user.entity.ts
│   ├── repositories/     # user.repository.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── posts/
│   ├── dto/              # create-post.dto.ts
│   ├── entities/         # post.entity.ts, comment.entity.ts
│   ├── repositories/     # posts.repository.ts
│   └── posts.module.ts
├── reports/
│   ├── controllers/
│   ├── services/
│   └── reports.module.ts
└── app.module.ts
```

---

## 7. Encja Post (TypeORM)

```typescript
// opowiedzto-api/src/posts/entities/post.entity.ts

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  authorId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ default: 0 })
  likesCount: number;

  @Column({ default: 0 })
  commentsCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
```

---

## 8. Migracja tworząca tabelę posts (TypeORM)

```typescript
// opowiedzto-api/src/migrations/20250101000000-Initial.ts

export class Initial20250101000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "posts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "authorId" uuid NOT NULL,
        "title" character varying NOT NULL,
        "content" text NOT NULL,
        "likesCount" integer NOT NULL DEFAULT 0,
        "commentsCount" integer NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_posts_id" PRIMARY KEY ("id")
      )
    `);

    -- Klucz obcy do tabeli users
    await queryRunner.query(`
      ALTER TABLE "posts"
      ADD CONSTRAINT "FK_posts_author"
      FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "posts"`);
  }
}
```

---

## 9. Generowanie tokenów JWT (auth.service.ts)

```typescript
// opowiedzto-api/src/auth/auth.service.ts

private generateToken(user: User): AuthResponseDto {
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    nickname: user.nickname,
  };

  const accessToken = this.jwtService.sign(payload);
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 min

  return { accessToken, userId: user.id, nickname: user.nickname, expiresAt };
}

async generateRefreshToken(user: User): Promise<string> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const refreshToken = await this.refreshTokenRepository.save({
    userId: user.id,
    expiresAt,
  });

  return this.jwtService.sign(
    { tokenId: refreshToken.id, email: user.email },
    { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
  );
}
```

---

## 10. Endpoint /auth/refresh-token

```typescript
// opowiedzto-api/src/auth/auth.controller.ts

@Post('refresh-token')
@UseGuards(RefreshTokenAuthGuard)
@HttpCode(HttpStatus.OK)
refreshToken(
  @GetUser() user: User,
  @Res({ passthrough: true }) res: Response,
) {
  return this.authService.refreshTokens(user, res);
}

// auth.service.ts
refreshTokens(user: User, res: Response): AuthResponseDto {
  const newAccessToken = this.generateToken(user);
  this.setAuthCookie(res, newAccessToken.accessToken);
  return newAccessToken;
}
```

---

## 11. Konfiguracja ciasteczka Set-Cookie

```typescript
// opowiedzto-api/src/auth/auth.service.ts

private setRefreshCookie(res: Response, token: string): void {
  res.cookie('refreshToken', token, {
    httpOnly: true,  // Niedostępne dla JavaScript (ochrona przed XSS)
    secure: true,    // Tylko przez HTTPS (w produkcji)
    sameSite: 'lax', // Ochrona przed CSRF ('none' dla cross-site)
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dni
    path: '/',
  });
}
```

**Opis flag:**

- `httpOnly: true` – ciasteczko niedostępne dla `document.cookie` (ochrona XSS)
- `secure: true` – wysyłane tylko przez HTTPS
- `sameSite: 'lax'` – ochrona CSRF, `'none'` wymaga `secure: true`
- `maxAge` – czas życia w milisekundach

---

## 12. Tabela kompromisów architektonicznych

| Decyzja                                      | Korzyść (skalowalność)                                 | Koszt (utrudnienia operacyjne)                      |
| -------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------- |
| **Monolit modułowy**                         | Prostota wdrożenia, jedna baza kodu                    | Trudniejsze skalowanie pojedynczych modułów         |
| **Oddzielne repo frontend/backend**          | Niezależne deploymenty, różne zespoły                  | Synchronizacja wersji API, więcej pipeline'ów CI/CD |
| **JWT + Refresh Token**                      | Bezstanowość, łatwe skalowanie horyzontalne            | Zarządzanie unieważnianiem tokenów                  |
| **Liczniki zdenormalizowane** (`likesCount`) | Szybkie odczyty bez JOIN/COUNT                         | Ryzyko desynchronizacji, logika aktualizacji        |
| **UUID jako klucz główny**                   | Generowanie po stronie klienta, łatwiejsze shardowanie | Większy rozmiar indeksu, wolniejsze niż INT         |
| **TypeORM + migracje**                       | Kontrola wersji schematu, bezpieczne rollbacki         | Ręczne pisanie migracji, nauka składni              |

