import { sql } from "drizzle-orm";
import { pgTable, smallint, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { OptionalTheme } from "../themes/themes-config";

/**
 * Lista de papéis de acesso permitidos para usuários na aplicação.
 *
 * - `"user"`: usuário padrão.
 * - `"colab"`: colaborador com permissões adicionais.
 * - `"admin"`: administrador do sistema.
 */
export const USER_ROLES = ["user", "colab", "admin"] as const;

/**
 * Tipo union derivado de {@link USER_ROLES} representando o papel de um usuário.
 */
export type UserRole = (typeof USER_ROLES)[number];

/**
 * Tabela `users` no PostgreSQL (via Drizzle ORM).
 *
 * Armazena os registros de usuários da aplicação, incluindo identificador
 * UUIDv7 gerado nativamente pelo Postgres 18+, credenciais, avatar, papel de
 * acesso e data de criação.
 *
 * @remarks
 * - A coluna `id` usa UUIDv7 para evitar enumeração sequencial mantendo ordenação cronológica.
 * - O e-mail não é armazenado em texto puro: `emailBlindIndex` guarda o HMAC-SHA256
 *   determinístico para busca/unicidade e `emailEncrypted` guarda o valor cifrado com AES-256-GCM.
 * - A coluna `password` armazena um **hash** seguro bcrypt ou fica `null` quando a conta entra apenas via OAuth (Google).
 * - A coluna `avatarFace` (`avatar_face`) guarda o índice (`1` a `6`) da face SVG selecionada pelo usuário.
 * - A coluna `role` define o nível de permissão do usuário (`user`, `colab` ou `admin`) e deve ser validada no servidor.
 * - Evite retornar `password`, `emailEncrypted` ou `emailBlindIndex` desnecessariamente em consultas públicas ou respostas de API/Server Actions.
 */
export const users = pgTable("users", {
  /** Identificador único ordenado por tempo do usuário (`UUID PRIMARY KEY`, gerado pelo Postgres via `uuidv7()`). */
  id: uuid("id")
    .default(sql`uuidv7()`)
    .primaryKey(),

  /** Nome completo ou de exibição do usuário. */
  name: text("name").notNull(),

  /** Hash HMAC-SHA256 (com segredo no servidor) do e-mail normalizado para busca e constraint `UNIQUE`. */
  emailBlindIndex: text("email_blind_index").notNull().unique(),

  /** E-mail normalizado cifrado com AES-256-GCM (não fica em texto puro no banco). */
  emailEncrypted: text("email_encrypted").notNull(),

  /** Hash da senha do usuário (nunca armazenar senha em texto plano), ou `null` para contas Google sem senha. */
  password: text("password"),

  /** Índice da face do avatar (`1` a `6`) exibida no menu do perfil; padrão `1`. */
  avatarFace: smallint("avatar_face").default(1).notNull(),

  /** Papel do usuário na aplicação (`user`, `colab` ou `admin`); padrão `'user'`. */
  role: text("role").$type<UserRole>().default("user").notNull(),

  /** Data e hora de criação do registro (preenchida automaticamente pelo banco). */
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Tabela `password_reset_tokens` no PostgreSQL (via Drizzle ORM).
 *
 * Armazena tokens temporários e de uso único para redefinição de senha via link
 * enviado por e-mail, vinculados ao usuário em `users`.
 *
 * @remarks
 * - Armazene apenas o **hash** (ex.: SHA-256) do token enviado por e-mail em `tokenHash`,
 *   nunca o token bruto em texto puro.
 * - Um token só deve ser considerado válido quando `usedAt` for `null` e `expiresAt`
 *   estiver no futuro.
 * - Ao remover um usuário de `users`, os tokens associados são excluídos em cascata
 *   (`onDelete: "cascade"`).
 */
export const passwordResetTokens = pgTable("password_reset_tokens", {
  /** Identificador único do registro de token (`UUID PRIMARY KEY`). */
  id: uuid("id").defaultRandom().primaryKey(),

  /** Referência ao usuário (`users.id`) dono da solicitação de redefinição; remove em cascata se o usuário for excluído. */
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  /** Hash único do token de recuperação enviado ao e-mail do usuário. */
  tokenHash: text("token_hash").notNull().unique(),

  /** Data e hora de expiração do token; após esse instante o link perde a validade. */
  expiresAt: timestamp("expires_at").notNull(),

  /** Data e hora em que o token foi utilizado; permanece `null` enquanto ainda não usado. */
  usedAt: timestamp("used_at"),

  /** Data e hora de criação do registro (preenchida automaticamente pelo banco). */
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Tabela `user_preferences` no PostgreSQL (via Drizzle ORM).
 *
 * Armazena preferências de interface e experiência de cada usuário,
 * isoladas da tabela principal `users`.
 *
 * @remarks
 * - Relação 1:1 com `users` via `userId` (`unique()` + `onDelete: "cascade"`).
 * - A coluna `theme` define o tema visual escolhido pelo usuário.
 */
export const userPreferences = pgTable("user_preferences", {
  /** Identificador único do registro de preferência (`UUID PRIMARY KEY`, gerado pelo Postgres via `uuidv7()`). */
  id: uuid("id")
    .default(sql`uuidv7()`)
    .primaryKey(),

  /** Referência única ao usuário (`users.id`) dono das preferências; remove em cascata ao excluir o usuário. */
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),

  /** Tema de interface escolhido pelo usuário; padrão `'tokyonight'`. */
  theme: text("theme").$type<OptionalTheme | null>(),

  /** Data e hora da última atualização da preferência. */
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
