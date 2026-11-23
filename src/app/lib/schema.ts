import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * Tabela `users` no PostgreSQL (via Drizzle ORM).
 *
 * Armazena os registros de usuários da aplicação, incluindo identificador
 * UUIDv7 gerado nativamente pelo Postgres 18+, credenciais e data de criação.
 *
 * @remarks
 * - A coluna `id` usa UUIDv7 para evitar enumeração sequencial mantendo ordenação cronológica.
 * - O e-mail não é armazenado em texto puro: `emailBlindIndex` guarda o HMAC-SHA256
 *   determinístico para busca/unicidade e `emailEncrypted` guarda o valor cifrado com AES-256-GCM.
 * - A coluna `password` armazena um **hash** seguro bcrypt.
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

  /** Hash da senha do usuário (nunca armazenar senha em texto plano). */
  password: text("password").notNull(),

  /** Data e hora de criação do registro (preenchida automaticamente pelo banco). */
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
